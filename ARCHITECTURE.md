# Focus With Ghibli — Technical Design

## Overview

Focus With Ghibli is a single-page Pomodoro-style focus timer with an immersive Studio Ghibli theme. The user picks a session length (10–60 minutes), starts the timer, and works while a random Ghibli still rotates as the background and a lo-fi Ghibli music playlist streams from YouTube. When the timer completes, a sound plays and the music stops.

It is a **purely client-side static SPA** — there is no backend, no database, no authentication, and no persistence. All state lives in memory in a Redux store. The app is built with Vite + React 18 and deployed to Netlify (live at `focuswithghibli.com`).

## Architecture

The app follows a classic **React + Redux (unidirectional data flow)** architecture, with one notable deviation: the timer's core logic lives outside React, in a plain-JS module (`src/utils/calculateTimer.js`) that imports the Redux store directly and dispatches actions imperatively.

```
┌────────────────────────────────────────────────────────────┐
│                         Browser                            │
│                                                            │
│  index.html                                                │
│     │                                                      │
│     ▼                                                      │
│  src/main.jsx ──► <Provider store> ──► <App> ──► <Layout>  │
│                          │                      │          │
│                          │          ┌───────────┼─────────┐│
│                          │          ▼           ▼         ││
│                          │    <YoutubeEmbedded> <Focus>   ││
│                          │          │           │         ││
│                          │          │     ┌─────┼──────┐  ││
│                          │          │     ▼     ▼      ▼  ││
│                          │          │  <Timer> <Step-  <Con-││
│                          │          │         Slider> trol> ││
│                          ▼          │     │           │    ││
│                    Redux Store ◄────┴─────┴───────────┘    ││
│                    (timer slice)      useSelector/         ││
│                          ▲            dispatch             ││
│                          │                                 ││
│             ┌────────────┴──────────────┐                  ││
│             │  utils/calculateTimer.js  │  (imports store  ││
│             │  setInterval countdown    │   directly,      ││
│             │  dispatches every 1s      │   outside React) ││
│             └───────────────────────────┘                  ││
│                                                            │
│  Side effects: document.title, Audio(),                    │
│  background <div> style, YouTube IFrame (react-player)     │
└────────────────────────────────────────────────────────────┘
```

### System Components

| Component | Responsibility | Location |
|-----------|---------------|----------|
| Entry point | Mounts React root, wraps app in Redux `<Provider>` | `src/main.jsx` |
| App shell | Trivial wrapper rendering `<Layout />` | `src/App.jsx` |
| Layout | Full-screen background image, rotates it every 60s, hosts all other components | `src/components/layout.jsx` |
| Focus | Composition of the timer UI; switches layout between idle/active states | `src/focus.jsx` |
| Timer | Displays remaining time (or selected minutes when idle); kicks off countdown on activation | `src/components/timer.jsx` |
| ControlTimer | Start/Stop button | `src/components/controlTimer.jsx` |
| StepSlider | MUI slider to select session length (10–60 min, step 5) | `src/components/stepSlider.jsx` |
| YoutubeEmbedded | Hidden ReactPlayer streaming a random YouTube playlist + mute/unmute button | `src/components/youtubeEmbedded.jsx` |
| Timer engine | Deadline-based countdown on `setInterval`, dispatches tick updates, end-of-timer sounds | `src/utils/calculateTimer.js` |
| Background picker | Random image selection from a static JSON catalog | `src/utils/setBackground.js`, `src/utils/imagesInfo.json` |
| Redux store | Single `timer` slice holding all app state | `src/redux/store.js`, `src/redux/slices/timerSlice.js` |

## Data Flow

Unidirectional Redux flow. Components read state via `useSelector`; writes happen via dispatched actions — mostly from the timer engine, not from components.

**Idle → configuring:**

```
User drags StepSlider
   → dispatch(setSelectedMinutes(value))
   → store.timer.selectedMinutes updates
   → Timer re-renders showing `${selectedMinutes}:00`
```

**Start → tick → finish:**

```
User clicks Start (ControlTimer)
   → timerControl() [utils/calculateTimer.js]
   → dispatch(toggleActive())           → isActive = true
   → Timer's useEffect([isActive]) fires
   → timerWork()
        deadline = now + selectedMinutes
        setInterval(1000ms):
            getTime(deadline)
              → dispatch(setMinutes(mm)), dispatch(setSeconds(ss))
              → document.title = "mm:ss | Focus with Ghibli"
   → Timer / YoutubeEmbedded re-render each tick from store

When deadline reached:
   → getTime returns 'finish'
   → dispatch(toggleActive())           → isActive = false
   → playComplete() (completed.wav)
   → YoutubeEmbedded effect sees 00:00 + !isActive → stops music
   → interval cleared
```

**Stop (user-initiated):** `timerControl()` toggles `isActive` off and plays `cancel.ogg`. Note the interval is *not* explicitly cleared on manual stop — it self-terminates on the next tick because `getTime` sees `isActive === false` and returns `'finish'` (see Known Limitations).

**Background rotation:** independent of Redux. `Layout` holds `background` in local `useState`, initialized with `getRandomImage()` and refreshed by a `setInterval(60_000)`.

**Music:** `YoutubeEmbedded` keeps `selectedVideo` and `isPlaying` in local `useState`. Playback starts only via the user's volume button (browser autoplay policy). A `useEffect` watches `minutes/seconds/isActive` from Redux and pauses when the session ends. `onEnded` picks a new random playlist (guaranteed different from the current one).

## Key Modules

### Timer Engine
- **Purpose**: Countdown logic, time formatting, end-of-session sounds.
- **Location**: `src/utils/calculateTimer.js`
- **Key exports**: `timerControl()` (start/stop), `timerWork()` (start interval), `getDeadline(minutes)`, `getTime(deadline)`
- **Dependencies**: Imports the Redux `store` directly (`store.dispatch`, `store.getState`) — deliberately couples the engine to the store so it can run outside the React tree.
- **Notes**: Deadline-based (`Date.parse(deadline) - Date.now()`) rather than decrementing a counter, so it's resilient to interval drift. Time is displayed in the browser tab title as a side effect.

### State Management (timer slice)
- **Purpose**: Single source of truth for the whole app.
- **Location**: `src/redux/slices/timerSlice.js`
- **Shape**:
  ```js
  {
    isActive: false,        // timer running?
    minutes: 0,             // current tick display (string 'mm' while running)
    seconds: 0,             // current tick display (string 'ss' while running)
    selectedMinutes: 10     // user-chosen session length
  }
  ```
- **Actions**: `toggleActive`, `setSelectedMinutes`, `setMinutes`, `setSeconds`.

### Media Modules
- **Background**: `src/utils/setBackground.js` picks a random entry from `src/utils/imagesInfo.json` (23 static paths under `public/ghibli/`). All 23 images are `<link rel="preload">`'d in `index.html` (lines 11–33) so rotations are instant.
- **Music**: `src/components/youtubeEmbedded.jsx` hardcodes 6 YouTube video IDs (`playlistsList`, lines 8–15) and renders them through `react-player/youtube` at volume 0.3. The player container is visually hidden via CSS; only a volume toggle button is visible.

## Data Model

No database and no persistence. The entire model is the in-memory Redux state shown above, plus two static data sets:

| Data set | Location | Shape |
|----------|----------|-------|
| Image catalog | `src/utils/imagesInfo.json` | `[{ name, path }]` × 23 |
| Playlist catalog | `src/components/youtubeEmbedded.jsx:8-15` | `string[]` of 6 YouTube video IDs |

Refreshing the page resets everything to `initialState`.

## API / Interface Design

There is no HTTP API. The public interfaces are:

- **Redux actions** (`src/redux/slices/timerSlice.js:29`): `toggleActive`, `setSelectedMinutes`, `setMinutes`, `setSeconds` — consumed by components and the timer engine.
- **Timer engine functions** (`src/utils/calculateTimer.js`): `timerControl`, `timerWork`, `getDeadline`, `getTime`.
- **External integration**: YouTube IFrame Player (via `react-player`) — the only third-party runtime service. No API key required.

## Design Decisions

| Decision | Rationale | Alternatives Considered |
|----------|-----------|------------------------|
| Redux Toolkit for a 4-field state | Keeps timer state accessible from both React components *and* the non-React timer engine; single predictable flow | A plain `useState` in a parent component (would require lifting + prop drilling or context) |
| Timer engine outside React (`calculateTimer.js` imports `store` directly) | The countdown interval can run and dispatch independently of component lifecycle/re-renders | `setInterval` inside a `useEffect` (the idiomatic React approach; rejected — likely to keep interval management out of StrictMode double-effect issues) |
| Deadline-based countdown (`Date.now()` diff) | Immune to `setInterval` drift and throttled background tabs (display catches up on next tick) | Decrementing a counter every second (drifts over long sessions) |
| Hardcoded JSON/JS catalogs for images & playlists | Zero network/config overhead; content is fixed and curated | Fetching from a CMS/API (unnecessary for static content) |
| Preload all 23 backgrounds in `index.html` | Instant background swaps every 60s with no flicker | Lazy-load on rotation (would flash a blank background) |
| `react-player` wrapper instead of raw YouTube IFrame API | Simple declarative `playing`/`onEnded` props; no manual IFrame API boilerplate | `react-youtube` is also in `package.json` but unused in the current code |
| MUI `Slider` styled via `styled()` | Quick themed slider (`PrettoSlider`) matching the beige Ghibli palette | A slider lib was also installed (`@fseehawer/react-circular-slider`, `react-compound-slider`) but is unused |
| Mixed styling: Tailwind utilities + plain CSS files | Rapid layout with Tailwind; custom animations (background zoom, timer states) in hand-written CSS | CSS-in-JS everywhere (Emotion is installed for MUI) |
| Vite | Fast dev server/HMR; static `dist/` output matches Netlify hosting | CRA (heavier, slower) |

## Cross-Cutting Concerns

- **Auth**: None. No users, no accounts.
- **Validation**: Minimal. `timerControl()` guards `selectedMinutes < 10` (`calculateTimer.js:77`); the slider constrains input to 10–60 in steps of 5.
- **Error Handling**: None present. No try/catch, no error boundaries, no handling for YouTube load failures or audio playback rejection.
- **Logging**: Two `console.debug` calls in `timerControl()` (`calculateTimer.js:81,85`). No logging framework.
- **Serialization**: N/A — no persistence or network payloads.
- **Side effects**: `document.title` updates (`calculateTimer.js:37`), `Audio()` playback, and `setInterval` timers — all managed imperatively.
- **Testing**: No test setup, no test files, no test runner in `package.json`.
- **Linting**: ESLint with react/react-hooks/react-refresh plugins (`npm run lint`, `.eslintrc.cjs`).

## External Dependencies

| Dependency | Purpose | Version |
|-----------|---------|---------|
| react / react-dom | UI framework | ^18.2.0 |
| @reduxjs/toolkit + react-redux | State management | ^2.1.0 / ^9.1.0 |
| react-player | YouTube playback (music) | ^2.14.1 |
| @mui/material + @emotion/* | Slider component & styling | ^5.15.9 |
| tailwindcss + postcss + autoprefixer | Utility styling | ^3.4.1 |
| vite + @vitejs/plugin-react | Build tool / dev server | ^5.0.8 |
| vite-plugin-qrcode | Dev-server QR code (mobile testing) | ^0.2.3 |
| YouTube (iframe embed) | Music streaming — only runtime external service | — |
| cdnfonts.com (LemonMilk font) | Typography, loaded via `<link>` in `index.html` | — |
| Netlify | Static hosting (`netlify.toml`: build `npm run build`, publish `dist`) | — |

Installed but **unused** in current source: `react-youtube`, `@fseehawer/react-circular-slider`, `react-compound-slider`.

## Known Limitations & Trade-offs

- **Interval leak on manual stop**: the `setInterval` in `timerWork()` is never captured/cleared when the user hits Stop; it relies on the next tick seeing `isActive === false` to self-clear. The cleanup function returned by `timerWork()` is discarded by `Timer`'s effect (`timer.jsx:12`).
- **Orphaned background interval**: `Layout`'s `setInterval` (`layout.jsx:13`) is never cleared (no cleanup in the effect). Harmless for a root component that never unmounts, but not idiomatic.
- **Timer state type inconsistency**: `minutes`/`seconds` start as numbers (`0`) but become zero-padded strings (`'05'`) while running; consumers rely on both shapes.
- **Music start is manual**: `isPlaying` starts `false` and only the volume button toggles it, so starting the timer does not start music (partly forced by browser autoplay policies, partly UX choice).
- **Stopping the timer doesn't stop the music**: the stop effect in `YoutubeEmbedded` only triggers at `00:00` completion, not on manual Stop.
- **No persistence**: selected minutes, playback state, and progress are lost on refresh.
- **No error handling**: a blocked/failed YouTube embed or denied audio playback fails silently.
- **Unused dependencies** bloat the bundle/install (see table above).
- **No tests, no CI.**
- **Content licensing**: images and music are Studio Ghibli IP used under a non-commercial/educational disclaimer (see README) — a distribution constraint, not a technical one.

## Future Considerations

- **Pomodoro cycles**: the current model is a single one-shot timer; work/break/long-break cycles would require new slice fields (phase, round count) and engine changes.
- **Persistence**: `localStorage` (or Redux persist) for `selectedMinutes` and mute preference is a natural small addition.
- **Fix interval lifecycle**: move the interval into a `useEffect` with proper cleanup, or return/store the interval id so Stop clears it immediately.
- **Sync music with timer state**: start/pause playback on Start/Stop, not just at completion.
- **Accessibility**: the timer is a visual-only `<h1>`; ARIA live regions and keyboard-operable controls would improve it.
- **Testing**: no harness exists; the pure functions (`getDeadline`, `getTime` formatting) are the easiest units to cover first.
- **Bundle cleanup**: removing unused slider/player dependencies.

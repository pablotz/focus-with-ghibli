# Focus With Ghibli

## Overview

Focus With Ghibli is a Pomodoro-style focus timer SPA with a Studio Ghibli theme. The user picks a session length (10–60 minutes), starts the timer, and works while a random Ghibli still rotates as the background and a lo-fi Ghibli playlist streams from YouTube.

It is a **purely client-side static SPA**: no backend, no database, no auth, no persistence. All state lives in memory in a Redux store. Built with Vite + React 18, deployed to Netlify (live at `focuswithghibli.com`).

For a deep technical breakdown (data flow diagrams, design decisions, known limitations), read `ARCHITECTURE.md`. For the visual identity, read `DESIGN.md`.

## Tech Stack

- **Language**: JavaScript (ES modules) with JSX — no TypeScript
- **Framework**: React 18 (`react`, `react-dom`)
- **State management**: Redux Toolkit (`@reduxjs/toolkit`) + `react-redux`
- **Build tool**: Vite 5 (`vite`, `@vitejs/plugin-react`, `vite-plugin-qrcode` for mobile testing)
- **Styling**: Tailwind CSS 3 (+ PostCSS/autoprefixer) mixed with plain CSS files; MUI (`@mui/material` + `@emotion/*`) used only for the slider
- **Media**: `react-player` (YouTube embeds) for music; static images and audio assets
- **Linting**: ESLint 8 (`eslint-plugin-react`, `react-hooks`, `react-refresh`) — flat `.eslintrc.cjs`
- **Formatting**: No Prettier/EditorConfig — style is manual (see Code Style)
- **Testing**: None — no test runner, no test files, no CI
- **Hosting**: Netlify (`netlify.toml`)

## Project Structure

```
├── index.html                  # Entry HTML; preloads all 23 background images, loads LemonMilk font
├── vite.config.js              # Vite config: react() + qrcode() plugins
├── netlify.toml                # Netlify: build = `npm run build`, publish = `dist`
├── tailwind.config.js          # Tailwind content globs; custom `sm` breakpoint at 390px
├── .eslintrc.cjs               # ESLint config (legacy format, CommonJS)
├── public/
│   ├── ghibli/                 # 23 static background images (served at /ghibli/*.jpg)
│   └── Totoro.svg              # Favicon
└── src/
    ├── main.jsx                # React root; wraps <App> in Redux <Provider> + StrictMode
    ├── App.jsx                 # Trivial shell, renders <Layout />
    ├── focus.jsx               # Composes the timer UI (Timer + StepSlider + ControlTimer)
    ├── components/             # React components (camelCase.jsx filenames)
    │   ├── layout.jsx          # Full-screen background; rotates image every 60s
    │   ├── timer.jsx           # Countdown display; starts timerWork() on activation
    │   ├── controlTimer.jsx    # Start/Stop button
    │   ├── stepSlider.jsx      # MUI Slider (10–60 min, step 5)
    │   └── youtubeEmbedded.jsx # Hidden ReactPlayer + volume toggle; playlist catalog lives here
    ├── redux/
    │   ├── store.js            # configureStore with a single `timer` slice
    │   └── slices/timerSlice.js
    ├── utils/
    │   ├── calculateTimer.js   # Timer engine — plain JS, imports the store directly
    │   ├── setBackground.js    # getRandomImage() from imagesInfo.json
    │   └── imagesInfo.json     # [{ name, path }] × 23 → public/ghibli/*
    └── assets/
        ├── sounds/             # cancel.ogg, completed.wav
        └── styles/             # Plain CSS files (index.css also holds @tailwind directives)
```

## Development

### Setup

```bash
npm install
npm run dev
```

Requires Node (developed on Node 22 / npm 10). No env vars needed. `npm run dev` starts Vite with `--host` and prints a QR code (via `vite-plugin-qrcode`) for testing on a phone over the LAN.

### Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server (`--host`, QR code for mobile) |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | ESLint over `.js`/`.jsx`, `--max-warnings 0` (see note below) |
| `npm run bump:minor` / `bump:patch` / `bump:major` | `npm version` bump |

**Note:** `npm run lint` currently fails on `main` (2 unused eslint-disable directives, 1 `exhaustive-deps` warning in `youtubeEmbedded.jsx`). Don't assume a clean baseline — check `git stash`/fresh checkout before blaming your changes.

## Code Style & Conventions

Style is **not enforced by a formatter** — match the file you're editing rather than imposing a uniform style.

- **Modules**: ES modules (`import`/`export`); `.jsx` for components, `.js` for logic.
- **Components**: arrow functions assigned to a `const` with a PascalCase name, `export default` at the bottom. Filenames are camelCase (`timer.jsx`, `youtubeEmbedded.jsx`) — note the mismatch between filename and component name (`YoutubeEmbedded`).
- **Imports**: relative paths; the `.jsx`/`.js` extension is included inconsistently (both `from './App.jsx'` and `from '../focus'` exist). No import ordering convention.
- **Quotes/semicolons/indentation**: mixed across files — single and double quotes, semicolons or not, 2-space and 4-space indentation all appear. Follow the local file.
- **Styling**: Tailwind utility classes for layout (`className='w-full flex flex-col ...'`) + plain CSS files in `src/assets/styles/` for custom classes/animations (e.g. `timer-counter`, `button-30`, `ghibli-background-start`). MUI components are styled with `styled()` (see `PrettoSlider` in `stepSlider.jsx`). Palette color `#F5F5DC` (beige) recurs.
- **State access**: components read the store with `useSelector(state => state.timer)` and write with `useDispatch()`; the timer engine (`utils/calculateTimer.js`) is the exception — it imports `store` directly and uses `store.dispatch`/`store.getState` outside React.
- **Props**: `prop-types` is not installed; components take no props in practice. ESLint prop-types violations are silenced with `/* eslint-disable react/prop-types */` comments.
- **Error handling**: none — no try/catch, no error boundaries. Logging is two `console.debug` calls in `timerControl()`.
- **Commits/branches**: informal commit messages (`Fix: ...`, `#BugFix: ...`, `Added ...`, version bumps like `1.1.2`). Work happens on `dev` or `feature/*` branches and is merged into `main` via pull requests.
- **Versioning**: `npm run bump:*` scripts (`npm version ...`); version bumps are committed as plain `1.1.x` commits.

## Architecture

Classic **React + Redux unidirectional flow**, with one deliberate deviation: the countdown engine lives outside React.

- **Single source of truth**: one `timer` slice (`src/redux/slices/timerSlice.js`) with shape `{ isActive, minutes, seconds, selectedMinutes }` and actions `toggleActive`, `setSelectedMinutes`, `setMinutes`, `setSeconds`.
- **Timer engine**: `src/utils/calculateTimer.js` exports `timerControl()` (start/stop), `timerWork()` (starts the interval), `getDeadline(minutes)`, `getTime(deadline)`. It is **deadline-based** (`Date.parse(deadline) - Date.now()`), not a decrementing counter, so it doesn't drift. It dispatches tick updates every 1s, updates `document.title` as a side effect, and plays end-of-session sounds (`completed.wav` / `cancel.ogg`).
- **Start flow**: `ControlTimer` → `timerControl()` → `dispatch(toggleActive())` → `Timer`'s `useEffect([isActive])` fires → `timerWork()`.
- **Background rotation**: local `useState` in `layout.jsx`, re-randomized by a `setInterval(60_000)`. All 23 images are `<link rel="preload">`'d in `index.html`, so swaps are instant.
- **Music**: `youtubeEmbedded.jsx` holds a hardcoded list of 6 YouTube video IDs and renders a hidden `ReactPlayer` (volume 0.3) with only a mute/unmute button visible. Playback starts manually (browser autoplay policy); a `useEffect` pauses when the timer hits `00:00`; `onEnded` picks a new, different playlist.
- **External services**: only YouTube (iframe embed, no API key) and cdnfonts.com (font). No HTTP API of any kind.

Known quirks worth knowing before editing (full list in `ARCHITECTURE.md`):

- The interval in `timerWork()` is not cleared on manual Stop — it self-terminates on the next tick; `Timer`'s effect discards the cleanup returned by `timerWork()`.
- `Layout`'s background `setInterval` has no cleanup (root component, never unmounts).
- `minutes`/`seconds` are numbers when idle but zero-padded strings while running — consumers rely on both.
- `react-youtube`, `@fseehawer/react-circular-slider`, and `react-compound-slider` are installed but unused.

## Testing

There is **no test setup** — no runner, no test files, no CI. Don't fabricate test commands. If asked to add tests, you'll need to introduce a harness (e.g. Vitest fits the Vite setup); the pure functions `getDeadline`/`getTime` in `src/utils/calculateTimer.js` are the easiest units to cover first. Until then, verify changes manually with `npm run dev` and by running `npm run lint` (keeping the pre-existing failures noted above in mind).

## Common Tasks

### Add a React component
1. Create `src/components/myComponent.jsx` (camelCase filename).
2. Write `const MyComponent = () => { ... }` and `export default MyComponent`.
3. Read state with `useSelector(state => state.timer)`; write with `useDispatch()` + slice actions.
4. Add styles either as Tailwind utilities or a new plain CSS file in `src/assets/styles/` imported at the top of the component.

### Add a Redux field
1. Add the field to `initialState` and a reducer to `reducers` in `src/redux/slices/timerSlice.js`.
2. Export the new action from the same file's `timerSlice.actions` destructure.
3. Consume it via `useSelector`/`useDispatch`; the store in `src/redux/store.js` needs no changes (single slice).

### Add a background image
1. Drop the `.jpg` into `public/ghibli/`.
2. Add `{ name, path }` to `src/utils/imagesInfo.json` (`path` is the public URL, e.g. `/ghibli/foo.jpg`).
3. Add a `<link rel="preload" href="/ghibli/foo.jpg" as="image">` line in `index.html` with the others.

### Add a music playlist
Edit the `playlistsList` array at the top of `src/components/youtubeEmbedded.jsx` (YouTube video IDs only).

### Change the timer range/step
Update `min`/`max`/`step` on the `PrettoSlider` in `src/components/stepSlider.jsx`, and the `selectedMinutes < 10` guard in `timerControl()` (`src/utils/calculateTimer.js`).

### Deploy
Push to `main`; Netlify builds with `npm run build` and publishes `dist/` per `netlify.toml`.

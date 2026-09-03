---
version: alpha
name: Focus With Ghibli
description: A warm, cinematic visual identity for a Pomodoro timer that places a minimalist beige UI over rotating Studio Ghibli film stills.
colors:
  primary: "#F5F5DC"
  secondary: "#ffffd1"
  tertiary: "#d6bd69"
  surface-translucent: "#fcfcfd67"
  shadow-deep: "#2d2342"
  focus-ring: "#D6D6E7"
typography:
  timer-idle:
    fontFamily: Lemon/Milk
    fontSize: 153px
  timer-active:
    fontFamily: Lemon/Milk
    fontSize: 63px
  button-label:
    fontFamily: Lemon/Milk
    fontSize: 18px
    letterSpacing: 10px
  base:
    fontFamily: Lemon/Milk light
    fontSize: 1rem
rounded:
  sm: 4px
spacing:
  sm: 8px
  md: 16px
  button-height: 48px
components:
  button-start:
    backgroundColor: "{colors.surface-translucent}"
    textColor: "{colors.primary}"
    typography: "{typography.button-label}"
    rounded: "{rounded.sm}"
    height: 48px
  button-stop:
    backgroundColor: "{colors.surface-translucent}"
    textColor: "{colors.primary}"
    typography: "{typography.button-label}"
    rounded: "{rounded.sm}"
    height: 48px
  timer-display:
    textColor: "{colors.primary}"
    typography: "{typography.timer-idle}"
  slider-track:
    backgroundColor: "{colors.secondary}"
    height: 10px
  slider-thumb:
    backgroundColor: "{colors.primary}"
    size: 24px
---

## Overview

Cinematic minimalism over living art. The UI is deliberately invisible: the
screen is dominated by full-bleed Studio Ghibli film stills, and the
interface — a single large timer, one slider, one button — floats on top in a
warm beige (`#F5F5DC`) that evokes aged paper and celluloid warmth.

The defining behavior is the **focus transition**: while idle, the background
photograph is softened with an 8px blur, like looking away from a painting.
When the timer starts, the blur lifts (`blur(0)` over 1.5s), the giant timer
shrinks and glides down, and the artwork snaps into sharp focus — mirroring
the mental act of focusing. Every motion uses long, gentle easings
(0.5s–1.5s `ease-in-out`), nothing ever snaps.

The font is **Lemon/Milk** (loaded from cdnfonts), a geometric sans used for
all text; its wide letterforms with extreme letter-spacing (10px on buttons)
give the UI a quiet, poster-like quality.

## Colors

The palette is a single warm off-white family layered over photography. There
is intentionally almost no UI chrome color — the Ghibli stills *are* the
background, so interface colors must harmonize with any arbitrary film frame.

- **Primary (#F5F5DC):** "Beige" — the universal foreground. Timer digits,
  button labels, slider thumb, and icons all use it. It reads warmly against
  both dark (Mononoke) and bright (Ponyo) frames.
- **Secondary (#ffffd1):** Pale cream — used only for the slider track, a
  slightly brighter step above the thumb to keep the control legible.
- **Tertiary (#d6bd69):** Muted gold — never a fill, only the timer's
  outer-glow (`text-shadow: 0 0 1em`), like light spilling from a lantern.
- **Surface translucent (#fcfcfd67):** Frosted white at ~40% opacity for the
  start/stop button, so the artwork remains visible through controls.
- **Shadow deep (#2d2342):** Deep violet (as `rgba(45,35,66,0.3–0.4)`) used
  exclusively in layered box-shadows to lift controls off the imagery.
- **Focus ring (#D6D6E7):** Cool lavender inset ring for keyboard focus.

Pure black, pure white, and saturated brand colors are all avoided — they
would fight the artwork.

## Typography

One family, Lemon/Milk, carries the whole app; hierarchy is expressed through
dramatic scale changes rather than weight or color.

- **Timer (idle) — `17vh` in code:** The unfocused state is dominated by a
  single enormous numeral, nearly a fifth of the viewport tall. It is the
  landing visual anchor. (Token lists `153px`, its equivalent at a 900px-tall
  reference viewport; the spec's Dimension type only allows px/rem/em —
  see `timer.css:22`.)
- **Timer (active) — `7vh` in code:** On start, the timer shrinks to less
  than half its size and moves toward the bottom, deliberately getting out
  of the user's way while they work. (Token: `63px` reference equivalent —
  `timer.css:26`.)
- **Button label — 18px / +10px letter-spacing:** Tiny word, huge tracking
  ("S T A R T"). The 10px trailing space is compensated with asymmetric
  padding (`padding-left: 10px; padding-right: 2px`) so the word stays
  optically centered.
- **Base — Lemon/Milk light, 1rem:** Any incidental text uses the light cut.

Sizes are viewport-relative (`vh`) for the timer so the composition holds at
any window size; fixed px only for controls.

## Layout

A single full-viewport composition with no page flow, no header, no footer:

- **Background:** `position: fixed`, `background-size: cover`, centered,
  filling the viewport at all times; `z-index: -1` keeps it behind all UI.
- **Vertical anchor:** the timer column starts at `padding-top: 30vh` (idle)
  and translates to `translate(0, 46vh)` when active — the content literally
  descends as the session begins.
- **Centering:** everything is a flex column centered horizontally; there is
  exactly one column of content, ever.
- **Slider width:** expressed as viewport margins — `margin: 0 40vw` on
  desktop, narrowing through hand-written media-query bands
  (375–768px → `7vw`; 820–1024px → `25vw`; 1180–1360px → `37vw`). Tailwind's
  only custom breakpoint is `sm: 390px`.
- **Controls:** the volume toggle is absolutely positioned top-right
  (`top-0 right-0 pt-8`), the only element that breaks the central column.

## Elevation & Depth

Depth is atmospheric rather than material:

- **Controls** float with two-layer soft shadows in deep violet:
  `rgba(45,35,66,0.4) 0 2px 4px, rgba(45,35,66,0.3) 0 7px 13px -3px`,
  deepening to `0 4px 8px` on hover.
- **The timer glows** instead of casting a shadow: `text-shadow: 0 0 1em
  #d6bd69, 0 0 0.2em #d6bd69` — light emitted, not blocked.
- **Icons** use `drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4))` to stay readable
  over busy film frames.
- Hover lifts the button physically (`translateY(-2px)`); active presses it
  down (`translateY(2px)` with an inset shadow) — a subtle skeuomorphic press.

## Shapes

Shapes are quiet and rectangular, deferring to the organic artwork:

- **Radius:** a single scale step — `4px` on buttons. Nothing else is
  rounded; sharp edges keep the chrome feeling like a projection overlay.
- **Slider:** 10px-high track with a 24px circular thumb ringed by a 2px
  `currentColor` border — the only circle in the system, drawing the eye to
  the one interactive dial.
- **Button:** 48px tall pill-less rectangle with wide-tracked caps.

## Components

### Start/Stop button (`.button-30`)

Frosted translucent rectangle (`#fcfcfd67`, 48px, radius 4px) with beige
wide-tracked label. States: hover lifts 2px with a deeper shadow; active
presses with an inset shadow; focus shows a 1.5px inset `#D6D6E7` ring.
Start and Stop share identical styling — only the label changes; state is
communicated by the timer's position, not the button's color.

### Timer display

Beige Lemon/Milk numerals with a golden outer glow, formatting `MM:SS`.
Idle renders at 17vh (`#timer-sleep`), active at 7vh (`#timer-started`);
the same remaining time is mirrored into the browser tab title.

### Duration slider (`PrettoSlider`)

MUI Slider reskinned to the palette: 10px cream track (`#ffffd1`), 24px
beige thumb with a 2px ring. Range 10–60 minutes in 5-minute steps; the
value label is disabled — the giant timer above *is* the readout.

### Background frame

Fixed full-viewport `<div>` cycling a curated catalog of film stills every
60s (`transition: background 0.7s`). Blurred 8px when idle, sharp when
focusing. All stills are preloaded so crossfades never flash.

### Volume toggle

Top-right Tabler stroke icon (volume / volume-off) in beige with a dark
drop-shadow. The YouTube player itself is always hidden (`opacity: 0`) —
music is ambient, never visual.

## Do's and Don'ts

**Do:**
- Keep every foreground element in the beige/cream family so it harmonizes
  with any background frame.
- Use viewport-relative sizing (`vh`) for hero elements so the composition
  survives any screen.
- Animate with slow `ease-in-out` transitions (0.5–1.5s) — the app should
  feel like breathing.
- Let the artwork carry color; UI stays neutral and translucent.

**Don't:**
- Don't introduce saturated accent colors, pure black, or pure white — they
  clash with the film stills.
- Don't add cards, panels, navbars, or page chrome; the interface is a
  single floating column.
- Don't round corners beyond 4px or add borders to containers.
- Don't show the YouTube player or any video UI — audio only.
- Don't use fast/snappy animations (< 0.3s) or bouncing easings.

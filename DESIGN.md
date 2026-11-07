---
name: ROCK TV
description: Continuous Live Rock Television Broadcast & Editorial Stage Monograph
colors:
  crimson: "#dc143c"
  crimson-bright: "#f01e46"
  crimson-deep: "#8c0b25"
  tungsten: "#ff6200"
  tungsten-warm: "#ff7a26"
  void: "#060608"
  obsidian: "#0a0a0e"
  truss: "#111115"
  gunmetal: "#18181f"
  steel: "#262630"
  chalk: "#f6f5f2"
  bone: "#d6d3cd"
  ash: "#9e9a93"
typography:
  display:
    fontFamily: "'Anton', sans-serif"
    fontSize: "clamp(3.5rem, 8vw, 6rem)"
    fontWeight: 400
    lineHeight: 0.94
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "'Anton', sans-serif"
    fontSize: "clamp(2.5rem, 5.5vw, 4.5rem)"
    fontWeight: 400
    lineHeight: 0.96
    letterSpacing: "-0.02em"
  title:
    fontFamily: "'Barlow Condensed', sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "0.04em"
  body:
    fontFamily: "'Archivo', sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "0em"
  label:
    fontFamily: "'JetBrains Mono', monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.05em"
  caption:
    fontFamily: "'JetBrains Mono', monospace"
    fontSize: "11px"
    fontWeight: 500
    lineHeight: 1.35
    letterSpacing: "0.05em"
rounded:
  none: "0px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "40px"
  2xl: "64px"
  3xl: "96px"
components:
  button-primary:
    backgroundColor: "{colors.crimson}"
    textColor: "{colors.chalk}"
    rounded: "{rounded.none}"
    padding: "16px 28px"
  button-primary-hover:
    backgroundColor: "{colors.crimson-bright}"
  button-secondary:
    backgroundColor: "{colors.obsidian}"
    textColor: "{colors.chalk}"
    rounded: "{rounded.none}"
    padding: "16px 24px"
  card-monograph:
    backgroundColor: "{colors.obsidian}"
    textColor: "{colors.chalk}"
    rounded: "{rounded.none}"
    padding: "32px"
---

# Design System: ROCK TV

> **2026-11 direction change — Liquid Glass.** The palette, type and editorial voice below still hold, but the
> "0px corners / no glassmorphism" rules are superseded. Current material rules:
>
> - **Material:** `.glass` (blur 22px + saturate 185%, specular top rim, directional gradient rim, pointer-following
>   highlight) with `.glass-thin` (over imagery), `.glass-thick` (text panels), `.glass-tint-crimson` /
>   `.glass-tint-tungsten` (primary actions). Chromium adds SVG refraction via `.glass-refract`. All in `src/app/globals.css`.
> - **Shape:** concentric radii — panels `rounded-glass` (28px) → inset media `rounded-glass-sm` (20px) → chips
>   `rounded-glass-xs` (14px); every control is a capsule (`rounded-full`). Press = gel squish (`.glass-press`).
> - **Ground:** fixed ambient stage light (`.ambient-stage`: drifting crimson / tungsten / deep-crimson orbs + grain)
>   so glass always has light to refract. Sections are transparent over it.
> - **Never put glass over video.** Video players (live deck, legends modal) sit in plain `bg-black` frames; controls
>   go beside or below them.
> - **Navigation:** floating glass capsule header on desktop; on phones an iOS-style floating tab bar (5 tabs + detached
>   language orb) that minimizes while scrolling down.
> - **Motion:** Premium personality, signature curve `cubic-bezier(0.16,1,0.3,1)`. Hero is a 320vh scroll-scrubbed
>   video (Arena → Live → Canon → On air); `prefers-reduced-motion` gets a static poster hero.
> - **Display leading** is 1.1 (1.18 on the hero h1) so Romanian Ă/Î/Ș/Ț never collide.


## Overview

**Creative North Star: "Arena Stage Rig & Crimson Follow-Spot"**

ROCK TV is built as an architectural midnight festival proscenium and print-grade rock music monograph. Rather than borrowing the rounded-card carousels, glassmorphic pills, or neon purple gradients of conventional streaming templates, the interface treats the viewport as a darkened concert arena constructed from anodized steel trusses, vulcanized flight-case surfaces, and high-contrast 35mm stage photography.

The live broadcast monitor (`CH-01`) sits at the heart of the proscenium, framed by 1px structural steel hairlines and user-selectable stage lighting washes. Every editorial section below the broadcast deck—covering rock's physical culture, eight foundational subgenres, and the Hall of Legends—paces the scroll like a heavyweight print monograph where monumental condensed headlines and darkroom photography command the room.

**Key Characteristics:**
- Razor-sharp 0px structural corners (`rounded-none`) framed by 1px brushed steel hairlines (`#262630`).
- Deep midnight void (`#060608`), obsidian (`#0a0a0e`), and brushed steel truss (`#111115`) grounds illuminated by arterial follow-spot crimson (`#dc143c`) and sparing valve-amp tungsten orange (`#ff6200`).
- Monumental kicker-free condensed display typography (`Anton` and `Barlow Condensed`) paired with `Archivo` editorial prose and tabular `JetBrains Mono` telemetry.
- Subtle 35mm concert film grain and directional stage-wash elevation shadows.

## Colors

The palette evokes a darkened festival arena where brushed steel rigging absorbs ambient light until crimson follow-spots and glowing orange amplifier filaments ignite the stage.

### Primary
- **Arterial Follow-Spot Crimson** (`#dc143c`): Primary action fills, active broadcast status indicators, selected subgenre tabs, and key headline emphasis.
- **Pyro Crimson Bright** (`#f01e46`): Hover and active state illumination on primary crimson controls.
- **Stage Curtain Deep Crimson** (`#8c0b25`): Deep tonal anchor for crimson surfaces.

### Secondary
- **Valve Filament Tungsten** (`#ff6200`): Sparing high-voltage highlight used for keyboard focus rings, tempo/frequency telemetry readouts, active timestamps, and secondary hardware accents.
- **Warm Tungsten Arc** (`#ff7a26`): Hover highlight on tungsten-accented elements.

### Neutral
- **Midnight Festival Void** (`#060608`): Root page canvas and 16:9 broadcast monitor housing.
- **Obsidian Proscenium** (`#0a0a0e`): Alternating section ground, sticky header backdrop, and primary monograph spread containers.
- **Brushed Steel Truss** (`#111115`): Hardware control bars, telemetry cells, and secondary editorial diptych containers.
- **Anodized Gunmetal** (`#18181f`): Elevated interactive surface states.
- **Structural Steel Hairline** (`#262630`): 1px architectural borders dividing stage modules, telemetry grids, and editorial spreads.
- **Stage Chalk White** (`#f6f5f2`): Primary display headlines, active navigation labels, and primary button copy.
- **Unbleached Bone** (`#d6d3cd`): High-contrast warm secondary prose copy (exceeds WCAG 2.2 AA contrast on all dark grounds).
- **Warm Stage Ash** (`#9e9a93`): Tertiary metadata keys and archival colophon labels.

### Named Rules
**The Follow-Spot Discipline Rule.** Arterial Crimson (`#dc143c`) and Valve Tungsten (`#ff6200`) never appear as full-bleed section backgrounds; they act strictly as focused stage lighting against Midnight Void (`#060608`) and Obsidian (`#0a0a0e`) grounds.

**The Warm Bone Contrast Rule.** Never use cold mid-gray for body copy on dark grounds; all editorial prose uses Unbleached Bone (`#d6d3cd`) to maintain warm print-monograph legibility above 10:1 contrast.

## Typography

**Display Font:** `Anton` (with `sans-serif` fallback)
**Headline / UI Control Font:** `Barlow Condensed` (with `sans-serif` fallback)
**Body Font:** `Archivo` (with `sans-serif` fallback)
**Label/Mono Font:** `JetBrains Mono` (with `monospace` fallback)

**Character:** Monumental festival-bill condensed headlines (`Anton`) anchor every section with physical authority, supported by structural `Barlow Condensed` control labels, highly legible `Archivo` long-form rock journalism, and tabular `JetBrains Mono` strictly reserved for numeric broadcast and acoustic measurements.

### Hierarchy
- **Display** (`400`, `clamp(3.5rem, 8vw, 6rem)`, `line-height: 0.94`, `letter-spacing: -0.02em`, uppercase): Hero stage opening and closing statement headlines.
- **Headline** (`400`, `clamp(2.5rem, 5.5vw, 4.5rem)`, `line-height: 0.96`, `letter-spacing: -0.02em`, uppercase): Primary section titles (`LIVE TELEVISION BROADCAST`, `EIGHT SONIC DESTINATIONS`, `IMMORTALS OF THE STAGE`).
- **Title** (`700`, `1.5rem` to `2.25rem`, `line-height: 1.15`, `letter-spacing: 0.04em`, uppercase): Sub-module headings, artist monikers, and broadcast console titles.
- **Body** (`400`, `1rem` to `1.125rem`, `line-height: 1.625`, `max-width: 65ch`): Editorial essays, artist portraits, and stream instructions.
- **Label** (`500`, `0.75rem`, `line-height: 1.4`, `letter-spacing: 0.05em`, `font-variant-numeric: tabular-nums`): Strictly for numeric telemetry, era spans (`1965 — 1979`), tempo ranges (`92 — 136 BPM`), decibel specs (`114.8 dB SPL`), and channel identifiers (`CH-01 HD`).

### Named Rules
**The No-Kicker Rule.** Headings (`h1`, `h2`, `h3`, `h4`) always lead at the very top of their typographic group. Never place an eyebrow or kicker label above a heading; supporting metadata and timestamps sit below or beside the heading.

**The True Measurement Mono Rule.** `JetBrains Mono` is reserved exclusively for genuine numbers, timestamps, era spans, URLs, and acoustic telemetry (`tabular-nums`)—never used as a decorative costume for prose buttons or navigation links.

## Layout

The layout uses a `1440px` maximum structural container (`1680px` when the Live Television Deck expands into Wide Stage theater mode) with responsive horizontal padding (`20px` mobile, `32px` tablet, `48px` desktop). Sections are separated by 1px `#262630` steel hairlines and generous vertical rhythm (`96px` to `128px` desktop, `80px` to `96px` mobile).

Inside sections, compositions use a 12-column asymmetric architectural grid:
- **Hero Opening:** 8-column headline + 4-column Master Broadcast Telemetry ledger.
- **Live Television Deck:** Full-width 16:9 stage proscenium with top hardware truss bar, bottom audio/fallback deck console, and a 3-column broadcast specification bar.
- **The Rock Experience:** 7-column / 5-column lead monograph spread followed by an asymmetric 7-column / 5-column secondary diptych.
- **Eight Sonic Destinations:** 8-tab interactive subgenre selector matrix above a 5-column / 7-column active monograph stage and a full-width 12-column archival ledger.
- **Rock Legends:** Alternating 7-column / 5-column large-format photographic spreads followed by a 2-column pantheon chronicle.

## Elevation & Depth

Depth is achieved through a hybrid of tonal steel layering (`#060608` -> `#0a0a0e` -> `#111115`) and directional stage-wash shadows with generous vertical offset and soft blur. Zero-offset neon halos and hard neobrutalist block shadows are prohibited.

### Shadow Vocabulary
- **Stage Elevation** (`box-shadow: 0 24px 64px -12px rgba(0, 0, 0, 0.85)`): Primary monograph spreads and telemetry containers.
- **Proscenium Crimson Wash** (`box-shadow: 0 32px 80px -16px rgba(220, 20, 60, 0.22), 0 20px 50px -10px rgba(0, 0, 0, 0.9)`): Primary broadcast CTA, active subgenre tab, and the Live Television monitor in Crimson Wash mode.
- **Deck Console Shadow** (`box-shadow: 0 18px 45px -8px rgba(0, 0, 0, 0.8)`): Sticky navigation header and secondary diptych modules.

### Named Rules
**The Stage-Wash Offset Rule.** Every shadow must carry a downward vertical offset (`18px` to `36px`) and wide diffusion (`45px` to `96px`), emulating overhead stage lighting rigs rather than flat CSS glow filters.

## Shapes

Every container, button, tab, and photographic frame uses sharp `0px` right-angle geometry (`rounded-none`), reinforced by `1px solid #262630` structural steel borders. Active and primary interactive controls upgrade their border to `1px solid #f6f5f2` (Chalk) or `1px solid #dc143c` (Crimson), shifting to `#ff6200` (Tungsten) on hover or focus.

## Components

### Buttons
- **Shape:** Sharp architectural rectangle (`0px` radius) with `1px` solid border.
- **Primary:** Arterial Crimson background (`#dc143c`), Stage Chalk text (`#f6f5f2`), `1px solid #f6f5f2` border, `16px 28px` padding, set in uppercase `Barlow Condensed` (`700`, `0.05em` tracking).
- **Hover / Focus:** Shifts background to `#f01e46` and border to `#ff6200`; `:focus-visible` renders a `2px solid #ff6200` outline at `3px` offset.
- **Secondary:** Obsidian (`#0a0a0e`) or Brushed Truss (`#111115`) background with `1px solid #262630` border, shifting border to `#dc143c` on hover.

### Chips & Telemetry Badges
- **Style:** Brushed Steel Truss (`#111115`) background, `1px solid #262630` border, `JetBrains Mono` (`0.75rem`, `tabular-nums`) text in Stage Chalk (`#f6f5f2`) or Valve Tungsten (`#ff6200`).
- **State:** Live status indicators pair a `10px` square status lamp (`#dc143c` when ready, `#ff6200` when syncing) with uppercase `Barlow Condensed` status text.

### Cards / Monograph Containers
- **Corner Style:** `0px` square corners.
- **Background:** Obsidian (`#0a0a0e`) for primary spreads; Brushed Steel Truss (`#111115`) for secondary modules.
- **Shadow Strategy:** `shadow-stage` on primary spreads; `shadow-deck` on secondary modules.
- **Border:** `1px solid #262630` perimeter with internal `1px solid #262630` structural dividers between photographic plates and text columns.
- **Internal Padding:** `28px` to `40px` (`p-7 sm:p-10`).

### Navigation
- **Style:** Fixed top bar transitioning from a translucent void gradient over the hero proscenium to a compact `border-b border-steel bg-obsidian/95 backdrop-blur-md` sticky deck on scroll.
- **Active State:** Tracked via `IntersectionObserver` with an animated `2px` `#dc143c` bottom indicator bar and a persistent `ON AIR DECK` crimson jump button.

### Live Television Proscenium Deck (Signature Component)
- **Structure:** Three-tier hardware frame housing the 16:9 responsive `<iframe src="https://tv.broadcasting.ro/85c83a80-4f71-4f2d-a8d6-43f676896bcb.html">` broadcast feed:
  1. Top Proscenium Hardware Truss Bar with channel badge (`CH-01`), Stage Lighting Ambience switcher (`Crimson Wash`, `Tungsten`, `Blackout`), `Wide Stage` theater toggle, and native `Fullscreen` control.
  2. 16:9 Broadcast Viewport with instant `Standby` and `External Broadcast Relay Fallback` overlays.
  3. Bottom Console with `Standby / Cut Audio`, `Re-Sync Signal`, inline embedded volume guidance, and `Open External Stream` launch link.

## Do's and Don'ts

### Do:
- **Do** preserve `0px` sharp structural corners and `1px solid #262630` steel hairlines across all containers, buttons, and image frames.
- **Do** lead every section and card with its heading (`h1`–`h4`) first, placing timestamps, monikers, and telemetry below or beside the heading.
- **Do** keep long-form editorial copy constrained to `65ch` in `Unbleached Bone` (`#d6d3cd`) for effortless reading against dark grounds.
- **Do** maintain strict technical honesty on the live stream player—distinguishing container readiness, user-initiated audio, standby mode, and external stream fallback.

### Don't:
- **Don't** place kickers, eyebrows, or decorative `01 / 02 / 03` section numbers above headings.
- **Don't** use rounded SaaS cards (`rounded-lg`, `rounded-xl`), gradient text (`bg-clip-text`), or decorative CSS grid-line backgrounds.
- **Don't** invent fake live track metadata, unverified viewer counts, or fake volume sliders that cannot control the cross-origin broadcast iframe.
- **Don't** use `JetBrains Mono` for prose copy or primary action buttons; keep monospace strictly on numeric and technical telemetry.

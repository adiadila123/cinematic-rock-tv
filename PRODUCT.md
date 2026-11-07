# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js (App Router) + React + TypeScript + Tailwind CSS + Framer Motion + GSAP + Lucide Icons

## Users

Rock music fans, live concert enthusiasts, and alternative/underground music listeners seeking an atmospheric, continuous live rock television broadcast paired with editorial rock culture and heritage curation.

## Product Purpose

Deliver a cinematic, continuously scrolling live rock music television destination centered around the live broadcast stream at `https://tv.broadcasting.ro/85c83a80-4f71-4f2d-a8d6-43f676896bcb.html`, framed by editorial exploration of rock culture, eight core rock genres, and iconic rock legends. Success means visitors immediately recognize the live broadcast, tune into the stream seamlessly, and experience the raw energy and heritage of rock music.

## Positioning

A continuous live rock television broadcast experience presented as a dark-room festival stage and editorial music magazine rather than a conventional on-demand SaaS video library.

## Operating Context

Visitors open the experience on desktop displays, laptops, tablets, or mobile phones in ambient or low-light listening environments to watch the live broadcast and browse curated editorial features on rock culture, genres, and legends.

## Capabilities and Constraints

- Primary live stream source: `https://tv.broadcasting.ro/85c83a80-4f71-4f2d-a8d6-43f676896bcb.html`.
- Integrate the live stream via a responsive iframe inside a custom television broadcast frame with fullscreen support, theatre/cinema focus, honest connection/iframe load status, and an elegant external-player fallback if embedding is blocked or restricted.
- Do not invent stream URLs, APIs, live track metadata, or playback capabilities not supported by the embedded broadcast source.
- Do not bypass DRM, authentication, or provider restrictions.
- Do not autoplay audio unexpectedly.
- Do not use simulated live indicators that claim verified stream activity when actual stream status is unverified or still connecting.
- Genre discovery sections (Classic Rock, Alternative Rock, Hard Rock, Heavy Metal, Progressive Rock, Indie Rock, Grunge, Punk Rock) are editorial visual destinations, not separate playable channels.
- Navigation includes ROCK TV logo, LIVE TV, DISCOVER, ROCK LEGENDS, and ABOUT, transitioning from transparent over the opening to a compact sticky header with smooth section scrolling and responsive mobile navigation.

## Brand Commitments

- Identity: ROCK TV.
- Pinned visual direction from brief: deep black and charcoal backgrounds, subtle metallic textures, dramatic red accent lighting, sparing electric orange highlights, high-contrast white editorial typography, cinematic gradients, atmospheric shadows, subtle film grain, and controlled glow effects.
- Avoid generic SaaS layouts, corporate aesthetics, excessive rounded cards, cheap neon effects, and overloaded interfaces.

## Evidence on Hand

- Confirmed live broadcast embed URL: `https://tv.broadcasting.ro/85c83a80-4f71-4f2d-a8d6-43f676896bcb.html`.
- No external social media profile URLs were supplied; footer and navigation must not invent unverified social handles.
- Visual photography and editorial assets will be authored/curated at production quality with proper provenance.

## Product Principles

- The live television broadcast is the undisputed centerpiece of the experience.
- Technical honesty over simulated telemetry: clearly distinguish between iframe container connection, user-initiated broadcast playback, and external stream fallback.
- Editorial authority over catalog clutter: treat rock culture, genres, and legends with the pacing and typographic weight of a print music monograph and live concert stage.
- Performant choreography: every scroll transition and parallax motion must feel deliberate and respect `prefers-reduced-motion`.

## Accessibility & Inclusion

- Target WCAG 2.2 AA compliance across contrast, keyboard navigation, focus states, semantic landmarks, and `prefers-reduced-motion` support.


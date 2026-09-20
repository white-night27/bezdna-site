# БЕЗДНА — Design System

This file records the visual direction used for the site refresh.

## Source direction

Derived from the open-source UI UX Pro Max guidance for:
- Restaurant/Food Service: hero-centric conversion, menu clarity, strong food photography, location and hours prominent.
- Dark Mode (OLED): deep dark surfaces, high contrast, restrained glow, low rendering cost.
- Accessible & Ethical: visible focus, keyboard support, reduced-motion handling, readable text.
- Luxury/Premium cues: restrained accents, premium imagery, deliberate spacing, less decorative noise.

## Brand adaptation

The site keeps its existing identity rather than blindly applying a generic restaurant template.

### Palette
- Void: `#070606`
- Panel: `#0d0a09`
- Panel elevated: `#15100e`
- Blood: `#861d18`
- Blood bright: `#c63c2e`
- Ember: `#d26b45`
- Brass accent: `#b08a55`
- Bone: `#f5eee6`
- Muted: `#94877e`

### Typography
Keep the existing self-hosted Next.js font stack:
- Caveat — display/brand headlines
- Oswald — labels/navigation
- Manrope — body copy

The refresh changes hierarchy, scale and spacing rather than introducing extra font downloads.

### Layout
- Hero remains the dominant visual.
- Section headers use editorial two-column composition on desktop.
- Menu cards use restrained block composition with strong numbering.
- Food photography receives more visual priority.
- Atmosphere uses timeline structure with brass time markers.
- Contacts become clear destination/action cards.

### Motion
- No new heavy blur, canvas or WebGL.
- Existing motion is slowed/restrained.
- `prefers-reduced-motion` remains authoritative.

### Accessibility
- Keep visible focus states.
- Maintain semantic content and existing browser smoke tests.
- Preserve mobile navigation touch targets.
- Do not use color as the only state indicator.

### Performance
This refresh should remain CSS-first and should not add third-party runtime scripts, external font requests, or large media assets.

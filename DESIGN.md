---
name: Hugo Operator Cockpit
description: A calm, evidence-first control surface for autonomous creator campaigns.
colors:
  signal-teal: "#019393"
  signal-deep: "#006E6E"
  signal-soft: "#E6F5F4"
  canvas: "#F5F7F7"
  surface: "#FFFFFF"
  surface-sunken: "#EEF2F2"
  ink: "#10211F"
  text-secondary: "#526360"
  line: "#DCE4E3"
  line-strong: "#C5D1D0"
  success: "#167A5B"
  warning: "#986200"
  danger: "#B42318"
typography:
  display:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif"
    fontSize: "2rem"
    fontWeight: 650
    lineHeight: 1.15
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif"
    fontSize: "1.375rem"
    fontWeight: 650
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.35
rounded:
  sm: "6px"
  md: "10px"
  lg: "14px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.signal-deep}"
    textColor: "{colors.surface}"
    rounded: "{rounded.sm}"
    padding: "10px 16px"
    height: "44px"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "10px 16px"
    height: "44px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "10px 12px"
    height: "44px"
---

# Design System: Hugo Operator Cockpit

## Overview

**Creative North Star: "Quiet Signal"**

Hugo feels like a precision instrument: highly capable, calm under pressure, and explicit about what the autonomous system is doing. White space creates legibility rather than emptiness, while compact tables and analytical views preserve the density expert operators need.

The interface uses Apple-like clarity, deference, and depth without imitating consumer-device chrome. It rejects generic card dashboards, dark control-room neon, glassmorphism, gradients, huge rounded containers, marketing language, and hidden operational states.

**Key Characteristics:**

- Evidence appears beside decisions, not on a separate scavenger hunt.
- Teal identifies action, selection, and live data; it is never decorative noise.
- Tonal layers and fine dividers establish structure before shadows do.
- Dense views retain generous internal rhythm and progressive disclosure.
- Every chart has a text summary or tabular route to the same facts.

## Colors

The palette is a near-white technical canvas animated by one clear signal color and sober semantic states.

**The One Signal Rule.** Signal Teal is reserved for primary action, current selection, focus, and first-party data. Keep it under roughly ten percent of a screen.

**The Contrast Rule.** White copy uses Signal Deep, not Signal Teal, as its background. Signal Teal remains the requested brand accent while controls meet WCAG AA.

## Typography

**Display Font:** Native system sans with SF Pro Display where available
**Body Font:** Native system sans with SF Pro Text where available
**Label/Mono Font:** Native UI monospace only for references and machine values

**Character:** The single-family system is exact and quiet. Tight display tracking conveys confidence; labels remain sentence case and readable instead of behaving like decorative metadata.

**The One Family Rule.** Do not introduce a serif display face or a second branded UI family. Hierarchy comes from weight, size, spacing, and tabular numerals.

## Elevation

Hugo is flat by default. Canvas, sunken, and raised surface tones define most depth; a short ambient shadow appears only on floating drawers, dialogs, menus, and selected analytical surfaces.

**The Structural Shadow Rule.** Shadows explain stacking. They do not decorate static sections or accompany a heavy border on the same plane.

## Components

Buttons are compact and decisive with 44px targets. Inputs use a white fill, one-pixel line, explicit labels, and a teal focus ring. Status labels combine text and iconography so meaning never depends on color alone. Tables use sticky, sentence-case headings and subtle row highlighting. Navigation uses a restrained left rail on desktop and an accessible modal drawer on mobile. Analytical surfaces use small radii and tonal separation; related content is grouped by proximity before it is boxed.

Motion is limited to state transitions: 90ms for direct feedback, 160ms for component state, and 240ms for drawers. All motion stops under reduced-motion preferences.

## Do's and Don'ts

### Do:

- **Do** use Signal Teal for selected navigation, focus, primary data, and live indicators.
- **Do** use 44px minimum targets and visible keyboard focus.
- **Do** show financial and approval consequences before the confirmation action.
- **Do** pair charts with direct labels, summaries, or accessible tables.
- **Do** keep expert workflows dense while chunking them into decisions, evidence, and history.

### Don't:

- **Don't** build generic card dashboards or repeated mosaics of identical KPI cards.
- **Don't** use dark control-room neon, glassmorphism, gradients, or huge rounded containers.
- **Don't** use marketing language, oversized dashboard heroes, or decorative eyebrow labels.
- **Don't** hide operational states, approval versions, money movement, or provider failures.
- **Don't** use color as the only status cue or animate purely for atmosphere.
- **Don't** add transform-heavy hover theatrics, glowing surfaces, or soft AI-dashboard ornament.

# Design System Strategy: Dark Editorial Intelligence

## 1. Overview & Creative North Star: "The Digital Curator"
This design system is built to convey the authority of a legacy broadsheet paired with the high-velocity precision of modern engineering tools. Our Creative North Star is **The Digital Curator**. Unlike generic SaaS platforms that rely on "friendly" rounded corners and vibrant floods of color, this system utilizes high-contrast typography, cold-toned depth, and intentional asymmetry to make data feel like a privileged intelligence brief.

We break the "template" look by treating the screen as a physical layout. We favor wide margins, tight monochromatic palettes, and "The Instrument Shift"—the juxtaposition of a sharp, italicized serif against a brutalist mono-spaced grid.

---

## 2. Colors & Tonal Architecture
The palette is rooted in deep, cold obsidians. We do not use "pure" black (#000); we use `#080A0F` to maintain a sense of atmospheric depth.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders for sectioning global layouts. Boundaries must be defined solely through background color shifts. To separate a sidebar from a main feed, transition from `surface` (#111319) to `surface-container-low` (#191B21). Solid lines are "scaffolding"—we are building "architecture."

### Surface Hierarchy & Nesting
Treat the UI as a series of nested physical layers:
- **Base Layer:** `background` (#111319) - The infinite canvas.
- **Section Layer:** `surface-container-low` (#191B21) - Large content areas.
- **Card/Panel Layer:** `surface-container` (#1E1F25) - Interactive intelligence units.
- **Elevated/Active Layer:** `surface-container-highest` (#33353A) - Floating menus or active states.

### The "Glass & Gradient" Rule
To avoid a flat "Vantablack" effect, main CTAs and Hero backgrounds must use **Signature Textures**. 
- Use a radial gradient for the primary action: `primary` (#B4C5FF) transitioning to `primary-container` (#628AFF) at a 45-degree angle.
- Apply `backdrop-filter: blur(12px)` to the `surface-container-lowest` (#0C0E13) for all floating navigation to create a frosted "glass" transition over scrolling data.

---

## 3. Typography: The Editorial Contrast
The typographic system relies on the tension between the intellectual and the technical.

- **Display (Instrument Serif Italic):** Used *exclusively* for hero headlines and high-level section titles. It represents the "Editorial Voice"—human, sharp, and sophisticated.
- **UI/Body (Inter/Geist):** The workhorse. Set with generous tracking (-0.01em) to maintain a dense, premium feel. 
- **Metrics (Geist Mono):** Every number, percentage, or data point must be set in Mono. This signals "raw precision" and ensures that changing numbers don't cause layout jitters.

**Hierarchy Tip:** Never use `headline-lg` and `display-lg` in the same viewport. The serif is the star; the UI sans is the support.

---

## 4. Elevation & Depth
We eschew traditional material shadows in favor of **Tonal Layering**.

### The Layering Principle
Depth is achieved by "stacking." A `surface-container-lowest` card placed on a `surface-container-low` background creates a "sunken" or "carved" effect, which feels more permanent and authoritative than a floating card.

### Ambient Shadows
For floating modals or popovers, shadows must be:
- **Color:** `on-primary-fixed-variant` (#003DAA) at 5% opacity.
- **Blur:** 40px to 60px.
- **X/Y:** 0px / 8px.
This creates a "blue-glow" lift rather than a grey "drop shadow," mimicking the light of a high-end monitor.

### The "Ghost Border" Fallback
If accessibility requires a border (e.g., in high-density tables), use the **Ghost Border**:
- **Token:** `outline-variant` (#434654) at 15% opacity. 
- **Rule:** Never use 100% opacity on borders; they must feel like light reflecting off an edge, not a stroke drawn on top.

---

## 5. Components

### Primary Buttons
- **Style:** Subtle gradient (Primary to Primary-Container).
- **Radius:** `md` (0.375rem) for a precise, "tech" feel.
- **State:** On hover, increase the `surface-tint` to create a "pulsing" light effect.

### Asymmetric Bento Grid
- **Rule:** Avoid equal-width columns. Use a 2:1 or 3:1 ratio. 
- **Styling:** Use `surface-container-low` for the card background. No borders. Use `spacing-6` (1.5rem) for the gap to allow the "background" color to act as a natural separator.

### Intelligence Brief Panels
- **Anatomy:** A `title-sm` header in all-caps, a `display-sm` (Serif) headline, and `body-md` content.
- **Detail:** Use a 2px vertical accent bar of `primary` (#B4C5FF) on the left of the brief to denote "active intelligence."

### Input Fields
- **Background:** `surface-container-lowest`.
- **Border:** `outline-variant` at 20% opacity.
- **Focus State:** Transitions to `outline` (#8D90A0) with a 2px outer "glow" of the `primary` color at 10% opacity.

### Cards & Lists
- **Restriction:** NO divider lines.
- **Separation:** Use `spacing-4` (1rem) of vertical whitespace. Group related items using a background shift to `surface-container-low`.

---

## 6. Do's and Don'ts

### Do:
- **Use "Geist Mono" for all data.** This includes timestamps, IDs, and financial metrics.
- **Embrace Asymmetry.** Align text to the left and leave "dead space" on the right to simulate a premium magazine layout.
- **Use Micro-Glows.** Apply a 15% opacity radial gradient of the `accent` color (#4F7EFF) behind high-fidelity product mockups to give them "soul."

### Don't:
- **Don't use pure grey.** All "neutrals" must have a cold blue undertone to stay consistent with the `background` (#080A0F).
- **Don't use large corner radii.** Never exceed `xl` (0.75rem). The system should feel "sharp" and "engineered," not "soft" or "playful."
- **Don't center-align editorial text.** Authority is found in the "Left-Flush" grid. Center alignment is for marketing templates; we are building a tool.
- **Don't use 100% opaque borders.** They flatten the design. If you need a line, use a background color shift or a 10% opacity Ghost Border.
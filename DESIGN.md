---
name: Academic Editorial
colors:
  surface: '#f9f9ff'
  surface-dim: '#cfdaf0'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dee9ff'
  surface-container-highest: '#d8e3f9'
  on-surface: '#111c2c'
  on-surface-variant: '#44474e'
  inverse-surface: '#263141'
  inverse-on-surface: '#ebf1ff'
  outline: '#75777e'
  outline-variant: '#c5c6ce'
  surface-tint: '#4d5f80'
  primary: '#011633'
  on-primary: '#ffffff'
  primary-container: '#182b49'
  on-primary-container: '#8093b6'
  inverse-primary: '#b4c7ed'
  secondary: '#1f58c4'
  on-secondary: '#ffffff'
  secondary-container: '#618ffd'
  on-secondary-container: '#002869'
  tertiary: '#231300'
  on-tertiary: '#ffffff'
  tertiary-container: '#3e2600'
  on-tertiary-container: '#c38629'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#b4c7ed'
  on-primary-fixed: '#061b39'
  on-primary-fixed-variant: '#354767'
  secondary-fixed: '#dae2ff'
  secondary-fixed-dim: '#b2c5ff'
  on-secondary-fixed: '#001847'
  on-secondary-fixed-variant: '#0040a0'
  tertiary-fixed: '#ffddb5'
  tertiary-fixed-dim: '#ffb958'
  on-tertiary-fixed: '#2a1800'
  on-tertiary-fixed-variant: '#643f00'
  background: '#f9f9ff'
  on-background: '#111c2c'
  surface-variant: '#d8e3f9'
typography:
  display-hero:
    fontFamily: Newsreader
    fontSize: 56px
    fontWeight: '400'
    lineHeight: 64px
    letterSpacing: -0.02em
  display-hero-mobile:
    fontFamily: Newsreader
    fontSize: 36px
    fontWeight: '400'
    lineHeight: 44px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Newsreader
    fontSize: 40px
    fontWeight: '400'
    lineHeight: 48px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Newsreader
    fontSize: 28px
    fontWeight: '400'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Newsreader
    fontSize: 28px
    fontWeight: '500'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Newsreader
    fontSize: 22px
    fontWeight: '500'
    lineHeight: 30px
    letterSpacing: 0em
  title-md:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.005em
  title-sm:
    fontFamily: Manrope
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 22px
    letterSpacing: 0em
  body-lg:
    fontFamily: Newsreader
    fontSize: 20px
    fontWeight: '400'
    lineHeight: 32px
    letterSpacing: 0.005em
  body-md:
    fontFamily: Manrope
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-sm:
    fontFamily: Manrope
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.06em
  label-mono-isbn:
    fontFamily: Manrope
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.12em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 3rem
  margin-mobile: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style
The design system embodies the intellectual gravitas of scholarly publishing fused with the tactile, deliberate warmth of a curated independent literary press. Created for researchers, university faculty, librarians, and discerning scholars, the interface evokes quiet authority, rigorous clarity, and literary prestige.

The aesthetic philosophy draws on **Contemporary Editorial Minimalism** married to **Tactile Academic Architecture**:
- Architectural discipline anchored by crisp ruling lines and balanced proportions.
- Generous editorial margins that mirror the physical composition of fine book typography.
- Deliberate hierarchy that showcases peer-reviewed monographs, ISBN registrations, and archival texts with the reverence of museum collections.
- Restraint over ornamentation: visual interest originates from refined typography pairings, structured information density, and considered micro-details rather than decorative excess.

## Colors
The palette balances ink-on-paper tradition with authoritative digital clarity:

- **Primary (`#182B49` - Deep Ink Blue):** The foundational tone representing printer's ink, binding boards, and high academic authority. Used for primary typography, dominant containers, formal badges, and primary interactive states.
- **Secondary (`#3568D4` - Cobalt Blue):** A vivid, precise chromatic accent denoting digital agency, citation links, interactive calls to action, and active research filter toggles.
- **Tertiary (`#E5A344` - Muted Amber):** Echoing gilded foil stamping, archival paper edges, and peer-review distinctions. Applied purposefully to peer-reviewed seals, featured volume ribbons, and bookmarking mechanics.
- **Neutral (`#687386` - Slate Gray):** The bridge tone for secondary metadata (ISBN strings, DOI links, author affiliations, and citation indexes).
- **Surface Canvas (`#FAFAF7` - Warm White):** The parchment base that avoids the clinical glare of digital screens, providing an inviting, tactile reading ground.
- **Surface Elevation (`#FFFFFF` - Pure White):** Used for elevated cards, book previews, dropdowns, and modal dialogs to establish crisp editorial contrast against `#FAFAF7`.
- **Structural Dividing Line (`#E9EEF5` - Pale Blue-Gray):** Subtle architectural borders, data tables, and horizontal rules.

## Typography
Typography is the cornerstone of this design system, establishing a dialogue between academic heritage and contemporary utility:

- **Serif Scale (`Newsreader`):** Applied to book titles, editorial essays, chapter headings, and quotes. Italics should be used generously for secondary volume titles, academic epigraphs, and translated titles.
- **Sans-Serif Scale (`Manrope`):** Handles all navigation, metadata, data-dense catalog indexes, search filters, and bibliographic forms. It ensures rapid scannability without cold impersonality.
- **Micro-Typography & Catalog Labels:** The `label-mono-isbn` style is always rendered in uppercase with wide tracking (`0.12em`) to cleanly frame catalog numbers, Library of Congress references, DOI strings, and publication dates.

## Layout & Spacing
The layout follows a disciplined 12-column editorial grid on desktop and tablet, shifting to a 4-column flow on mobile screens:

- **Desktop (>= 1280px):** Max container width capped at 1360px with generous `3rem` margins to emulate wide book margins. Asymmetrical splits (e.g., 4 columns for cover metadata and book jacket preview, 8 columns for abstract, citation index, and chapter breakdown) reflect high-end print monographs.
- **Tablet (768px - 1279px):** 8-column layout with `2rem` outer margins and `1.25rem` gutters. Dual-pane catalog filters collapse into an off-canvas drawer.
- **Mobile (< 768px):** 4-column layout with `1.25rem` outer margins. Dense vertical rhythm with `space-md` element gaps, prioritizing single-column book card stacks and direct sticky reading controls.
- **Spacing Rhythm:** Vertical spacing adheres strictly to multiples of `0.5rem`, guaranteeing consistent baseline cadence across multi-column book listings and long-form excerpts.

## Elevation & Depth
Elevation mimics stacked physical paper, archival cases, and fine-bound volumes rather than high-altitude floating surfaces:

- **Tonal Hierarchy:** Depth is created primarily through color shifts: `#FAFAF7` (canvas baseline) to `#FFFFFF` (elevated cards and plates), bounded by sharp `1px solid #E9EEF5` structural borders.
- **The "Book Plate" Shadow:** For publication cards and covers, use a directional, heavy-base ambient shadow mimicking upright books on natural shelving:
  `box-shadow: 0 1px 3px rgba(24, 43, 73, 0.05), 0 8px 24px -4px rgba(24, 43, 73, 0.08);`
- **Elevated Modals & Reading Drawers:** High-order surfaces use an ink-tinted backdrop blur with structural borders:
  `box-shadow: 0 20px 48px -8px rgba(24, 43, 73, 0.16); border: 1px solid #E9EEF5;`
- **Zero-Shadow Alternative:** In archival tables and citation lists, rely entirely on hairline dividers (`1px solid #E9EEF5`) without shadows to sustain academic precision.

## Shapes
The shape philosophy favors crisp, bookbinding-inspired geometry:

- **Base Radius (0.25rem / 4px):** Form fields, action buttons, filter tags, and citation chips maintain restrained corners, echoing precision-trimmed book blocks and card catalog leaves.
- **Container Radius (0.5rem / 8px):** Applied to content cards, publication jackets, and preview sheets.
- **Hard Edges (0px):** Academic tables, book cover display artboards, and full-width section dividers retain sharp, unrounded geometry to preserve formal structure.
- **Pills Disallowed:** True pill borders (`border-radius: 9999px`) are intentionally avoided to protect the academic and architectural seriousness of the design language.

## Components

### Buttons
- **Primary Button:** Background in Deep Ink Blue (`#182B49`), text in Pure White (`#FFFFFF`), border radius `4px`. Hover state shifts background to Cobalt Blue (`#3568D4`) with a subtle 150ms transition. Active state applies `transform: scale(0.99)`.
- **Secondary Button:** Surface in Pure White (`#FFFFFF`) with a `1px solid #182B49` outline and text in `#182B49`. Hover fills with Pale Blue-Gray (`#E9EEF5`).
- **Tertiary / Literary Link Button:** Transparent background, text in Cobalt Blue (`#3568D4`), accompanied by an arrow glyph (`→`) with a 2px hover slide effect.

### Chips & Badges
- **Peer-Reviewed Status Badge:** Muted Amber surface (`#E5A344` at 12% opacity), text in `#9A6417`, border `1px solid rgba(229, 163, 68, 0.3)`. Text set in `label-md`.
- **Subject Category Chips:** Warm White (`#FAFAF7`) background with `1px solid #E9EEF5`, text in Slate Gray (`#687386`). Active/selected state shifts to Deep Ink Blue (`#182B49`) background with white text.

### Publication Cards (Monograph Presentation)
- Structured on `#FFFFFF` with a `1px solid #E9EEF5` border and the signature "Book Plate" shadow.
- Top section showcases the publication cover with realistic spine shading and an aspect ratio of 1:1.48.
- Bottom section contains the monograph title in `headline-sm` serif, author credentials in `body-sm`, and an archival footer bar presenting the ISBN-13 badge and DOI indicator in `label-mono-isbn`.

### Input Fields & Search Architecture
- Form controls use Pure White surfaces with `1px solid #687386` borders (muted to 40% opacity in default state).
- Focused state applies a crisp `1px solid #3568D4` border paired with an ink-tinted outer glow: `box-shadow: 0 0 0 3px rgba(51, 104, 212, 0.15)`.
- Global catalog search inputs include integrated prefix labels for search scopes (`ISBN`, `Author`, `Subject`, `DOI`).

### Checkboxes & Radio Buttons
- Custom square checkboxes with `2px` corners; radio circles with double concentric rings.
- Inactive state: `1.5px solid #687386`. Checked state: Deep Ink Blue (`#182B49`) fill with a pure white check icon or center dot.

### Specialized Component: ISBN & Citation Drawer
- An archival pane featuring pre-formatted citations (APA 7th, Chicago 17th, MLA 9th, Harvard) with a single-click copy action, persistent barcode render, and verified registrar badge confirming registration in Lucknow, India.
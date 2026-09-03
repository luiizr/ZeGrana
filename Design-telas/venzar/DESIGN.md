---
name: Venzar
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#414845'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#717975'
  outline-variant: '#c0c8c3'
  surface-tint: '#3b6758'
  primary: '#002018'
  on-primary: '#ffffff'
  primary-container: '#06372b'
  on-primary-container: '#74a191'
  inverse-primary: '#a2d0bf'
  secondary: '#476800'
  on-secondary: '#ffffff'
  secondary-container: '#bcf063'
  on-secondary-container: '#4b6d00'
  tertiary: '#191b1c'
  on-tertiary: '#ffffff'
  tertiary-container: '#2e3030'
  on-tertiary-container: '#969898'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#beeddb'
  primary-fixed-dim: '#a2d0bf'
  on-primary-fixed: '#002118'
  on-primary-fixed-variant: '#234e41'
  secondary-fixed: '#bff365'
  secondary-fixed-dim: '#a4d64c'
  on-secondary-fixed: '#131f00'
  on-secondary-fixed-variant: '#354e00'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  balance-xl:
    fontFamily: Hanken Grotesk
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.03em
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base-unit: 4px
  container-padding-mobile: 20px
  container-padding-desktop: 40px
  stack-gap-sm: 8px
  stack-gap-md: 16px
  stack-gap-lg: 24px
  grid-gutter: 16px
---

## Brand & Style

The design system is engineered for a high-end, mobile-first financial experience. It balances the seriousness of wealth management with a fresh, energetic aesthetic that encourages frequent engagement. The personality is **sophisticated, precise, and transparent**.

### Design Style: Modern Glassmorphism & High-Contrast
The visual direction combines **Corporate Modern** structures with **Glassmorphism** and **High-Contrast** accents. 
- **Depth:** Subtle background blurs and translucent card layers create a sense of organized hierarchy.
- **Vibrancy:** High-energy lime accents against deep forest greens provide immediate visual feedback and clear calls to action.
- **Precision:** A focus on numerical clarity through deliberate typographic weighting.
- **Atmosphere:** The interface feels like a premium digital wallet, utilizing soft gradients and organic shapes to soften the traditionally "stiff" nature of finance.

## Colors

The palette is rooted in a "Deep Forest" primary green to evoke stability and growth, contrasted with a "Neon Lime" secondary for action and emphasis.

- **Primary (#06372B):** Used for main containers, dark-mode backgrounds, and primary action buttons.
- **Secondary (#BEF264):** The "Growth" color. Used for success states, key highlights, and primary CTA accents.
- **Neutral High (#FFFFFF):** The base for the light mode interface, providing a crisp, clean canvas.
- **Neutral Low (#F8FAFC):** Used for subtle section differentiation and secondary card backgrounds.
- **Semantic Colors:** Green for income/positive trends, White or Primary for neutral data, and a muted Red for expenses/negative trends only when critical.

The design system utilizes **Glassmorphism** through semi-transparent white overlays (60% opacity) with a 20px backdrop blur to create "floating" interactive layers.

## Typography

This design system uses **Hanken Grotesk** as the primary typeface for its sharp, contemporary geometry that maintains high legibility in financial data. **Geist** is used for labels and technical data to provide a developer-grade precision feel to numbers and metadata.

- **Financial Data:** Large currency amounts should use `balance-xl` with tight letter spacing to feel like a singular visual unit.
- **Hierarchy:** Use bold weights for primary balance figures and medium weights for transaction titles.
- **Mobile Scaling:** Headlines downscale by approximately 20% on mobile devices to ensure balance figures remain on a single line.

## Layout & Spacing

The layout follows a **fluid-to-fixed** model optimized for handheld use.

- **Mobile (Default):** A single-column flow with 20px side margins. Key financial summaries are housed in "Hero Cards" that span the full width minus margins.
- **Desktop:** The layout centers to a maximum width of 1200px, utilizing a 12-column grid.
- **Safe Areas:** All interactive elements must maintain a minimum 44px touch target height.
- **Rhythm:** A 4px baseline grid ensures consistent vertical rhythm. Card internals should consistently use 16px or 24px padding to maintain a breathable, premium feel.

## Elevation & Depth

Hierarchy is established through **Tonal Layering** and **Backdrop Blurs** rather than traditional heavy shadows.

1.  **Level 0 (Base):** The main background (White or Forest Green).
2.  **Level 1 (Cards):** Low-contrast outlines (1px solid #E2E8F0) or subtle 5% black shadows with 10px blur.
3.  **Level 2 (Glass Overlays):** Used for navigation bars and floating action menus. Background blur of 20px and a 1px white border at 20% opacity.
4.  **Level 3 (Modals/Popovers):** High-diffused ambient shadows (Opacity: 10%, Blur: 30px, Y-Offset: 10px) to indicate the highest level of the stack.

## Shapes

The design system employs an **extra-rounded (2xl)** shape language to feel approachable and "native app-like."

- **Cards:** Use a consistent `24px` (1.5rem) radius to create a soft, containerized look.
- **Interactive Elements:** Buttons utilize a full **Pill-shape** (`100px`) to maximize touch-affordance and differentiate them from informational cards.
- **Inputs:** A slightly tighter `16px` radius is used for text fields to maintain structural integrity.
- **Inner Radii:** When nesting elements, the inner radius should be 8px smaller than the outer container to maintain visual harmony.

## Components

### Buttons
- **Primary:** Forest Green background with White text or Lime Green background with Forest Green text. Pill-shaped.
- **Secondary:** Transparent with a 1.5px Forest Green border.
- **Icon Buttons:** Circular containers with glassmorphic backgrounds for low-priority actions.

### Cards (The "Financial Container")
- **Balance Card:** Primary Forest Green background, White typography, and a subtle Lime Green accent (e.g., a small trend sparkline or a pill-shaped "Increase" indicator).
- **Activity Item:** A flat list item with a 48px circular icon container (soft grey or muted lime) and Geist-font labels for the amount.

### Input Fields
- Semi-transparent backgrounds with a 1px border that glows Lime Green on focus.
- Labels sit above the field in `label-caps` typography.

### Navigation Bar
- A floating "Glass" dock at the bottom of the screen.
- Icons are stroke-based (2px weight).
- The active state is indicated by a Forest Green dot or a subtle Lime highlight behind the icon.

### Chips/Tags
- Used for transaction categories (e.g., "Food", "Travel").
- Small, `12px` rounded corners, using high-light versions of the primary colors (e.g., Light Lime background with Dark Green text).
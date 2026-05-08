---
name: DevProgress
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#45474c'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#75777d'
  outline-variant: '#c5c6cd'
  surface-tint: '#545f73'
  primary: '#091426'
  on-primary: '#ffffff'
  primary-container: '#1e293b'
  on-primary-container: '#8590a6'
  inverse-primary: '#bcc7de'
  secondary: '#0058be'
  on-secondary: '#ffffff'
  secondary-container: '#2170e4'
  on-secondary-container: '#fefcff'
  tertiary: '#040057'
  on-tertiary: '#ffffff'
  tertiary-container: '#0d0093'
  on-tertiary-container: '#7f82ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e3fb'
  primary-fixed-dim: '#bcc7de'
  on-primary-fixed: '#111c2d'
  on-primary-fixed-variant: '#3c475a'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#004395'
  tertiary-fixed: '#e1e0ff'
  tertiary-fixed-dim: '#c0c1ff'
  on-tertiary-fixed: '#07006c'
  on-tertiary-fixed-variant: '#2f2ebe'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  h1:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.02em
  h2:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  h3:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  code:
    fontFamily: jetbrainsMono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  xs: 0.25rem
  sm: 0.5rem
  md: 1rem
  lg: 1.5rem
  xl: 2rem
  2xl: 3rem
  gutter: 1.5rem
  margin: 2rem
---

## Brand & Style

This design system is built on the principles of **Corporate Minimalism**, specifically tailored for high-density project management. The brand personality is authoritative yet enabling—positioning the platform as a reliable partner in technical execution. 

The aesthetic prioritizes functional clarity over decorative flair. It utilizes a structured visual hierarchy to reduce cognitive load in data-heavy environments. By combining a deep, grounding primary palette with vibrant interaction cues, the system evokes a sense of "focused momentum." The interface feels instrumental, precise, and engineered for professional workflows.

## Colors

The palette is engineered for prolonged professional use, balancing high-contrast navigation with a soft, neutral workspace.

*   **Primary (Deep Navy):** Reserved for structural elements like sidebars and headers to provide a solid frame for the application.
*   **Action (Vibrant Blue):** Used exclusively for primary buttons, active states, and progress indicators to draw the eye to interactive paths.
*   **Neutral (Slate & Gray):** A scale of grays handles secondary text, borders, and backgrounds to maintain a clean, non-distracting environment.
*   **Semantic Colors:** Success (Emerald), Warning (Amber), and Error (Rose) are used with low-saturation backgrounds and high-saturation text for status indicators.

## Typography

This design system utilizes **Inter** as the primary typeface for its exceptional legibility and systematic weight distribution. 

The typographic scale is tight, designed for information density. We use semi-bold weights for data labels to ensure they remain scannable against light-gray backgrounds. For technical identifiers (Task IDs, Commit Hashes), the system switches to a monospaced font to differentiate technical data from human-readable content.

## Layout & Spacing

This design system employs a **12-column fluid grid** for main dashboard views, ensuring adaptability across desktop and wide-screen monitor setups.

A strict **8px (0.5rem) base unit** governs all spacing decisions. This creates a predictable rhythm in lists and tables. Data-heavy views should utilize "Compact" (8px) and "Default" (12px) padding settings to allow users to toggle between information density and readability. Sidebar widths are fixed at 280px to provide a consistent anchor for the navigation.

## Elevation & Depth

Visual hierarchy is established through **Tonal Layering** and **Ambient Shadows**. 

1.  **Floor (Level 0):** Background (#F8FAFC) where the main app structure sits.
2.  **Surface (Level 1):** Main content cards and panels. These use a 1px border (#E2E8F0) and no shadow for a flat, organized look.
3.  **Raised (Level 2):** Hover states and active dropdowns. These utilize a soft, diffused shadow (0 4px 6px -1px rgb(0 0 0 / 0.1)) to indicate interactivity.
4.  **Overlay (Level 3):** Modals and slide-overs. These feature a larger blur radius and a subtle backdrop dimming to pull focus.

## Shapes

The shape language is balanced and modern. A **roundedness level of 2 (8px base)** is applied to primary components like buttons and input fields, while larger containers like dashboard cards use a **12px (0.75rem)** radius.

This subtle rounding softens the industrial "enterprise" feel without sacrificing the professional grid-based structure. Consistent corner radii are essential to maintaining the "engineered" look of the system.

## Components

*   **Buttons:** Primary actions use the Vibrant Blue (#3B82F6) with white text. Secondary actions use a light gray ghost style with a subtle border.
*   **Input Fields:** Use 8px corners, a white background, and a 1px border. On focus, the border transitions to Vibrant Blue with a soft 2px glow.
*   **Chips & Tags:** Small, low-contrast pills (4px radius) used for status (e.g., "In Progress," "Backlog"). They use a light tint of the semantic color as a background.
*   **Data Tables:** Clean rows with 1px horizontal dividers only. Header rows are slightly tinted (#F1F5F9) with uppercase, bold labels.
*   **Progress Bars:** Thin, 8px-high rounded tracks. Completed segments use the Vibrant Blue, while the background track is a neutral light gray.
*   **Cards:** The primary container for dashboard widgets. Cards should have a white background, 12px rounded corners, and a 1px border. No shadows unless they are being dragged or interacted with.
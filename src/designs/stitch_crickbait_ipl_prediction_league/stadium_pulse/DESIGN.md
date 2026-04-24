---
name: Stadium Pulse
colors:
  surface: '#0f131f'
  surface-dim: '#0f131f'
  surface-bright: '#353946'
  surface-container-lowest: '#0a0e1a'
  surface-container-low: '#171b28'
  surface-container: '#1b1f2c'
  surface-container-high: '#262a37'
  surface-container-highest: '#313442'
  on-surface: '#dfe2f3'
  on-surface-variant: '#e0c0b1'
  inverse-surface: '#dfe2f3'
  inverse-on-surface: '#2c303d'
  outline: '#a78b7d'
  outline-variant: '#584237'
  surface-tint: '#ffb690'
  primary: '#ffb690'
  on-primary: '#552100'
  primary-container: '#f97316'
  on-primary-container: '#582200'
  inverse-primary: '#9d4300'
  secondary: '#ffc640'
  on-secondary: '#402d00'
  secondary-container: '#e3aa00'
  on-secondary-container: '#5a4100'
  tertiary: '#4ae176'
  on-tertiary: '#003915'
  tertiary-container: '#00b251'
  on-tertiary-container: '#003b16'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdbca'
  primary-fixed-dim: '#ffb690'
  on-primary-fixed: '#341100'
  on-primary-fixed-variant: '#783200'
  secondary-fixed: '#ffdf9f'
  secondary-fixed-dim: '#f9bd22'
  on-secondary-fixed: '#261a00'
  on-secondary-fixed-variant: '#5c4300'
  tertiary-fixed: '#6bff8f'
  tertiary-fixed-dim: '#4ae176'
  on-tertiary-fixed: '#002109'
  on-tertiary-fixed-variant: '#005321'
  background: '#0f131f'
  on-background: '#dfe2f3'
  surface-variant: '#313442'
typography:
  display-header:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '900'
    lineHeight: '1.1'
    letterSpacing: -0.05em
  team-name:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '700'
    lineHeight: '1.2'
  score-massive:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '800'
    lineHeight: '1'
  body-main:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: lexend
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  data-mono:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: '700'
    lineHeight: '1'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 0.25rem
  sm: 0.5rem
  md: 1rem
  lg: 1.5rem
  xl: 2rem
  gutter: 1rem
  margin-mobile: 1rem
  margin-desktop: 2.5rem
---

## Brand & Style

This design system captures the electric atmosphere of an IPL night match. The brand personality is aggressive, high-stakes, and premium, targeting fans who treat cricket as a lifestyle rather than just a sport. The UI should evoke the adrenaline of a last-ball finish and the prestige of a VIP stadium lounge.

The design style is **High-Contrast / Bold** mixed with **Glassmorphism**. It utilizes deep obsidian surfaces layered with neon-glow indicators and broadcast-style typography. Decorative elements include subtle leather textures (cricket ball stitch) and white pitch-marking lines to ground the interface in the sport’s physical reality. The interface must feel "live"—pulsating with real-time data and glowing accents that mimic stadium floodlights.

## Colors

The palette is anchored in a "Deep Navy Black" to simulate the night sky over a stadium. The **IPL Orange** primary accent is used for high-priority calls to action and critical brand moments. **Gold** is reserved for premium features, winnings, and leaderboards. 

Status colors are hyper-saturated to ensure visibility against the dark backdrop:
- **Neon Green:** Used for live match states with a 0 0 12px glow effect.
- **Red:** Used for locked markets or high-stakes warnings.
- **Grey:** Used for disabled or upcoming states.

Headers use a dramatic vertical gradient from a muted stadium blue (#1E3A5F) to the background black to create a sense of verticality and focus.

## Typography

This design system utilizes a tiered typography approach to handle dense sports data. **Inter** is the workhorse, used in its heaviest weights (900/Black) for headlines to create a broadcast aesthetic. 

For numeric data, points, and betting odds, we use **Space Grotesk** or a high-utility Mono variant to ensure character alignment in live-updating scoreboards. **Lexend** is introduced for labels and auxiliary "active" text to provide a subtle athletic feel. All headers must use tight tracking (-0.05em) to maintain a compact, high-energy look.

## Layout & Spacing

The layout follows a **fluid grid** model optimized for one-handed mobile use. It uses an 8px base rhythm, but narrows to 4px for tight data tables and match cards. 

Information density is high. Main navigation is anchored to a bottom bar for mobile-first accessibility. Content containers (cards) should span the full width of the mobile viewport minus the 16px margins, while on larger screens, they should organize into a multi-column masonry layout to reveal secondary match stats and social feeds.

## Elevation & Depth

Visual hierarchy is achieved through **Tonal Layering** and **Glassmorphism**. 
- **Level 0:** #0A0E1A (The pitch/background).
- **Level 1:** #111827 (Standard cards).
- **Level 2:** #1F2937 (Floating headers or active modals).

To enhance the "premium" feel, use a subtle 1px inner border on cards with an opacity of 10% white to catch the "light" from above. Live indicators and "Bet Now" buttons should utilize an outer glow (box-shadow: 0 0 15px [color]40) to simulate the intensity of stadium floodlights.

## Shapes

The shape language is **Soft** but disciplined. We avoid overly bubbly corners to maintain a serious, high-stakes aesthetic. Standard cards use a 4px (rounded) corner, while primary action buttons use 8px (rounded-lg) to stand out. 

Decorative elements, like progress bars for "Win Probability" or "Overs Completed," should use flat or slightly chamfered ends rather than fully rounded pills to keep the look sharp and aggressive.

## Components

### Buttons
- **Primary:** Background #F97316, Text #F9FAFB, font-bold. High-contrast, no shadow except for a glow on hover/active.
- **Secondary:** Transparent with a 2px border of #FBBF24.
- **Live Toggle:** Uses a neon green dot alongside the text.

### Cards (Match/Prediction)
Cards are the heart of this design system. They use the #111827 surface color with a #1F2937 border. Include a subtle "pitch line" graphic (a single 1px white line) at the bottom or top of the card for thematic consistency.

### Chips/Badges
Small, high-contrast markers for "Live," "Upcoming," or "Finished." "Live" badges must pulse using a subtle opacity animation.

### Prediction Inputs
Inputs should feel tactile. Use the font-mono for numeric entry. The active state should change the border from #1F2937 to #F97316 (Orange).

### Progress Bars (Win Probabilities)
Use a dual-color bar (#F97316 vs #1E3A5F) with a vertical divider to show the head-to-head probability.
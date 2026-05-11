# PulseBoard — Master Aesthetic Skill Sheet
> Extracted from Revio landing page reference. Use as the definitive design system for PulseBoard.

---

## 1. LAYOUT LOGIC

### Grid System
- **12-column grid** with a centered content container
- Max-width: **1200px** on desktop, with **24-32px** horizontal padding on each side
- Content typically spans **10 columns centered** for text-heavy sections, full 12 for card grids

### Negative Space Strategy — AIRY (premium spacing)
- **Section vertical padding**: 96-120px top/bottom between major sections
- **Inner card padding**: 28-36px on all sides
- **Gap between grid cards**: 20-24px
- **Paragraph spacing**: 20-24px between text blocks
- **CTA button padding**: 14-16px vertical, 28-32px horizontal
- Rule: **When in doubt, add more space, not less.** White space = premium feel.

### Content Hierarchy Patterns

**Hero**: Full-width centered layout
- Eyebrow badge (small pill) centered above headline
- H1 headline centered, max-width ~720px
- Subtitle centered below, max-width ~600px
- Two CTA buttons side-by-side, centered
- 3 product preview cards in an equal row below, with slight overlap/offset toward the hero

**Platform Overview / Feature Showcase**: 50/50 split
- Left: Large headline text (H2) + body paragraph
- Right: Full dashboard mockup screenshot with soft shadow

**Core Capabilities**: Bento-box grid (mixed card sizes)
- Row 1: 3 equal cards
- Row 2: 2 wider cards (60/40 or 50/50 split)
- Row 3: 3 equal cards
- Cards contain: icon/visual at top, title, short description

**Final CTA**: Full-width centered, same pattern as hero but denser

**Footer**: 4-column grid — logo+description | product links | resources | company

---

## 2. VISUAL LANGUAGE & SURFACES

### Depth Model: "Soft Elevation" (Glassmorphism-light)
- NOT flat design — surfaces have **gentle lift** and **subtle transparency**
- NOT heavy glassmorphism — no harsh blur or strong transparency
- Cards feel like **floating paper** on a soft background, not punched into it

### Border Radius — ORGANIC & SOFT

| Element | Border Radius |
|---|---|
| Cards (feature, pricing, bento) | **20-24px** |
| Dashboard mockup containers | **16-20px** |
| Buttons (primary CTA) | **12px** (rounded but not pill) |
| Buttons (secondary/ghost) | **12px** |
| Pill badges / tags | **999px** (full pill) |
| Input fields | **12px** |
| Small inner cards / nested elements | **12-16px** |
| Avatar images | **50%** (circle) |
| Tooltips / popovers | **12px** |

**Rule**: Nothing below 12px. No sharp corners anywhere. The default is 20px for containers.

### Shadows — DIFFUSE & AMBIENT
- Cards: `box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 8px 24px rgba(0, 0, 0, 0.03)`
- Elevated cards (on hover): `box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06), 0 20px 40px rgba(0, 0, 0, 0.04)`
- Dashboard mockups: `box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06)`
- **Rule**: Shadows are barely visible. They whisper, never shout. Low opacity, wide spread.

### Borders
- Cards have **1px borders** with very low opacity: `border: 1px solid rgba(0, 0, 0, 0.06)`
- Some cards use a slightly more visible border: `border: 1px solid #E8E8E6`
- Inner separators: `border: 1px solid #F0F0EE`
- **Rule**: Borders are structural hints, not visual elements. They help define edges on white-on-white.

### Surface Hierarchy
1. **Page background**: Warm off-white (not pure white)
2. **Card surfaces**: Pure white `#FFFFFF`
3. **Nested/inner elements**: Slightly tinted `#F9F9F7` or `#F5F5F3`
4. **Active/selected states**: Light accent tint (e.g., `#F0F7FF` for blue, `#F0FDF4` for green)

---

## 3. COLOR ARCHITECTURE

### Primary Palette

| Role | Color | Hex | Usage |
|---|---|---|---|
| Page Background | Warm off-white / cream | `#FAFAF7` | Full page background |
| Card Background | Pure white | `#FFFFFF` | All cards and surfaces |
| Primary Text | Near-black (warm) | `#1A1A2E` | Headlines, body text |
| Secondary Text | Medium gray | `#6B7280` | Subtitles, descriptions |
| Tertiary Text | Light gray | `#9CA3AF` | Captions, metadata, eyebrow labels |
| Primary CTA | Deep charcoal/black | `#1A1A2E` | Main action buttons (dark bg + white text) |
| CTA Text | Pure white | `#FFFFFF` | Text on primary buttons |

### Accent Palette

| Role | Color | Hex | Usage |
|---|---|---|---|
| Success / Primary accent | Soft green | `#22C55E` | Badges, positive indicators, active states |
| Info / Secondary accent | Soft blue | `#3B82F6` | Charts, links, selected states |
| Warning / Tertiary accent | Soft orange/coral | `#F97316` | Attention indicators, chart accents |
| Purple accent | Soft violet | `#8B5CF6` | Chart variety, premium feature highlights |

### Background Strategy — "Warm Diffused Gradient"
**Hero background**: Multiple soft, large, blurred gradient blobs
- Blob 1: Warm peach/orange (`#FED7AA` at 40% opacity), positioned top-right
- Blob 2: Soft green/teal (`#A7F3D0` at 30% opacity), positioned center-left
- Blob 3: Soft blue/lavender (`#BFDBFE` at 30% opacity), positioned top-left
- All blobs: `filter: blur(80-120px)`, absolute positioned behind content
- Creates a warm, inviting, aurora-like background without being distracting

**Section backgrounds alternate**:
- Odd sections: `#FAFAF7` (warm off-white)
- Even sections: `#FFFFFF` (pure white)
- CTA section: Warm off-white with subtle gradient
- Footer: `#FAFAF7` with top border

---

## 4. TYPOGRAPHY SYSTEM

### Font Stack
- **Headlines (H1-H3)**: `'Plus Jakarta Sans', 'Inter', sans-serif` — weight 700 (Bold)
- **Body text**: `'Inter', 'Plus Jakarta Sans', sans-serif` — weight 400 (Regular) / 500 (Medium)
- **Mono/code**: `'JetBrains Mono', 'Fira Code', monospace` — only for code snippets or data

### Type Scale

| Element | Size (desktop) | Size (mobile) | Weight | Line-height | Letter-spacing |
|---|---|---|---|---|---|
| Eyebrow / Label | 12-13px | 11-12px | 600 | 1.2 | `0.08em` (tracked-out, uppercase) |
| Body small | 14px | 13px | 400 | 1.6 | `0` |
| Body | 16-17px | 15-16px | 400 | 1.65 | `-0.01em` |
| Body large / Subtitle | 18-20px | 16-18px | 400 | 1.6 | `-0.01em` |
| H4 (card title) | 20-22px | 18-20px | 600 | 1.3 | `-0.02em` |
| H3 (section sub) | 26-30px | 22-26px | 700 | 1.25 | `-0.02em` |
| H2 (section heading) | 38-44px | 28-34px | 700 | 1.15 | `-0.03em` |
| H1 (hero) | 56-64px | 36-42px | 700 | 1.08 | `-0.035em` |
| Display (oversized) | 72px+ | 42px+ | 700 | 1.05 | `-0.04em` |

### Typography Vibe
- **Oversized, tightly tracked headlines** — big, bold, confident
- **Tiny uppercase eyebrow labels** above section headings — subtle, structured
- **Negative letter-spacing on headlines** — makes large text feel tighter and more premium
- **Generous line-height on body** — comfortable reading at 1.6-1.65
- **No decorative fonts** — everything is utilitarian and readable

---

## 5. INTERACTIVE DNA

### Hover Effects
- **Primary CTA button**: `background: #1A1A2E -> #2D2D42` (lighten slightly) + `transform: translateY(-1px)` + shadow increase. Transition: `200ms ease`
- **Secondary/ghost button**: `background: transparent -> rgba(26, 26, 46, 0.05)`. Transition: `150ms ease`
- **Cards**: `transform: translateY(-4px)` + shadow increase from ambient to elevated. Transition: `300ms ease`
- **Links**: `opacity: 0.7 -> 1.0` or subtle underline animation (left-to-right reveal)
- **Nav items**: `color: #6B7280 -> #1A1A2E`. Transition: `150ms ease`

### Scroll Animations
- **Sections fade-in-up**: Elements start `opacity: 0; transform: translateY(24px)` and animate to `opacity: 1; transform: translateY(0)` when entering viewport
- **Stagger**: Cards in a grid stagger their entrance by `100ms` each
- **Duration**: `600-800ms` with `ease-out` easing
- **Trigger**: When element is ~20% visible in viewport
- **Hero gradient blobs**: Very slow drift animation (`animation: drift 20s ease-in-out infinite alternate`)

### Micro-interactions
- **Button press**: `transform: scale(0.98)` on `:active`
- **Badge/pill**: Subtle pulse or glow on the hero eyebrow badge
- **Stat numbers**: Count-up animation from 0 to final value over ~1.5s when scrolled into view
- **Copy button**: Brief checkmark flash + "Copied!" tooltip on click

### Transitions
- **Default transition**: `all 200ms ease`
- **Card hover**: `all 300ms ease`
- **Page/section transitions**: `600ms ease-out`
- **Color transitions**: `150ms ease`

---

## 6. COMPONENT PATTERNS

### Card Anatomy (standard feature card)
```
Container: bg-white, rounded-[20px], border 1px rgba(0,0,0,0.06), shadow-ambient
  Padding: 32px
  Icon/Visual: 40-48px, soft colored background circle or square (rounded-12px)
  Spacing: 16px below icon
  Title: H4, font-weight 600, color #1A1A2E
  Spacing: 8px below title
  Description: Body, font-weight 400, color #6B7280, max 2-3 lines
```

### Bento Card (larger, with visual)
```
Container: bg-white, rounded-[24px], border 1px rgba(0,0,0,0.06), shadow-ambient
  Padding: 36px
  Visual/Chart: Takes up ~60% of card height, rounded-[16px] inner container
  Spacing: 20px below visual
  Title: H4, font-weight 600
  Spacing: 8px below title
  Description: Body small, color #6B7280
```

### CTA Button (primary)
```
bg: #1A1A2E, color: #FFFFFF
padding: 14px 28px
border-radius: 12px
font-weight: 600, font-size: 15-16px
icon: optional right arrow, 16px, ml-8px
shadow: 0 1px 3px rgba(0,0,0,0.1)
hover: bg #2D2D42, translateY(-1px), shadow increase
```

### CTA Button (secondary / ghost)
```
bg: transparent, color: #1A1A2E
padding: 14px 28px
border-radius: 12px
border: 1px solid #E5E7EB
font-weight: 500, font-size: 15-16px
hover: bg rgba(0,0,0,0.03)
```

### Eyebrow Badge (hero pill)
```
bg: #F0FDF4 (or light accent tint)
color: #16A34A (or matching accent)
padding: 6px 16px
border-radius: 999px
font-size: 13px, font-weight: 600
letter-spacing: 0.02em
optional: subtle border 1px solid rgba(34,197,94,0.2)
optional: small dot/icon before text
```

### Navigation Bar
```
Container: bg rgba(255,255,255,0.8), backdrop-filter blur(12px)
  Position: sticky top-0, z-50
  Padding: 16px 0
  border-bottom: 1px solid rgba(0,0,0,0.06)
  Max-width container centered
  Layout: Logo left | Nav links center | CTA button right
  Nav links: font-size 15px, weight 500, color #6B7280, gap 32px
  CTA: Small primary button variant (padding 10px 20px)
```

---

## 7. RULES TO FOLLOW

```
DESIGN RULES — PulseBoard Aesthetic (Revio-inspired)

SPACING:
- Section padding: 96-120px vertical
- Card padding: 28-36px
- Grid gap: 20-24px
- Never less than 16px gap between any elements
- When unsure, add more whitespace

CORNERS:
- Cards/containers: 20-24px border-radius
- Buttons/inputs: 12px border-radius
- Badges/pills: 999px (full round)
- Inner nested containers: 12-16px
- NEVER use sharp corners (0px) or small radius (<12px)

SHADOWS:
- Ambient: 0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)
- Hover: 0 4px 12px rgba(0,0,0,0.06), 0 20px 40px rgba(0,0,0,0.04)
- Shadows are whisper-quiet, never harsh

COLORS:
- Page bg: #FAFAF7 (warm off-white, NOT pure white)
- Card bg: #FFFFFF
- Text primary: #1A1A2E
- Text secondary: #6B7280
- Text tertiary: #9CA3AF
- CTA buttons: #1A1A2E bg + #FFFFFF text
- Accents: green #22C55E, blue #3B82F6, orange #F97316, purple #8B5CF6
- Borders: 1px solid rgba(0,0,0,0.06)
- Hero gradient: soft blurred blobs of peach, green, blue at 30-40% opacity

TYPOGRAPHY:
- Font: Plus Jakarta Sans or Inter
- Headlines: 700 weight, negative letter-spacing (-0.03em), oversized
- Body: 400 weight, 16-17px, line-height 1.65
- Eyebrows: 600 weight, 12-13px, uppercase, tracked (0.08em)
- Hero H1: 56-64px desktop, 36-42px mobile

ANIMATIONS:
- Sections: fade-in-up (24px translate, 600-800ms ease-out)
- Cards hover: translateY(-4px), 300ms ease
- Buttons hover: translateY(-1px), 200ms ease
- Stagger grid items by 100ms
- Keep all animations subtle and purposeful

LAYOUT:
- 12-column grid, max-width 1200px centered
- Hero: centered text + centered cards below
- Feature sections: 50/50 split OR bento grid
- Mobile: single column stack, maintain spacing ratios
- Sticky nav with backdrop blur

GENERAL:
- Warm, not cold. Soft, not sharp. Spacious, not cramped.
- Product mockups over illustrations
- Minimal borders, prefer spacing and shadows for hierarchy
- No decorative elements — every pixel has a purpose
```

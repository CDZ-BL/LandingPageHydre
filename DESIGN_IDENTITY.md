# DESIGN IDENTITY — HYDRE / AETHER

> **Aesthetic**: High-contrast, clinical, premium brutalist.
> Neon accents are reserved exclusively for product imagery and CTAs.
> Bone is reserved for the Founder Circle / Alliance section.

---

## 1. COLOR PALETTES

### 1.1 Dark Mode — `[data-theme="dark"]` (default)

| Token | CSS Variable | OKLCH | Role |
|-------|-------------|-------|------|
| Background primary | `--bg-primary` | `oklch(0.115 0 0)` | Page base, sections |
| Background secondary | `--bg-secondary` | `oklch(0.159 0 0)` | Subtle surface variation |
| Background surface | `--bg-surface` | `oklch(0.218 0 0)` | Cards, panels |
| Background elevated | `--bg-elevated` | `oklch(0.252 0 0)` | Modals, tooltips, dropdowns |
| Text primary | `--text-primary` | `oklch(1 0 0)` | Headings — 21:1 contrast |
| Text secondary | `--text-secondary` | `oklch(0.957 0 0)` | Body text — 18.1:1 contrast |
| Text tertiary | `--text-tertiary` | `oklch(0.833 0 0)` | Captions, descriptions — 8.6:1 |
| Text muted | `--text-muted` | `oklch(0.705 0 0)` | Labels, metadata — 5.9:1 |
| Stroke | `--stroke` | `oklch(1 0 0 / 0.10)` | Borders, dividers |
| Stroke hover | `--stroke-hover` | `oklch(1 0 0 / 0.20)` | Interactive border states |
| Glass background | `--glass-bg` | `oklch(0.144 0 0 / 0.80)` | Frosted overlays |
| Glass border | `--glass-border` | `oklch(1 0 0 / 0.10)` | Frosted overlay borders |

### 1.2 Light Mode — `[data-theme="light"]`

| Token | CSS Variable | OKLCH | Role |
|-------|-------------|-------|------|
| Background primary | `--bg-primary` | `oklch(0.939 0.015 81)` | Page base — warm off-white |
| Background secondary | `--bg-secondary` | `oklch(0.910 0.018 78)` | Subtle surface variation |
| Background surface | `--bg-surface` | `oklch(1 0 0)` | Cards, panels |
| Background elevated | `--bg-elevated` | `oklch(0.954 0.015 83)` | Modals, tooltips, dropdowns |
| Text primary | `--text-primary` | `oklch(0.125 0.025 91)` | Headings — 19.5:1 contrast |
| Text secondary | `--text-secondary` | `oklch(0.207 0.020 63)` | Body text — 14.2:1 contrast |
| Text tertiary | `--text-tertiary` | `oklch(0.331 0.020 97)` | Captions, descriptions — 8.1:1 |
| Text muted | `--text-muted` | `oklch(0.440 0.023 57)` | Labels, metadata — 5.2:1 |
| Stroke | `--stroke` | `oklch(0 0 0 / 0.08)` | Borders, dividers |
| Stroke hover | `--stroke-hover` | `oklch(0 0 0 / 0.16)` | Interactive border states |
| Glass background | `--glass-bg` | `oklch(1 0 0 / 0.85)` | Frosted overlays |
| Glass border | `--glass-border` | `oklch(0 0 0 / 0.08)` | Frosted overlay borders |

### 1.3 Fixed Accent Colors (theme-agnostic)

| Name | Tailwind Class | OKLCH | Usage |
|------|---------------|-------|-------|
| Neon Orange | `text-neon-orange` / `bg-neon-orange` | `oklch(0.702 0.201 45)` | Primary CTA, product glow, highlights |
| Neon Purple | `text-neon-purple` | `oklch(0.582 0.275 301)` | Secondary accent |
| Neon Yellow | `text-neon-yellow` | `oklch(0.931 0.228 123)` | Tertiary accent |
| Neon Lime | `text-neon-lime` | `oklch(0.871 0.286 142)` | Tertiary accent |
| Bone | `text-bone` / `bg-bone` | `oklch(0.897 0.029 86)` | Founder Circle / Alliance section only |

### 1.4 Void Scale (monochrome, Tailwind)

| Token | OKLCH |
|-------|-------|
| `void` | `oklch(0.115 0 0)` |
| `void-50` | `oklch(0.159 0 0)` |
| `void-100` | `oklch(0.196 0 0)` |
| `void-200` | `oklch(0.252 0 0)` |
| `void-300` | `oklch(0.321 0 0)` |
| `void-400` | `oklch(0.450 0 0)` |
| `void-500` | `oklch(0.570 0 0)` |
| `void-600` | `oklch(0.682 0 0)` |
| `void-700` | `oklch(0.793 0 0)` |
| `void-800` | `oklch(0.897 0 0)` |
| `void-900` | `oklch(0.949 0 0)` |
| `void-950` | `oklch(1 0 0)` |

---

## 2. TYPOGRAPHY

### 2.1 Font Families

| Role | Tailwind Class | CSS Variable | Typeface | Usage |
|------|---------------|-------------|----------|-------|
| Display / Headline | `font-headline` / `font-display` | `--font-headline` | **Clash Display** (Raleway) | All headings (H1–H3), hero titles |
| Body / UI / Data | `font-body` / `font-sans` / `font-mono` / `font-data` | `--font-geist-sans` | **Geist Sans** | Body text, UI labels, paragraphs, data readouts, CTAs, metadata |

### 2.2 Type Scale (fluid — scales from 320px to 1440px viewport)

| Token | Tailwind Class | CSS `clamp()` | Min → Max |
|-------|---------------|--------------|-----------|
| Display | `text-display` | `clamp(2.5rem, 5vw + 1rem, 6rem)` | 40px → 96px |
| H1 | `text-h1` | `clamp(2.25rem, 2.5vw + 0.5rem, 3.5rem)` | 36px → 56px |
| H2 | `text-h2` | `clamp(1.5rem, 3vw + 0.5rem, 3rem)` | 24px → 48px |
| H3 | `text-h3` | `clamp(1.25rem, 2vw + 0.5rem, 2.25rem)` | 20px → 36px |
| Body large | `text-body-lg` | `clamp(1rem, 1vw + 0.25rem, 1.125rem)` | 16px → 18px |
| Micro | `text-micro` | `clamp(0.625rem, 0.5vw + 0.5rem, 0.75rem)` | 10px → 12px |

### 2.3 Typography by Element

#### Hero / Section Title (Display)
```
font-display text-display font-bold tracking-tight
color: oklch(1 0 0)                          /* dark */  oklch(0.125 0.025 91)  /* light */
line-height: 0.95
```
Accent span (gradient):
```
text-transparent bg-clip-text bg-gradient-to-r
from-[var(--text-primary)] to-[var(--text-muted)]
```
Italic subtitle:
```
font-display text-h3 italic font-light tracking-normal
color: oklch(0.897 0.029 86)   /* bone — opacity-80 */
```

#### Section H1 (section main heading)
```
font-headline text-h1 font-bold tracking-wide
color: oklch(1 0 0)  /  oklch(0.125 0.025 91)
line-height: 1.05
```

#### Section H2
```
font-headline text-h2 font-bold tracking-wide
color: oklch(1 0 0)  /  oklch(0.125 0.025 91)
line-height: 1.05
```

#### Section H3 / Card Title
```
font-headline text-h3 font-bold
color: oklch(1 0 0)  /  oklch(0.125 0.025 91)
```

#### Glitch / Disruption Heading (SystemFailure section)
```
font-headline font-black uppercase tracking-wider
color: oklch(1 0 0)                   /* base layer */
color: oklch(0.702 0.201 45)          /* glitch layer 1 — neon orange, mix-blend-screen opacity-80 */
color: oklch(0.897 0.029 86)          /* glitch layer 2 — bone, mix-blend-screen opacity-80 */
```

#### Body Paragraph (large)
```
font-sans text-h3
color: oklch(0.957 0 0)  /  oklch(0.207 0.020 63)
line-height: relaxed
```

#### Body Paragraph (standard)
```
font-sans text-sm md:text-lg font-light tracking-wide
color: oklch(0.833 0 0)  /  oklch(0.331 0.020 97)
line-height: relaxed
```

#### Mono Description / Technical Copy
```
font-mono text-xs md:text-sm tracking-wide
color: oklch(0.833 0 0)  /  oklch(0.331 0.020 97)
line-height: 1.8
```

#### Data / Readout Label
```
font-mono text-[10px] tracking-[0.3em] uppercase
color: oklch(0.705 0 0)  /  oklch(0.440 0.023 57)
```

#### Data Value (tabular numbers)
```
font-mono text-2xl md:text-3xl tabular-nums
color: oklch(0.705 0 0)  /  oklch(0.440 0.023 57)   /* strikethrough/comparison */
color: oklch(1 0 0)      /  oklch(0.125 0.025 91)   /* hero value */
```

#### CTA Button Text
```
font-mono text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase
color: oklch(1 0 0) → oklch(0.702 0.201 45) on hover
```

#### Micro Label / Tag
```
font-mono text-[9px] tracking-[0.2em] uppercase
color: oklch(0.705 0 0)  /  oklch(0.440 0.023 57)
```

---

## 3. SHADOWS & GLOWS

| Name | Tailwind Class | Value | Usage |
|------|---------------|-------|-------|
| Orange glow | `shadow-glow` | `0 0 60px oklch(0.702 0.201 45 / 0.15)` | CTA buttons, product cards |
| White inner glow | `shadow-inner-glow` | `inset 0 0 30px oklch(1 0 0 / 0.05)` | Elevated surfaces |
| CTA diffuse glow | *(inline)* | `0 0 25px oklch(0.702 0.201 45 / 0.15), 0 0 50px oklch(0.702 0.201 45 / 0.08)` | Button resting state |
| CTA glow hover | *(inline)* | `0 0 35px oklch(0.702 0.201 45 / 0.25), 0 0 70px oklch(0.702 0.201 45 / 0.12)` | Button hover state |
| Ambient CTA blur | *(inline)* | `bg-neon-orange/8 blur-[40px]` → `bg-neon-orange/15` on hover | Behind CTA button |

---

## 4. BORDERS & STROKES

| Context | Value |
|---------|-------|
| Default border (dark) | `1px solid oklch(1 0 0 / 0.10)` |
| Default border (light) | `1px solid oklch(0 0 0 / 0.08)` |
| Hover border (dark) | `1px solid oklch(1 0 0 / 0.20)` |
| Hover border (light) | `1px solid oklch(0 0 0 / 0.16)` |
| CTA border (resting) | `1px solid oklch(0.702 0.201 45 / 0.20)` + `ring-1 ring-neon-orange/5` |
| CTA border (hover) | `1px solid oklch(0.702 0.201 45 / 0.45)` |
| Border radius | `rounded-machined` = `2px` (sharp, brutalist) |
| Terminal input | `border-bottom: 1px solid var(--stroke)` — no other borders |

---

## 5. GLASS EFFECT

```css
background: oklch(0.144 0 0 / 0.80)   /* dark */  /  oklch(1 0 0 / 0.85)  /* light */
backdrop-filter: blur(20px)
border: 1px solid oklch(1 0 0 / 0.10) /* dark */  /  oklch(0 0 0 / 0.08)  /* light */
transform: translateZ(0)               /* GPU layer promotion */
```
Tailwind class: `.glass`

---

## 6. MOTION TOKENS

### Easing
| Name | CSS Variable | Value |
|------|-------------|-------|
| Smooth | `--ease-smooth` | `cubic-bezier(0.25, 0.1, 0.25, 1.0)` |
| Clinical (snap) | `--ease-snap` / `CLINICAL` | `cubic-bezier(0.87, 0, 0.13, 1)` |
| Silk (luxury) | `--ease-silk` | ultra-smooth luxury |
| Mercury | `--ease-mercury` | dissolve/transform easing |

### Durations
| Token | CSS Variable | Value |
|-------|-------------|-------|
| Micro | `--duration-micro` | `150ms` |
| Fast | `--duration-fast` | `300ms` |
| Medium | `--duration-medium` | `500ms` |
| Slow | `--duration-slow` | `800ms` |
| Cinematic | `--duration-cinematic` | `1200ms` |
| Epic | `--duration-epic` | `2000ms` |

---

## 7. BACKGROUND GRADIENTS

| Name | Tailwind Class | Value |
|------|---------------|-------|
| Void gradient | `bg-gradient-void` | `linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 50%, var(--bg-primary) 100%)` |
| Radial gradient | `bg-gradient-radial` | `radial-gradient(circle at center, var(--bg-elevated) 0%, var(--bg-primary) 70%)` |
| Hero bottom fade | *(inline)* | `bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/80 to-transparent` — dark mode only |
| Mobile fallback | *(inline)* | `radial-gradient(ellipse 80% 60% at 70% 40%, oklch(0.175 0.03 264) 0%, oklch(0.134 0.02 264) 40%, oklch(0.115 0 0) 100%)` |

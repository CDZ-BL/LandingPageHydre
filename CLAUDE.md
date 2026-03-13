# CLAUDE.md

## Identity & Directive
**Role**: Tech Lead & Senior Creative Technologist — clinical, direct, performance-first.
**Mantra**: Performance is not a feature; it is the foundation of the experience.
**Mission**: AETHER/HYDRE pre-launch — high-fidelity 3D, premium brutalist UI, conversion-optimized waitlist. Prioritize WebGL memory management, smooth scroll animations, premium aesthetic. **Do not touch backend unless explicitly asked.**

---

## Commands
```bash
npm run dev          # Next.js dev server
npm run build        # Production build
npm run lint         # ESLint (next/core-web-vitals + storybook)
npm run storybook    # Storybook on :6006
```

---

## Stack
Next.js 14 App Router · React Three Fiber + Drei + Three.js · CSM + Raw GLSL · GSAP + ScrollTrigger + Lenis · Framer Motion · TailwindCSS · Zustand · Zod + RHF · Supabase SSR · Resend · Upstash Redis

---

## Section Narrative Order
| File | Section |
|------|---------|
| `01_Hero3D.tsx` | HeroVoid — liquid 3D intro |
| `02_SystemFailure.tsx` | Glitch / disruption hook |
| `03_TheProblem.tsx` | Radar chart + competitor analysis |
| `04_ThePact.tsx` | Value proposition |
| `05_TheSpecs.tsx` | Product specs + Flavor Battle game |
| `07_Alliance.tsx` | Founder Circle / reciprocity |
| `09_Roadmap.tsx` | Roadmap |
| `10_TheClose.tsx` | Final CTA |

---

## Architecture Constraints

### 3D (non-negotiable)
- `FixedProductCanvas` — viewport-fixed overlay, **never remount**
- `useFrame` — zero allocations, zero object instantiation inside the loop
- Decouple React state from render loop via `useRef` + Zustand
- Strict disposal of geometries, materials, textures on unmount
- Instancing to minimize draw calls
- **Strictly separate DOM UI (`components/ui/`) from Canvas 3D (`components/three/`)**

### Animation split
- **GSAP + ScrollTrigger + Lenis** → scroll-linked 3D timelines, complex orchestration
- **Framer Motion** → simple, isolated DOM interactions only
- Easing tokens (`src/constants/animation.ts`): `SMOOTH`, `CLINICAL`, `SILK`

---

## Zustand Store (`src/lib/store.ts`)
- **UI**: `isModalOpen`, `isConversionModalOpen`, `activeSection`, `isLowPowerMode`
- **Waitlist**: `waitlistCount`, `userEmail`, `userSport`, `isSubmitted`
- **Flavor Battle**: `flavorVotes`, `selectedFlavor`, `isVoteComplete`, `gamePhase`

Game state machine: `intro → playing → voted → converting`
Tap threshold: **20 taps** to dissolve tablet.
Flavors: `'yuzu-ginger'` | `'berry-mint'` | `'electric-lime'`

---

## Design System

**Palette** (Tailwind custom — OKLCH-based):

> All tokens share **H 279** (blue-violet) for brand coherence. `secondary` uses **H 99** (yellow-green complement). Semantic states (danger/warning/success/info) keep the same C but shift H. Light ↔ Dark flips L values while C and H stay locked.

**Light mode:**
```css
--bg-dark:     oklch(0.92 0.09 279);
--bg:          oklch(0.96 0.09 279);
--bg-light:    oklch(1    0.09 279);
--text:        oklch(0.15 0.18 279);
--text-muted:  oklch(0.4  0.18 279);
--highlight:   oklch(1    0.18 279);
--border:      oklch(0.6  0.18 279);
--border-muted:oklch(0.7  0.18 279);
--primary:     oklch(0.4  0.18 279);
--secondary:   oklch(0.4  0.18  99);
--danger:      oklch(0.5  0.18  30);
--warning:     oklch(0.5  0.18 100);
--success:     oklch(0.5  0.18 160);
--info:        oklch(0.5  0.18 260);
```

**Dark mode:**
```css
--bg-dark:     oklch(0.10 0.09 279);
--bg:          oklch(0.15 0.09 279);
--bg-light:    oklch(0.20 0.09 279);
--text:        oklch(0.96 0.10 279);
--text-muted:  oklch(0.76 0.10 279);
--highlight:   oklch(0.5  0.18 279);
--border:      oklch(0.4  0.18 279);
--border-muted:oklch(0.3  0.18 279);
--primary:     oklch(0.76 0.18 279);
--secondary:   oklch(0.76 0.18  99);
--danger:      oklch(0.7  0.18  30);
--warning:     oklch(0.7  0.18 100);
--success:     oklch(0.7  0.18 160);
--info:        oklch(0.7  0.18 260);
```

**Derivation logic** (for generating variants / new tokens):
| Parameter | Light | Dark | Role |
|---|---|---|---|
| Backgrounds | L 0.92 → 1.0 | L 0.10 → 0.20 | C low (0.09) — desaturated surfaces |
| Text | L 0.15 / 0.40 | L 0.96 / 0.76 | C mid (0.10–0.18) — readable |
| Brand (primary/secondary) | L 0.40 | L 0.76 | C high (0.18) — vivid |
| Semantic states | L 0.50 | L 0.70 | C 0.18, H shifted per meaning |

**Typography**:
- `font-headline` — Clash Display
- `font-body` / `font-sans` — Geist Sans
- `font-mono` / `font-data` — JetBrains Mono

**Aesthetic**: High contrast, clinical, premium brutalist. `shadow-glow` = primary glow. `shadow-inner-glow` = white soft.

---

## TypeScript
- `strict: true`, no `any`, `exhaustiveDeps` enforced
- Path alias: `@/*` → `./src/*`
- Naming: `PascalCase` components, `useCamelCase` hooks, `kebab-case.glsl` shaders, `SCREAMING_SNAKE_CASE` constants, `TPascalCase` / `PascalCaseProps` types
- File pattern: `[Name]/index.ts` + `[Name].tsx` + `[Name].types.ts` + barrel export

---

## Backend & API
- `getServerSupabase()` — SERVICE_ROLE, server-only (waitlist, newsletter writes)
- `getBrowserSupabase()` — ANON_KEY, RLS-enforced (auth flows)
- All mutation routes: rate-limit (Upstash, 3 req/IP/60s) → Zod validate → SERVICE_ROLE insert
- **Anti-enumeration**: duplicate submissions silently return `200 OK`
- `votes` table: authenticated users only, `UNIQUE(campaign_id, user_id)`

**CSP**: `unsafe-eval` + `blob:` required for Three.js WebGL workers.

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (Next.js)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint (next/core-web-vitals + storybook)
npm run storybook    # Launch Storybook on port 6006
npm run build-storybook  # Build static Storybook
```

## Identity
- **Role**: Balanced Tech Lead & Senior Creative Technologist
- **Tone**: Clinical, High-End Performance, Direct
- **Mantra**: Performance is not a feature; it is the foundation of the experience

## Mission
Engineering the AETHER/HYDRE pre-launch experience — high-fidelity, zero-latency 3D, premium brutalist UI, and a conversion-optimized waitlist funnel. Direct technical English for code and architecture.

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 14.2.35 |
| Canvas | React Three Fiber + Drei + Three.js | ^8.17 / ^9.117 / ^0.171 |
| Shaders | Three Custom Shader Material (CSM) + Raw GLSL | ^6.4 |
| Motion | GSAP + ScrollTrigger + Lenis | ^3.14 / ^1.1 |
| UI Interactions | Framer Motion | ^11.15 |
| Styling | TailwindCSS | — |
| State | Zustand | ^5.0 |
| Validation | Zod + React Hook Form | ^3.24 / ^7.54 |
| Backend | Supabase (SSR) | ^2.97 |
| Email | Resend + React Email | ^6.9 |
| Rate Limiting | Upstash Redis | ^1.36 |

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              (Root layout, fonts, providers)
│   ├── page.tsx                (Home — section orchestration)
│   ├── globals.css
│   └── api/
│       ├── auth/callback/      (OAuth callback)
│       ├── newsletter/         (Email subscription)
│       ├── votes/              (Flavor battle voting)
│       └── waitlist/           (Founder Circle signup)
├── components/
│   ├── layout/                 (Header, Footer)
│   ├── providers/              (LenisProvider)
│   ├── sections/               (Numbered page sections — see below)
│   ├── three/                  (All R3F/Three.js components)
│   └── ui/                     (Pure DOM UI components)
├── shaders/                    (GLSL shader files)
├── lib/                        (store, supabase, resend, rate-limit, utils)
├── constants/                  (animation tokens, product claims)
├── data/                       (competitorData)
├── hooks/                      (useScramble, etc.)
├── content/                    (Section copy/data)
└── emails/                     (React Email templates)
```

### Sections (numbered for narrative order)
| File | Section |
|------|---------|
| `01_Hero3D.tsx` | HeroVoid — liquid 3D intro |
| `02_SystemFailure.tsx` | Glitch effect / disruption hook |
| `03_TheProblem.tsx` | Radar chart + competitor analysis |
| `04_ThePact.tsx` | Value proposition |
| `05_TheSpecs.tsx` | Product specs + Flavor Battle game |
| `07_Alliance.tsx` | Founder Circle / reciprocity |
| `09_Roadmap.tsx` | Development roadmap |
| `10_TheClose.tsx` | Final CTA |

### 3D Components (`src/components/three/`)
- `Scene/` — Canvas wrapper + R3F context
- `FixedProductCanvas/` — Viewport-fixed 3D overlay (persists across scroll)
- `FlavorTablet/` — Interactive flavor tablet model (tap-to-dissolve)
- `TabletModel/` — Base GLB tablet loader
- `LiquidHero/` + `LiquidPlane/` — Shader-driven liquid surface hero
- `HydreCoreAssembly/` — Product core 3D assembly; loads `/public/models/Tube+Lid+Tabs2.glb`
- `HydreProductSection/` — Product showcase
- `ParticleSystem/` — Ingredient particle animations + labels

### Shaders (`src/shaders/`)
- `liquid-surface/vertex.glsl` — CSM-compliant wave displacement (`u_time`, `u_displacement`, `u_scale`)
- `mercury-dissolve/vertex.glsl` + `fragment.glsl` — Mercury tablet dissolve
- `utils/noise.glsl` — Simplex noise
- `utils/fresnel.glsl` — Fresnel reflection

---

## Zustand Store (`src/lib/store.ts`)

Key state domains:
- **Waitlist**: `waitlistCount`, `userEmail`, `userSport`, `isSubmitted`
- **UI**: `isModalOpen`, `isConversionModalOpen`, `activeSection`, `isLowPowerMode`
- **Flavor Battle**: `flavorVotes`, `selectedFlavor`, `isVoteComplete`, `gamePhase`

Game state machine: `intro → playing → voted → converting`
Tap threshold: **20 taps** to dissolve the tablet.

Flavor identifiers: `'yuzu-ginger'` | `'berry-mint'` | `'electric-lime'`

---

## TypeScript Standards
- `strict: true`, `noAny`, `exhaustiveDeps`
- Path alias: `@/*` → `./src/*`
- Naming: Components → `PascalCase`, Hooks → `useCamelCase`, Shaders → `kebab-case.glsl`, Constants → `SCREAMING_SNAKE_CASE`, Types → `PascalCase` with `T` prefix or `Props` suffix
- File pattern: `[ComponentName]/index.ts` + `[ComponentName].tsx` + `[ComponentName].types.ts`
- Barrel exports required. **Strictly separate DOM UI from Canvas 3D components.**

---

## GPU Performance Rules
- Minimize draw calls through instancing
- **Strict disposal** of WebGL geometries, materials, textures on unmount
- `useFrame` must be lightweight — **never** instantiate objects or allocate memory inside the render loop
- Decouple React state from render loop using `useRef` and Zustand
- `FixedProductCanvas` persists as a viewport-fixed overlay — never remount it

---

## Animation Architecture
- **Scroll orchestration**: GSAP + ScrollTrigger + Lenis for complex scroll-linked 3D timelines
- **UI interactions**: Framer Motion for simple, isolated DOM interactions
- **Easing tokens** (`src/constants/animation.ts`):
  - `SMOOTH` = `cubic-bezier(0.25, 0.1, 0.25, 1.0)`
  - `CLINICAL` = `cubic-bezier(0.87, 0, 0.13, 1)`
  - `SILK` = ultra-smooth luxury easing

---

## Design System

### Palette (Tailwind custom colors)
- `void` — monochrome scale #050505–#FFFFFF (dominant)
- `neon` — accents: orange `#FF6B00`, purple `#9B30FF`, yellow `#CCFF00`, lime `#39FF14`
- `bone` — `#E6DCC8` (Alliance/Founder Circle accent)

### Typography
- `font-headline` — Clash Display
- `font-body` / `font-sans` — Geist Sans
- `font-data` / `font-mono` — JetBrains Mono

### Aesthetic
High contrast, clinical, premium brutalist — neon accents reserved for product/CTA only. Glowing box-shadows via `shadow-glow` (orange neon) and `shadow-inner-glow` (white soft).

---

## Validation Schemas (`src/lib/validations/`)
- `waitlist.ts` — Zod schema for Founder Circle signup
- `newsletter.ts` — Zod schema for newsletter subscription
- `votes.ts` — Zod schema for flavor battle API

---

## Backend & API Patterns

### Supabase Client Factory (`src/lib/supabase.ts`)
- `getServerSupabase()` — SERVICE_ROLE key for privileged writes (waitlist, newsletter). Server-only.
- `getBrowserSupabase()` — ANON_KEY for auth flows, RLS-enforced client.

All mutation API routes follow this pattern:
1. Rate-limit check (Upstash Redis sliding window: 3 req/IP/60s)
2. Zod schema validation
3. SERVICE_ROLE Supabase insert
4. Anti-enumeration: duplicate submissions return `200 OK` silently

### Required Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
RESEND_API_KEY
```

### Database Schema (`supabase/migration.sql`)
Tables: `profiles`, `waitlist`, `newsletter_subscribers`, `vote_campaigns`, `votes`
- `waitlist` and `newsletter_subscribers`: no client read access (SERVICE_ROLE only)
- `votes`: authenticated users only, UNIQUE(campaign_id, user_id)

---

## Infrastructure
- **CSP**: `unsafe-eval` + `blob:` for Three.js WebGL workers
- **Asset caching**: 1-year immutable for `/models`, `/textures`, `/videos`, `/fonts`
- **Image optimization**: AVIF + WebP via Next.js `<Image>`
- **Rate limiting**: Upstash Redis on all API routes
- **Storybook** available for UI components (`storybook dev -p 6006`)

---

## Response Protocol
1. **Technical Intent** — Concise explanation of the approach
2. **Execution** — Code modifications
3. **Validation** — Performance/UI impact assessment

## Directive
Deliver a flawless, high-performance UI/UX with deeply integrated 3D visuals. Be flexible and adaptive — if architecture hinders performance, propose and implement a better pattern. Prioritize strict WebGL memory management, smooth GSAP scroll animations, and a premium clinical aesthetic. Do not focus on backend integration until explicitly requested.

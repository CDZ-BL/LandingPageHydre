/**
 * HydreProductSection — Hardened Canvas Environmental Wrapper
 * V4.0.0-HYDRE-APEX Compliant
 *
 * ARCHITECTURE:
 * ┌──────────────────────────────────────────────────────┐
 * │  <section id="hydre-product-section">  (200vh)       │
 * │    └─ <div className="sticky top-0 h-screen">        │
 * │         └─ <Canvas dpr=[1,2]>                         │
 * │              ├─ color (#050505)                        │
 * │              ├─ ambientLight (fallback)                │
 * │              └─ <Suspense>                             │
 * │                   ├─ Environment (local PMREM .hdr)    │
 * │                   └─ PresentationControls              │
 * │                        └─ <HydreCoreAssembly />        │
 * └──────────────────────────────────────────────────────┘
 *
 * GPU HARDENING:
 * - DPR clamped [1, 2] — 50% fragment compute savings on 3x screens
 * - Shadows disabled — no phantom VRAM shadowmap allocation
 * - Local PMREM HDRI — zero runtime CDN dependency
 * - Suspense boundary — DOM does not freeze during shader compilation
 * - logarithmicDepthBuffer: false — no overhead for non-planetary scales
 */

'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, PresentationControls } from '@react-three/drei';
import { HydreCoreAssembly } from '../HydreCoreAssembly';

// ─────────────────────────────────────────────────────────────
// CAMERA CONFIGURATION
// ─────────────────────────────────────────────────────────────
/** Camera distance tuned for the assembly to fill ~60% of the viewport */
const CAMERA_POSITION: [number, number, number] = [0, 0, 8];
/** Narrow FOV for compression / cinematic framing */
const CAMERA_FOV = 35;

/**
 * HydreProductSection — The WebGL execution environment
 *
 * Wraps <HydreCoreAssembly /> in a performance-hardened Canvas
 * with local PMREM HDRI, Suspense boundaries, and clamped DPR.
 */
export function HydreProductSection() {
    return (
        <section
            id="hydre-product-section"
            style={{
                position: 'relative',
                width: '100%',
                height: '200vh',
                backgroundColor: '#050505',
            }}
        >
            {/* Sticky viewport — pins the Canvas while scroll advances */}
            <div
                style={{
                    position: 'sticky',
                    top: 0,
                    width: '100%',
                    height: '100vh',
                    overflow: 'hidden',
                }}
            >
                <Canvas
                    /* Shadows intentionally omitted — prevents phantom
                     * VRAM shadowmap allocation when no directional
                     * light casts them. */
                    dpr={[1, 2]} // Clamp max resolution — imperceptible visual delta vs 3x, 50% fragment savings
                    camera={{
                        position: CAMERA_POSITION,
                        fov: CAMERA_FOV,
                    }}
                    gl={{
                        antialias: true,
                        alpha: false,
                        powerPreference: 'high-performance',
                        logarithmicDepthBuffer: false, // No planetary-scale depth precision needed
                    }}
                >
                    {/* ── SCENE BACKGROUND ─────────────────────── */}
                    <color attach="background" args={['#050505']} />

                    {/* ── FALLBACK AMBIENT ─────────────────────── */}
                    {/* Prevents absolute black during HDRI async load */}
                    <ambientLight intensity={0.2} />

                    {/* ── SUSPENSE BOUNDARY ────────────────────── */}
                    {/* Heavy async resources (HDRI decode, glTF parse)
                     *  are wrapped so the DOM never freezes during
                     *  GPU shader compilation. */}
                    <Suspense fallback={null}>

                        {/* ── LOCAL PMREM HDRI ─────────────────── */}
                        {/* Local 256×256 studio HDRI — zero CDN dependency.
                         *  Download 'studio_small_08_1k.hdr' from PolyHaven,
                         *  scale to 256×256 (< 100KB), place in /public/textures/ */}
                        <Environment
                            files="/models/studio_small_08_1k.hdr"
                            environmentIntensity={0.8}
                        />

                        {/* ── INTERACTIVE CONTROLS ─────────────── */}
                        <PresentationControls
                            global
                            config={{ mass: 2, tension: 500 }}
                            snap={{ mass: 4, tension: 1500 }}
                            rotation={[0, 0, 0]}
                            polar={[-Math.PI / 3, Math.PI / 3]}
                            azimuth={[-Math.PI / 1.4, Math.PI / 2]}
                        >
                            <HydreCoreAssembly />
                        </PresentationControls>

                    </Suspense>
                </Canvas>
            </div>
        </section>
    );
}

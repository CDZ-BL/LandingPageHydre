'use client';

import { Suspense, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import { HydreCoreAssembly } from '@/components/three/HydreCoreAssembly';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────────────────────
// CAMERA CONFIGURATION
// ─────────────────────────────────────────────────────────────
const CAMERA_POSITION: [number, number, number] = [0, 0, 1.0];
const CAMERA_FOV = 35;

/**
 * FixedProductCanvas — Viewport-Pinned 3D Product Overlay
 *
 * ARCHITECTURE:
 * ┌─────────────────────────────────────────────────────────┐
 * │  position: fixed  │  z-50  │  right 50% of viewport    │
 * │  pointer-events: none (total HTML pass-through)         │
 * │  ↓                                                      │
 * │  Transparent R3F Canvas (alpha: true)                   │
 * │  ↓                                                      │
 * │  HydreCoreAssembly — 100% GSAP scroll-driven           │
 * │  No PresentationControls — scroll is the controller    │
 * └─────────────────────────────────────────────────────────┘
 *
 * Fades out at the end of section 2 (#stable-section).
 */
export function FixedProductCanvas() {
    const wrapperRef = useRef<HTMLDivElement>(null);

    // ── GSAP: Fade out at end of section 2 ──────────────────
    useEffect(() => {
        if (!wrapperRef.current) return;

        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: '#stable-section',
                start: 'top 80%',
                end: 'bottom top',
                scrub: 1,
                onUpdate: (self) => {
                    if (wrapperRef.current) {
                        wrapperRef.current.style.opacity = String(1 - self.progress);
                    }
                },
                onLeave: () => {
                    if (wrapperRef.current) {
                        wrapperRef.current.style.visibility = 'hidden';
                    }
                },
                onEnterBack: () => {
                    if (wrapperRef.current) {
                        wrapperRef.current.style.visibility = 'visible';
                    }
                },
            });
        });

        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={wrapperRef}
            style={{
                position: 'fixed',
                top: 0,
                right: 0,
                width: '50%',
                height: '100vh',
                zIndex: 50,
                pointerEvents: 'none',
            }}
        >
            <Canvas
                dpr={[1, 1.5]}
                camera={{
                    position: CAMERA_POSITION,
                    fov: CAMERA_FOV,
                }}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: 'high-performance',
                }}
                style={{
                    background: 'transparent',
                    pointerEvents: 'none',
                }}
            >
                {/* ── IBL for product reflections ──────── */}
                <Environment resolution={256} background={false}>
                    <Lightformer
                        form="rect"
                        intensity={1.5}
                        position={[5, 5, 5]}
                        rotation-y={Math.PI / 4}
                        scale={[5, 5, 1]}
                        color="#ffffff"
                    />
                    <Lightformer
                        form="ring"
                        intensity={0.5}
                        position={[-5, 3, 2]}
                        scale={[8, 8, 1]}
                        color="#4060ff"
                    />
                    {/* Rim light — silhouette separation */}
                    <Lightformer
                        form="rect"
                        intensity={15}
                        position={[0, 2, -10]}
                        scale={[10, 20, 1]}
                        color="#ffffff"
                    />
                    {/* Kicker — warm accent */}
                    <Lightformer
                        form="rect"
                        intensity={5}
                        position={[-8, 0, -2]}
                        scale={[2, 10, 1]}
                        color="#E6DCC8"
                    />
                </Environment>

                <directionalLight position={[5, 10, 5]} intensity={2} color="#ffffff" />
                <ambientLight intensity={0.15} />

                {/* 100% GSAP scroll-driven — no PresentationControls */}
                <Suspense fallback={null}>
                    <HydreCoreAssembly scale={2.75} position={[0, -0.15, 0]} />
                </Suspense>
            </Canvas>
        </div>
    );
}

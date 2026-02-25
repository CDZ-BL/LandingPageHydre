'use client';

import { Suspense, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import { HydreCoreAssembly } from '@/components/three/HydreCoreAssembly';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import * as THREE from 'three';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────────────────────
// CAMERA CONFIGURATION
// ─────────────────────────────────────────────────────────────
const CAMERA_POSITION: [number, number, number] = [0, 0, 1.4];
const CAMERA_FOV = 38;

// ─────────────────────────────────────────────────────────────
// EMERGENCY LIGHTING - Scroll-triggered lighting effect
// ─────────────────────────────────────────────────────────────
function EmergencyLighting() {
    const lightRef = useRef<THREE.PointLight>(null);

    useGSAP(() => {
        if (!lightRef.current) return;
        
        // The light intensifies as we approach the System Failure section
        gsap.to(lightRef.current, {
            intensity: 15,
            distance: 10,
            ease: 'power2.in',
            scrollTrigger: {
                trigger: '#hydre-product-section',
                start: 'bottom bottom',
                endTrigger: '#system-failure-section',
                end: 'top 40%', 
                scrub: 1,
            },
        });
    }, []);

    return (
        <pointLight 
            ref={lightRef} 
            position={[0, -2, -1]} 
            color="#ff0033" 
            intensity={0} 
            distance={0} 
        />
    );
}

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

    // ── GSAP: Pin the product and fade out as System Failure arrives ────────────────
    useEffect(() => {
        if (!wrapperRef.current) return;

        const ctx = gsap.context(() => {
            // 1. PIN THE PRODUCT TO THE VIEWPORT (behaves like 'fixed')
            // It will unpin specifically when System Failure reaches the top,
            // allowing it to naturally scroll up and away with the rest of the page.
            ScrollTrigger.create({
                trigger: wrapperRef.current,
                start: 'top top',
                endTrigger: '#system-failure-section',
                end: 'top top',
                pin: true,
                pinSpacing: false, // Critical: prevents GSAP from adding padding that pushes UI down
            });

            // 1.5. LOWER THE TUBE by 15vh during hero scroll to reveal lid animation
            gsap.to(wrapperRef.current, {
                y: '15vh',
                ease: 'none',
                scrollTrigger: {
                    trigger: '#hydre-product-section',
                    start: 'top top',
                    end: '+=800',
                    scrub: 1,
                },
            });

            // 2. FADE OUT as System Failure arrives
            ScrollTrigger.create({
                trigger: '#system-failure-section',
                start: 'top 60%',
                end: 'top top',
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
            className="absolute top-[10vh] right-0 w-full lg:w-1/2 h-screen z-50 pointer-events-none"
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

                {/* THE SURPRISE: A dormant red emergency light that GSAP wakes up */}
                <EmergencyLighting />

                {/* 100% GSAP scroll-driven — no PresentationControls */}
                <Suspense fallback={null}>
                    <HydreCoreAssembly scale={3.1} position={[0, -0.15, 0]} />
                </Suspense>
            </Canvas>
        </div>
    );
}

/**
 * SceneContent — Internal 3D Scene Components
 * V4.0.0-HYDRE-APEX Compliant
 */

'use client';


import { useRef, useLayoutEffect, useCallback } from 'react';
import { Environment, OrbitControls, PerspectiveCamera, Preload } from '@react-three/drei';
import { TabletModel } from '@/components/three/TabletModel';
import { ParticleSystem, IngredientLabels } from '@/components/three/ParticleSystem';
import { usePrefersReducedMotion } from '@/lib/accessibility';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import type { SceneContentProps } from './Scene.types';

// Register GSAP plugins
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

/**
 * SceneContent — All 3D elements within the Canvas
 */
export function SceneContent({ interactive = true }: SceneContentProps) {
    const prefersReducedMotion = usePrefersReducedMotion();
    const explosionRef = useRef(0);
    const lenisRef = useRef<Lenis | null>(null);

    // ═══════════════════════════════════════════════════════════════════════════
    // GSAP + LENIS SYNC (The 60fps Lock)
    // ═══════════════════════════════════════════════════════════════════════════
    useLayoutEffect(() => {
        // 1. Hijack GSAP ticker to drive Lenis
        // This ensures the smooth scroll calculation happens in the exact same
        // frame budget as the GSAP animations, preventing interpolation jitter.
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            touchMultiplier: 2,
        });

        lenisRef.current = lenis;

        const updateLenis = (time: number, deltaTime: number, frame: number) => {
            lenis.raf(time * 1000);
        };

        gsap.ticker.add(updateLenis);

        // Disable lag smoothing to force strict frame synchronization
        // This prevents GSAP from "jumping" to catch up after a heavy frame,
        // which would desync from the physics-based scroll.
        gsap.ticker.lagSmoothing(0);

        // 2. Set up ScrollTrigger for the explosion
        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: "body", // Global scroll
                start: "top top",
                end: "bottom bottom",
                scrub: 0.5, // Slight smoothing on the value itself
                onUpdate: (self) => {
                    // Map scroll progress to explosion range (0.3 to 0.8 of viewport usually)
                    // We'll map global scroll 0-100% to our specific animation window
                    // For now, let's replicate the original logic: 30% to 80% of VH

                    const scrollY = window.scrollY;
                    const triggerPoint = window.innerHeight * 0.3;
                    const endPoint = window.innerHeight * 0.8;

                    if (scrollY > triggerPoint) {
                        const progress = Math.min(1, (scrollY - triggerPoint) / (endPoint - triggerPoint));
                        explosionRef.current = progress;
                    } else {
                        explosionRef.current = 0;
                    }
                }
            });
        });

        return () => {
            gsap.ticker.remove(updateLenis);
            lenis.destroy();
            ctx.revert();
        };
    }, []);

    // ═══════════════════════════════════════════════════════════════════════════
    // INTERACTION (Direct Uniform Mutation)
    // ═══════════════════════════════════════════════════════════════════════════

    const handleClick = useCallback(() => {
        if (!interactive || prefersReducedMotion) return;

        // Animate the Ref directly. No React renders.
        gsap.to(explosionRef, {
            current: 1,
            duration: 2.0,
            ease: "expo.out",
            onComplete: () => {
                // Return to 0
                gsap.to(explosionRef, {
                    current: 0,
                    duration: 1.0,
                    ease: "power2.in",
                    delay: 0.5
                });
            }
        });
    }, [interactive, prefersReducedMotion]);

    // Add click listener to canvas via parent div usually, but here we can
    // expose a handler or use the Three.js event system on a transparent plane if needed.
    // Since the original Scene.tsx had the onClick on the container, we rely on the
    // scroll for the main effect, but we can emit this ref down.

    // NOTE: The previous Scene.tsx handled clicks on the wrapper div. 
    // Since we moved logic here, we need a way to trigger this. 
    // For now, key interaction is Scroll. 
    // If we need click, we should attach it to the mesh or a screen-covering plane.
    // Let's attach it to the group via the meshes.

    return (
        <group onClick={handleClick}>
            {/* Camera */}
            <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />

            {/* Lighting */}
            <ambientLight intensity={0.4} />
            <directionalLight
                position={[10, 10, 5]}
                intensity={1.5}
                castShadow={!prefersReducedMotion}
            />
            <pointLight position={[-10, -10, -5]} intensity={0.5} color="#FF6B35" />
            <pointLight position={[10, -10, 5]} intensity={0.3} color="#00D4FF" />

            {/* Main tablet */}
            <TabletModel
                explosionRef={explosionRef}
            />

            {/* Particle explosion */}
            <ParticleSystem
                explosionRef={explosionRef}
            />

            {/* Ingredient labels - Needs refactor to accept ref or use internal logic */}
            {/* For now, passing ref to a wrapper that handles visibility if needed, 
                or we just pass the ref and let it handle its own visibility.
                The original prop was `isVisible={explosionProgress > 0.3}`.
                We'll update IngredientLabels signature next.
            */}
            <IngredientLabels explosionRef={explosionRef} />

            {/* Environment for reflections */}
            <Environment preset="studio" />

            {/* Orbit controls (desktop only, non-intrusive) */}
            <OrbitControls
                enableZoom={false}
                enablePan={false}
                maxPolarAngle={Math.PI / 2}
                minPolarAngle={Math.PI / 3}
                rotateSpeed={0.5}
                enabled={!prefersReducedMotion}
            />

            {/* Preload all assets */}
            <Preload all />
        </group>
    );
}

'use client';

import { Suspense, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useThree } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import { HydreCoreAssembly } from '@/components/three/HydreCoreAssembly';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// ─────────────────────────────────────────────────────────
// FRAME GUARD — pause the THREE.Clock on tab hide
// Placed inside the Canvas so it has access to useThree().
//
// R3F computes delta via clock.getDelta() each frame.
// When the tab is hidden the browser throttles rAF; on return
// the accumulated real-time causes a huge delta spike.
// Stopping the clock on hide means clock.getDelta() returns
// ~0 on the first visible frame, eliminating the spike.
// The MAX_DELTA clamp in HydreCoreAssembly acts as a second
// line of defence in case this listener fires late.
// ─────────────────────────────────────────────────────────
function FrameGuard() {
    const { clock } = useThree();

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                clock.stop();
            } else {
                // start() resets oldTime → delta on next frame ≈ 0
                clock.start();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [clock]);

    return null;
}

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────────────────
// CAMERA — telephoto compression, product fills the frame
// ─────────────────────────────────────────────────────────
const CAMERA_POSITION: [number, number, number] = [0, 0, 2.8];
const CAMERA_FOV = 20;

/**
 * FixedProductCanvas
 *
 * Pinned to the right half of the viewport for the full hero section.
 * Product is centered in the canvas — pure ambient animation, no scroll binding.
 * Fades out as SystemFailure section arrives.
 */
export function FixedProductCanvas() {
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!wrapperRef.current) return;

        const ctx = gsap.context(() => {
            // Pin canvas to viewport while hero section is active
            ScrollTrigger.create({
                trigger:      wrapperRef.current,
                start:        'top top',
                endTrigger:   '#system-failure-section',
                end:          'top top',
                pin:          true,
                pinSpacing:   false,
            });

            // Fade out as SystemFailure arrives
            ScrollTrigger.create({
                trigger: '#system-failure-section',
                start:   'top 60%',
                end:     'top top',
                scrub:   1,
                onUpdate: (self) => {
                    if (wrapperRef.current)
                        wrapperRef.current.style.opacity = String(1 - self.progress);
                },
                onLeave:     () => { if (wrapperRef.current) wrapperRef.current.style.visibility = 'hidden'; },
                onEnterBack: () => { if (wrapperRef.current) wrapperRef.current.style.visibility = 'visible'; },
            });
        });

        return () => ctx.revert();
    }, []);

    return (
        // Full right half, vertically centered in the viewport
        <div
            ref={wrapperRef}
            className="absolute top-0 right-0 w-full lg:w-1/2 h-screen z-50 pointer-events-none"
        >
            <Canvas
                dpr={[1, 1.5]}
                camera={{ position: CAMERA_POSITION, fov: CAMERA_FOV }}
                gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
                style={{ background: 'transparent', pointerEvents: 'none' }}
            >
                {/* IBL — product reflections */}
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
                    {/* Kicker — warm bone accent */}
                    <Lightformer
                        form="rect"
                        intensity={5}
                        position={[-8, 0, -2]}
                        scale={[2, 10, 1]}
                        color="#E6DCC8"
                    />
                </Environment>

                <directionalLight position={[5, 10, 5]} intensity={2}    color="#ffffff" />
                <ambientLight                            intensity={0.15}              />

                <FrameGuard />
                <Suspense fallback={null}>
                    {/* scale=4.5 fills the right half generously.
                        Y=-0.30: origin is at tube bottom, -0.30 centers the
                        mid-tube in the viewport (≈tube-height/2 + 15vh offset) */}
                    <HydreCoreAssembly scale={4.5} position={[0, -0.34, 0]} />
                </Suspense>
            </Canvas>
        </div>
    );
}

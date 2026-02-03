/**
 * Scene — Main 3D Scene Component
 * V4.0.0-HYDRE-APEX Compliant
 * 
 * Entry point for the 3D visualization with:
 * - Low power mode detection and fallback
 * - Scroll-triggered explosion
 * - Click interaction for mobile
 * - Full accessibility support
 */

'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { useAppStore } from '@/lib/store';
import { useLowPowerMode, useQualitySettings } from '@/lib/performance';
import { usePrefersReducedMotion, getAccessibleButtonProps } from '@/lib/accessibility';
import { SceneContent } from './SceneContent';
import { LoadingFallback } from './LoadingFallback';
import type { Scene3DProps } from './Scene.types';

/**
 * Scene3D — Premium 3D visualization with graceful degradation
 */
export function Scene3D({
    className,
    interactive = true,
    onExplosionChange,
}: Scene3DProps) {
    const [isExploding, setIsExploding] = useState(false);
    const [explosionProgress, setExplosionProgress] = useState(0);

    // Performance & accessibility hooks
    const isLowPowerMode = useLowPowerMode();
    const prefersReducedMotion = usePrefersReducedMotion();
    const qualitySettings = useQualitySettings();

    // Store integration
    const { setLowPowerMode } = useAppStore();

    // Sync low power mode to store
    useEffect(() => {
        setLowPowerMode(isLowPowerMode);
    }, [isLowPowerMode, setLowPowerMode]);

    // Notify parent of explosion changes
    useEffect(() => {
        onExplosionChange?.(isExploding, explosionProgress);
    }, [isExploding, explosionProgress, onExplosionChange]);

    // Handle scroll-triggered explosion
    useEffect(() => {
        if (prefersReducedMotion) return;

        const handleScroll = () => {
            const scrollY = window.scrollY;
            const triggerPoint = window.innerHeight * 0.3;
            const endPoint = window.innerHeight * 0.8;

            if (scrollY > triggerPoint) {
                setIsExploding(true);
                const progress = Math.min(1, (scrollY - triggerPoint) / (endPoint - triggerPoint));
                setExplosionProgress(progress);
            } else {
                setIsExploding(false);
                setExplosionProgress(0);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [prefersReducedMotion]);

    // Click to trigger explosion (mobile interaction)
    const handleClick = useCallback(() => {
        if (!interactive || prefersReducedMotion) return;

        if (!isExploding) {
            setIsExploding(true);

            // Animate explosion progress
            let progress = 0;
            const interval = setInterval(() => {
                progress += 0.02;
                setExplosionProgress(progress);

                if (progress >= 1) {
                    clearInterval(interval);
                    // Reset after 2 seconds
                    setTimeout(() => {
                        setIsExploding(false);
                        setExplosionProgress(0);
                    }, 2000);
                }
            }, 16);
        }
    }, [interactive, isExploding, prefersReducedMotion]);

    // Accessible button props
    const accessibleProps = interactive
        ? getAccessibleButtonProps(handleClick, 'Click to see the tablet dissolve')
        : {};

    // ═══════════════════════════════════════════════════════════════════════════
    // LOW POWER MODE FALLBACK
    // ═══════════════════════════════════════════════════════════════════════════

    if (isLowPowerMode || prefersReducedMotion) {
        return (
            <div
                className={`relative ${className}`}
                aria-label="Product visualization"
            >
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    poster="/images/tablet-poster.jpg"
                >
                    <source src="/videos/tablet-animation.mp4" type="video/mp4" />
                    {/* Fallback for browsers that don't support video */}
                    <img
                        src="/images/tablet-poster.jpg"
                        alt="HYDRE tablet visualization"
                        className="w-full h-full object-cover"
                    />
                </video>
            </div>
        );
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // FULL 3D RENDER
    // ═══════════════════════════════════════════════════════════════════════════

    return (
        <div
            className={`relative ${className}`}
            onClick={interactive ? handleClick : undefined}
            {...accessibleProps}
        >
            <Suspense fallback={<LoadingFallback />}>
                <Canvas
                    dpr={[1, qualitySettings.maxDpr]}
                    gl={{
                        antialias: qualitySettings.antialias,
                        alpha: true,
                        powerPreference: 'high-performance',
                        preserveDrawingBuffer: false,
                    }}
                    style={{ background: 'transparent' }}
                >
                    <SceneContent
                        isExploding={isExploding}
                        explosionProgress={explosionProgress}
                    />
                </Canvas>
            </Suspense>
        </div>
    );
}

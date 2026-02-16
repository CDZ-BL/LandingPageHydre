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
}: Scene3DProps) {
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
        <div className={`relative ${className}`}>
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
                    <SceneContent interactive={interactive} />
                </Canvas>
            </Suspense>
        </div>
    );
}

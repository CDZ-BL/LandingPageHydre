/**
 * HYDRE V1.0 — Performance Monitoring Utilities
 * V4.0.0-HYDRE-APEX Compliant
 * 
 * GPU performance monitoring, adaptive quality management,
 * and resource disposal utilities for WebGL optimization.
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// GPU PERFORMANCE BUDGETS (from V4.0.0-HYDRE-APEX)
// ═══════════════════════════════════════════════════════════════════════════

export const GPU_BUDGETS = {
    /** Maximum draw calls per frame */
    MAX_DRAW_CALLS: 100,

    /** Maximum triangle count */
    MAX_TRIANGLES: 500000,

    /** Maximum texture memory in MB */
    MAX_TEXTURE_MEMORY_MB: 128,

    /** Target FPS for desktop */
    TARGET_FPS_DESKTOP: 60,

    /** Target FPS for mobile */
    TARGET_FPS_MOBILE: 30,

    /** Maximum shader loop iterations */
    MAX_SHADER_LOOP_ITERATIONS: 16,
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// GPU TIER DETECTION
// ═══════════════════════════════════════════════════════════════════════════

export type GPUTier = 'low' | 'medium' | 'high' | 'ultra';

interface GPUInfo {
    tier: GPUTier;
    vendor: string;
    renderer: string;
    isMobile: boolean;
    supportsWebGL2: boolean;
}

/**
 * Detect GPU capabilities and assign a performance tier.
 */
export function detectGPUTier(): GPUInfo {
    if (typeof window === 'undefined') {
        return {
            tier: 'medium',
            vendor: 'unknown',
            renderer: 'unknown',
            isMobile: false,
            supportsWebGL2: false,
        };
    }

    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');

    if (!gl) {
        return {
            tier: 'low',
            vendor: 'none',
            renderer: 'none',
            isMobile: /Mobi|Android/i.test(navigator.userAgent),
            supportsWebGL2: false,
        };
    }

    const supportsWebGL2 = !!canvas.getContext('webgl2');
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');

    let vendor = 'unknown';
    let renderer = 'unknown';

    if (debugInfo) {
        vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || 'unknown';
        renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || 'unknown';
    }

    const isMobile = /Mobi|Android/i.test(navigator.userAgent);

    // Determine tier based on renderer string
    let tier: GPUTier = 'medium';

    const rendererLower = renderer.toLowerCase();

    // High-end desktop GPUs
    if (
        rendererLower.includes('rtx 40') ||
        rendererLower.includes('rtx 30') ||
        rendererLower.includes('rx 7') ||
        rendererLower.includes('rx 6') ||
        rendererLower.includes('m1') ||
        rendererLower.includes('m2') ||
        rendererLower.includes('m3')
    ) {
        tier = 'ultra';
    }
    // Mid-range GPUs
    else if (
        rendererLower.includes('rtx 20') ||
        rendererLower.includes('gtx 16') ||
        rendererLower.includes('gtx 10') ||
        rendererLower.includes('rx 5')
    ) {
        tier = 'high';
    }
    // Low-end or integrated
    else if (
        rendererLower.includes('intel') ||
        rendererLower.includes('mali') ||
        rendererLower.includes('adreno') ||
        isMobile
    ) {
        tier = isMobile ? 'low' : 'medium';
    }

    return {
        tier,
        vendor,
        renderer,
        isMobile,
        supportsWebGL2,
    };
}

/**
 * Hook to get GPU tier with reactive updates.
 */
export function useGPUTier(): GPUInfo {
    const [gpuInfo, setGpuInfo] = useState<GPUInfo>(() => ({
        tier: 'medium',
        vendor: 'unknown',
        renderer: 'unknown',
        isMobile: false,
        supportsWebGL2: false,
    }));

    useEffect(() => {
        setGpuInfo(detectGPUTier());
    }, []);

    return gpuInfo;
}

// ═══════════════════════════════════════════════════════════════════════════
// ADAPTIVE QUALITY SETTINGS
// ═══════════════════════════════════════════════════════════════════════════

export interface QualitySettings {
    /** Particle count multiplier (0.25 - 1.0) */
    particleMultiplier: number;

    /** Shadow quality (none, low, medium, high) */
    shadowQuality: 'none' | 'low' | 'medium' | 'high';

    /** Post-processing enabled */
    postProcessing: boolean;

    /** Texture resolution multiplier (0.5 - 1.0) */
    textureScale: number;

    /** Anti-aliasing enabled */
    antialias: boolean;

    /** Device pixel ratio limit */
    maxDpr: number;

    /** LOD bias (higher = more aggressive LOD) */
    lodBias: number;
}

/**
 * Get quality settings based on GPU tier.
 */
export function getQualitySettings(tier: GPUTier): QualitySettings {
    switch (tier) {
        case 'ultra':
            return {
                particleMultiplier: 1.0,
                shadowQuality: 'high',
                postProcessing: true,
                textureScale: 1.0,
                antialias: true,
                maxDpr: 2,
                lodBias: 0,
            };

        case 'high':
            return {
                particleMultiplier: 0.75,
                shadowQuality: 'medium',
                postProcessing: true,
                textureScale: 1.0,
                antialias: true,
                maxDpr: 1.5,
                lodBias: 0.5,
            };

        case 'medium':
            return {
                particleMultiplier: 0.5,
                shadowQuality: 'low',
                postProcessing: false,
                textureScale: 0.75,
                antialias: true,
                maxDpr: 1,
                lodBias: 1,
            };

        case 'low':
        default:
            return {
                particleMultiplier: 0.25,
                shadowQuality: 'none',
                postProcessing: false,
                textureScale: 0.5,
                antialias: false,
                maxDpr: 1,
                lodBias: 2,
            };
    }
}

/**
 * Hook to get adaptive quality settings.
 */
export function useQualitySettings(): QualitySettings {
    const gpuInfo = useGPUTier();
    const [settings, setSettings] = useState<QualitySettings>(() =>
        getQualitySettings('medium')
    );

    useEffect(() => {
        setSettings(getQualitySettings(gpuInfo.tier));
    }, [gpuInfo.tier]);

    return settings;
}

// ═══════════════════════════════════════════════════════════════════════════
// FPS MONITORING
// ═══════════════════════════════════════════════════════════════════════════

interface FPSStats {
    current: number;
    average: number;
    min: number;
    max: number;
    isLow: boolean;
}

/**
 * Hook to monitor FPS and detect performance issues.
 */
export function useFPSMonitor(targetFps = 60): FPSStats {
    const [stats, setStats] = useState<FPSStats>({
        current: 60,
        average: 60,
        min: 60,
        max: 60,
        isLow: false,
    });

    const frameTimesRef = useRef<number[]>([]);
    const lastTimeRef = useRef<number>(performance.now());
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        const measure = () => {
            const now = performance.now();
            const delta = now - lastTimeRef.current;
            lastTimeRef.current = now;

            const fps = 1000 / delta;
            const frameTimes = frameTimesRef.current;

            frameTimes.push(fps);
            if (frameTimes.length > 60) {
                frameTimes.shift();
            }

            if (frameTimes.length > 0) {
                const average = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
                const min = Math.min(...frameTimes);
                const max = Math.max(...frameTimes);

                setStats({
                    current: Math.round(fps),
                    average: Math.round(average),
                    min: Math.round(min),
                    max: Math.round(max),
                    isLow: average < targetFps * 0.8,
                });
            }

            rafRef.current = requestAnimationFrame(measure);
        };

        rafRef.current = requestAnimationFrame(measure);

        return () => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, [targetFps]);

    return stats;
}

// ═══════════════════════════════════════════════════════════════════════════
// MEMORY MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Dispose of Three.js resources properly.
 * Call this in useEffect cleanup for 3D components.
 */
export function disposeThreeResources(
    objects: Array<{
        geometry?: { dispose: () => void };
        material?: { dispose: () => void } | Array<{ dispose: () => void }>;
        dispose?: () => void;
    }>
): void {
    objects.forEach((obj) => {
        if (obj.geometry?.dispose) {
            obj.geometry.dispose();
        }

        if (obj.material) {
            if (Array.isArray(obj.material)) {
                obj.material.forEach((mat) => mat.dispose?.());
            } else {
                obj.material.dispose?.();
            }
        }

        if (obj.dispose) {
            obj.dispose();
        }
    });
}

/**
 * Hook to automatically dispose resources on unmount.
 */
export function useResourceDisposal() {
    const resourcesRef = useRef<Array<{
        geometry?: { dispose: () => void };
        material?: { dispose: () => void } | Array<{ dispose: () => void }>;
        dispose?: () => void;
    }>>([]);

    const registerResource = useCallback((resource: typeof resourcesRef.current[0]) => {
        resourcesRef.current.push(resource);
    }, []);

    useEffect(() => {
        return () => {
            disposeThreeResources(resourcesRef.current);
            resourcesRef.current = [];
        };
    }, []);

    return { registerResource };
}

// ═══════════════════════════════════════════════════════════════════════════
// LOW POWER MODE DETECTION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Enhanced low power mode detection.
 * Checks for battery saver, reduced data, and device capabilities.
 */
export function detectLowPowerMode(): boolean {
    if (typeof window === 'undefined') return false;

    // Check for explicit low power indicators
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;

    // Check device memory (if available)
    const lowMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory !== undefined
        && (navigator as Navigator & { deviceMemory?: number }).deviceMemory! < 4;

    // Check hardware concurrency (CPU cores)
    const lowCPU = navigator.hardwareConcurrency !== undefined
        && navigator.hardwareConcurrency < 4;

    // Mobile detection
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);

    // Consider low power if multiple indicators are true
    const indicators = [prefersReducedMotion, saveData, lowMemory, lowCPU, isMobile];
    const trueCount = indicators.filter(Boolean).length;

    return trueCount >= 2;
}

/**
 * Hook for low power mode detection with reactive updates.
 */
export function useLowPowerMode(): boolean {
    const [isLowPower, setIsLowPower] = useState(false);

    useEffect(() => {
        setIsLowPower(detectLowPowerMode());

        // Listen for reduced motion changes
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        const handleChange = () => setIsLowPower(detectLowPowerMode());

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    return isLowPower;
}

// ═══════════════════════════════════════════════════════════════════════════
// PERFORMANCE LOGGING (Development Only)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Log performance metrics in development.
 */
export function logPerformanceMetrics(label: string, metrics: Record<string, number | string>): void {
    if (process.env.NODE_ENV !== 'development') return;

    console.group(`🔬 Performance: ${label}`);
    Object.entries(metrics).forEach(([key, value]) => {
        console.log(`  ${key}: ${value}`);
    });
    console.groupEnd();
}

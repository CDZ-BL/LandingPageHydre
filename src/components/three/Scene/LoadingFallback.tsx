/**
 * LoadingFallback — Scene Loading State
 * V4.0.0-HYDRE-APEX Compliant
 */

'use client';

import { usePrefersReducedMotion } from '@/lib/accessibility';

/**
 * Animated loading placeholder while 3D scene loads
 */
export function LoadingFallback() {
    const prefersReducedMotion = usePrefersReducedMotion();

    return (
        <div
            className="absolute inset-0 flex items-center justify-center"
            role="status"
            aria-label="Loading 3D scene"
        >
            <div className="relative">
                {/* Outer ring */}
                <div
                    className={`
            w-24 h-24 rounded-full border-4 border-void-400/30
            ${prefersReducedMotion ? '' : 'animate-pulse'}
          `}
                />

                {/* Inner spinning gradient */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div
                        className={`
              w-16 h-16 rounded-full 
              bg-gradient-to-br from-neon-orange to-bone
              ${prefersReducedMotion ? '' : 'animate-spin'}
            `}
                        style={{
                            animationDuration: prefersReducedMotion ? '0s' : '3s',
                        }}
                    />
                </div>

                {/* Center dot */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-void" />
                </div>
            </div>

            {/* Screen reader text */}
            <span className="sr-only">Loading 3D visualization...</span>
        </div>
    );
}

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface NeuralLoaderProps {
    className?: string;
    segments?: number;
    variant?: 'vertical' | 'horizontal';
}

export function NeuralLoader({
    className,
    segments = 5,
    variant = 'vertical',
}: NeuralLoaderProps) {
    return (
        <div
            className={cn(
                'neural-loader',
                variant === 'horizontal' && 'flex-row',
                className
            )}
        >
            {Array.from({ length: segments }).map((_, i) => (
                <div key={i} className="segment" />
            ))}
        </div>
    );
}

// Full-screen loader for page transitions
export function PageTransitionLoader({
    isLoading,
    className,
}: {
    isLoading: boolean;
    className?: string;
}) {
    if (!isLoading) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
                'fixed inset-0 z-[100] bg-void flex items-center justify-center',
                className
            )}
        >
            <div className="flex flex-col items-center gap-8">
                {/* Neural spine loader */}
                <div className="relative">
                    <NeuralLoader segments={7} />

                    {/* Glow effect behind loader */}
                    <div
                        className="absolute inset-0 blur-xl opacity-50"
                        style={{
                            background: 'radial-gradient(circle, rgba(0, 240, 255, 0.4) 0%, transparent 70%)',
                        }}
                    />
                </div>

                {/* Loading text */}
                <div className="coordinate-display text-center">
                    <div className="text-neon-cyan mb-2">INITIALIZING SYSTEM</div>
                    <motion.div
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="text-void-500"
                    >
                        LOADING ASSETS...
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}

// Circular brain-synapse variant
export function SynapseLoader({ className }: { className?: string }) {
    return (
        <div className={cn('relative w-16 h-16', className)}>
            <svg viewBox="0 0 64 64" className="w-full h-full">
                {/* Outer ring */}
                <circle
                    cx="32"
                    cy="32"
                    r="28"
                    fill="none"
                    stroke="rgba(0, 240, 255, 0.2)"
                    strokeWidth="1"
                />

                {/* Animated arc */}
                <motion.circle
                    cx="32"
                    cy="32"
                    r="28"
                    fill="none"
                    stroke="rgba(0, 240, 255, 0.8)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray="40 136"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    style={{ transformOrigin: 'center' }}
                />

                {/* Inner core */}
                <motion.circle
                    cx="32"
                    cy="32"
                    r="8"
                    fill="rgba(0, 240, 255, 0.3)"
                    animate={{
                        r: [8, 10, 8],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                />

                {/* Center dot */}
                <circle
                    cx="32"
                    cy="32"
                    r="3"
                    fill="#00F0FF"
                    className="drop-shadow-neon"
                />
            </svg>
        </div>
    );
}

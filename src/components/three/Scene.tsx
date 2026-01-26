'use client';

import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, PerspectiveCamera, Preload } from '@react-three/drei';
import { TabletModel } from './TabletModel';
import { ParticleSystem, IngredientLabels } from './ParticleSystem';
import { useAppStore } from '@/lib/store';
import { detectLowPowerMode } from '@/lib/utils';

interface SceneProps {
    isExploding: boolean;
    explosionProgress: number;
}

function SceneContent({ isExploding, explosionProgress }: SceneProps) {
    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />

            {/* Lighting */}
            <ambientLight intensity={0.4} />
            <directionalLight
                position={[10, 10, 5]}
                intensity={1.5}
                castShadow
            />
            <pointLight position={[-10, -10, -5]} intensity={0.5} color="#00F0FF" />
            <pointLight position={[10, -10, 5]} intensity={0.3} color="#00D4FF" />

            {/* Main tablet */}
            <TabletModel
                isExploding={isExploding}
                explosionProgress={explosionProgress}
            />

            {/* Particle explosion */}
            <ParticleSystem
                isActive={isExploding}
                progress={explosionProgress}
            />

            {/* Ingredient labels */}
            <IngredientLabels isVisible={explosionProgress > 0.3} />

            {/* Environment for reflections */}
            <Environment preset="studio" />

            {/* Allow orbit controls on desktop */}
            <OrbitControls
                enableZoom={false}
                enablePan={false}
                maxPolarAngle={Math.PI / 2}
                minPolarAngle={Math.PI / 3}
                rotateSpeed={0.5}
            />

            <Preload all />
        </>
    );
}

// Loading fallback with animated placeholder
function LoadingFallback() {
    return (
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-neon-cyan/30 animate-pulse" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-neon-cyan to-neon-blue animate-spin-slow" />
                </div>
            </div>
        </div>
    );
}

interface Scene3DProps {
    className?: string;
}

export function Scene3D({ className }: Scene3DProps) {
    const [isExploding, setIsExploding] = useState(false);
    const [explosionProgress, setExplosionProgress] = useState(0);
    const { isLowPowerMode, setLowPowerMode } = useAppStore();

    // Detect low power mode on mount
    useEffect(() => {
        setLowPowerMode(detectLowPowerMode());
    }, [setLowPowerMode]);

    // Handle scroll-triggered explosion
    useEffect(() => {
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

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Click to trigger explosion (for mobile)
    const handleClick = () => {
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
    };

    // Show video fallback for low-power devices
    if (isLowPowerMode) {
        return (
            <div className={`relative ${className}`}>
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    poster="/images/tablet-poster.jpg"
                >
                    <source src="/videos/tablet-animation.mp4" type="video/mp4" />
                </video>
            </div>
        );
    }

    return (
        <div
            className={`relative ${className}`}
            onClick={handleClick}
            role="button"
            tabIndex={0}
            aria-label="Click to see the tablet dissolve"
        >
            <Suspense fallback={<LoadingFallback />}>
                <Canvas
                    dpr={[1, 2]}
                    gl={{
                        antialias: true,
                        alpha: true,
                        powerPreference: 'high-performance',
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


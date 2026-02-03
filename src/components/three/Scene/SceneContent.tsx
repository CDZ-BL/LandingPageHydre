/**
 * SceneContent — Internal 3D Scene Components
 * V4.0.0-HYDRE-APEX Compliant
 */

'use client';

import { Environment, OrbitControls, PerspectiveCamera, Preload } from '@react-three/drei';
import { TabletModel } from '@/components/three/TabletModel';
import { ParticleSystem, IngredientLabels } from '@/components/three/ParticleSystem';
import { usePrefersReducedMotion } from '@/lib/accessibility';
import type { SceneContentProps } from './Scene.types';

/**
 * SceneContent — All 3D elements within the Canvas
 */
export function SceneContent({ isExploding, explosionProgress }: SceneContentProps) {
    const prefersReducedMotion = usePrefersReducedMotion();

    return (
        <>
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
        </>
    );
}

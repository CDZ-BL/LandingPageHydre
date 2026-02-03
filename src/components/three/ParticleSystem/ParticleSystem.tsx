/**
 * ParticleSystem — Main Component
 * V4.0.0-HYDRE-APEX Compliant
 * 
 * Explosion particle effect with adaptive quality
 * and proper resource disposal.
 */

'use client';

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useResourceDisposal } from '@/lib/performance';
import { usePrefersReducedMotion } from '@/lib/accessibility';
import { useParticleAnimation } from './useParticleAnimation';
import type { ParticleSystemProps } from './ParticleSystem.types';

/**
 * Default base particle count (before quality scaling)
 */
const DEFAULT_BASE_PARTICLE_COUNT = 200;

/**
 * ParticleSystem — Explosion particle effect
 */
export function ParticleSystem({
    isActive,
    progress,
    baseParticleCount = DEFAULT_BASE_PARTICLE_COUNT,
    position = [0, 0, 0],
}: ParticleSystemProps) {
    const particlesRef = useRef<THREE.Points>(null);
    const prefersReducedMotion = usePrefersReducedMotion();
    const { registerResource } = useResourceDisposal();

    // Get particle animation state and update function
    const { particleState, particleCount, updateParticles } = useParticleAnimation({
        baseParticleCount,
    });

    // Register for disposal on unmount
    useEffect(() => {
        if (particlesRef.current) {
            registerResource(particlesRef.current);
        }
    }, [registerResource]);

    // Animate particles
    useFrame((state, delta) => {
        if (!particlesRef.current || !isActive || prefersReducedMotion) return;

        const positionAttribute = particlesRef.current.geometry.attributes.position as THREE.BufferAttribute;
        updateParticles(positionAttribute, delta, progress, state.clock.elapsedTime);
    });

    // Don't render if inactive or reduced motion preferred
    if (!isActive || prefersReducedMotion) return null;

    return (
        <points ref={particlesRef} position={position}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particleCount}
                    array={particleState.positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={particleCount}
                    array={particleState.colors}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-size"
                    count={particleCount}
                    array={particleState.sizes}
                    itemSize={1}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.1}
                vertexColors
                transparent
                opacity={1 - progress * 0.5}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
}

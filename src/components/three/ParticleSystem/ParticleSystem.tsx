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
    explosionRef,
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
        if (!particlesRef.current || prefersReducedMotion) return;

        // Floating point safety threshold for strict culling
        // If explosion is basically zero, hide the system entirely to save GPU
        if (explosionRef.current < 0.001) {
            if (particlesRef.current.visible) {
                particlesRef.current.visible = false;
            }
            return; // Kill the math loop entirely
        }

        // Wake up if valid
        if (!particlesRef.current.visible) {
            particlesRef.current.visible = true;
        }

        const positionAttribute = particlesRef.current.geometry.attributes.position as THREE.BufferAttribute;

        // Pass the ref value to the update function
        updateParticles(positionAttribute, delta, explosionRef.current, state.clock.elapsedTime);

        // Update opacity material uniform/prop if it exists
        const mat = particlesRef.current.material as THREE.PointsMaterial;
        if (mat) {
            const newOpacity = Math.max(0, 1 - explosionRef.current * 0.5);
            if (mat.opacity !== newOpacity) {
                mat.opacity = newOpacity;
            }
        }
    });

    // If reduced motion, we still render but empty/hidden, or just return null
    if (prefersReducedMotion) return null;

    return (
        <points ref={particlesRef} position={position} visible={false}>
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
                opacity={1}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
}

/**
 * IngredientLabels — Floating Labels Component
 * V4.0.0-HYDRE-APEX Compliant
 */

'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePrefersReducedMotion } from '@/lib/accessibility';
import type { IngredientLabelsProps } from './ParticleSystem.types';

/**
 * Label position and color data
 */
const LABEL_POSITIONS = [
    { pos: [2, 1, 0] as [number, number, number], label: 'Mg', color: '#FF6B35' },
    { pos: [-2, 0.5, 1] as [number, number, number], label: 'K', color: '#00D4FF' },
    { pos: [1.5, -1, 1.5] as [number, number, number], label: 'Na', color: '#FFD700' },
    { pos: [-1.5, 1.5, -1] as [number, number, number], label: 'Ca', color: '#FFFFFF' },
    { pos: [0.5, -1.5, -2] as [number, number, number], label: 'Zn', color: '#C0C0C0' },
    { pos: [-1, -0.5, 2] as [number, number, number], label: 'B6', color: '#90EE90' },
];

/**
 * Floating ingredient labels that appear during explosion
 */
export function IngredientLabels({
    isVisible,
    parentPosition = [0, 0, 0],
}: IngredientLabelsProps) {
    const groupRef = useRef<THREE.Group>(null);
    const prefersReducedMotion = usePrefersReducedMotion();

    useFrame((state) => {
        if (groupRef.current && isVisible && !prefersReducedMotion) {
            groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
        }
    });

    if (!isVisible) return null;

    return (
        <group ref={groupRef} position={parentPosition}>
            {LABEL_POSITIONS.map((item, index) => (
                <mesh key={index} position={item.pos}>
                    <sphereGeometry args={[0.2, 32, 32]} />
                    <meshBasicMaterial
                        color={item.color}
                        transparent
                        opacity={0.8}
                    />
                </mesh>
            ))}
        </group>
    );
}

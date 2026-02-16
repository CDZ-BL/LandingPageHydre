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
    explosionRef,
    parentPosition = [0, 0, 0],
}: IngredientLabelsProps) {
    const groupRef = useRef<THREE.Group>(null);
    const prefersReducedMotion = usePrefersReducedMotion();

    useFrame((state) => {
        if (!groupRef.current || prefersReducedMotion) return;

        const progress = explosionRef.current;
        const isVisible = progress > 0.3;

        // Visibility toggle to save GPU
        if (groupRef.current.visible !== isVisible) {
            groupRef.current.visible = isVisible;
        }

        if (isVisible) {
            groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;

            // Optional: Animate opacity of children if they supported it, 
            // but right now they are meshBasicMaterial.
            // We could iterate children to fade them in.
            groupRef.current.children.forEach((child) => {
                if (child instanceof THREE.Mesh) {
                    const mat = child.material as THREE.Material;
                    // Fade in logic: map progress 0.3->0.5 to opacity 0->0.8
                    const targetOpacity = Math.min(0.8, (progress - 0.3) * 4);
                    if (mat.opacity !== targetOpacity) {
                        mat.opacity = targetOpacity;
                    }
                }
            });
        }
    });

    if (prefersReducedMotion) return null;

    return (
        <group ref={groupRef} position={parentPosition} visible={false}>
            {LABEL_POSITIONS.map((item, index) => (
                <mesh key={index} position={item.pos}>
                    <sphereGeometry args={[0.2, 32, 32]} />
                    <meshBasicMaterial
                        color={item.color}
                        transparent
                        opacity={0} // Start invisible
                    />
                </mesh>
            ))}
        </group>
    );
}

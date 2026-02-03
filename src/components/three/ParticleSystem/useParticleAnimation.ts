/**
 * useParticleAnimation — Custom Hook
 * V4.0.0-HYDRE-APEX Compliant
 * 
 * Handles particle physics simulation with adaptive quality.
 */

'use client';

import { useMemo, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { useQualitySettings } from '@/lib/performance';
import type { Ingredient, ParticleState } from './ParticleSystem.types';

/**
 * Default ingredient data for particles
 */
export const INGREDIENTS: Ingredient[] = [
    { name: 'Mg', color: '#FF6B35', size: 0.15 },  // Magnesium - Orange
    { name: 'K', color: '#00D4FF', size: 0.12 },   // Potassium - Blue
    { name: 'Na', color: '#FFD700', size: 0.13 },  // Sodium - Gold
    { name: 'Ca', color: '#FFFFFF', size: 0.11 },  // Calcium - White
    { name: 'Zn', color: '#C0C0C0', size: 0.10 },  // Zinc - Silver
    { name: 'B6', color: '#90EE90', size: 0.09 },  // Vitamin B6 - Green
];

interface UseParticleAnimationOptions {
    baseParticleCount: number;
    ingredients?: Ingredient[];
}

interface UseParticleAnimationResult {
    particleState: ParticleState;
    particleCount: number;
    updateParticles: (
        positionAttribute: THREE.BufferAttribute,
        delta: number,
        progress: number,
        elapsedTime: number
    ) => void;
}

/**
 * Hook for managing particle animation state and physics
 */
export function useParticleAnimation({
    baseParticleCount,
    ingredients = INGREDIENTS,
}: UseParticleAnimationOptions): UseParticleAnimationResult {
    const qualitySettings = useQualitySettings();

    // Calculate actual particle count based on quality
    const particleCount = Math.floor(baseParticleCount * qualitySettings.particleMultiplier);

    // Store velocities in a ref so they persist across renders
    const velocitiesRef = useRef<Float32Array | null>(null);

    // Generate particle positions and properties
    const particleState = useMemo(() => {
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        const velocities = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            // Start from center (tablet position)
            positions[i * 3] = 0;
            positions[i * 3 + 1] = 0;
            positions[i * 3 + 2] = 0;

            // Random velocity direction (spherical explosion)
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const speed = 2 + Math.random() * 3;

            velocities[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
            velocities[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
            velocities[i * 3 + 2] = Math.cos(phi) * speed;

            // Random ingredient color
            const ingredient = ingredients[Math.floor(Math.random() * ingredients.length)];
            const color = new THREE.Color(ingredient.color);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;

            // Random sizes
            sizes[i] = ingredient.size * (0.5 + Math.random());
        }

        // Store velocities in ref for animation updates
        velocitiesRef.current = velocities;

        return { positions, colors, sizes, velocities };
    }, [particleCount, ingredients]);

    // Update function for animation frame
    const updateParticles = useCallback((
        positionAttribute: THREE.BufferAttribute,
        delta: number,
        progress: number,
        elapsedTime: number
    ) => {
        const velocities = velocitiesRef.current;
        if (!velocities) return;

        const posArray = positionAttribute.array as Float32Array;

        for (let i = 0; i < particleCount; i++) {
            // Move particles outward based on their velocity
            posArray[i * 3] += velocities[i * 3] * delta * progress;
            posArray[i * 3 + 1] += velocities[i * 3 + 1] * delta * progress;
            posArray[i * 3 + 2] += velocities[i * 3 + 2] * delta * progress;

            // Add slight gravity effect
            posArray[i * 3 + 1] -= 0.5 * delta * progress;

            // Add swirl effect
            const angle = elapsedTime * 0.5;
            posArray[i * 3] += Math.sin(angle + i) * 0.01;
            posArray[i * 3 + 2] += Math.cos(angle + i) * 0.01;
        }

        positionAttribute.needsUpdate = true;
    }, [particleCount]);

    return {
        particleState,
        particleCount,
        updateParticles,
    };
}

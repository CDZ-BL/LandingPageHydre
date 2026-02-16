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
        delta: number, // Keep signature compatible but might ignore
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

    // Store velocities/directions in a ref so they persist
    const directionsRef = useRef<Float32Array | null>(null);
    // Store initial positions (if we wanted non-zero origin)
    const originsRef = useRef<Float32Array | null>(null);

    // Generate particle positions and properties
    const particleState = useMemo(() => {
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        const directions = new Float32Array(particleCount * 3);
        const origins = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            // Start from random point within tablet volume (cylinder)
            // Radius 0.8, Height 0.4
            const r = Math.sqrt(Math.random()) * 0.6; // slightly clustered
            const thetaPos = Math.random() * Math.PI * 2;
            const yPos = (Math.random() - 0.5) * 0.3;

            origins[i * 3] = r * Math.cos(thetaPos);
            origins[i * 3 + 1] = yPos;
            origins[i * 3 + 2] = r * Math.sin(thetaPos);

            // Set initial position to origin
            positions[i * 3] = origins[i * 3];
            positions[i * 3 + 1] = origins[i * 3 + 1];
            positions[i * 3 + 2] = origins[i * 3 + 2];

            // Random explosion direction (spherical)
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const speed = 2 + Math.random() * 3; // Explosion magnitude

            directions[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
            directions[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
            directions[i * 3 + 2] = Math.cos(phi) * speed;

            // Random ingredient color
            const ingredient = ingredients[Math.floor(Math.random() * ingredients.length)];
            const color = new THREE.Color(ingredient.color);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;

            // Random sizes
            sizes[i] = ingredient.size * (0.5 + Math.random());
        }

        directionsRef.current = directions;
        originsRef.current = origins;

        return { positions, colors, sizes, velocities: directions }; // reuse velocities as directions in state return
    }, [particleCount, ingredients]);

    // Update function for animation frame
    const updateParticles = useCallback((
        positionAttribute: THREE.BufferAttribute,
        delta: number,
        progress: number,
        elapsedTime: number
    ) => {
        const directions = directionsRef.current;
        const origins = originsRef.current;
        if (!directions || !origins) return;

        const posArray = positionAttribute.array as Float32Array;

        // Expansion factor: how far they fly at max progress
        const EXPANSION_FACTOR = 5.0;

        for (let i = 0; i < particleCount; i++) {
            // Deterministic position based on progress
            // Pos = Origin + Direction * Progress * Factor

            const px = origins[i * 3] + directions[i * 3] * progress * EXPANSION_FACTOR;
            const py = origins[i * 3 + 1] + directions[i * 3 + 1] * progress * EXPANSION_FACTOR;
            const pz = origins[i * 3 + 2] + directions[i * 3 + 2] * progress * EXPANSION_FACTOR;

            // Add Swirl/Noise overlaid on top
            // Swirl should also scale with progress so it doesn't wiggle when static at 0?
            // Or maybe it does wiggle inside?
            // "Dissolving" implies movement.
            // Let's make swirl scale with progress too, so it's stable at 0.

            const swirlStrength = progress * 0.5; // Scale noise with explosion
            const angle = elapsedTime * 0.5 + i;

            const noiseX = Math.sin(angle) * swirlStrength;
            const noiseY = Math.cos(angle * 1.3) * swirlStrength; // Gravity/wobble
            const noiseZ = Math.cos(angle) * swirlStrength;

            // Apply positions
            posArray[i * 3] = px + noiseX;
            posArray[i * 3 + 1] = py + noiseY;
            posArray[i * 3 + 2] = pz + noiseZ;
        }

        positionAttribute.needsUpdate = true;
    }, [particleCount]);

    return {
        particleState,
        particleCount,
        updateParticles,
    };
}

/**
 * ParticleSystem Types — V4.0.0-HYDRE-APEX Compliant
 */

import type * as THREE from 'three';

/**
 * Props for the ParticleSystem component
 */
export interface ParticleSystemProps {
    /** Whether the particle system is active */
    isActive: boolean;

    /** Animation progress [0, 1] */
    progress: number;

    /** Number of particles (will be scaled by quality settings) */
    baseParticleCount?: number;

    /** Position offset */
    position?: [number, number, number];
}

/**
 * Props for ingredient labels overlay
 */
export interface IngredientLabelsProps {
    /** Whether labels are visible */
    isVisible: boolean;

    /** Parent position for offset calculations */
    parentPosition?: [number, number, number];
}

/**
 * Individual ingredient data
 */
export interface Ingredient {
    /** Chemical symbol or name */
    name: string;

    /** Display color */
    color: string;

    /** Relative particle size */
    size: number;
}

/**
 * Particle animation state
 */
export interface ParticleState {
    positions: Float32Array;
    colors: Float32Array;
    sizes: Float32Array;
    velocities: Float32Array;
}

/**
 * Ref type for particle points
 */
export type ParticleSystemRef = React.RefObject<THREE.Points>;

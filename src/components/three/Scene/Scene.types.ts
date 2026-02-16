/**
 * Scene Types — V4.0.0-HYDRE-APEX Compliant
 */

import type * as THREE from 'three';

/**
 * Props for the Scene3D component
 */
export interface Scene3DProps {
    /** Additional CSS class names */
    className?: string;

    /** Enable click-to-explode interaction */
    interactive?: boolean;

    /** Callback when explosion state changes */
    onExplosionChange?: (isExploding: boolean, progress: number) => void;
}

/**
 * Props for internal SceneContent component
 */
export interface SceneContentProps {
    /** Enable click-to-explode interaction */
    interactive?: boolean;
}

/**
 * Scene state
 */
export interface SceneState {
    isExploding: boolean;
    explosionProgress: number;
    isLowPowerMode: boolean;
}

/**
 * Scene refs
 */
export interface SceneRefs {
    canvasRef: React.RefObject<HTMLCanvasElement>;
}

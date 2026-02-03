/**
 * TabletModel Types — V4.0.0-HYDRE-APEX Compliant
 */

import type * as THREE from 'three';

/**
 * Props for the TabletModel component
 */
export interface TabletModelProps {
    /** Whether the tablet is currently exploding/dissolving */
    isExploding: boolean;

    /** Explosion/dissolution progress [0, 1] */
    explosionProgress: number;

    /** Primary color for the tablet */
    color?: THREE.ColorRepresentation;

    /** Secondary color for glow effects */
    glowColor?: THREE.ColorRepresentation;

    /** Enable/disable hover interactions */
    interactive?: boolean;

    /** Callback when hovered */
    onHover?: (hovered: boolean) => void;

    /** Position in 3D space */
    position?: [number, number, number];

    /** Scale multiplier */
    scale?: number;
}

/**
 * Internal state for TabletModel
 */
export interface TabletModelState {
    isHovered: boolean;
    currentScale: number;
    currentOpacity: number;
}

/**
 * Ref type for the TabletModel group
 */
export type TabletModelRef = React.RefObject<THREE.Group>;

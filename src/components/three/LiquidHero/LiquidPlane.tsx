/**
 * LiquidPlane — HYDRE Liquid Core Surface
 * V4.0.0-HYDRE-APEX Compliant
 *
 * ARCHITECTURE:
 * ┌─────────────────────────────────────────────────────────┐
 * │  PlaneGeometry (128×128) → CSM vertex injection        │
 * │  ↓                                                      │
 * │  MeshPhysicalMaterial (metalness: 0.9, clearcoat: 1.0) │
 * │  ↓                                                      │
 * │  Environment IBL handles all reflections natively       │
 * └─────────────────────────────────────────────────────────┘
 *
 * Performance: Vertex-only shader. Fragment pipeline is
 * the unmodified MeshPhysicalMaterial PBR lighting model.
 * GPU budget: ~16k vertices, 1 draw call, 0 texture lookups.
 */

'use client';

import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import CustomShaderMaterial from 'three-custom-shader-material';
import { liquidVertex, LIQUID_DEFAULTS } from '@/shaders/liquid-surface';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────
interface LiquidPlaneProps {
    /** Position in world space */
    position?: [number, number, number];
    /** Override displacement amplitude */
    displacement?: number;
    /** Override animation speed */
    speed?: number;
    /** Override noise scale */
    scale?: number;
}

// ─────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────
export function LiquidPlane({
    position = [0, -2, 0],
    displacement = LIQUID_DEFAULTS.DISPLACEMENT,
    speed = LIQUID_DEFAULTS.SPEED,
    scale = LIQUID_DEFAULTS.SCALE,
}: LiquidPlaneProps) {

    // Mutable uniform refs — GSAP-compatible, zero re-renders
    const uniforms = useMemo(() => ({
        u_time: { value: 0 },
        u_displacement: { value: displacement },
        u_scale: { value: scale },
    }), [displacement, scale]);

    // Detect mobile for adaptive quality
    const segments = useMemo(() => {
        if (typeof window === 'undefined') return LIQUID_DEFAULTS.SEGMENTS_DESKTOP;
        const isMobile = window.innerWidth < 768;
        return isMobile ? LIQUID_DEFAULTS.SEGMENTS_MOBILE : LIQUID_DEFAULTS.SEGMENTS_DESKTOP;
    }, []);

    // ── ANIMATION LOOP ──────────────────────────────────────
    // Drives u_time uniform. MeshPhysicalMaterial handles
    // all lighting calculations natively.
    useFrame((state) => {
        uniforms.u_time.value = state.clock.elapsedTime * speed;
    });

    return (
        <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={position}
            receiveShadow
        >
            <planeGeometry args={[
                LIQUID_DEFAULTS.PLANE_SIZE,
                LIQUID_DEFAULTS.PLANE_SIZE,
                segments,
                segments,
            ]} />
            <CustomShaderMaterial
                baseMaterial={THREE.MeshPhysicalMaterial}
                vertexShader={liquidVertex}
                uniforms={uniforms}
                // ── MERCURY LIQUID PBR ───────────────────────
                color="#050505"
                metalness={0.9}
                roughness={0.02}
                clearcoat={1.0}
                clearcoatRoughness={0.05}
                envMapIntensity={2.0}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
}

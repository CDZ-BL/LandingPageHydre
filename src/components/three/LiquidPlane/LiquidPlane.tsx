/**
 * LiquidPlane — HYDRE Liquid Core Surface
 * V4.0.0-HYDRE-APEX Compliant
 *
 * ARCHITECTURE:
 * ┌─────────────────────────────────────────────────────────┐
 * │  PlaneGeometry (adaptive segments) → CSM vertex inject │
 * │  ↓                                                      │
 * │  MeshPhysicalMaterial (metalness: 0.9, clearcoat: 1.0) │
 * │  ↓                                                      │
 * │  Environment IBL handles all reflections natively       │
 * └─────────────────────────────────────────────────────────┘
 *
 * Performance: Vertex-only shader. Fragment pipeline is
 * the unmodified MeshPhysicalMaterial PBR lighting model.
 * GPU budget: ~16k vertices, 1 draw call, 0 texture lookups.
 *
 * HYDRATION-SAFE: Uses useThree().size instead of raw window
 * object — evaluated 100% client-side after Canvas mount.
 */

'use client';

import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
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

    // Le hook useThree accède au store interne de R3F (exécuté 100% côté client)
    const { size } = useThree();
    const materialRef = useRef<any>(null);

    // Résolution adaptative stricte et sûre — hydration-safe
    const segments = size.width < 768
        ? LIQUID_DEFAULTS.SEGMENTS_MOBILE
        : LIQUID_DEFAULTS.SEGMENTS_DESKTOP;

    const uniforms = useMemo(() => ({
        u_time: { value: 0 },
        u_displacement: { value: displacement },
        u_scale: { value: scale },
    }), [displacement, scale]);

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.u_time.value = state.clock.elapsedTime * speed;
        }
    });

    // Création du matériau de base (MeshPhysicalMaterial)
    // Instanciation directe — la méthode la plus stable avec CSM/vanilla
    const baseMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#050505"),
        metalness: 0.9,
        roughness: 0.02,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        envMapIntensity: 2.0,
        side: THREE.DoubleSide,
    }), []);

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
                ref={materialRef}
                baseMaterial={baseMaterial}
                vertexShader={liquidVertex}
                uniforms={uniforms}
            />
        </mesh>
    );
}

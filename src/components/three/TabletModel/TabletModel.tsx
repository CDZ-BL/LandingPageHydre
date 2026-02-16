/**
 * TabletModel — Main Component
 * V4.0.0-HYDRE-APEX Compliant
 * 
 * 3D tablet mesh with Mercury Dissolve shader integration,
 * optimized for performance with proper geometry disposal.
 */

'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { extend } from '@react-three/fiber';
import { MercuryDissolveMaterial } from '@/shaders/mercury-dissolve';
import { usePrefersReducedMotion } from '@/lib/accessibility';
import { useResourceDisposal } from '@/lib/performance';
import type { TabletModelProps } from './TabletModel.types';

// Extend R3F with custom shader material
extend({ MercuryDissolveMaterial });

// Declare JSX type for custom material
declare module '@react-three/fiber' {
    interface ThreeElements {
        mercuryDissolveMaterial: JSX.IntrinsicElements['shaderMaterial'] & {
            u_time?: number;
            u_dissolveProgress?: number;
            u_color?: THREE.Color;
            u_secondaryColor?: THREE.Color;
            u_fresnelPower?: number;
            u_chromaticStrength?: number;
            u_opacity?: number;
            u_noiseScale?: number;
            u_noiseStrength?: number;
        };
    }
}

/**
 * TabletModel — Premium 3D tablet with Mercury Glass effects
 */
export function TabletModel({
    explosionRef,
    color = '#FFFAF0',
    glowColor = '#FF6B35',
    interactive = true,
    onHover,
    position = [0, 0, 0],
    scale = 1,
}: TabletModelProps) {
    const tabletRef = useRef<THREE.Group>(null);
    const meshRef = useRef<THREE.Mesh>(null);
    const topCapRef = useRef<THREE.Mesh>(null);
    const bottomCapRef = useRef<THREE.Mesh>(null);
    const logoRef = useRef<THREE.Mesh>(null);
    const ringRef = useRef<THREE.Mesh>(null);

    // We keep hover state in React because it doesn't happen 60fps
    const [hovered, setHovered] = useState(false);

    // Accessibility
    const prefersReducedMotion = usePrefersReducedMotion();

    // Resource management
    const { registerResource } = useResourceDisposal();

    // Convert colors to THREE.Color
    const baseColor = new THREE.Color(color);
    const secondaryColor = new THREE.Color(glowColor);

    // Handle hover
    const handlePointerOver = useCallback(() => {
        if (!interactive) return;
        setHovered(true);
        onHover?.(true);
    }, [interactive, onHover]);

    const handlePointerOut = useCallback(() => {
        if (!interactive) return;
        setHovered(false);
        onHover?.(false);
    }, [interactive, onHover]);

    // Animation frame - update shader uniforms via mesh material
    useFrame((state) => {
        if (!tabletRef.current) return;

        const explosionProgress = explosionRef.current;
        const isExploding = explosionProgress > 0.01;

        // Calculate dynamic values imperatively to avoid React renders
        const tabletOpacity = isExploding ? Math.max(0, 1 - explosionProgress * 2) : 1;

        // 1. Update Mercury Shader Uniforms
        if (meshRef.current && meshRef.current.material) {
            const mat = meshRef.current.material as THREE.ShaderMaterial;
            if (mat.uniforms) {
                mat.uniforms.u_time.value = state.clock.elapsedTime;
                mat.uniforms.u_dissolveProgress.value = explosionProgress;
                mat.uniforms.u_opacity.value = tabletOpacity;
            }
        }

        // 2. Update Standard Materials Opacity imperatively
        const updateOpacity = (mesh: THREE.Mesh | null) => {
            if (mesh && mesh.material) {
                const mat = mesh.material as THREE.Material;
                // Check if opacity needs update to avoid unnecessary sets (though likely cheap)
                if (mat.opacity !== tabletOpacity) {
                    mat.opacity = tabletOpacity;
                    // No need for needsUpdate = true for simple opacity change on transparent material
                }
            }
        };

        updateOpacity(topCapRef.current);
        updateOpacity(bottomCapRef.current);
        updateOpacity(logoRef.current);
        updateOpacity(ringRef.current);

        // 3. Rotation animation (skip if reduced motion preferred)
        if (!prefersReducedMotion && !isExploding) {
            tabletRef.current.rotation.y = state.clock.elapsedTime * 0.3;
            tabletRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
        }

        // 4. Manual imperative scale
        const currentScale = isExploding
            ? scale * (1 + explosionProgress * 0.5)
            : scale * (hovered ? 1.05 : 1);

        if (tabletRef.current.scale.x !== currentScale) {
            tabletRef.current.scale.setScalar(currentScale);
        }
    });

    // Register mesh for disposal
    useEffect(() => {
        if (meshRef.current) registerResource(meshRef.current);
        if (topCapRef.current) registerResource(topCapRef.current);
        if (bottomCapRef.current) registerResource(bottomCapRef.current);
        if (logoRef.current) registerResource(logoRef.current);
        if (ringRef.current) registerResource(ringRef.current);
    }, [registerResource]);

    // Float wrapper (disabled for reduced motion)
    const FloatWrapper = prefersReducedMotion ? 'group' : Float;
    const floatProps = prefersReducedMotion ? {} : {
        speed: 2,
        rotationIntensity: 0.5,
        floatIntensity: 0.5,
        floatingRange: [-0.1, 0.1] as [number, number],
    };

    return (
        <FloatWrapper {...floatProps}>
            <group
                ref={tabletRef}
                position={position}
                scale={scale} // Initial scale, updated imperatively
                onPointerOver={handlePointerOver}
                onPointerOut={handlePointerOut}
            >
                {/* Main tablet body - cylindrical shape */}
                <mesh ref={meshRef} position={[0, 0, 0]}>
                    <cylinderGeometry args={[0.8, 0.8, 0.4, 64]} />
                    <mercuryDissolveMaterial
                        u_time={0}
                        u_color={baseColor}
                        u_secondaryColor={secondaryColor}
                        u_dissolveProgress={0}
                        u_fresnelPower={3.0}
                        u_chromaticStrength={1.0}
                        u_opacity={1}
                        u_noiseScale={2.0}
                        u_noiseStrength={1.0}
                        transparent
                        side={THREE.DoubleSide}
                        depthWrite={false}
                    />
                </mesh>

                {/* Top rounded cap */}
                <mesh ref={topCapRef} position={[0, 0.2, 0]}>
                    <sphereGeometry args={[0.8, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
                    <meshPhysicalMaterial
                        color={color}
                        metalness={0.1}
                        roughness={0.3}
                        clearcoat={0.8}
                        clearcoatRoughness={0.2}
                        transparent
                        opacity={1}
                    />
                </mesh>

                {/* Bottom rounded cap */}
                <mesh ref={bottomCapRef} position={[0, -0.2, 0]} rotation={[Math.PI, 0, 0]}>
                    <sphereGeometry args={[0.8, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
                    <meshPhysicalMaterial
                        color={color}
                        metalness={0.1}
                        roughness={0.3}
                        clearcoat={0.8}
                        clearcoatRoughness={0.2}
                        transparent
                        opacity={1}
                    />
                </mesh>

                {/* "H" embossed logo */}
                <mesh ref={logoRef} position={[0, 0, 0.82]} rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[0.2, 0.05, 16, 32]} />
                    <meshPhysicalMaterial
                        color={glowColor}
                        metalness={0.3}
                        roughness={0.4}
                        transparent
                        opacity={1}
                        emissive={glowColor}
                        emissiveIntensity={0.3}
                    />
                </mesh>

                {/* Inner glow ring */}
                <mesh ref={ringRef} position={[0, 0, 0]}>
                    <torusGeometry args={[0.85, 0.03, 16, 64]} />
                    <meshBasicMaterial
                        color={glowColor}
                        transparent
                        opacity={0.6}
                    />
                </mesh>
            </group>
        </FloatWrapper>
    );
}

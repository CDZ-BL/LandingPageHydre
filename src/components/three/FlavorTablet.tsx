'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Flavor, FLAVOR_DATA } from '@/lib/store';

interface FlavorTabletProps {
    flavor: Flavor;
    position: [number, number, number];
    taps: number;
    maxTaps: number;
    isCompleted: boolean;
    isSelected: boolean;
    onTap: () => void;
}

export function FlavorTablet({
    flavor,
    position,
    taps,
    maxTaps,
    isCompleted,
    isSelected,
    onTap,
}: FlavorTabletProps) {
    const tabletRef = useRef<THREE.Group>(null);
    const [hovered, setHovered] = useState(false);
    const [tapAnimation, setTapAnimation] = useState(0);

    const flavorInfo = FLAVOR_DATA[flavor];
    const progress = taps / maxTaps;
    const color = new THREE.Color(flavorInfo.color);
    const secondaryColor = new THREE.Color(flavorInfo.secondaryColor);

    // Animate on tap
    useEffect(() => {
        if (taps > 0) {
            setTapAnimation(1);
            const timer = setTimeout(() => setTapAnimation(0), 100);
            return () => clearTimeout(timer);
        }
    }, [taps]);

    // Animate rotation and dissolution
    useFrame((state) => {
        if (!tabletRef.current) return;

        // Gentle floating rotation
        tabletRef.current.rotation.y = state.clock.elapsedTime * 0.5;

        // Scale based on dissolution progress
        const baseScale = 1 - progress * 0.3;
        const tapScale = 1 - tapAnimation * 0.1;
        tabletRef.current.scale.setScalar(baseScale * tapScale * (hovered ? 1.1 : 1));

        // Shake when being tapped
        if (tapAnimation > 0) {
            tabletRef.current.position.x = position[0] + (Math.random() - 0.5) * 0.1;
            tabletRef.current.position.z = position[2] + (Math.random() - 0.5) * 0.1;
        } else {
            tabletRef.current.position.x = position[0];
            tabletRef.current.position.z = position[2];
        }
    });

    // Particle positions for dissolution effect
    const particles = useMemo(() => {
        const count = 50;
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = 0.3 + Math.random() * 0.5;

            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = r * Math.cos(phi);

            const particleColor = Math.random() > 0.5 ? color : secondaryColor;
            colors[i * 3] = particleColor.r;
            colors[i * 3 + 1] = particleColor.g;
            colors[i * 3 + 2] = particleColor.b;
        }

        return { positions, colors };
    }, [color, secondaryColor]);

    if (isCompleted) {
        // Show explosion particles
        return (
            <group position={position}>
                <points>
                    <bufferGeometry>
                        <bufferAttribute
                            attach="attributes-position"
                            count={50}
                            array={particles.positions}
                            itemSize={3}
                        />
                        <bufferAttribute
                            attach="attributes-color"
                            count={50}
                            array={particles.colors}
                            itemSize={3}
                        />
                    </bufferGeometry>
                    <pointsMaterial
                        size={0.15}
                        vertexColors
                        transparent
                        opacity={0.8}
                        sizeAttenuation
                        blending={THREE.AdditiveBlending}
                    />
                </points>
                <Text
                    position={[0, -1.5, 0]}
                    fontSize={0.3}
                    color="#4AE3B5"
                    anchorX="center"
                >
                    {flavorInfo.emoji} SELECTED!
                </Text>
            </group>
        );
    }

    return (
        <Float
            speed={2}
            rotationIntensity={0.3}
            floatIntensity={0.4}
        >
            <group
                ref={tabletRef}
                position={position}
                onClick={(e) => {
                    e.stopPropagation();
                    onTap();
                }}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                {/* Main tablet body */}
                <mesh>
                    <cylinderGeometry args={[0.6, 0.6, 0.25, 64]} />
                    <meshPhysicalMaterial
                        color={flavorInfo.color}
                        metalness={0.1}
                        roughness={0.2}
                        clearcoat={0.8}
                        clearcoatRoughness={0.1}
                        transparent
                        opacity={1 - progress * 0.5}
                        envMapIntensity={1.5}
                    />
                </mesh>

                {/* Top cap */}
                <mesh position={[0, 0.125, 0]}>
                    <sphereGeometry args={[0.6, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
                    <meshPhysicalMaterial
                        color={flavorInfo.color}
                        metalness={0.1}
                        roughness={0.2}
                        clearcoat={0.8}
                        transparent
                        opacity={1 - progress * 0.5}
                    />
                </mesh>

                {/* Bottom cap */}
                <mesh position={[0, -0.125, 0]} rotation={[Math.PI, 0, 0]}>
                    <sphereGeometry args={[0.6, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
                    <meshPhysicalMaterial
                        color={flavorInfo.color}
                        metalness={0.1}
                        roughness={0.2}
                        clearcoat={0.8}
                        transparent
                        opacity={1 - progress * 0.5}
                    />
                </mesh>

                {/* Inner glow */}
                <mesh>
                    <sphereGeometry args={[0.5, 32, 32]} />
                    <meshBasicMaterial
                        color={flavorInfo.secondaryColor}
                        transparent
                        opacity={0.3 + progress * 0.4}
                    />
                </mesh>

                {/* Progress ring */}
                <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                    <torusGeometry args={[0.75, 0.03, 16, 64, Math.PI * 2 * progress]} />
                    <meshBasicMaterial color="#4AE3B5" />
                </mesh>

                {/* Flavor label */}
                <Text
                    position={[0, -1, 0]}
                    fontSize={0.2}
                    color="#F5F0EB"
                    anchorX="center"
                    font="/fonts/PlusJakartaSans-Bold.woff"
                >
                    {flavorInfo.displayName}
                </Text>

                {/* Tap counter */}
                <Text
                    position={[0, -1.3, 0]}
                    fontSize={0.15}
                    color="#4AE3B5"
                    anchorX="center"
                >
                    {taps}/{maxTaps} taps
                </Text>
            </group>
        </Float>
    );
}

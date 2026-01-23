'use client';

import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

interface TabletModelProps {
    isExploding: boolean;
    explosionProgress: number;
}

export function TabletModel({ isExploding, explosionProgress }: TabletModelProps) {
    const tabletRef = useRef<THREE.Group>(null);
    const [hovered, setHovered] = useState(false);

    // Animate rotation
    useFrame((state) => {
        if (tabletRef.current && !isExploding) {
            tabletRef.current.rotation.y = state.clock.elapsedTime * 0.3;
            tabletRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
        }
    });

    // Calculate tablet opacity and scale based on explosion progress
    const tabletOpacity = isExploding ? Math.max(0, 1 - explosionProgress * 2) : 1;
    const tabletScale = isExploding
        ? 1 + explosionProgress * 0.5
        : hovered ? 1.05 : 1;

    return (
        <Float
            speed={2}
            rotationIntensity={0.5}
            floatIntensity={0.5}
            floatingRange={[-0.1, 0.1]}
        >
            <group
                ref={tabletRef}
                scale={tabletScale}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                {/* Main tablet body - cylindrical shape */}
                <mesh position={[0, 0, 0]}>
                    <cylinderGeometry args={[0.8, 0.8, 0.4, 64]} />
                    <meshPhysicalMaterial
                        color="#FFFAF0"
                        metalness={0.1}
                        roughness={0.3}
                        clearcoat={0.8}
                        clearcoatRoughness={0.2}
                        transparent
                        opacity={tabletOpacity}
                        envMapIntensity={1}
                    />
                </mesh>

                {/* Top rounded cap */}
                <mesh position={[0, 0.2, 0]}>
                    <sphereGeometry args={[0.8, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
                    <meshPhysicalMaterial
                        color="#FFFAF0"
                        metalness={0.1}
                        roughness={0.3}
                        clearcoat={0.8}
                        clearcoatRoughness={0.2}
                        transparent
                        opacity={tabletOpacity}
                    />
                </mesh>

                {/* Bottom rounded cap */}
                <mesh position={[0, -0.2, 0]} rotation={[Math.PI, 0, 0]}>
                    <sphereGeometry args={[0.8, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
                    <meshPhysicalMaterial
                        color="#FFFAF0"
                        metalness={0.1}
                        roughness={0.3}
                        clearcoat={0.8}
                        clearcoatRoughness={0.2}
                        transparent
                        opacity={tabletOpacity}
                    />
                </mesh>

                {/* "H" embossed logo */}
                <mesh position={[0, 0, 0.82]} rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[0.2, 0.05, 16, 32]} />
                    <meshPhysicalMaterial
                        color="#FF6B35"
                        metalness={0.3}
                        roughness={0.4}
                        transparent
                        opacity={tabletOpacity}
                    />
                </mesh>

                {/* Inner glow ring */}
                <mesh position={[0, 0, 0]}>
                    <torusGeometry args={[0.85, 0.03, 16, 64]} />
                    <meshBasicMaterial
                        color="#FF6B35"
                        transparent
                        opacity={tabletOpacity * 0.6}
                    />
                </mesh>
            </group>
        </Float>
    );
}


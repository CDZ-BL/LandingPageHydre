'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleSystemProps {
    isActive: boolean;
    progress: number;
}

// Ingredient data for particles
const ingredients = [
    { name: 'Mg', color: '#FF6B35', size: 0.15 },  // Magnesium - Orange
    { name: 'K', color: '#00D4FF', size: 0.12 },   // Potassium - Blue
    { name: 'Na', color: '#FFD700', size: 0.13 },  // Sodium - Gold
    { name: 'Ca', color: '#FFFFFF', size: 0.11 },  // Calcium - White
    { name: 'Zn', color: '#C0C0C0', size: 0.10 },  // Zinc - Silver
    { name: 'B6', color: '#90EE90', size: 0.09 },  // Vitamin B6 - Green
];

export function ParticleSystem({ isActive, progress }: ParticleSystemProps) {
    const particlesRef = useRef<THREE.Points>(null);
    const particleCount = 200;

    // Generate particle positions and properties
    const { positions, colors, sizes, velocities } = useMemo(() => {
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

        return { positions, colors, sizes, velocities };
    }, []);

    // Animate particles
    useFrame((state, delta) => {
        if (!particlesRef.current || !isActive) return;

        const positionAttribute = particlesRef.current.geometry.attributes.position;
        const posArray = positionAttribute.array as Float32Array;

        for (let i = 0; i < particleCount; i++) {
            // Move particles outward based on their velocity
            posArray[i * 3] += velocities[i * 3] * delta * progress;
            posArray[i * 3 + 1] += velocities[i * 3 + 1] * delta * progress;
            posArray[i * 3 + 2] += velocities[i * 3 + 2] * delta * progress;

            // Add slight gravity effect
            posArray[i * 3 + 1] -= 0.5 * delta * progress;

            // Add swirl effect
            const angle = state.clock.elapsedTime * 0.5;
            posArray[i * 3] += Math.sin(angle + i) * 0.01;
            posArray[i * 3 + 2] += Math.cos(angle + i) * 0.01;
        }

        positionAttribute.needsUpdate = true;
    });

    if (!isActive) return null;

    return (
        <points ref={particlesRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particleCount}
                    array={positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={particleCount}
                    array={colors}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-size"
                    count={particleCount}
                    array={sizes}
                    itemSize={1}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.1}
                vertexColors
                transparent
                opacity={1 - progress * 0.5}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
}

// Floating ingredient labels that appear during explosion
interface IngredientLabelProps {
    isVisible: boolean;
}

export function IngredientLabels({ isVisible }: IngredientLabelProps) {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (groupRef.current && isVisible) {
            groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
        }
    });

    if (!isVisible) return null;

    const labelPositions = [
        { pos: [2, 1, 0], label: 'Mg', color: '#FF6B35' },
        { pos: [-2, 0.5, 1], label: 'K', color: '#00D4FF' },
        { pos: [1.5, -1, 1.5], label: 'Na', color: '#FFD700' },
        { pos: [-1.5, 1.5, -1], label: 'Ca', color: '#FFFFFF' },
        { pos: [0.5, -1.5, -2], label: 'Zn', color: '#C0C0C0' },
        { pos: [-1, -0.5, 2], label: 'B6', color: '#90EE90' },
    ];

    return (
        <group ref={groupRef}>
            {labelPositions.map((item, index) => (
                <mesh key={index} position={item.pos as [number, number, number]}>
                    <sphereGeometry args={[0.2, 32, 32]} />
                    <meshBasicMaterial color={item.color} transparent opacity={0.8} />
                </mesh>
            ))}
        </group>
    );
}

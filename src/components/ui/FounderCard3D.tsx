'use client';

import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { getAssetPath } from '@/lib/utils';

function TexturedCard() {
    const cardRef = useRef<THREE.Mesh>(null);

    // Load the texture
    const texture = useTexture(getAssetPath('/images/cartemembre.png'));
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.flipY = true; // Flip to show right-side up

    // Card dimensions (credit card ratio is roughly 85.6mm × 53.98mm = 1.586:1)
    const cardWidth = 3.2;
    const cardHeight = 2;
    const cardDepth = 0.05;

    // Gentle floating animation
    useFrame((state) => {
        if (cardRef.current) {
            cardRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
            cardRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1 - 0.1;
            cardRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
        }
    });

    return (
        <mesh ref={cardRef} castShadow receiveShadow>
            <boxGeometry args={[cardWidth, cardHeight, cardDepth]} />
            {/* Front face with texture */}
            <meshStandardMaterial
                map={texture}
                metalness={0.6}
                roughness={0.3}
                attach="material-4" // Front face
            />
            {/* Back face with texture (flipped) */}
            <meshStandardMaterial
                map={texture}
                metalness={0.6}
                roughness={0.3}
                attach="material-5" // Back face
            />
            {/* Side faces - dark metallic */}
            <meshStandardMaterial
                color="#0a0a0a"
                metalness={0.9}
                roughness={0.1}
                attach="material-0" // Right
            />
            <meshStandardMaterial
                color="#0a0a0a"
                metalness={0.9}
                roughness={0.1}
                attach="material-1" // Left
            />
            <meshStandardMaterial
                color="#0a0a0a"
                metalness={0.9}
                roughness={0.1}
                attach="material-2" // Top
            />
            <meshStandardMaterial
                color="#0a0a0a"
                metalness={0.9}
                roughness={0.1}
                attach="material-3" // Bottom
            />
        </mesh>
    );
}

export function FounderCard3D() {
    return (
        <div className="relative w-full h-full">
            {/* Cold Glow Shadow */}
            <div
                className="absolute inset-0 blur-3xl opacity-30 -z-10"
                style={{
                    background: 'radial-gradient(ellipse at center, rgba(0, 200, 255, 0.3) 0%, transparent 70%)',
                    transform: 'scale(1.2)',
                }}
            />

            <Canvas
                camera={{ position: [0, 0, 5], fov: 45 }}
                style={{ background: 'transparent' }}
                gl={{ antialias: true, alpha: true }}
            >
                {/* Lighting - front and back for both sides */}
                <ambientLight intensity={1.2} />
                {/* Front lights */}
                <directionalLight position={[5, 5, 5]} intensity={2} />
                <directionalLight position={[-5, 3, 5]} intensity={1} color="#00ccff" />
                <pointLight position={[0, 0, 4]} intensity={1.5} />
                {/* Back lights */}
                <directionalLight position={[5, 5, -5]} intensity={2} />
                <directionalLight position={[-5, 3, -5]} intensity={1} color="#00ccff" />
                <pointLight position={[0, 0, -4]} intensity={1.5} />

                <Suspense fallback={null}>
                    <TexturedCard />
                </Suspense>

                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    autoRotate={false}
                    maxPolarAngle={Math.PI / 1.5}
                    minPolarAngle={Math.PI / 3}
                />
            </Canvas>
        </div>
    );
}

'use client';

import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { getAssetPath } from '@/lib/utils';

function CardModel() {
    const groupRef = useRef<THREE.Group>(null);
    const { scene } = useGLTF(getAssetPath('/models/cardmodel.glb'));

    // Levitation animation — slow, organic float
    useFrame((state) => {
        if (groupRef.current) {
            const t = state.clock.elapsedTime;
            groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.3;
            groupRef.current.rotation.x = Math.sin(t * 0.3) * 0.08 - 0.05;
            groupRef.current.position.y = Math.sin(t * 0.8) * 0.08;
        }
    });

    return (
        <group ref={groupRef}>
            <primitive object={scene} scale={62.5} />
        </group>
    );
}

export function FounderCard3D() {
    return (
        <div className="relative w-full h-full overflow-visible">
            {/* Levitation glow — intense multi-layer */}
            <div className="absolute inset-0 -z-10 pointer-events-none" style={{ transform: 'scale(1.6)' }}>
                {/* Core glow — bright cyan center */}
                <div
                    className="absolute inset-0 blur-[80px] opacity-70"
                    style={{
                        background: 'radial-gradient(circle at 50% 55%, rgba(0, 220, 255, 0.5) 0%, transparent 50%)',
                    }}
                />
                {/* Mid glow — wider spread */}
                <div
                    className="absolute inset-0 blur-[120px] opacity-50"
                    style={{
                        background: 'radial-gradient(ellipse at 50% 60%, rgba(0, 150, 255, 0.35) 0%, transparent 60%)',
                    }}
                />
                {/* Ground reflection — beneath the card */}
                <div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1/3 blur-[60px] opacity-40"
                    style={{
                        background: 'radial-gradient(ellipse at center, rgba(0, 220, 255, 0.6) 0%, transparent 70%)',
                    }}
                />
            </div>

            {/* Pulsing ambient ring */}
            <div
                className="absolute inset-0 -z-10 pointer-events-none animate-pulse"
                style={{
                    background: 'radial-gradient(circle at 50% 50%, rgba(0, 180, 255, 0.08) 0%, transparent 40%)',
                    transform: 'scale(2)',
                    animationDuration: '3s',
                }}
            />

            <Canvas
                camera={{ position: [0, 0, 8], fov: 40 }}
                style={{ background: 'transparent' }}
                gl={{ antialias: true, alpha: true }}
            >
                {/* Ambient base — low to let directional lights sculpt */}
                <ambientLight intensity={0.6} />

                {/* Key light — strong warm from top-right for specular highlights */}
                <directionalLight position={[4, 6, 5]} intensity={4} color="#fff5e6" />

                {/* Fill light — cool blue from left */}
                <directionalLight position={[-5, 2, 4]} intensity={2} color="#a0c4ff" />

                {/* Rim lights — cyan halo on edges for premium silhouette */}
                <spotLight
                    position={[4, 0, -5]}
                    intensity={8}
                    color="#00ccff"
                    angle={0.5}
                    penumbra={0.8}
                />
                <spotLight
                    position={[-4, 0, -5]}
                    intensity={8}
                    color="#00ccff"
                    angle={0.5}
                    penumbra={0.8}
                />

                {/* Top spotlight — makes card surface pop */}
                <spotLight
                    position={[0, 8, 2]}
                    intensity={5}
                    color="#ffffff"
                    angle={0.4}
                    penumbra={1}
                    castShadow
                />

                {/* Under-glow — levitation light bouncing from below */}
                <pointLight position={[0, -4, 2]} intensity={3} color="#00aaff" />

                {/* Front fill — so the face is always readable */}
                <pointLight position={[0, 0, 5]} intensity={1.5} color="#e0f0ff" />

                <Suspense fallback={null}>
                    <CardModel />
                </Suspense>

                {/* Contact shadow — grounds the levitation illusion */}
                <ContactShadows
                    position={[0, -1.5, 0]}
                    opacity={0.4}
                    scale={8}
                    blur={2.5}
                    far={4}
                    color="#00ccff"
                />

                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    autoRotate={false}
                    target={[0, 0, 0]}
                    minPolarAngle={0}
                    maxPolarAngle={Math.PI}
                />
            </Canvas>
        </div>
    );
}

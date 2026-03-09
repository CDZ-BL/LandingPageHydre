'use client';

import { useRef, Suspense, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, ContactShadows, TrackballControls } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { getAssetPath } from '@/lib/utils';

// Only preload on desktop — avoids 4.7MB GLB download on mobile
if (typeof window !== 'undefined' && window.innerWidth >= 768) {
    useGLTF.preload(getAssetPath('/models/cardmodel.glb'));
}

// ═══════════════════════════════════════════════════════════════
// CARD MODEL
// Default rotation: 90° on Y → card shows edge-on at first load
// Levitation on Y only — rotation is free via TrackballControls
// ═══════════════════════════════════════════════════════════════
function CardModel() {
    const groupRef = useRef<THREE.Group>(null);
    const { scene } = useGLTF(getAssetPath('/models/cardmodel.glb'));

    useFrame((state) => {
        if (!groupRef.current) return;
        const t = state.clock.elapsedTime;
        groupRef.current.position.y = Math.sin(t * 0.8) * 0.08;
    });

    return (
        <group ref={groupRef} rotation={[Math.PI / 2, 0, 0]}>
            <primitive object={scene} scale={62.5} />
        </group>
    );
}

// ═══════════════════════════════════════════════════════════════
// MOBILE STATIC FALLBACK — zero JS weight, no GLB download
// ═══════════════════════════════════════════════════════════════
function FounderCardStatic() {
    return (
        <div className="relative w-full h-full flex items-center justify-center">
            {/* Ambient glow */}
            <div
                className="absolute inset-0 pointer-events-none blur-[80px] opacity-50"
                style={{ background: 'radial-gradient(circle at 50% 55%, rgba(0,220,255,0.4) 0%, transparent 60%)' }}
            />
            {/* Card shape */}
            <motion.div
                className="relative w-[280px] aspect-[1.586/1] rounded-xl overflow-hidden"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, ease: 'easeInOut', repeat: Infinity }}
                style={{
                    background: 'linear-gradient(135deg, rgba(0,220,255,0.12) 0%, rgba(0,80,140,0.08) 50%, rgba(0,0,0,0.6) 100%)',
                    border: '1px solid rgba(0,220,255,0.25)',
                    boxShadow: '0 0 40px rgba(0,220,255,0.15), 0 0 80px rgba(0,150,255,0.08)',
                }}
            >
                {/* Scan line */}
                <motion.div
                    className="absolute left-0 right-0 h-[1px]"
                    style={{
                        background: 'linear-gradient(90deg, transparent, rgba(0,220,255,0.8) 50%, transparent)',
                        boxShadow: '0 0 8px rgba(0,220,255,0.4)',
                    }}
                    animate={{ top: ['-2%', '102%'] }}
                    transition={{ duration: 3, ease: 'linear', repeat: Infinity, repeatDelay: 2 }}
                />
                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-start justify-end p-6">
                    <p className="font-mono text-[9px] text-cyan-400/60 tracking-widest mb-1">SMART NUTRITION</p>
                    <p className="font-headline text-white font-bold text-lg tracking-wide">FONDATEUR</p>
                    <p className="font-mono text-[10px] text-white/30 tracking-wider mt-1">ACCÈS ANTICIPÉ · AN 1</p>
                </div>
                {/* Grid overlay */}
                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(0,220,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,220,255,1) 1px, transparent 1px)',
                        backgroundSize: '30px 30px',
                    }}
                />
            </motion.div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
export function FounderCard3D() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
        const onResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', onResize, { passive: true });
        return () => window.removeEventListener('resize', onResize);
    }, []);

    // On mobile: static CSS card — no GLB, no WebGL context
    if (isMobile) return <FounderCardStatic />;

    return (
        <div className="relative w-full h-full overflow-visible">
            {/* Levitation glow — multi-layer */}
            <div className="absolute inset-0 -z-10 pointer-events-none" style={{ transform: 'scale(1.6)' }}>
                <div
                    className="absolute inset-0 blur-[80px] opacity-70"
                    style={{
                        background: 'radial-gradient(circle at 50% 55%, rgba(0, 220, 255, 0.5) 0%, transparent 50%)',
                    }}
                />
                <div
                    className="absolute inset-0 blur-[120px] opacity-50"
                    style={{
                        background: 'radial-gradient(ellipse at 50% 60%, rgba(0, 150, 255, 0.35) 0%, transparent 60%)',
                    }}
                />
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

            {/* Holographic scan line */}
            <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
                <motion.div
                    className="absolute left-0 right-0 h-[1px]"
                    style={{
                        background:
                            'linear-gradient(90deg, transparent 0%, rgba(0,220,255,0.5) 25%, rgba(0,220,255,0.9) 50%, rgba(0,220,255,0.5) 75%, transparent 100%)',
                        boxShadow: '0 0 8px rgba(0,220,255,0.5), 0 0 24px rgba(0,220,255,0.15)',
                    }}
                    animate={{ top: ['-2%', '102%'] }}
                    transition={{ duration: 3.5, ease: 'linear', repeat: Infinity, repeatDelay: 2 }}
                />
            </div>



            {/* Camera at z=11 + fov 38 — no clipping at any rotation angle */}
            <Canvas
                camera={{ position: [0, 0, 11], fov: 38 }}
                style={{ background: 'transparent' }}
                gl={{ antialias: true, alpha: true }}
            >
                <ambientLight intensity={0.6} />
                <directionalLight position={[4, 6, 5]} intensity={4} color="#fff5e6" />
                <directionalLight position={[-5, 2, 4]} intensity={2} color="#a0c4ff" />
                {/* Strong frontal fill — lights the card face from camera direction */}
                <directionalLight position={[0, 0, 8]} intensity={3} color="#e8f0ff" />
                <directionalLight position={[0, -6, 5]} intensity={2.5} color="#ffffff" />
                <spotLight position={[4, 0, -5]} intensity={8} color="#00ccff" angle={0.5} penumbra={0.8} />
                <spotLight position={[-4, 0, -5]} intensity={8} color="#00ccff" angle={0.5} penumbra={0.8} />
                <spotLight position={[0, 8, 2]} intensity={5} color="#ffffff" angle={0.4} penumbra={1} castShadow />
                <pointLight position={[0, -4, 2]} intensity={3} color="#00aaff" />
                <pointLight position={[0, 0, 5]} intensity={3} color="#e0f0ff" />

                <Suspense fallback={null}>
                    <CardModel />
                </Suspense>

                <ContactShadows
                    position={[0, -1.5, 0]}
                    opacity={0.4}
                    scale={8}
                    blur={2.5}
                    far={4}
                    color="#00ccff"
                />

                {/* TrackballControls: true free rotation on X/Y/Z — no polar lock, no gimbal */}
                <TrackballControls
                    noZoom
                    noPan
                    rotateSpeed={2.5}
                />
            </Canvas>
        </div>
    );
}

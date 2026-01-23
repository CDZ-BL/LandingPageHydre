'use client';

import { useState, useRef, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment } from '@react-three/drei';

interface Ingredient {
    id: string;
    name: string;
    amount: string;
    purpose: string;
}

const INGREDIENTS: Ingredient[] = [
    {
        id: 'sodium',
        name: 'SODIUM',
        amount: '1200 MG',
        purpose: 'Maintien hydratation cellulaire'
    },
    {
        id: 'potassium',
        name: 'POTASSIUM',
        amount: '1000 MG',
        purpose: 'Équilibre électrolytique'
    },
    {
        id: 'magnesium',
        name: 'MAGNÉSIUM',
        amount: '500 MG',
        purpose: 'Fonction musculaire optimale'
    }
];

function ProductModel3D({ xrayMode, autoRotate }: { xrayMode: boolean; autoRotate: boolean }) {
    const meshRef = useRef<any>();
    const { scene, materials } = useGLTF('/images/tubeent.glb');

    useFrame((state, delta) => {
        if (meshRef.current && autoRotate) {
            meshRef.current.rotation.y += delta * 0.2;
        }
    });

    // Apply transparency in X-Ray mode
    if (materials && xrayMode) {
        Object.values(materials).forEach((material: any) => {
            material.transparent = true;
            material.opacity = 0.3;
        });
    } else if (materials) {
        Object.values(materials).forEach((material: any) => {
            material.transparent = false;
            material.opacity = 1;
        });
    }

    return (
        <primitive
            ref={meshRef}
            object={scene}
            scale={3}
            position={[0, 0, 0]}
            rotation={[Math.PI / 2, 0, 0]}
        />
    );
}

export function Visualizer3D() {
    const [xrayMode, setXrayMode] = useState(false);
    const [autoRotate, setAutoRotate] = useState(true);
    const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);

    return (
        <section id="visualizer" className="relative py-32 bg-void overflow-hidden">
            {/* Grid background */}
            <div
                className="absolute inset-0 opacity-5"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px',
                }}
            />

            <div className="relative z-10 w-[85%] max-w-[1600px] mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-12"
                >
                    <span className="font-data text-neon-orange text-sm font-bold tracking-wider">ANALYSE FORMULE</span>
                    <h2 className="font-display text-4xl md:text-5xl text-white mt-2 mb-4">
                        VISUALISEUR 3D
                    </h2>
                    <p className="font-sans text-white max-w-2xl mx-auto">
                        Explorez le produit en détail. Rotation 360°, mode X-Ray pour visualiser la formulation.
                    </p>
                </motion.div>

                {/* 3D Viewer Container */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="border border-void-300 bg-void relative"
                >
                    {/* HUD Corners */}
                    <div className="absolute inset-4 pointer-events-none z-20">
                        <div className="hud-corner hud-corner-tl border-neon-orange" />
                        <div className="hud-corner hud-corner-tr border-neon-orange" />
                        <div className="hud-corner hud-corner-bl border-neon-orange" />
                        <div className="hud-corner hud-corner-br border-neon-orange" />
                    </div>

                    {/* Top HUD */}
                    <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-20 pointer-events-none">
                        <div className="font-data text-white text-xs">
                            <span className="block">MODE: {xrayMode ? 'X-RAY' : 'NORMAL'}</span>
                            <span className="block text-neon-orange">ROTATION: {autoRotate ? 'AUTO' : 'MANUEL'}</span>
                        </div>
                        <div className="font-data text-right text-white text-xs">
                            <span className="block">AETHER</span>
                            <span className="block text-white">FORMULE V1.0</span>
                        </div>
                    </div>

                    {/* 3D Canvas */}
                    <div className="h-[600px] relative">
                        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                            <Suspense fallback={null}>
                                <ambientLight intensity={0.6} />
                                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
                                <pointLight position={[-10, -10, -10]} intensity={0.5} />
                                <ProductModel3D xrayMode={xrayMode} autoRotate={autoRotate} />
                                <Environment preset="sunset" />
                                <OrbitControls
                                    enableZoom={true}
                                    enablePan={false}
                                    autoRotate={false}
                                    minDistance={3}
                                    maxDistance={8}
                                />
                            </Suspense>
                        </Canvas>

                        {/* X-Ray Mode Ingredient Hotspots */}
                        {xrayMode && (
                            <div className="absolute inset-0 pointer-events-none">
                                {INGREDIENTS.map((ingredient, i) => (
                                    <motion.div
                                        key={ingredient.id}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="absolute pointer-events-auto cursor-pointer"
                                        style={{
                                            top: `${30 + i * 20}%`,
                                            left: i % 2 === 0 ? '10%' : '70%',
                                        }}
                                        onClick={() => setSelectedIngredient(ingredient)}
                                    >
                                        <div className="relative">
                                            <div className="w-3 h-3 rounded-full bg-neon-orange animate-pulse" />
                                            <div className="absolute left-6 top-0 whitespace-nowrap bg-void/90 border border-neon-orange px-3 py-1">
                                                <span className="font-data text-xs text-neon-orange font-semibold">
                                                    {ingredient.amount} · {ingredient.name}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Controls Panel */}
                    <div className="absolute bottom-6 left-6 right-6 z-20 flex justify-between items-center gap-4">
                        <div className="flex gap-3">
                            <button
                                onClick={() => setXrayMode(!xrayMode)}
                                className={`px-6 py-3 border font-data text-xs tracking-wider transition-all
                                    ${xrayMode
                                        ? 'border-neon-orange bg-neon-orange text-black'
                                        : 'border-void-300 text-white hover:border-neon-orange'
                                    }`}
                            >
                                MODE X-RAY
                            </button>
                            <button
                                onClick={() => setAutoRotate(!autoRotate)}
                                className={`px-6 py-3 border font-data text-xs tracking-wider transition-all
                                    ${autoRotate
                                        ? 'border-neon-orange bg-neon-orange text-black'
                                        : 'border-void-300 text-white hover:border-neon-orange'
                                    }`}
                            >
                                AUTO-ROTATION
                            </button>
                        </div>
                        <div className="font-data text-xs text-white">
                            <span className="hidden md:inline">GLISSER POUR PIVOTER · SCROLL POUR ZOOM</span>
                        </div>
                    </div>
                </motion.div>

                {/* Ingredient Detail Panel */}
                {selectedIngredient && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 border border-neon-orange bg-void p-8"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <span className="font-data text-neon-orange text-sm font-bold">{selectedIngredient.amount}</span>
                                <h3 className="font-display text-2xl text-white mt-1">{selectedIngredient.name}</h3>
                            </div>
                            <button
                                onClick={() => setSelectedIngredient(null)}
                                className="font-data text-white hover:text-neon-orange transition-colors"
                            >
                                ✕
                            </button>
                        </div>
                        <p className="font-sans text-white">
                            {selectedIngredient.purpose}
                        </p>
                    </motion.div>
                )}
            </div>
        </section>
    );
}

'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { getAssetPath } from '@/lib/utils';

export function FounderStatus() {
    const cardRef = useRef<HTMLDivElement>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    // Handle 3D tilt effect on mouse move
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        setMousePosition({ x, y });
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => {
        setIsHovered(false);
        setMousePosition({ x: 0.5, y: 0.5 });
    };

    // Calculate 3D rotation based on mouse position
    const rotateX = isHovered ? (mousePosition.y - 0.5) * -15 : 0;
    const rotateY = isHovered ? (mousePosition.x - 0.5) * 15 : 0;

    return (
        <section
            className="relative py-32 md:py-40 overflow-hidden"
            style={{
                background: `radial-gradient(ellipse at center, #111111 0%, #050505 50%, #050505 100%)`
            }}
        >
            <div className="relative z-10 w-[85%] max-w-[1200px] mx-auto">
                {/* Tagline */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-8"
                >
                    <span className="font-mono text-cyan-400 text-xs tracking-widest">
                        // BATCH 001 EXCLUSIVE
                    </span>
                </motion.div>

                {/* Headline */}
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="font-sans text-3xl md:text-5xl lg:text-6xl text-white font-bold tracking-tight text-center mb-8"
                >
                    CECI N'EST PAS UNE CARTE DE FIDÉLITÉ.
                </motion.h2>

                {/* Card with 3D Tilt and Sheen Effect */}
                <motion.div
                    ref={cardRef}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    onMouseMove={handleMouseMove}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    className="relative mx-auto mb-16 max-w-2xl cursor-pointer"
                    style={{
                        perspective: '1000px',
                    }}
                >
                    <motion.div
                        animate={{
                            rotateX,
                            rotateY,
                        }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="relative"
                        style={{
                            transformStyle: 'preserve-3d',
                        }}
                    >
                        {/* Cold Glow Shadow */}
                        <div
                            className="absolute inset-0 blur-3xl opacity-30"
                            style={{
                                background: 'radial-gradient(ellipse at center, rgba(0, 200, 255, 0.3) 0%, transparent 70%)',
                                transform: 'translateZ(-50px) scale(1.2)',
                            }}
                        />

                        {/* Card Image */}
                        <div className="relative w-full aspect-[1.6/1] overflow-hidden rounded-lg">
                            <Image
                                src={getAssetPath('/images/cartemembre.png')}
                                alt="AETHER Founder Card - Titanium Black"
                                fill
                                className="object-contain"
                            />

                            {/* Metallic Sheen Effect */}
                            <motion.div
                                className="absolute inset-0 pointer-events-none"
                                initial={{ x: '-100%' }}
                                animate={{
                                    x: isHovered ? '200%' : '-100%'
                                }}
                                transition={{
                                    duration: 0.8,
                                    ease: 'easeInOut'
                                }}
                                style={{
                                    background: 'linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.1) 55%, transparent 100%)',
                                    width: '50%',
                                }}
                            />
                        </div>
                    </motion.div>
                </motion.div>

                {/* Body Text */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="text-center mb-12"
                >
                    <p className="font-sans text-lg md:text-xl text-[#E0E0E0] leading-relaxed max-w-2xl mx-auto">
                        L'accès au Batch 001 vous octroie le rang de <span className="text-white font-semibold">Membre Fondateur</span>.
                        <br />
                        Cette carte en Titanium Black physique certifie votre position dans la hiérarchie AETHER.
                        <br />
                        <span className="text-cyan-400">Elle est votre clé pour le futur.</span>
                    </p>
                </motion.div>

                {/* Features List - Terminal Style */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="max-w-xl mx-auto mb-16"
                >
                    <div className="border border-void-300 bg-void/50 backdrop-blur-sm p-6 md:p-8">
                        <div className="space-y-4 font-mono text-sm md:text-base">
                            <div className="flex items-start gap-3">
                                <span className="text-cyan-400">[&gt;]</span>
                                <span className="text-[#E0E0E0]">ACCÈS PRIORITAIRE AUX FUTURS DROPS (24H AVANT LE PUBLIC)</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-cyan-400">[&gt;]</span>
                                <span className="text-[#E0E0E0]">DROIT DE VOTE SUR LES PROTOCOLES R&D</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-cyan-400">[&gt;]</span>
                                <span className="text-[#E0E0E0]">CANAL DE COMMUNICATION PRIVÉ</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* CTA Button */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="text-center"
                >
                    <button className="group relative px-10 py-5 bg-transparent border-2 border-white text-white font-mono text-sm tracking-widest uppercase transition-all duration-300 hover:bg-white hover:text-black">
                        {/* Corner accents for military style */}
                        <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
                        <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
                        <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
                        <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />
                        RÉCLAMER MON IDENTIFIANT
                    </button>

                    {/* Subtext */}
                    <p className="mt-4 font-mono text-xs text-cyan-400/80 tracking-wider">
                        Seulement <span className="text-white font-semibold">42/1000</span> restants.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}

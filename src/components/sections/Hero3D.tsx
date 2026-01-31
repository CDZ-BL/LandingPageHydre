'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { getAssetPath } from '@/lib/utils';

export function HeroVoid() {
    const [isXray, setIsXray] = useState(false);

    // X-ray blink effect: every 5 seconds, show X-ray for 0.5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setIsXray(true);
            setTimeout(() => setIsXray(false), 300); // 0.3 second blink
        }, 5000); // Every 5 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative min-h-screen bg-void text-white overflow-hidden flex items-center justify-center">
            {/* Layer 1: Grid overlay - technical aesthetic */}
            <div
                className="absolute inset-0 opacity-5 z-0"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px',
                }}
            />

            {/* Layer 2: Black Matte Tube Image with X-ray Blink */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 flex items-center justify-center overflow-hidden z-0"
            >
                {/* Container for tube - MASSIVE SIZE to dominate hero */}
                <div
                    className="relative"
                    style={{
                        width: '115rem',
                        height: '115rem',
                        maxWidth: '100vw',
                        maxHeight: '120vh'
                    }}
                >
                    {/* Static glow - NO ANIMATION */}
                    <div
                        className="absolute inset-0 z-[-1] pointer-events-none"
                        style={{
                            background: 'radial-gradient(circle at center, rgba(255,215,0,0.12) 0%, transparent 60%)',
                            filter: 'blur(60px)',
                        }}
                    />

                    {/* Normal tube image */}
                    <Image
                        src={getAssetPath('/images/blackmatetubetrans.png')}
                        alt="AETHER System"
                        fill
                        className={`object-contain transition-opacity duration-150 ${isXray ? 'opacity-0' : 'opacity-100'}`}
                        priority
                        sizes="(max-width: 768px) 90vw, 40rem"
                        style={{
                            filter: 'drop-shadow(0 0 30px rgba(255,255,255,0.3)) brightness(1.2)'
                        }}
                    />

                    {/* X-ray - CSS transition only, no Framer Motion */}
                    <Image
                        src={getAssetPath('/images/backmatetubexraytrans.png')}
                        alt="AETHER System X-Ray"
                        fill
                        className={`object-contain transition-opacity duration-150 ${isXray ? 'opacity-100' : 'opacity-0'}`}
                        sizes="(max-width: 768px) 90vw, 40rem"
                        style={{
                            filter: 'brightness(1.1)',
                        }}
                    />
                </div>
            </motion.div>

            {/* Layer 3: Dark overlay for text contrast */}
            <div className="absolute inset-0 bg-gradient-to-b from-void/30 via-void/60 to-void z-10" />

            {/* Layer 4: Status Bar - Top (below fixed header) */}
            <div className="absolute top-8 left-8 right-8 flex justify-between items-start z-30">
                <div className="font-mono text-white text-xs tracking-wider">
                    <span className="block">AETHER [LABS]</span>
                    <span className="block text-white mt-1">BATCH 001</span>
                </div>
                <div className="font-mono text-right text-xs tracking-wider">
                    <span className="block text-white">STATUS</span>
                    <span className="block text-neon-orange font-semibold mt-1">AVAILABLE</span>
                </div>
            </div>

            {/* Layer 5: Main Content - Text on top */}
            <div className="relative z-20 flex-1 flex items-center justify-center px-4">
                <div className="text-center max-w-5xl mx-auto">
                    {/* Headline */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="mb-8"
                    >
                        <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl text-white font-bold tracking-tight mb-6">
                            ARCHITECTURE CELLULAIRE.
                            <br />
                            <span className="text-[#E6DCC8] italic font-light tracking-wide">CONÇUE AVEC VOUS.</span>
                        </h1>
                        <p className="font-sans text-lg md:text-xl text-white max-w-3xl mx-auto leading-relaxed tracking-wide">
                            Le premier système d'hydratation qui investit dans votre biologie, pas dans votre attention.
                            <br />
                            <span className="text-white/60 text-base mt-2 block">Performance Hydrique V1.0 · Zéro Sucre · Co-développé par le Cercle Fondateur.</span>
                        </p>
                    </motion.div>

                    {/* CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="space-y-3"
                    >
                        <button className="px-12 py-5 bg-white text-black font-sans text-sm font-semibold tracking-widest hover:bg-amber-400 hover:text-black transition-all duration-300 border border-white hover:border-amber-400">
                            REJOINDRE L'ALLIANCE
                        </button>
                        <p className="font-mono text-xs text-amber-500/80 tracking-wider">
                            Alliance Ouverte · Batch V1.0
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { getAssetPath } from '@/lib/utils';

export function HeroVoid() {
    const [isXray, setIsXray] = useState(false);

    // X-ray blink effect: every 3 seconds, show X-ray for 0.5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setIsXray(true);
            setTimeout(() => setIsXray(false), 300); // 0.3 second blink
        }, 3000); // Every 3 seconds

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
                <div className="relative z-10 flex flex-col items-center justify-center min-h-[60vh] text-center px-4">

                    {/* 1. LE TITRE MASSIF */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white leading-[0.95] mb-6"
                    >
                        L'HYDRATATION <br /> ÉPURÉE.
                        <span className="text-[#E6DCC8] italic font-light tracking-normal block text-2xl md:text-4xl mt-3">
                            CONÇUE AVEC VOUS.
                        </span>
                    </motion.h1>

                    {/* 2. LE MANIFESTE */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="text-lg md:text-xl text-white/60 font-light tracking-wide mb-10"
                    >
                        Pour vous. Pas pour le marketing.
                    </motion.p>

                    {/* 3. L'ACTION */}
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="bg-white text-black font-bold px-8 py-4 rounded-sm hover:bg-[#E6DCC8] transition-colors duration-300 tracking-widest text-xs md:text-sm uppercase"
                    >
                        REJOINDRE L'ALLIANCE
                    </motion.button>

                    {/* 4. ANCRAGE TECHNIQUE (DISCRET) */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        className="absolute bottom-4 flex gap-4 text-[10px] md:text-xs font-mono text-white/20 uppercase tracking-widest"
                    >
                        <span>[ BATCH V1.0 ]</span>
                        <span>•</span>
                        <span>ZÉRO SUCRE</span>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}

'use client';

import { Scene3D } from '@/components/three/Scene/Scene';
import { motion, useScroll, useTransform } from 'framer-motion';

// --- HERO ---
export function HeroVoid() {
    const { scrollY } = useScroll();
    const textY = useTransform(scrollY, [0, 500], [0, -100]);

    // We remove videoRef logic as video is gone
    // Keeping useEffect empty for now or removing it entirely if unused
    // Actually, videoRef was used for playbackRate. Since we remove video, we can remove the ref and effect.

    return (
        <section className="relative h-screen bg-void text-white overflow-hidden">
            {/* Product 3D Scene - Replaces Video */}
            <div className="absolute top-0 right-0 bottom-0 w-1/2 z-0 flex items-center justify-center">
                <Scene3D className="w-full h-full" />
            </div>

            {/* Gradient */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-void via-void/80 to-transparent z-[2]" />

            {/* Status bar */}
            <div className="absolute top-8 left-8 right-8 flex justify-between items-start z-30 mix-blend-difference">
                <div className="font-mono text-white text-xs tracking-wider opacity-80">
                    <span className="block">AETHER [LABS]</span>
                    <span className="block mt-1">BATCH 001</span>
                </div>
                <div className="font-mono text-right text-xs tracking-wider opacity-80">
                    <span className="block">STATUS</span>
                    <span className="block text-neon-orange font-semibold mt-1 animate-pulse">AVAILABLE</span>
                </div>
            </div>

            {/* LEFT TEXT */}
            <motion.div style={{ y: textY }} className="relative z-20 h-full flex flex-col items-start justify-center pl-8 md:pl-16 lg:pl-24 max-w-xl">
                <motion.h1
                    initial={{ opacity: 0, x: -40, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    className="font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white leading-[0.95] mb-8"
                >
                    L'HYDRATATION <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">ÉPURÉE.</span>
                    <span className="text-[#E6DCC8] italic font-light tracking-normal block text-xl md:text-3xl mt-4 opacity-80">CONÇUE AVEC VOUS.</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="text-base md:text-lg text-white/60 font-light tracking-wide mb-10 max-w-md"
                >
                    Pour vous. Pas pour le marketing.<br />
                    <span className="text-xs font-mono text-white/30 mt-2 block">// INITIATING NEURAL SYNC...</span>
                </motion.p>

                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="bg-white text-black font-bold px-8 py-4 rounded-sm hover:bg-[#E6DCC8] transition-colors duration-300 tracking-widest text-xs md:text-sm uppercase"
                >
                    REJOINDRE L'ALLIANCE
                </motion.button>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1 }} className="mt-16 flex gap-8 text-[10px] uppercase tracking-[0.2em] text-white/30 font-mono">
                    <span>System: Normal</span>
                    <span>Bio-Link: Active</span>
                </motion.div>
            </motion.div>
        </section>
    );
}

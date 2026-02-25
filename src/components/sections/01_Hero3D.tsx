'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useLenis } from 'lenis/react';

// --- HERO ---
export function HeroVoid() {
    const { scrollY } = useScroll();
    const textY = useTransform(scrollY, [0, 500], [0, -100]);
    const lenis = useLenis();

    const handleCTAClick = () => {
        if (lenis) {
            lenis.scrollTo('#close', { duration: 2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
        } else {
            document.querySelector('#close')?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section
            id="hydre-product-section"
            className="relative bg-void text-white overflow-hidden"
            style={{ height: '200vh' }}
        >
            {/* Sticky viewport — pins text while scroll drives the product */}
            <div className="sticky top-0 h-screen flex">

                {/* ━━━ FULLSCREEN VIDEO BACKGROUND ━━━━━━━━━━━━━━━━━━ */}
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover z-0"
                    src="/videos/Backgroundvideo3Dhero.webm"
                />

                {/* ━━━ LEFT TEXT OVERLAY ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
                <motion.div style={{ y: textY }} className="relative z-20 h-full flex flex-col items-start justify-center pl-8 md:pl-16 lg:pl-24 max-w-xl w-full lg:w-1/2">


                    <motion.h1
                        initial={{ opacity: 0, x: -40, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        className="font-display text-display font-bold tracking-tighter text-white leading-[0.95] mb-8"
                    >
                        L'HYDRATATION <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">ÉPURÉE.</span>
                        <span className="text-[#E6DCC8] italic font-light tracking-normal block text-h3 mt-4 opacity-80">CONÇUE AVEC VOUS.</span>
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
                        onClick={handleCTAClick}
                        className="group relative cursor-pointer overflow-hidden"
                    >
                        {/* Outer border — thin, clinical */}
                        <div className="relative border border-white/30 group-hover:border-white/60 transition-all duration-700">
                            {/* Fill sweep */}
                            <div className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]" />

                            <div className="relative z-10 flex items-center gap-4 px-8 md:px-10 py-4 md:py-5">
                                <span className="font-mono text-[10px] md:text-xs text-white group-hover:text-black tracking-[0.3em] uppercase transition-colors duration-500">
                                    Rejoindre l'Alliance
                                </span>
                                {/* Arrow */}
                                <svg
                                    className="w-4 h-4 text-white/50 group-hover:text-black group-hover:translate-x-1 transition-all duration-500"
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                                </svg>
                            </div>
                        </div>
                    </motion.button>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1 }} className="mt-16 flex gap-8 text-[10px] uppercase tracking-[0.2em] text-white/30 font-mono">
                        <span>System: Normal</span>
                        <span>Bio-Link: Active</span>
                    </motion.div>
                </motion.div>

                {/* RIGHT: Status indicator */}
                <div className="absolute top-8 right-8 font-mono text-right text-xs tracking-wider opacity-80 z-30 mix-blend-difference pointer-events-none">
                    <span className="block">STATUS</span>
                    <span className="block text-neon-orange font-semibold mt-1 animate-pulse">AVAILABLE</span>
                </div>

                {/* Bottom gradient */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-void via-void/80 to-transparent z-[2] pointer-events-none" />
            </div>
        </section>
    );
}

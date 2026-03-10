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
            className="relative bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-hidden h-screen"
        >
            <div className="relative h-full flex">

                {/* ━━━ FULLSCREEN VIDEO BACKGROUND ━━━━━━━━━━━━━━━━━━
                    Desktop only — saves 3.4MB on mobile.
                    Mobile gets a rich CSS gradient fallback.            */}
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="hidden md:block absolute inset-0 w-full h-full object-cover z-0"
                    src="/videos/Backgroundvideo3Dhero.webm"
                />
                {/* Mobile gradient fallback — no download cost */}
                <div
                    className="md:hidden absolute inset-0 z-0"
                    style={{
                        background: 'radial-gradient(ellipse 80% 60% at 70% 40%, #1a1a2e 0%, #0d0d1a 40%, #050505 100%)',
                    }}
                />

                {/* ━━━ LEFT TEXT OVERLAY ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
                <motion.div style={{ y: textY }} className="relative z-20 h-full flex flex-col items-start justify-center pl-8 md:pl-16 lg:pl-24 max-w-xl w-full lg:w-1/2">


                    <motion.h1
                        initial={{ opacity: 0, x: -40, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        className="font-display text-display font-bold tracking-tight text-[var(--text-primary)] leading-[0.95] mb-5 md:mb-8"
                    >
                        L'hydratation <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-muted)]">épurée.</span>
                        <span className="text-[#E6DCC8] italic font-light tracking-normal block text-h3 mt-4 opacity-80">Conçue avec vous.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="text-sm md:text-lg text-[var(--text-tertiary)] font-light tracking-wide mb-6 md:mb-10 max-w-md"
                    >
                        Pour vous. Pas pour le marketing.<br />
                    </motion.p>

                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        onClick={handleCTAClick}
                        className="group relative cursor-pointer"
                    >
                        {/* Persistent diffuse orange glow behind button */}
                        <div className="absolute -inset-4 bg-neon-orange/8 blur-[40px] rounded-full pointer-events-none group-hover:bg-neon-orange/15 transition-all duration-700" />

                        {/* Outer border — TheClose-style diffuse orange glow */}
                        <div className="relative border border-neon-orange/20 bg-[var(--bg-surface)]/5 overflow-hidden shadow-[0_0_25px_rgba(255,107,0,0.15),0_0_50px_rgba(255,107,0,0.08)] group-hover:shadow-[0_0_35px_rgba(255,107,0,0.25),0_0_70px_rgba(255,107,0,0.12)] group-hover:border-neon-orange/45 ring-1 ring-neon-orange/5 transition-all duration-700">
                            {/* Fill sweep */}
                            <div className="absolute inset-0 bg-neon-orange/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]" />

                            <div className="relative z-10 flex items-center gap-4 px-8 md:px-10 py-4 md:py-5">
                                <span className="font-mono text-[10px] md:text-xs text-[var(--text-primary)] group-hover:text-neon-orange tracking-[0.3em] uppercase transition-colors duration-500 font-bold">
                                    DEVENIR TESTEUR
                                </span>
                                {/* Arrow */}
                                <svg
                                    className="w-4 h-4 text-[var(--text-muted)] group-hover:text-neon-orange group-hover:translate-x-1 transition-all duration-500"
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                                </svg>
                            </div>

                        </div>
                    </motion.button>

                </motion.div>

                {/* Bottom gradient */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/80 to-transparent z-[2] pointer-events-none" />
            </div>
        </section>
    );
}

'use client';

import { useLenis } from 'lenis/react';
import { motion } from 'framer-motion';

// ─── EASING ───────────────────────────────────────────────────────────────────
const SILK_EASE = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

export function Header() {
    const lenis = useLenis();

    // ─────────────────────────────────────────────────────────────────────────
    //  SMART NAV SCROLL
    //
    //  SystemFailure is now min-h-screen (no 1180dvh pin zone), so Lenis
    //  scrolls through it without stalling. Two events are dispatched:
    //  - `clearNavStart`              → blocks the ring's reveal guard
    //  - `forceCompleteSystemFailure` → silently completes the section so
    //    scroll-back never shows a half-loaded black void.
    // ─────────────────────────────────────────────────────────────────────────
    const handleNavScroll = (selector: string) => {
        if (!selector || !lenis) return;

        window.dispatchEvent(new CustomEvent('clearNavStart'));
        window.dispatchEvent(new CustomEvent('forceCompleteSystemFailure'));

        lenis.scrollTo(selector, { duration: 0.8, easing: SILK_EASE });
    };

    const handleCTA = () => handleNavScroll('#close');

    return (
        <nav className="absolute top-0 left-0 w-full z-[99999] pointer-events-none">

            {/* ━━━ MAIN HEADER ━━━ */}
            <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="w-full px-6 md:px-10 lg:px-14 py-4 md:py-5 flex justify-between items-center"
            >

                {/* ━━━ WORDMARK — CLEAR / Nutrition stacked (brand guide) ━━━
                    "CLEAR" in heavy bone at full width.
                    "Nutrition" below with wider tracking → golden ratio width
                    relationship: W_NUTRITION ≈ W_CLEAR / φ (1.618).           */}
                <div className="pointer-events-auto flex flex-col items-center select-none" style={{ gap: '0.18em' }}>
                    <h1
                        className="font-headline font-black text-[#E6DCC8] uppercase leading-none"
                        style={{
                            fontSize: 'clamp(1.55rem, 2.6vw, 2.4rem)',
                            letterSpacing: '0.22em',
                        }}
                    >
                        CLEAR
                    </h1>
                    {/* Wider letter-spacing + smaller size → visual ~61.8% width of CLEAR */}
                    <span
                        className="font-sans font-light text-white/35 uppercase leading-none tracking-[0.55em]"
                        style={{ fontSize: 'clamp(0.55rem, 0.85vw, 0.72rem)', marginRight: '-0.55em' }}
                    >
                        Nutrition
                    </span>
                </div>

                {/* ━━━ CENTER: Discreet navigation ━━━ */}
                <div className="hidden lg:flex items-center gap-10 pointer-events-auto">
                    {(['Manifeste', 'Produit', 'Alliance', 'Roadmap'] as const).map((item, i) => {
                        const targets: Record<string, string> = {
                            Manifeste: '#system-failure-section',
                            Produit: '#specs',
                            Alliance: '#alliance',
                            Roadmap: '#roadmap',
                        };
                        return (
                            <motion.button
                                key={item}
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.6 + i * 0.08 }}
                                onClick={() => handleNavScroll(targets[item])}
                                className="relative font-mono text-[10px] text-white/35 tracking-[0.22em] uppercase
                                           hover:text-white/75 transition-colors duration-500 mix-blend-difference
                                           after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-px
                                           after:bg-white/50 hover:after:w-full after:transition-all after:duration-500"
                            >
                                {item}
                            </motion.button>
                        );
                    })}
                </div>

                {/* ━━━ RIGHT: CTA ━━━ */}
                <motion.button
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    onClick={handleCTA}
                    className="pointer-events-auto group relative overflow-hidden mix-blend-difference"
                >
                    <div className="relative border border-white/20 group-hover:border-white/50 transition-all duration-700">
                        {/* Fill sweep */}
                        <div className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                        <div className="relative z-10 flex items-center gap-3 px-5 md:px-7 py-2.5 md:py-3">
                            <span className="font-mono text-[9px] md:text-[10px] text-white group-hover:text-black tracking-[0.3em] uppercase transition-colors duration-500">
                                Rejoindre
                            </span>
                            <svg
                                className="w-3 h-3 text-white/40 group-hover:text-black group-hover:translate-x-0.5 transition-all duration-500"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                            </svg>
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10 group-hover:bg-white/40 transition-colors duration-500" />
                </motion.button>

            </motion.div>

            {/* ━━━ Bottom hairline ━━━ */}
            <div className="w-full h-px bg-white/[0.06]" />
        </nav>
    );
}

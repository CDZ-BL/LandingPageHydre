'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Header() {
    const [isVisible, setIsVisible] = useState(false);
    const [glitchIntensity, setGlitchIntensity] = useState(0); // 0 = none, 1 = light, 2 = medium, 3 = intense

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const viewportHeight = window.innerHeight;
            const docHeight = document.documentElement.scrollHeight;

            // Show header immediately on first scroll
            setIsVisible(scrollY > 10);

            // Calculate scroll progress (0 to 1)
            const scrollProgress = scrollY / (docHeight - viewportHeight);

            // Glitch intensity based on scroll position
            // 0-35% = minimal, 35-45% = light, 45-55% = medium, 55-62% = intense, 62%+ = calm
            if (scrollProgress < 0.35) {
                setGlitchIntensity(1); // Minimal glitch at top (small, every 3s)
            } else if (scrollProgress < 0.45) {
                setGlitchIntensity(2); // Light glitch (2s)
            } else if (scrollProgress < 0.55) {
                setGlitchIntensity(3); // Medium glitch (2s, more intense)
            } else if (scrollProgress < 0.62) {
                setGlitchIntensity(4); // Intense glitch (at glitch section)
            } else {
                setGlitchIntensity(0); // Calm after passing
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Get animation class based on intensity
    const getGlitchClass = () => {
        switch (glitchIntensity) {
            case 1: return 'header-glitch-minimal';
            case 2: return 'header-glitch-light';
            case 3: return 'header-glitch-medium';
            case 4: return 'header-glitch-intense';
            default: return '';
        }
    };

    return (
        <>
            <AnimatePresence>
                {isVisible && (
                    <motion.header
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -100, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="fixed top-0 left-0 right-0 z-50 bg-void/95 backdrop-blur-md border-b border-void-300"
                    >
                        <div className="w-[85%] max-w-[1600px] mx-auto">
                            <nav className="flex items-center justify-between h-16">
                                {/* Logo */}
                                <div className="font-mono text-white text-sm tracking-wider">
                                    AETHER [LABS] | BATCH 001
                                </div>

                                {/* Status with Dynamic Glitch */}
                                <div className={`relative font-mono text-neon-orange text-xs tracking-wider ${getGlitchClass()}`}>
                                    <span className="header-status-base">STATUS: AVAILABLE</span>
                                    <span className="absolute top-0 left-0 text-cyan-400 header-status-cyan" aria-hidden="true">STATUS: AVAILABLE</span>
                                    <span className="absolute top-0 left-0 text-red-500 header-status-red" aria-hidden="true">STATUS: AVAILABLE</span>
                                </div>
                            </nav>
                        </div>
                    </motion.header>
                )}
            </AnimatePresence>

            <style>{`
                /* Base hidden state for ghost texts */
                .header-status-cyan,
                .header-status-red {
                    opacity: 0;
                    mix-blend-mode: screen;
                }

                /* ===== MINIMAL GLITCH (0-35%, small, 3s) ===== */
                .header-glitch-minimal .header-status-base {
                    animation: glitch-minimal-main 3s infinite;
                }
                .header-glitch-minimal .header-status-cyan {
                    animation: glitch-minimal-cyan 3s infinite;
                }
                .header-glitch-minimal .header-status-red {
                    animation: glitch-minimal-red 3s infinite;
                }

                @keyframes glitch-minimal-main {
                    0%, 100% { transform: translate(0, 0); }
                    95% { transform: translate(0, 0); }
                    96% { transform: translate(-1px, 0); }
                    97% { transform: translate(1px, 0); }
                    98% { transform: translate(0, 0); }
                }
                @keyframes glitch-minimal-cyan {
                    0%, 100% { opacity: 0; }
                    96% { opacity: 0.2; transform: translate(-2px, 0); }
                    98% { opacity: 0; }
                }
                @keyframes glitch-minimal-red {
                    0%, 100% { opacity: 0; }
                    97% { opacity: 0.2; transform: translate(2px, 0); }
                    99% { opacity: 0; }
                }

                /* ===== LIGHT GLITCH (35-45%, 2s) ===== */
                .header-glitch-light .header-status-base {
                    animation: glitch-light-main 2s infinite;
                }
                .header-glitch-light .header-status-cyan {
                    animation: glitch-light-cyan 2s infinite;
                }
                .header-glitch-light .header-status-red {
                    animation: glitch-light-red 2s infinite;
                }

                @keyframes glitch-light-main {
                    0%, 100% { transform: translate(0, 0); }
                    45% { transform: translate(0, 0); }
                    47% { transform: translate(-1px, 0); }
                    49% { transform: translate(1px, 0); }
                    51% { transform: translate(0, 0); }
                }
                @keyframes glitch-light-cyan {
                    0%, 100% { opacity: 0; }
                    47% { opacity: 0.4; transform: translate(-3px, 0); }
                    51% { opacity: 0; }
                }
                @keyframes glitch-light-red {
                    0%, 100% { opacity: 0; }
                    48% { opacity: 0.4; transform: translate(3px, 0); }
                    52% { opacity: 0; }
                }

                /* ===== MEDIUM GLITCH (45-55%, 2s, more intense) ===== */
                .header-glitch-medium .header-status-base {
                    animation: glitch-medium-main 2s infinite;
                }
                .header-glitch-medium .header-status-cyan {
                    animation: glitch-medium-cyan 2s infinite;
                }
                .header-glitch-medium .header-status-red {
                    animation: glitch-medium-red 2s infinite;
                }

                @keyframes glitch-medium-main {
                    0%, 100% { transform: translate(0, 0) skewX(0deg); opacity: 1; }
                    8% { transform: translate(-3px, 0) skewX(-1deg); }
                    10% { transform: translate(3px, 0) skewX(1deg); }
                    12% { transform: translate(0, 0) skewX(0deg); }
                    25% { opacity: 0.4; }
                    27% { opacity: 1; }
                    45% { transform: translate(-2px, 1px); }
                    48% { transform: translate(2px, -1px); }
                    50% { transform: translate(0, 0); }
                    70% { opacity: 0.3; }
                    72% { opacity: 1; }
                    85% { transform: translate(-2px, 0) skewX(-0.5deg); }
                    88% { transform: translate(2px, 0) skewX(0.5deg); }
                    91% { transform: translate(0, 0) skewX(0deg); }
                }
                @keyframes glitch-medium-cyan {
                    0%, 100% { opacity: 0; }
                    8% { opacity: 0.7; transform: translate(-6px, 0); }
                    12% { opacity: 0; }
                    45% { opacity: 0.6; transform: translate(4px, 0); }
                    50% { opacity: 0; }
                    85% { opacity: 0.7; transform: translate(-5px, 0); }
                    91% { opacity: 0; }
                }
                @keyframes glitch-medium-red {
                    0%, 100% { opacity: 0; }
                    9% { opacity: 0.7; transform: translate(6px, 0); }
                    13% { opacity: 0; }
                    46% { opacity: 0.6; transform: translate(-4px, 0); }
                    51% { opacity: 0; }
                    86% { opacity: 0.7; transform: translate(5px, 0); }
                    92% { opacity: 0; }
                }

                /* ===== INTENSE GLITCH ===== */
                .header-glitch-intense .header-status-base {
                    animation: glitch-intense-main 1s infinite;
                }
                .header-glitch-intense .header-status-cyan {
                    animation: glitch-intense-cyan 0.8s infinite;
                }
                .header-glitch-intense .header-status-red {
                    animation: glitch-intense-red 0.6s infinite;
                }

                @keyframes glitch-intense-main {
                    0%, 100% { transform: translate(0, 0) skewX(0deg); opacity: 1; }
                    5% { transform: translate(-4px, 0) skewX(-2deg); }
                    10% { transform: translate(4px, 0) skewX(2deg); }
                    15% { transform: translate(0, 0) skewX(0deg); }
                    30% { opacity: 0.3; }
                    32% { opacity: 1; }
                    50% { transform: translate(-3px, 2px) skewX(-1deg); }
                    55% { transform: translate(3px, -2px) skewX(1deg); }
                    60% { transform: translate(0, 0) skewX(0deg); }
                    80% { opacity: 0.2; }
                    82% { opacity: 1; }
                    90% { transform: translate(-2px, 0); }
                    95% { transform: translate(2px, 0); }
                }
                @keyframes glitch-intense-cyan {
                    0%, 100% { opacity: 0; transform: translate(0, 0); }
                    5% { opacity: 0.8; transform: translate(-8px, 0); }
                    15% { opacity: 0; }
                    30% { opacity: 0.7; transform: translate(6px, 0); }
                    40% { opacity: 0; }
                    60% { opacity: 0.9; transform: translate(-10px, 0); }
                    70% { opacity: 0; }
                    85% { opacity: 0.6; transform: translate(5px, 0); }
                    95% { opacity: 0; }
                }
                @keyframes glitch-intense-red {
                    0%, 100% { opacity: 0; transform: translate(0, 0); }
                    8% { opacity: 0.8; transform: translate(8px, 0); }
                    18% { opacity: 0; }
                    35% { opacity: 0.7; transform: translate(-6px, 0); }
                    45% { opacity: 0; }
                    65% { opacity: 0.9; transform: translate(10px, 0); }
                    75% { opacity: 0; }
                    88% { opacity: 0.6; transform: translate(-5px, 0); }
                    98% { opacity: 0; }
                }
            `}</style>
        </>
    );
}

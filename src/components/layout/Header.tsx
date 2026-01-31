'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Header() {
    const [isVisible, setIsVisible] = useState(false);
    const [glitchIntensity, setGlitchIntensity] = useState(0); // 0 = none, 1 = light, 2 = medium, 3 = intense

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            // Show header immediately on first scroll
            setIsVisible(scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // IntersectionObserver to detect when #system-failure is visible
    useEffect(() => {
        const glitchSection = document.getElementById('system-failure');
        if (!glitchSection) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setGlitchIntensity(4); // Intense glitch when section visible
                    } else {
                        setGlitchIntensity(0); // No glitch otherwise
                    }
                });
            },
            {
                threshold: 0.3, // Trigger when 30% of section is visible
                rootMargin: '-10% 0px -10% 0px' // Shrink detection zone slightly
            }
        );

        observer.observe(glitchSection);
        return () => observer.disconnect();
    }, []);

    // Get animation class based on intensity
    const getGlitchClass = () => {
        switch (glitchIntensity) {
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
                                {/* Logo with Glitch at glitch section */}
                                <div className={`relative font-mono text-white text-sm tracking-wider ${getGlitchClass()}`}>
                                    <span className="header-logo-base">AETHER [LABS] | BATCH 001</span>
                                    <span className="absolute top-0 left-0 text-cyan-400 header-logo-cyan" aria-hidden="true">AETHER [LABS] | BATCH 001</span>
                                    <span className="absolute top-0 left-0 text-red-500 header-logo-red" aria-hidden="true">AETHER [LABS] | BATCH 001</span>
                                </div>

                                {/* Status with Glitch at glitch section */}
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
                /* Base hidden state for ghost texts - STATUS */
                .header-status-cyan,
                .header-status-red {
                    opacity: 0;
                    mix-blend-mode: screen;
                }

                /* Base hidden state for ghost texts - LOGO */
                .header-logo-cyan,
                .header-logo-red {
                    opacity: 0;
                    mix-blend-mode: screen;
                }

                /* ===== INTENSE GLITCH (only at glitch section 50-65%) ===== */
                
                /* STATUS animations */
                .header-glitch-intense .header-status-base {
                    animation: glitch-intense-main 1s infinite;
                }
                .header-glitch-intense .header-status-cyan {
                    animation: glitch-intense-cyan 0.8s infinite;
                }
                .header-glitch-intense .header-status-red {
                    animation: glitch-intense-red 0.6s infinite;
                }

                /* LOGO animations - same as status */
                .header-glitch-intense .header-logo-base {
                    animation: glitch-intense-main 1s infinite;
                }
                .header-glitch-intense .header-logo-cyan {
                    animation: glitch-intense-cyan 0.8s infinite;
                }
                .header-glitch-intense .header-logo-red {
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

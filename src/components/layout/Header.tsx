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
                                <div className="relative font-mono text-white text-sm tracking-wider">
                                    <span className={`block ${glitchIntensity === 4 ? 'animate-glitch-intense-main' : ''}`}>
                                        AETHER [LABS] | BATCH 001
                                    </span>
                                    <span
                                        className={`absolute top-0 left-0 text-cyan-400 opacity-0 mix-blend-screen ${glitchIntensity === 4 ? 'animate-glitch-intense-cyan' : ''}`}
                                        aria-hidden="true"
                                    >
                                        AETHER [LABS] | BATCH 001
                                    </span>
                                    <span
                                        className={`absolute top-0 left-0 text-red-500 opacity-0 mix-blend-screen ${glitchIntensity === 4 ? 'animate-glitch-intense-red' : ''}`}
                                        aria-hidden="true"
                                    >
                                        AETHER [LABS] | BATCH 001
                                    </span>
                                </div>

                                {/* Status with Glitch at glitch section */}
                                <div className="relative font-mono text-neon-orange text-xs tracking-wider">
                                    <span className={`block ${glitchIntensity === 4 ? 'animate-glitch-intense-main' : ''}`}>
                                        STATUS: AVAILABLE
                                    </span>
                                    <span
                                        className={`absolute top-0 left-0 text-cyan-400 opacity-0 mix-blend-screen ${glitchIntensity === 4 ? 'animate-glitch-intense-cyan' : ''}`}
                                        aria-hidden="true"
                                    >
                                        STATUS: AVAILABLE
                                    </span>
                                    <span
                                        className={`absolute top-0 left-0 text-red-500 opacity-0 mix-blend-screen ${glitchIntensity === 4 ? 'animate-glitch-intense-red' : ''}`}
                                        aria-hidden="true"
                                    >
                                        STATUS: AVAILABLE
                                    </span>
                                </div>
                            </nav>
                        </div>
                    </motion.header>
                )}
            </AnimatePresence>
        </>
    );
}

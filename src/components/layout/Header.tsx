'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Header() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show header immediately on first scroll
            setIsVisible(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
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

                            {/* Status */}
                            <div className="font-mono text-neon-orange text-xs tracking-wider">
                                STATUS: AVAILABLE
                            </div>
                        </nav>
                    </div>
                </motion.header>
            )}
        </AnimatePresence>
    );
}

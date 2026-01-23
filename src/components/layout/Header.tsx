'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        setIsMobileMenuOpen(false);
    };

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-void/90 backdrop-blur-md border-b border-void-300'
                : 'bg-transparent'
                }`}
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
    );
}

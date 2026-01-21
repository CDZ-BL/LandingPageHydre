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

    const navItems = [
        { label: 'FORMULA', href: 'education' },
        { label: 'INTELLIGENCE', href: 'ai-coach' },
        { label: 'SELECT', href: 'flavor-battle' },
    ];

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-void/90 backdrop-blur-md border-b border-void-200'
                : 'bg-transparent'
                }`}
        >
            <div className="w-[85%] max-w-[1600px] mx-auto">
                <nav className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <button
                        onClick={() => scrollTo('hero')}
                        className="font-display text-lg tracking-[0.3em] text-void-950 hover:text-void-700 transition-colors"
                    >
                        AETHER
                    </button>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-12">
                        {navItems.map((item) => (
                            <button
                                key={item.label}
                                onClick={() => scrollTo(item.href)}
                                className="font-data text-xs text-void-600 hover:text-void-950 transition-colors"
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {/* CTA */}
                    <button
                        onClick={() => scrollTo('flavor-battle')}
                        className="hidden md:block px-4 py-2 border border-void-300 text-void-950 font-data text-xs
                       hover:bg-void-950 hover:text-void transition-all duration-300"
                    >
                        JOIN FOUNDERS
                    </button>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <div className="w-5 h-4 relative flex flex-col justify-between">
                            <span className={`w-full h-px bg-void-950 transition-all ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                            <span className={`w-full h-px bg-void-950 transition-all ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
                            <span className={`w-full h-px bg-void-950 transition-all ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
                        </div>
                    </button>
                </nav>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden border-t border-void-200"
                        >
                            <div className="py-6 space-y-4">
                                {navItems.map((item) => (
                                    <button
                                        key={item.label}
                                        onClick={() => scrollTo(item.href)}
                                        className="block w-full text-left font-data text-sm text-void-600 hover:text-void-950 py-2"
                                    >
                                        {item.label}
                                    </button>
                                ))}
                                <button
                                    onClick={() => scrollTo('flavor-battle')}
                                    className="w-full px-4 py-3 border border-void-300 text-void-950 font-data text-xs mt-4
                             hover:bg-void-950 hover:text-void transition-all"
                                >
                                    JOIN FOUNDERS
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.header>
    );
}

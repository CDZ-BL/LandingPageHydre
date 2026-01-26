'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface NavLink {
    label: string;
    href: string;
}

const navLinks: NavLink[] = [
    { label: 'MISSION', href: '#mission' },
    { label: 'SPECS', href: '#specs' },
    { label: 'PROTOCOL', href: '#protocol' },
];

export function TacticalNavigation() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [hoveredLink, setHoveredLink] = useState<string | null>(null);
    const [scrollY, setScrollY] = useState(0);

    // Track mouse position for coordinate display
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };

        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Format coordinates like tactical display
    const formatCoord = useCallback((value: number, prefix: string) => {
        return `${prefix}${value.toString().padStart(4, '0')}`;
    }, []);

    return (
        <header className="fixed top-0 left-0 right-0 z-50">
            {/* Main navigation bar */}
            <nav className="tactical-glass border-b border-neon-cyan/20">
                <div className="max-w-[1400px] mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Left: Logo & System Status */}
                        <div className="flex items-center gap-6">
                            <Link href="/" className="font-display text-xl tracking-[0.3em] text-white neon-glow-text">
                                AETHER
                            </Link>
                            <div className="hidden md:flex items-center gap-2 status-indicator coordinate-display">
                                SYSTEM ONLINE
                            </div>
                        </div>

                        {/* Center: Navigation Links */}
                        <div className="hidden md:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <div
                                    key={link.href}
                                    className="relative"
                                    onMouseEnter={() => setHoveredLink(link.href)}
                                    onMouseLeave={() => setHoveredLink(null)}
                                >
                                    <Link
                                        href={link.href}
                                        className={cn(
                                            'font-mono text-sm tracking-wider transition-colors duration-200',
                                            hoveredLink === link.href
                                                ? 'text-neon-cyan'
                                                : 'text-void-600 hover:text-white'
                                        )}
                                    >
                                        {link.label}
                                    </Link>

                                    {/* Targeting reticle animation */}
                                    <AnimatePresence>
                                        {hoveredLink === link.href && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 1.5 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                className="absolute -inset-2 border border-neon-cyan/50 pointer-events-none"
                                            />
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>

                        {/* Right: Coordinate Display */}
                        <div className="hidden lg:flex items-center gap-4 coordinate-display">
                            <span className="text-void-500">{formatCoord(mousePos.x, 'X:')}</span>
                            <span className="text-void-500">{formatCoord(mousePos.y, 'Y:')}</span>
                            <span className="text-neon-cyan/70">DEPTH:{Math.floor(scrollY)}px</span>
                        </div>

                        {/* Mobile menu indicator */}
                        <div className="md:hidden flex items-center gap-2">
                            <div className="w-6 h-0.5 bg-neon-cyan/70" />
                            <div className="w-4 h-0.5 bg-neon-cyan/50" />
                            <div className="w-2 h-0.5 bg-neon-cyan/30" />
                        </div>
                    </div>
                </div>
            </nav>

            {/* Scan line effect across top */}
            <div className="absolute top-0 left-0 right-0 h-0.5 overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-r from-transparent via-neon-cyan to-transparent"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                />
            </div>
        </header>
    );
}

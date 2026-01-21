'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { HERO_CLAIMS, MARQUEE_ITEMS } from '@/constants/claims';

export function HeroVoid() {
    const [isHovering, setIsHovering] = useState(false);

    return (
        <div className="relative">
            {/* Main Hero Section */}
            <section
                id="hero"
                className="relative h-[calc(100vh-60px)] flex flex-col overflow-hidden cursor-pointer"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                {/* Full-screen SURFACE image (visible by default) */}
                <motion.div
                    className="absolute inset-0"
                    animate={{ opacity: isHovering ? 0.2 : 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Image
                        src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80"
                        alt="AETHER Surface"
                        fill
                        className="object-cover"
                        priority
                    />
                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-void/70" />
                </motion.div>

                {/* Full-screen X-RAY image (appears on hover) */}
                <motion.div
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovering ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Image
                        src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1920&q=80"
                        alt="AETHER X-Ray Formula"
                        fill
                        className="object-cover"
                    />
                    {/* Cyan/Lab overlay for scientific look */}
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-900/40 via-transparent to-void/80" />

                    {/* Floating ingredient labels across the screen */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="grid grid-cols-3 gap-20 md:gap-40 text-center">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: isHovering ? 1 : 0, y: isHovering ? 0 : 20 }}
                                transition={{ delay: 0.1 }}
                                className="space-y-2"
                            >
                                <div className="font-display text-4xl md:text-6xl text-neon-orange">1200</div>
                                <div className="font-data text-void-700 text-sm">MG SODIUM</div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: isHovering ? 1 : 0, y: isHovering ? 0 : 20 }}
                                transition={{ delay: 0.2 }}
                                className="space-y-2"
                            >
                                <div className="font-display text-4xl md:text-6xl text-neon-orange">1000</div>
                                <div className="font-data text-void-700 text-sm">MG POTASSIUM</div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: isHovering ? 1 : 0, y: isHovering ? 0 : 20 }}
                                transition={{ delay: 0.3 }}
                                className="space-y-2"
                            >
                                <div className="font-display text-4xl md:text-6xl text-neon-orange">500</div>
                                <div className="font-data text-void-700 text-sm">MG MAGNÉSIUM</div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* HUD Corners */}
                <div className="absolute inset-8 pointer-events-none z-20">
                    <div className="hud-corner hud-corner-tl border-void-400" />
                    <div className="hud-corner hud-corner-tr border-void-400" />
                    <div className="hud-corner hud-corner-bl border-void-400" />
                    <div className="hud-corner hud-corner-br border-void-400" />
                </div>

                {/* Top HUD Data */}
                <div className="absolute top-8 left-12 right-12 flex justify-between items-start z-20">
                    <div className="font-data text-void-700">
                        <span className="block">{HERO_CLAIMS.batchLabel}</span>
                        <span className="block text-void-600">2025.Q4</span>
                    </div>
                    <motion.div
                        className="font-data text-right"
                        animate={{ color: isHovering ? '#FF6B00' : '#BBBBBB' }}
                    >
                        <span className="block">{isHovering ? HERO_CLAIMS.xrayMode : HERO_CLAIMS.statusLabel}</span>
                        <span className="block text-void-600">{isHovering ? HERO_CLAIMS.formulaRevealed : 'FONDATEURS ONLY'}</span>
                    </motion.div>
                </div>

                {/* Main Content */}
                <div className="relative z-10 flex-1 flex items-center justify-center px-4">
                    <div className="text-center max-w-4xl">
                        {/* Logo / Brand */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="mb-8"
                        >
                            <h1 className="font-display text-5xl md:text-7xl lg:text-9xl text-white tracking-[0.2em]">
                                {HERO_CLAIMS.headline}
                            </h1>
                            <motion.p
                                className="font-data mt-4"
                                animate={{ color: isHovering ? '#FF6B00' : '#BBBBBB' }}
                            >
                                {isHovering ? HERO_CLAIMS.subheadlineHover : HERO_CLAIMS.subheadline}
                            </motion.p>
                        </motion.div>

                        {/* Hover instruction */}
                        <motion.div
                            animate={{ opacity: isHovering ? 0 : 1 }}
                            className="my-12"
                        >
                            <div className="inline-flex items-center gap-3 px-6 py-3 border border-void-400 text-void-600 font-data text-sm">
                                <span className="w-2 h-2 rounded-full bg-neon-orange animate-pulse" />
                                {HERO_CLAIMS.hoverInstruction}
                            </div>
                        </motion.div>

                        {/* CTA */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="space-y-4"
                        >
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    document.getElementById('flavor-battle')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="px-8 py-4 border border-void-400 text-white font-display text-sm tracking-widest
                           hover:bg-white hover:text-void transition-all duration-300"
                            >
                                {HERO_CLAIMS.cta}
                            </button>
                        </motion.div>
                    </div>
                </div>

                {/* Bottom HUD - positioned above marquee */}
                <div className="absolute bottom-4 left-12 right-12 flex justify-between items-end z-20">
                    <div className="font-data text-void-600 text-xs">
                        <span>© 2025 AETHER LABS</span>
                    </div>
                    <motion.div
                        animate={{ y: [0, 5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="font-data text-void-600 text-xs"
                    >
                        SCROLL ↓
                    </motion.div>
                </div>
            </section>

            {/* Infinite Marquee - OUTSIDE the hero section, no overlap */}
            <div className="relative z-30 h-[60px] border-t border-b border-void-300 bg-void overflow-hidden flex items-center">
                <motion.div
                    className="flex gap-16 whitespace-nowrap"
                    animate={{ x: ['0%', '-50%'] }}
                    transition={{
                        x: {
                            duration: 40,
                            repeat: Infinity,
                            ease: 'linear',
                        },
                    }}
                >
                    {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
                        <span
                            key={i}
                            className="font-display text-xl md:text-2xl text-outline text-void-500 flex-shrink-0"
                        >
                            {item}
                        </span>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}

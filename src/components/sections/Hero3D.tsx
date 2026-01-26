'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { getAssetPath } from '@/lib/utils';
import { TacticalGlass, TacticalReadout, SystemStatus } from '@/components/ui/TacticalGlass';
import { TerminalText, DecryptText } from '@/components/ui/TerminalText';

export function HeroVoid() {
    const [isXray, setIsXray] = useState(false);

    // X-ray blink effect: every 5 seconds, show X-ray for 0.5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setIsXray(true);
            setTimeout(() => setIsXray(false), 500); // 0.5 second blink
        }, 5000); // Every 5 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative min-h-screen bg-void text-white overflow-hidden flex items-center justify-center">
            {/* Layer 1: Grid overlay - technical aesthetic */}
            <div
                className="absolute inset-0 opacity-5 z-0"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px',
                }}
            />

            {/* Layer 2: Black Matte Tube Image with X-ray Blink */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, delay: 0.2 }}
                className="absolute inset-0 flex items-center justify-center overflow-hidden z-0"
            >
                {/* Container for both images */}
                <div
                    className="relative"
                    style={{
                        width: '100em',
                        height: '100em',
                        minWidth: '100em',
                        minHeight: '100em'
                    }}
                >
                    {/* Normal tube image */}
                    <Image
                        src={getAssetPath('/images/Blackmatetube.png')}
                        alt="AETHER System"
                        fill
                        className={`object-contain transition-opacity duration-100 ${isXray ? 'opacity-0' : 'opacity-100'}`}
                        priority
                    />

                    {/* X-ray overlay with glitch effect */}
                    <AnimatePresence>
                        {isXray && (
                            <motion.div
                                initial={{ opacity: 0, scale: 1.02 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ duration: 0.1 }}
                                className="absolute inset-0"
                            >
                                <Image
                                    src={getAssetPath('/images/Blackmatetubexray.jpg')}
                                    alt="AETHER System X-Ray"
                                    fill
                                    className="object-contain"
                                    style={{
                                        filter: 'brightness(1.2) contrast(1.1)',
                                    }}
                                />
                                {/* Scanline effect during X-ray */}
                                <div
                                    className="absolute inset-0 pointer-events-none opacity-30"
                                    style={{
                                        background: `repeating-linear-gradient(
                                            to bottom,
                                            transparent 0px,
                                            transparent 2px,
                                            rgba(0, 255, 255, 0.1) 3px,
                                            rgba(0, 255, 255, 0.1) 4px
                                        )`
                                    }}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* Layer 3: Dark overlay for text contrast */}
            <div className="absolute inset-0 bg-gradient-to-b from-void/30 via-void/60 to-void z-10" />

            {/* Layer 4: Status Bar - Top (below fixed header) */}
            <div className="absolute top-24 left-8 right-8 flex justify-between items-start z-30">
                <TacticalGlass label="SYSTEM" className="p-4" hudBrackets={true}>
                    <div className="font-mono text-white text-xs tracking-wider">
                        <span className="block text-neon-cyan">AETHER [LABS]</span>
                        <span className="block text-void-500 mt-1">BATCH 001</span>
                    </div>
                </TacticalGlass>
                <TacticalGlass label="STATUS" className="p-4" hudBrackets={true}>
                    <div className="font-mono text-right text-xs tracking-wider">
                        <SystemStatus status="ONLINE" />
                        <span className="block text-neon-cyan font-semibold mt-2">AVAILABLE</span>
                    </div>
                </TacticalGlass>
            </div>

            {/* Telemetry readouts - bottom corners */}
            <div className="absolute bottom-8 left-8 z-30 space-y-2">
                <TacticalReadout label="FORMULA" value="v1.0.3" />
                <TacticalReadout label="PURITY" value="99.7%" />
            </div>
            <div className="absolute bottom-8 right-8 z-30 space-y-2">
                <TacticalReadout label="IONS" value="ACTIVE" />
                <TacticalReadout label="INTEGRITY" value="VERIFIED" />
            </div>

            {/* Layer 5: Main Content - Text on top */}
            <div className="relative z-20 flex-1 flex items-center justify-center px-4">
                <div className="text-center max-w-5xl mx-auto">
                    {/* Headline */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="mb-8"
                    >
                        <h1 className="font-sans text-5xl md:text-7xl lg:text-8xl text-white font-bold tracking-tight mb-6">
                            <TerminalText text="PERFORMANCE HYDRIQUE." speed={60} />
                            <br />
                            <span className="text-white"><TerminalText text="NON DILUÉE." speed={60} delay={1500} /></span>
                        </h1>
                        <div className="font-sans text-lg md:text-xl text-white max-w-3xl mx-auto leading-relaxed tracking-wide">
                            <DecryptText text="Zéro Sucre. Zéro Taxe Marketing. 100% Ingrédients Actifs." />
                            <br />
                            <span className="mt-4 block text-void-300">
                                Le premier système d'électrolytes conçu sur la base de données cliniques, pas de tendances.
                            </span>
                        </div>
                    </motion.div>

                    {/* CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="space-y-3"
                    >
                        <button className="px-12 py-5 bg-white text-void font-sans text-sm font-semibold tracking-widest hover:bg-neon-cyan hover:text-void transition-all duration-300 neon-border">
                            INITIALISER L'ACCÈS
                        </button>
                        <p className="font-mono text-xs text-void-500 tracking-wider">
                            Stock limité au Batch 001.
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

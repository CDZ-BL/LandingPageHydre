'use client';

import { motion } from 'framer-motion';
import { FounderCard3D } from '@/components/ui/FounderCard3D';
import { TacticalGlass, TacticalReadout, SystemStatus } from '@/components/ui/TacticalGlass';

export function FounderStatus() {

    return (
        <>
            {/* CSS Keyframe Animation for Sheen */}
            <style jsx>{`
                @keyframes shine {
                    0% {
                        left: -100%;
                    }
                    100% {
                        left: 125%;
                    }
                }
                .founder-card-container {
                    position: relative;
                    overflow: hidden;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                .founder-card-container:hover {
                    transform: scale(1.02);
                    box-shadow: 0 0 30px rgba(255, 255, 255, 0.1);
                }
                .founder-card-container::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 50%;
                    height: 100%;
                    background: linear-gradient(
                        to right,
                        rgba(255, 255, 255, 0) 0%,
                        rgba(255, 255, 255, 0.3) 50%,
                        rgba(255, 255, 255, 0) 100%
                    );
                    transform: skewX(-25deg);
                    pointer-events: none;
                }
                .founder-card-container:hover::after {
                    animation: shine 0.75s;
                }
            `}</style>

            <section
                className="relative py-32 md:py-40 overflow-hidden"
                style={{
                    background: `radial-gradient(ellipse at center, #111111 0%, #050505 50%, #050505 100%)`
                }}
            >
                <div className="relative z-10 w-[85%] max-w-[1200px] mx-auto">
                    {/* Tagline HUD */}
                    <div className="flex justify-center mb-8">
                        <TacticalGlass label="CERTIFICATION" className="px-6 py-2" hudBrackets={true}>
                            <span className="font-mono text-cyan-400 text-xs tracking-widest">
                                BATCH 001 // EXCLUSIVE ACCESS
                            </span>
                        </TacticalGlass>
                    </div>

                    {/* Headline */}
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="font-sans text-3xl md:text-5xl lg:text-6xl text-white font-bold tracking-tight text-center mb-16"
                    >
                        CECI N'EST PAS UNE CARTE DE FIDÉLITÉ.
                    </motion.h2>

                    {/* Card container with background scanlines */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: false, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative mx-auto mb-16 max-w-2xl h-[400px] md:h-[500px]"
                    >
                        {/* Background Aura */}
                        <div className="absolute inset-0 bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none" />
                        <FounderCard3D />
                    </motion.div>

                    {/* Body Text */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="text-center mb-16"
                    >
                        <p className="font-sans text-lg md:text-xl text-[#E0E0E0] leading-relaxed max-w-2xl mx-auto uppercase tracking-wide">
                            L'accès au Batch 001 vous octroie le rang de <span className="text-white font-bold border-b-2 border-cyan-400/50 pb-1">Membre Fondateur</span>.
                            <br />
                            <span className="text-xs font-mono text-void-500 mt-4 block">TITANIUM BLACK SERIES // RFID ENCRYPTED</span>
                        </p>
                    </motion.div>

                    {/* Features List - Tactical Glass */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="max-w-2xl mx-auto mb-16"
                    >
                        <TacticalGlass label="BENEFITS_ARRAY" className="p-8" scanLine={true}>
                            <div className="space-y-6 font-mono text-sm md:text-base">
                                <div className="flex items-start gap-4 group">
                                    <span className="text-cyan-400 group-hover:animate-pulse">[&gt;]</span>
                                    <div className="flex flex-col">
                                        <span className="text-white font-bold">ACCÈS PRIORITAIRE AUX FUTURS DROPS</span>
                                        <span className="text-void-500 text-[10px] mt-1">WINDOW: 24H PRE-PUBLIC</span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 group">
                                    <span className="text-cyan-400 group-hover:animate-pulse">[&gt;]</span>
                                    <div className="flex flex-col">
                                        <span className="text-white font-bold">DROIT DE VOTE SUR LES PROTOCOLES R&D</span>
                                        <span className="text-void-500 text-[10px] mt-1">DIRECT INFLUENCE // FORMULATION V2</span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 group">
                                    <span className="text-cyan-400 group-hover:animate-pulse">[&gt;]</span>
                                    <div className="flex flex-col">
                                        <span className="text-white font-bold">CANAL DE COMMUNICATION PRIVÉ</span>
                                        <span className="text-void-500 text-[10px] mt-1">ENCRYPTED // DIRECT ACCESS</span>
                                    </div>
                                </div>
                            </div>
                        </TacticalGlass>
                    </motion.div>

                    {/* Stats HUD - Bottom */}
                    <div className="flex justify-center gap-12 mb-16">
                        <div className="text-center">
                            <span className="block font-mono text-void-500 text-[10px] uppercase">Slot Availability</span>
                            <span className="block font-mono text-cyan-400 text-sm">LOW SUPPLY</span>
                        </div>
                        <div className="text-center">
                            <span className="block font-mono text-void-500 text-[10px] uppercase">Node Status</span>
                            <SystemStatus status="ENCRYPTED" />
                        </div>
                    </div>

                    {/* CTA Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="text-center"
                    >
                        <button className="group relative px-12 py-6 bg-white text-black font-mono text-sm font-bold tracking-[0.2em] uppercase transition-all duration-300 hover:bg-cyan-400 hover:text-black hover:scale-105">
                            {/* Corner accents for military style */}
                            <span className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
                            <span className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
                            <span className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
                            <span className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />
                            RÉCLAMER MON IDENTIFIANT
                        </button>
                    </motion.div>
                </div>
            </section>
        </>
    );
}

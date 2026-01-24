'use client';

import { motion } from 'framer-motion';
import { FounderCard3D } from '@/components/ui/FounderCard3D';

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
                    {/* Tagline */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-8"
                    >
                        <span className="font-mono text-cyan-400 text-xs tracking-widest">
                            // BATCH 001 EXCLUSIVE
                        </span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="font-sans text-3xl md:text-5xl lg:text-6xl text-white font-bold tracking-tight text-center mb-8"
                    >
                        CECI N'EST PAS UNE CARTE DE FIDÉLITÉ.
                    </motion.h2>

                    {/* Card with CSS Sheen Effect Only */}
                    {/* 3D Card with texture */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: false, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative mx-auto mb-16 max-w-2xl h-[400px] md:h-[500px]"
                    >
                        <FounderCard3D />
                    </motion.div>

                    {/* Body Text */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="text-center mb-12"
                    >
                        <p className="font-sans text-lg md:text-xl text-[#E0E0E0] leading-relaxed max-w-2xl mx-auto">
                            L'accès au Batch 001 vous octroie le rang de <span className="text-white font-semibold">Membre Fondateur</span>.
                            <br />
                            Cette carte en Titanium Black physique certifie votre position dans la hiérarchie AETHER.
                            <br />
                            <span className="text-cyan-400">Elle est votre clé pour le futur.</span>
                        </p>
                    </motion.div>

                    {/* Features List - Terminal Style */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="max-w-xl mx-auto mb-16"
                    >
                        <div className="border border-void-300 bg-void/50 backdrop-blur-sm p-6 md:p-8">
                            <div className="space-y-4 font-mono text-sm md:text-base">
                                <div className="flex items-start gap-3">
                                    <span className="text-cyan-400">[&gt;]</span>
                                    <span className="text-[#E0E0E0]">ACCÈS PRIORITAIRE AUX FUTURS DROPS (24H AVANT LE PUBLIC)</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="text-cyan-400">[&gt;]</span>
                                    <span className="text-[#E0E0E0]">DROIT DE VOTE SUR LES PROTOCOLES R&D</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="text-cyan-400">[&gt;]</span>
                                    <span className="text-[#E0E0E0]">CANAL DE COMMUNICATION PRIVÉ</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* CTA Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="text-center"
                    >
                        <button className="group relative px-10 py-5 bg-transparent border-2 border-white text-white font-mono text-sm tracking-widest uppercase transition-all duration-300 hover:bg-white hover:text-black">
                            {/* Corner accents for military style */}
                            <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
                            <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
                            <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
                            <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />
                            RÉCLAMER MON IDENTIFIANT
                        </button>
                    </motion.div>
                </div>
            </section>
        </>
    );
}

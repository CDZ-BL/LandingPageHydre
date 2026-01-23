'use client';

import { motion } from 'framer-motion';

export function TheProblem() {
    return (
        <section className="relative py-32 bg-void overflow-hidden">
            {/* Grid background */}
            <div
                className="absolute inset-0 opacity-5"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
                    `,
                    backgroundSize: '40px 40px',
                }}
            />

            <div className="relative z-10 w-[85%] max-w-[1200px] mx-auto">
                {/* Title */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="mb-16"
                >
                    <h2 className="font-sans text-4xl md:text-6xl text-white font-bold tracking-tight">
                        LE MENSONGE DU MARCHÉ
                    </h2>
                </motion.div>

                {/* Body Text */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="mb-16"
                >
                    <p className="font-sans text-xl md:text-2xl text-white leading-relaxed max-w-3xl">
                        Vous ne payez pas pour l'hydratation. Vous payez pour leurs publicités, leurs couleurs néons et leur sucre industriel.
                    </p>
                    <p className="font-sans text-xl md:text-2xl text-white leading-relaxed max-w-3xl mt-6">
                        La majorité des boissons "sportives" sont des <span className="text-red-500 font-semibold">confiseries liquides déguisées en performance</span>.
                    </p>
                    <p className="font-sans text-xl md:text-2xl text-white leading-relaxed max-w-3xl mt-6">
                        Votre corps est une <span className="text-neon-orange font-semibold">machine thermique</span>, pas une poubelle.
                    </p>
                </motion.div>

                {/* Comparison Bar Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="mb-16 space-y-8"
                >
                    {/* Competitors Bar */}
                    <div>
                        <div className="font-mono text-white text-sm mb-3 tracking-wider">
                            [CONCURRENTS] — ALLOCATION BUDGET
                        </div>
                        <div className="flex h-16 border border-void-300">
                            <div className="bg-red-500/30 border-r-2 border-red-500 flex items-center justify-center" style={{ width: '80%' }}>
                                <span className="font-mono text-red-500 text-lg font-bold">80% MARKETING</span>
                            </div>
                            <div className="bg-void-300/20 flex items-center justify-center" style={{ width: '20%' }}>
                                <span className="font-mono text-white text-sm">20% PRODUIT</span>
                            </div>
                        </div>
                    </div>

                    {/* AETHER Bar */}
                    <div>
                        <div className="font-mono text-white text-sm mb-3 tracking-wider">
                            [AETHER] — ALLOCATION BUDGET
                        </div>
                        <div className="flex h-16 border border-neon-orange">
                            <div className="bg-neon-orange/30 border-r-2 border-neon-orange flex items-center justify-center w-full">
                                <span className="font-mono text-neon-orange text-lg font-bold">100% PRODUIT</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Comparative Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="border border-void-300 p-8 md:p-12"
                >
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* They */}
                        <div>
                            <div className="font-mono text-red-500 text-xs font-bold tracking-wider mb-6">
                                [EUX]
                            </div>
                            <div className="space-y-4 font-mono text-white">
                                <div className="flex justify-between border-b border-void-300 pb-3">
                                    <span className="text-white">Sucre</span>
                                    <span className="text-red-500 font-semibold">15g</span>
                                </div>
                                <div className="flex justify-between border-b border-void-300 pb-3">
                                    <span className="text-white">Excipient</span>
                                    <span className="text-red-500 font-semibold">Maltodextrine</span>
                                </div>
                                <div className="flex justify-between pb-3">
                                    <span className="text-white">Colorant</span>
                                    <span className="text-red-500 font-semibold">E133</span>
                                </div>
                            </div>
                        </div>

                        {/* AETHER */}
                        <div>
                            <div className="font-mono text-neon-orange text-xs font-bold tracking-wider mb-6">
                                [AETHER]
                            </div>
                            <div className="space-y-4 font-mono text-white">
                                <div className="flex justify-between border-b border-void-300 pb-3">
                                    <span className="text-white">Sucre</span>
                                    <span className="text-neon-orange font-semibold">0g</span>
                                </div>
                                <div className="flex justify-between border-b border-void-300 pb-3">
                                    <span className="text-white">Magnésium</span>
                                    <span className="text-neon-orange font-semibold">Bisglycinate</span>
                                </div>
                                <div className="flex justify-between pb-3">
                                    <span className="text-white">Arôme</span>
                                    <span className="text-neon-orange font-semibold">Naturel</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

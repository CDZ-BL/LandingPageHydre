'use client';

import { motion } from 'framer-motion';

export function ThePact() {
    return (
        <section className="relative py-32 bg-void overflow-hidden">
            {/* Blueprint Grid Background */}
            <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
                    `,
                    backgroundSize: '100px 100px',
                }}
            />
            {/* Blueprint Measurements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-5">
                <div className="absolute top-32 left-10 border-l border-t border-white w-16 h-16"></div>
                <div className="absolute bottom-32 right-10 border-r border-b border-white w-16 h-16"></div>
            </div>

            <div className="relative z-10 w-[85%] max-w-[1200px] mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="mb-20 text-center"
                >
                    <h2 className="font-mono text-amber-500 text-sm tracking-widest mb-4">
                        [ SECTION 1 : LE PACTE DE VALEUR ]
                    </h2>
                    <h3 className="font-sans text-3xl md:text-5xl lg:text-6xl text-white font-bold tracking-tight mb-8">
                        LE RETOUR DU POUVOIR D'ACHAT.
                    </h3>
                    <p className="font-sans text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        Le modèle standard est cassé : vous payez pour le bruit, pas pour le produit.
                        <br />
                        AETHER propose un <span className="text-white font-semibold">Nouveau Pacte Industriel</span>.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center">
                    {/* Left Column: The Philosophy */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="space-y-12"
                    >
                        <div className="relative pl-8 border-l border-void-600">
                            <h4 className="font-sans text-xl text-white font-bold mb-4">
                                MATIÈRE PREMIÈRE &gt; MARKETING
                            </h4>
                            <p className="font-mono text-sm md:text-base text-gray-400 leading-relaxed">
                                Nous avons supprimé les intermédiaires et la publicité de masse. Chaque euro que vous dépensez va directement dans la qualité des ingrédients (Magnésium Bisglycinate, Arômes réels).
                            </p>
                        </div>

                        <div className="relative pl-8 border-l border-void-600">
                            <h4 className="font-sans text-xl text-white font-bold mb-4">
                                TRANSPARENCE RADICALE
                            </h4>
                            <p className="font-mono text-sm md:text-base text-gray-400 leading-relaxed text-justify">
                                Nous ne cachons pas nos coûts. Nous sommes fiers de vous montrer que notre coût de production est <span className="text-amber-500">4x supérieur</span> à la moyenne du marché.
                            </p>
                        </div>

                        <div className="relative pl-8 border-l border-amber-500/50">
                            <p className="font-sans text-lg text-white font-medium italic">
                                "Nous ne cherchons pas à vous extraire de la valeur, mais à vous en apporter. C'est la seule base saine pour une relation durable."
                            </p>
                        </div>
                    </motion.div>

                    {/* Right Column: Visual Breakdown (Blueprint Style) */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="relative p-6 border border-void-700 bg-void-200/50"
                    >
                        {/* Technical Corners */}
                        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/50"></div>
                        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/50"></div>
                        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/50"></div>
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/50"></div>

                        <h4 className="font-mono text-xs text-void-500 tracking-widest mb-8 text-center uppercase">
                            // ANALYSE COMPARATIVE DES COÛTS
                        </h4>

                        <div className="space-y-8">
                            {/* Standard Brand */}
                            <div>
                                <div className="flex justify-between text-xs font-mono text-gray-400 mb-2">
                                    <span>STANDARD INDUSTRY</span>
                                    <span>PRIX : 45€</span>
                                </div>
                                <div className="h-4 bg-void-800 w-full flex">
                                    <div className="h-full bg-red-900/50 w-[15%]"></div> {/* Product */}
                                    <div className="h-full bg-void-700 w-[85%] relative overflow-hidden">
                                        <div className="absolute inset-0 flex items-center justify-center text-[8px] text-white/30 tracking-widest">MARKETING + MARGE</div>
                                    </div>
                                </div>
                                <div className="mt-1 flex justify-between text-[9px] font-mono text-gray-500">
                                    <span>PRODUIT (15%)</span>
                                    <span>BRUIT (85%)</span>
                                </div>
                            </div>

                            {/* AETHER */}
                            <div>
                                <div className="flex justify-between text-xs font-mono text-white mb-2">
                                    <span>AETHER ARCHITECTURE</span>
                                    <span>PRIX : 45€</span>
                                </div>
                                <div className="h-4 bg-void-800 w-full flex">
                                    <div className="h-full bg-amber-500 w-[65%] relative overflow-hidden">
                                        <div className="absolute inset-0 flex items-center justify-center text-[8px] text-black/70 font-bold tracking-widest">INGRÉDIENTS ACTIFS</div>
                                    </div>
                                    <div className="h-full bg-void-700 w-[35%]"></div>
                                </div>
                                <div className="mt-1 flex justify-between text-[9px] font-mono text-gray-400">
                                    <span className="text-amber-500">PRODUIT (65%)</span>
                                    <span>FONCTIONNEMENT (35%)</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-void-800 text-center">
                            <p className="font-mono text-xs text-void-500">
                                [DATA] : VOTRE INVESTISSEMENT EST BIOLOGIQUE, PAS MÉDIATIQUE.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

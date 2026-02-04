'use client';

import { motion } from 'framer-motion';
import NumberTicker from '@/components/ui/NumberTicker';

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

            <div className="relative z-10 w-[85%] max-w-[1400px] mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="mb-20"
                >
                    <span className="font-mono text-xs text-amber-500 tracking-widest mb-4 block">
                        [ SECTION 2 : LE PACTE DE VALEUR ]
                    </span>
                    <h3 className="font-sans text-3xl md:text-5xl lg:text-6xl text-white font-bold tracking-widest mb-8">
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
                                Suppression des intermédiaires et de la publicité. Chaque euro finance la qualité.
                            </p>
                        </div>

                        <div className="relative pl-8 border-l border-void-600">
                            <h4 className="font-sans text-xl text-white font-bold mb-4">
                                TRANSPARENCE RADICALE
                            </h4>
                            <p className="font-mono text-sm md:text-base text-gray-400 leading-relaxed text-justify">
                                Analyse labo et production avec les membres.
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

                        <div className="space-y-10">
                            {/* Standard Brand */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: false, margin: "-50px" }}
                                transition={{ duration: 0.6 }}
                            >
                                <div className="flex justify-between items-center text-xs font-mono text-gray-500 mb-3">
                                    <span>CONCURRENT PREMIUIM</span>
                                    <div className="flex items-center gap-3">
                                        <span className="text-gray-600">PRIX TOTAL : 9.99€</span>
                                    </div>
                                </div>
                                {/* Ultra-thin bar container */}
                                <div className="h-2 bg-void-900 w-full relative overflow-hidden border border-void-700">
                                    {/* Marketing portion - dark gray with hatching effect + SHAKE */}
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: '85%' }}
                                        viewport={{ once: false, margin: "-50px" }}
                                        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                                        className="h-full bg-red-900/40 absolute left-0 animate-bar-shake"
                                        style={{
                                            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)'
                                        }}
                                    />
                                </div>
                                <div className="mt-2 flex justify-between text-[10px] font-mono text-gray-600">
                                    <span>PRODUIT (15%)</span>
                                    <span className="text-gray-500">MARKETING + MARGE (85%)</span>
                                </div>
                            </motion.div>

                            {/* AETHER */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: false, margin: "-50px" }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                            >
                                <div className="flex justify-between items-center text-xs font-mono text-white mb-3">
                                    <span>AETHER PROTOCOLE</span>
                                    <div className="flex items-center gap-3">
                                        <span>PRIX TOTAL : 5.90€</span>
                                    </div>
                                </div>
                                {/* Ultra-thin bar container */}
                                <div className="h-2 bg-void-900 w-full relative overflow-hidden border border-void-700">
                                    {/* Ingredients portion - solid white with glow */}
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: '100%' }}
                                        viewport={{ once: false, margin: "-50px" }}
                                        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                                        className="h-full bg-white absolute left-0"
                                        style={{
                                            boxShadow: '0 0 15px rgba(255,255,255,0.6), inset 0 0 5px rgba(255,255,255,0.3)'
                                        }}
                                    />
                                </div>
                                <div className="mt-2 flex justify-between text-[10px] font-mono">
                                    <span className="text-white">INGRÉDIENTS ACTIFS (100%)</span>
                                    <span className="text-gray-500">BRUIT (0%)</span>
                                </div>
                            </motion.div>
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

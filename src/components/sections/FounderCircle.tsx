'use client';

import { motion } from 'framer-motion';
import { FounderCard3D } from '@/components/ui/FounderCard3D';

export function FounderCircle() {
    return (
        <section className="relative py-32 md:py-40 overflow-hidden bg-black text-white">
            {/* Background Radial Gradient */}
            <div
                className="absolute inset-0 opacity-100 pointer-events-none"
                style={{
                    background: `radial-gradient(ellipse at center, #111111 0%, #050505 50%, #050505 100%)`
                }}
            />

            <div className="relative z-10 w-[85%] max-w-[1200px] mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                        className="font-mono text-cyan-400 text-xs tracking-widest mb-4"
                    >
                        // BATCH 001 : ACCÈS PIONNIER
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="font-sans text-3xl md:text-5xl lg:text-6xl text-white font-bold tracking-tight"
                    >
                        PRENEZ PLACE AU CONSEIL.
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left: 3D Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: false, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="h-[400px] md:h-[500px] w-full relative"
                    >
                        <FounderCard3D />
                    </motion.div>

                    {/* Right: Copy & Features */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="space-y-10"
                    >
                        <p className="font-sans text-lg text-gray-300 leading-relaxed">
                            La Carte Titanium (Incluse avec le Supply Mensuel) n'est pas un gadget. <span className="text-white font-semibold">C'est un droit de vote.</span>
                            <br /><br />
                            AETHER est une marque "Open-Ended". Nous ne devinons pas vos besoins, nous vous écoutons. En tant que Membre Fondateur :
                        </p>

                        <div className="space-y-6">
                            {/* Feature 1 */}
                            <div className="flex gap-4">
                                <div className="mt-1 w-2 h-2 rounded-full bg-cyan-400 shrink-0"></div>
                                <div>
                                    <h4 className="font-sans text-white font-bold text-lg">VOUS VALIDEZ</h4>
                                    <p className="font-mono text-sm text-gray-400 mt-1">Les prototypes des futures saveurs (Samples envoyés gratuitement).</p>
                                </div>
                            </div>

                            {/* Feature 2 */}
                            <div className="flex gap-4">
                                <div className="mt-1 w-2 h-2 rounded-full bg-cyan-400 shrink-0"></div>
                                <div>
                                    <h4 className="font-sans text-white font-bold text-lg">VOUS DÉCIDEZ</h4>
                                    <p className="font-mono text-sm text-gray-400 mt-1">Les priorités de notre laboratoire R&D (Sommeil ? Focus ?).</p>
                                </div>
                            </div>

                            {/* Feature 3 */}
                            <div className="flex gap-4">
                                <div className="mt-1 w-2 h-2 rounded-full bg-cyan-400 shrink-0"></div>
                                <div>
                                    <h4 className="font-sans text-white font-bold text-lg">VOUS SAVEZ</h4>
                                    <p className="font-mono text-sm text-gray-400 mt-1">Accès aux feuilles de route produits 6 mois avant le public.</p>
                                </div>
                            </div>
                        </div>

                        <p className="font-sans text-white italic border-l-2 border-white pl-4 py-2">
                            "Construisons ensemble la marque que l'industrie n'a jamais osé faire."
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

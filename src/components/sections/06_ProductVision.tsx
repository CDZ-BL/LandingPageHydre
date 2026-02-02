'use client';

import { motion } from 'framer-motion';

export function ProductVision() {
    return (
        <section className="relative py-32 bg-black overflow-hidden border-t border-void-800">
            {/* Tech Grid Background */}
            <div
                className="absolute inset-0 opacity-5 pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(rgba(0, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.05) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                }}
            />

            <div className="relative z-10 w-[85%] max-w-[1400px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Visual: Versioning Timeline/Schematic */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: false, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="relative h-[400px] border border-void-700 bg-void-200/40 p-8 flex flex-col justify-between"
                    >
                        {/* Blueprint decorative lines */}
                        <div className="absolute top-4 left-4 w-2 h-2 border-t border-l border-cyan-500/50"></div>
                        <div className="absolute bottom-4 right-4 w-2 h-2 border-b border-r border-cyan-500/50"></div>

                        <div className="text-right font-mono text-xs text-cyan-500/70 tracking-widest uppercase mb-4">
                            System_Versioning.log
                        </div>

                        {/* Versions Stack */}
                        <div className="space-y-4 relative flex-1 flex flex-col justify-end">
                            {/* V1.2 Future */}
                            <div className="p-4 border border-dashed border-void-600 rounded bg-void-100/50 opacity-50 ml-8">
                                <div className="flex justify-between items-center text-xs font-mono text-gray-400">
                                    <span>V1.2 [CONCEPT]</span>
                                    <span>LOCKED</span>
                                </div>
                            </div>
                            {/* V1.1 Funding */}
                            <div className="p-4 border border-dashed border-void-600 rounded bg-void-100/80 opacity-70 ml-4 relative">
                                <div className="absolute -left-3 top-1/2 w-2 h-[1px] bg-void-600"></div>
                                <div className="flex justify-between items-center text-xs font-mono text-gray-400">
                                    <span>V1.1 [DEV]</span>
                                    <span>FUNDING...</span>
                                </div>
                            </div>
                            {/* V1.0 Current */}
                            <div className="p-4 border border-cyan-500/30 rounded bg-cyan-900/10 shadow-[0_0_20px_rgba(0,255,255,0.05)] relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500"></div>
                                <div className="flex justify-between items-center text-xs font-mono text-white mb-2">
                                    <span>V1.0 [STABLE]</span>
                                    <span className="text-cyan-400 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
                                        DEPLOYED
                                    </span>
                                </div>
                                <div className="text-xs text-gray-400 font-mono">
                                    &gt; Pure Hydration Kernel
                                    <br />
                                    &gt; Zero_Sugar Patch applied
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <span className="font-mono text-xs text-amber-500 tracking-widest mb-4 block">
                            [ SECTION 4 : LA VISION ]
                        </span>
                        <h3 className="font-sans text-3xl md:text-5xl text-white font-bold tracking-tight mb-8">
                            VERSIONING ÉVOLUTIF (V1.0).
                        </h3>

                        <div className="space-y-8 font-sans text-lg text-gray-300 leading-relaxed">
                            <p>
                                AETHER considère la nutrition comme une technologie. Elle n'est jamais figée, elle s'améliore constamment.
                            </p>
                            <p>
                                <span className="text-white font-semibold">L'HYDRE V1.0</span> est notre point de départ. Une fondation solide, pure et efficace. En rejoignant AETHER aujourd'hui, vous ne sécurisez pas seulement un stock : vous financez la V1.1, la V1.2.
                            </p>

                            <div className="p-6 border-l-2 border-cyan-500 bg-cyan-900/10">
                                <p className="text-sm font-mono text-cyan-200">
                                    // GARANTIE STOCK
                                    <br />
                                    Nous garantissons la stabilité de votre approvisionnement. Tant que vous êtes Membre, votre allocation est réservée à l'usine. Vous ne manquerez jamais de carburant.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}

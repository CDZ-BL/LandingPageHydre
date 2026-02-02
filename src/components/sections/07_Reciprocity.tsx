'use client';

import { motion } from 'framer-motion';

export function Reciprocity() {
    return (
        <section className="relative py-32 bg-void overflow-hidden">
            {/* Warm Light Background */}
            <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                    background: 'radial-gradient(circle at 50% 100%, rgba(255, 160, 0, 0.15) 0%, transparent 60%)',
                }}
            />

            <div className="relative z-10 w-[85%] max-w-[1400px] mx-auto">
                {/* === MANIFESTO SECTION === */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className=""
                >
                    <span className="font-mono text-xs text-amber-500 tracking-widest mb-4 block">
                        [ SECTION 5 : LA RÉCIPROCITÉ ]
                    </span>
                    {/* Title */}
                    <h2 className="font-headline text-white text-3xl md:text-5xl font-bold mb-12 tracking-tight">
                        NOUS SOMMES CLIENTS DE NOS CLIENTS.
                    </h2>

                    {/* Manifesto Text */}
                    <div className="font-sans text-gray-300 text-lg md:text-xl leading-relaxed space-y-8">
                        <p>
                            AETHER n'est pas une marque qui regarde ses clients de haut. Nos membres sont des entrepreneurs, des athlètes, des créateurs, des développeurs. <span className="text-white font-semibold">Vous bâtissez l'avenir.</span>
                        </p>

                        <div className="py-8 relative">
                            {/* Decorative Divider */}
                            <div className="absolute left-1/2 -translate-x-1/2 top-0 w-20 h-[1px] bg-amber-500/50"></div>
                            <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-20 h-[1px] bg-amber-500/50"></div>

                            <p className="italic text-white font-medium max-w-2xl mx-auto">
                                "Notre mission est humble mais critique : Assurer votre infrastructure biologique. Pour que vous puissiez performer, nous devons performer."
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-2xl mx-auto">
                            <div className="p-6 border border-white/10 bg-white/[0.02] rounded-machined">
                                <h4 className="font-mono text-cyan-400 text-xs mb-2 uppercase tracking-widest">Notre Apport</h4>
                                <p className="text-white text-base">Nous vous fournissons la clarté mentale et l'endurance.</p>
                            </div>
                            <div className="p-6 border border-white/10 bg-white/[0.02] rounded-machined">
                                <h4 className="font-mono text-amber-500 text-xs mb-2 uppercase tracking-widest">Votre Apport</h4>
                                <p className="text-white text-base">Vous nous fournissez l'exigence et la direction.</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

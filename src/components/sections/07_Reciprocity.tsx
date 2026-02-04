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
                    <h2 className="font-headline text-white text-3xl md:text-5xl font-bold mb-12 tracking-widest">
                        MEMBRES ≠ CLIENTS.
                    </h2>

                    {/* Minimalist Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-2xl text-sm">
                        <div className="p-6 border-l border-cyan-500 bg-white/[0.02]">
                            <h4 className="font-mono text-cyan-400 text-xs mb-2 uppercase tracking-widest">AETHER</h4>
                            <p className="text-white">Infrastructure biologique. Clarté mentale. Endurance.</p>
                        </div>
                        <div className="p-6 border-l border-amber-500 bg-white/[0.02]">
                            <h4 className="font-mono text-amber-500 text-xs mb-2 uppercase tracking-widest">VOUS</h4>
                            <p className="text-white">Exigence. Direction R&D. Feedback terrain.</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

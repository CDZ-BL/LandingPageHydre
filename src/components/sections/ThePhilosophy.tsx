'use client';

import { motion } from 'framer-motion';

export function ThePhilosophy() {
    return (
        <section className="relative py-32 bg-black overflow-hidden">
            {/* Subtle scanline effect */}
            <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    background: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.03), rgba(255,255,255,0.03) 1px, transparent 1px, transparent 2px)',
                }}
            />

            <div className="relative z-10 w-[85%] max-w-[900px] mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                >
                    {/* Title */}
                    <h2 className="font-mono text-white text-3xl md:text-5xl font-bold mb-12 tracking-tight">
                        LE RESPECT DE L'INTELLIGENCE.
                    </h2>

                    {/* Manifesto Text - Terminal Style */}
                    <div className="font-mono text-white text-base md:text-lg leading-loose space-y-6">
                        <p className="text-left">
                            Nous n'avons pas besoin de mascottes ou de néons pour vous convaincre.
                        </p>
                        <p className="text-left">
                            Nous parions sur le fait que vous savez lire une étiquette clinique.
                        </p>

                        <div className="h-12" />

                        <p className="text-left text-white">
                            AETHER n'est pas une dépense, c'est un <span className="text-neon-orange font-semibold">investissement structurel</span>.
                            Nous avons retiré tout ce qui n'améliore pas votre physiologie. Le superflu a été éliminé pour ne laisser que l'essentiel : L'Efficacité.
                        </p>

                        <div className="h-12" />

                        <p className="text-left text-white">
                            Ceci est pour ceux qui refusent le compromis imposé par le marché de masse.
                        </p>
                    </div>

                    {/* Cursor Blink Effect */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                        className="inline-block w-3 h-6 bg-neon-orange mt-8"
                    />
                </motion.div>
            </div>
        </section>
    );
}

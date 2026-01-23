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
                        NOUS AVONS TUÉ LE MARKETING.
                    </h2>

                    {/* Manifesto Text - Terminal Style */}
                    <div className="font-mono text-white text-base md:text-lg leading-loose space-y-6">
                        <p className="text-left">
                            Nous n'avons pas d'influenceurs qui dansent.
                        </p>
                        <p className="text-left">
                            Nous n'avons pas d'emballages fluo.
                        </p>
                        <p className="text-left">
                            Nous avons investi chaque centime dans ce qui se trouve dans le tube.
                        </p>

                        <div className="h-12" />

                        <p className="text-left text-white">
                            AETHER est une <span className="text-neon-orange font-semibold">anomalie économique</span> :
                            une marque qui respecte votre intelligence et votre biologie.
                        </p>

                        <div className="h-12" />

                        <p className="text-left text-white">
                            Ceci n'est pas pour tout le monde.
                        </p>
                        <p className="text-left text-white">
                            C'est pour ceux qui <span className="text-neon-orange font-semibold">lisent les étiquettes</span>.
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

'use client';

import { motion } from 'framer-motion';
import { TacticalGlass, TacticalReadout } from '@/components/ui/TacticalGlass';
import { DecryptText } from '@/components/ui/TerminalText';

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

            <div className="relative z-10 w-[85%] max-w-[1000px] mx-auto">
                <TacticalGlass label="MANIFESTO" className="p-8 md:p-16" hudBrackets={true}>
                    {/* Technical Corners */}
                    <div className="absolute top-2 left-2 text-[8px] font-mono text-cyan-600 opacity-40">ORIGIN.OSLO // B-01</div>
                    <div className="absolute top-2 right-2 text-[8px] font-mono text-cyan-600 opacity-40">AUTH.LEVEL // 05</div>
                    <div className="absolute bottom-2 left-2 text-[8px] font-mono text-cyan-600 opacity-40">COORD. 59.91°N</div>
                    <div className="absolute bottom-2 right-2 text-[8px] font-mono text-cyan-600 opacity-40">STAMP. 2024.08</div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Title */}
                        <h2 className="font-mono text-white text-3xl md:text-5xl font-bold mb-12 tracking-tight">
                            <DecryptText text="NOUS AVONS TUÉ LE MARKETING." />
                        </h2>

                        {/* Manifesto Text - Terminal Style */}
                        <div className="font-mono text-white text-base md:text-lg leading-loose space-y-6">
                            <p className="text-left">
                                <span className="text-void-500 mr-2">&gt;</span> Nous n'avons pas d'influenceurs qui dansent.
                            </p>
                            <p className="text-left">
                                <span className="text-void-500 mr-2">&gt;</span> Nous n'avons pas d'emballages fluo.
                            </p>
                            <p className="text-left">
                                <span className="text-void-500 mr-2">&gt;</span> Nous avons investi chaque centime dans ce qui se trouve dans le tube.
                            </p>

                            <div className="h-4" />

                            <p className="text-left text-white border-l-2 border-neon-cyan pl-6 py-2 bg-neon-cyan/5">
                                AETHER est une <span className="text-neon-cyan font-semibold">anomalie économique</span> :
                                une marque qui respecte votre intelligence et votre biologie.
                            </p>

                            <div className="h-4" />

                            <p className="text-left text-white">
                                <span className="text-void-500 mr-2">&gt;</span> Ceci n'est pas pour tout le monde.
                            </p>
                            <p className="text-left text-white font-bold text-neon-cyan">
                                <span className="text-neon-cyan mr-2">&gt;</span> C'est pour ceux qui <span className="underline underline-offset-4 decoration-neon-cyan/30">lisent les étiquettes</span>.
                            </p>
                        </div>

                        {/* Cursor Blink Effect */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [1, 0, 1] }}
                            transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                            className="inline-block w-3 h-6 bg-neon-cyan mt-12"
                        />
                    </motion.div>
                </TacticalGlass>

                {/* Bottom Telemetry */}
                <div className="mt-8 flex justify-center gap-8">
                    <TacticalReadout label="PHILOSOPHY" value="UNCOMPROMISED" />
                    <TacticalReadout label="PROTOCOL" value="ACT_V1" />
                </div>
            </div>
        </section>
    );
}

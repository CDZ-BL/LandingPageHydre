'use client';

import { motion } from 'framer-motion';

export function GlitchOverride() {
    return (
        <section className="relative bg-black py-24 md:py-32 overflow-hidden">
            {/* Intense Scanlines */}
            <div
                className="absolute inset-0 pointer-events-none z-10 opacity-60"
                style={{
                    background: `repeating-linear-gradient(
                        to bottom,
                        transparent 0px,
                        transparent 1px,
                        rgba(0, 0, 0, 0.9) 2px,
                        rgba(0, 0, 0, 0.9) 3px
                    )`
                }}
            />

            {/* Screen shake container */}
            <div className="relative z-20 w-[85%] max-w-[600px] mx-auto text-left animate-screen-shake">
                {/* Alert Badge - Blinking aggressively */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="inline-block font-mono text-red-500 text-xs tracking-widest mb-4 border-b border-red-500 pb-1 animate-aggressive-blink"
                >
                    [ SYSTEM_OVERRIDE // PROTOCOL VIOLATION ]
                </motion.div>

                {/* VIOLENT Glitch Title */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="relative mb-8"
                >
                    {/* Base text with shake */}
                    <h2 className="font-sans text-3xl md:text-5xl text-white font-black uppercase animate-text-shake">
                        RÈGLES DU MARCHÉ : BRISÉES.
                    </h2>

                    {/* Cyan glitch layer - AGGRESSIVE */}
                    <h2
                        className="absolute top-0 left-0 font-sans text-3xl md:text-5xl text-cyan-400 font-black uppercase opacity-90 mix-blend-screen animate-glitch-violent-1"
                        aria-hidden="true"
                    >
                        RÈGLES DU MARCHÉ : BRISÉES.
                    </h2>

                    {/* Red glitch layer - AGGRESSIVE */}
                    <h2
                        className="absolute top-0 left-0 font-sans text-3xl md:text-5xl text-red-600 font-black uppercase opacity-90 mix-blend-screen animate-glitch-violent-2"
                        aria-hidden="true"
                    >
                        RÈGLES DU MARCHÉ : BRISÉES.
                    </h2>

                    {/* Extra distortion layer */}
                    <h2
                        className="absolute top-0 left-0 font-sans text-3xl md:text-5xl text-white font-black uppercase opacity-50 animate-glitch-slice"
                        aria-hidden="true"
                    >
                        RÈGLES DU MARCHÉ : BRISÉES.
                    </h2>
                </motion.div>

                {/* Terminal Text - Corrupted */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="space-y-3 font-mono text-sm md:text-base"
                >
                    <p className="text-gray-400 animate-corrupt-flicker">
                        <span className="text-white">&gt;</span> ANALYSE : Le standard industriel (Sucre + Marge 80%) est incompatible avec l'architecture AETHER.
                    </p>
                    <p className="text-gray-400 animate-corrupt-flicker-2">
                        <span className="text-white">&gt;</span> ACTION : Réécriture du code source. Suppression des intermédiaires. Priorité aux actifs.
                    </p>
                    <p className="text-red-500 mt-4 animate-emergency-pulse font-bold">
                        <span className="text-white">&gt;</span> STATUS : ANOMALIE DÉTECTÉE. NE PAS REVENIR EN ARRIÈRE.
                    </p>
                </motion.div>

                {/* Random glitch bars */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="animate-glitch-bar-1 absolute left-0 right-0 h-2 bg-cyan-500/30" style={{ top: '20%' }} />
                    <div className="animate-glitch-bar-2 absolute left-0 right-0 h-1 bg-red-500/40" style={{ top: '60%' }} />
                    <div className="animate-glitch-bar-3 absolute left-0 right-0 h-3 bg-white/20" style={{ top: '80%' }} />
                </div>
            </div>

            {/* Aggressive CSS Animations */}
            <style>{`
                @keyframes screen-shake {
                    0%, 100% { transform: translate(0, 0); }
                    2% { transform: translate(-2px, 1px); }
                    4% { transform: translate(2px, -1px); }
                    6% { transform: translate(-1px, -1px); }
                    8% { transform: translate(1px, 1px); }
                    10% { transform: translate(0, 0); }
                    50% { transform: translate(0, 0); }
                    52% { transform: translate(3px, -2px); }
                    54% { transform: translate(-3px, 2px); }
                    56% { transform: translate(0, 0); }
                }

                @keyframes text-shake {
                    0%, 100% { transform: translate(0, 0) skewX(0deg); }
                    1% { transform: translate(-3px, 0) skewX(-2deg); }
                    2% { transform: translate(3px, 0) skewX(2deg); }
                    3% { transform: translate(0, 0) skewX(0deg); }
                    30% { transform: translate(0, 0) skewX(0deg); }
                    31% { transform: translate(2px, -1px) skewX(1deg); }
                    32% { transform: translate(-2px, 1px) skewX(-1deg); }
                    33% { transform: translate(0, 0) skewX(0deg); }
                    70% { transform: translate(0, 0) skewX(0deg); }
                    71% { transform: translate(-4px, 0) skewX(-3deg); }
                    72% { transform: translate(4px, 0) skewX(3deg); }
                    73% { transform: translate(0, 0) skewX(0deg); }
                }

                @keyframes glitch-violent-1 {
                    0%, 100% { 
                        clip-path: inset(0 0 0 0);
                        transform: translate(0, 0);
                    }
                    2% { 
                        clip-path: inset(10% 0 80% 0);
                        transform: translate(-8px, 0);
                    }
                    4% { 
                        clip-path: inset(70% 0 10% 0);
                        transform: translate(8px, 0);
                    }
                    6% { 
                        clip-path: inset(0 0 0 0);
                        transform: translate(0, 0);
                    }
                    20% { 
                        clip-path: inset(40% 0 40% 0);
                        transform: translate(-6px, 0);
                    }
                    22% { 
                        clip-path: inset(0 0 0 0);
                        transform: translate(0, 0);
                    }
                    50% { 
                        clip-path: inset(20% 0 60% 0);
                        transform: translate(10px, 0);
                    }
                    52% { 
                        clip-path: inset(80% 0 5% 0);
                        transform: translate(-10px, 0);
                    }
                    54% { 
                        clip-path: inset(0 0 0 0);
                        transform: translate(0, 0);
                    }
                    80% { 
                        clip-path: inset(5% 0 90% 0);
                        transform: translate(-5px, 0);
                    }
                    82% { 
                        clip-path: inset(0 0 0 0);
                        transform: translate(0, 0);
                    }
                }

                @keyframes glitch-violent-2 {
                    0%, 100% { 
                        clip-path: inset(0 0 0 0);
                        transform: translate(0, 0);
                    }
                    3% { 
                        clip-path: inset(60% 0 20% 0);
                        transform: translate(10px, 0);
                    }
                    5% { 
                        clip-path: inset(0 0 0 0);
                        transform: translate(0, 0);
                    }
                    15% { 
                        clip-path: inset(30% 0 50% 0);
                        transform: translate(-12px, 0);
                    }
                    17% { 
                        clip-path: inset(0 0 0 0);
                        transform: translate(0, 0);
                    }
                    45% { 
                        clip-path: inset(90% 0 5% 0);
                        transform: translate(8px, 0);
                    }
                    47% { 
                        clip-path: inset(5% 0 85% 0);
                        transform: translate(-8px, 0);
                    }
                    49% { 
                        clip-path: inset(0 0 0 0);
                        transform: translate(0, 0);
                    }
                    75% { 
                        clip-path: inset(50% 0 30% 0);
                        transform: translate(-6px, 0);
                    }
                    77% { 
                        clip-path: inset(0 0 0 0);
                        transform: translate(0, 0);
                    }
                }

                @keyframes glitch-slice {
                    0%, 100% { 
                        clip-path: inset(0 0 100% 0);
                        transform: translate(0, 0);
                    }
                    10% { 
                        clip-path: inset(45% 0 45% 0);
                        transform: translate(-20px, 0);
                    }
                    12% { 
                        clip-path: inset(0 0 100% 0);
                        transform: translate(0, 0);
                    }
                    40% { 
                        clip-path: inset(70% 0 20% 0);
                        transform: translate(15px, 0);
                    }
                    42% { 
                        clip-path: inset(0 0 100% 0);
                        transform: translate(0, 0);
                    }
                    60% { 
                        clip-path: inset(10% 0 80% 0);
                        transform: translate(-25px, 0);
                    }
                    62% { 
                        clip-path: inset(0 0 100% 0);
                        transform: translate(0, 0);
                    }
                }

                @keyframes aggressive-blink {
                    0%, 100% { opacity: 1; }
                    49% { opacity: 1; }
                    50% { opacity: 0; }
                    54% { opacity: 0; }
                    55% { opacity: 1; }
                    59% { opacity: 1; }
                    60% { opacity: 0; }
                    61% { opacity: 1; }
                }

                @keyframes corrupt-flicker {
                    0%, 100% { opacity: 1; transform: translate(0, 0); }
                    8% { opacity: 0.1; transform: translate(2px, 0); }
                    9% { opacity: 1; transform: translate(0, 0); }
                    15% { opacity: 0.3; transform: translate(-1px, 0); }
                    16% { opacity: 1; transform: translate(0, 0); }
                }

                @keyframes corrupt-flicker-2 {
                    0%, 100% { opacity: 1; transform: translate(0, 0); }
                    25% { opacity: 0.2; transform: translate(-2px, 0); }
                    26% { opacity: 1; transform: translate(0, 0); }
                    60% { opacity: 0.4; transform: translate(3px, 0); }
                    61% { opacity: 1; transform: translate(0, 0); }
                }

                @keyframes emergency-pulse {
                    0%, 100% { opacity: 1; text-shadow: 0 0 5px #ff0000; }
                    50% { opacity: 0.6; text-shadow: 0 0 20px #ff0000, 0 0 40px #ff0000; }
                }

                @keyframes glitch-bar-1 {
                    0%, 100% { opacity: 0; transform: scaleX(0); }
                    15% { opacity: 1; transform: scaleX(1); }
                    17% { opacity: 0; transform: scaleX(0); }
                    65% { opacity: 1; transform: scaleX(0.7); }
                    67% { opacity: 0; transform: scaleX(0); }
                }

                @keyframes glitch-bar-2 {
                    0%, 100% { opacity: 0; transform: scaleX(0); }
                    25% { opacity: 1; transform: scaleX(0.5); }
                    27% { opacity: 0; transform: scaleX(0); }
                    80% { opacity: 1; transform: scaleX(1); }
                    82% { opacity: 0; transform: scaleX(0); }
                }

                @keyframes glitch-bar-3 {
                    0%, 100% { opacity: 0; transform: scaleX(0); }
                    40% { opacity: 0.8; transform: scaleX(0.8); }
                    42% { opacity: 0; transform: scaleX(0); }
                    55% { opacity: 0.6; transform: scaleX(0.3); }
                    57% { opacity: 0; transform: scaleX(0); }
                }

                .animate-screen-shake { animation: screen-shake 2s infinite; }
                .animate-text-shake { animation: text-shake 1.5s infinite; }
                .animate-glitch-violent-1 { animation: glitch-violent-1 1.2s infinite; }
                .animate-glitch-violent-2 { animation: glitch-violent-2 1s infinite; }
                .animate-glitch-slice { animation: glitch-slice 2s infinite; }
                .animate-aggressive-blink { animation: aggressive-blink 0.8s infinite; }
                .animate-corrupt-flicker { animation: corrupt-flicker 3s infinite; }
                .animate-corrupt-flicker-2 { animation: corrupt-flicker-2 4s infinite; }
                .animate-emergency-pulse { animation: emergency-pulse 0.5s infinite; }
                .animate-glitch-bar-1 { animation: glitch-bar-1 3s infinite; }
                .animate-glitch-bar-2 { animation: glitch-bar-2 2.5s infinite; }
                .animate-glitch-bar-3 { animation: glitch-bar-3 4s infinite; }
            `}</style>
        </section>
    );
}

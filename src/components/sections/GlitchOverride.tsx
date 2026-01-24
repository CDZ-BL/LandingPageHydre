'use client';

import { motion } from 'framer-motion';

export function GlitchOverride() {
    return (
        <section className="relative bg-black py-16 md:py-24 mt-20 md:mt-32 mb-20 md:mb-32 overflow-hidden">
            {/* Heavy Scanlines */}
            <div
                className="absolute inset-0 pointer-events-none z-10 opacity-50"
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

            {/* Noise/static overlay */}
            <div className="absolute inset-0 pointer-events-none z-5 opacity-10 animate-noise"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* Screen shake container */}
            <div className="relative z-30 w-[90%] max-w-[700px] mx-auto text-center animate-screen-shake">

                {/* Alert Badge - Aggressive blink */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="inline-block font-mono text-red-500 text-xs tracking-widest mb-6 animate-hard-blink"
                >
                    [ SYSTEM_OVERRIDE // PROTOCOL VIOLATION ]
                </motion.div>

                {/* INTENSE Glitch Title with EXTREME TELEPORTING */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="relative mb-10"
                >
                    {/* Base text with intense shake */}
                    <h2 className="font-sans text-2xl sm:text-3xl md:text-5xl text-white font-black uppercase tracking-tight animate-text-distort">
                        RÈGLES DU MARCHÉ : BRISÉES.
                    </h2>

                    {/* Cyan glitch layer */}
                    <h2
                        className="absolute top-0 left-0 right-0 font-sans text-2xl sm:text-3xl md:text-5xl text-cyan-400 font-black uppercase tracking-tight opacity-80 mix-blend-screen animate-glitch-hard-1"
                        aria-hidden="true"
                    >
                        RÈGLES DU MARCHÉ : BRISÉES.
                    </h2>

                    {/* Red glitch layer */}
                    <h2
                        className="absolute top-0 left-0 right-0 font-sans text-2xl sm:text-3xl md:text-5xl text-red-500 font-black uppercase tracking-tight opacity-80 mix-blend-screen animate-glitch-hard-2"
                        aria-hidden="true"
                    >
                        RÈGLES DU MARCHÉ : BRISÉES.
                    </h2>

                    {/* EXTREME TELEPORT SLICE - Layer 1 */}
                    <h2
                        className="absolute top-0 left-0 right-0 font-sans text-2xl sm:text-3xl md:text-5xl text-white font-black uppercase tracking-tight animate-teleport-slice-1"
                        aria-hidden="true"
                    >
                        RÈGLES DU MARCHÉ : BRISÉES.
                    </h2>

                    {/* EXTREME TELEPORT SLICE - Layer 2 */}
                    <h2
                        className="absolute top-0 left-0 right-0 font-sans text-2xl sm:text-3xl md:text-5xl text-white font-black uppercase tracking-tight animate-teleport-slice-2"
                        aria-hidden="true"
                    >
                        RÈGLES DU MARCHÉ : BRISÉES.
                    </h2>

                    {/* EXTREME TELEPORT SLICE - Layer 3 */}
                    <h2
                        className="absolute top-0 left-0 right-0 font-sans text-2xl sm:text-3xl md:text-5xl text-white font-black uppercase tracking-tight opacity-90 animate-teleport-slice-3"
                        aria-hidden="true"
                    >
                        RÈGLES DU MARCHÉ : BRISÉES.
                    </h2>

                    {/* EXTREME TELEPORT SLICE - Layer 4 */}
                    <h2
                        className="absolute top-0 left-0 right-0 font-sans text-2xl sm:text-3xl md:text-5xl text-white font-black uppercase tracking-tight opacity-80 animate-teleport-slice-4"
                        aria-hidden="true"
                    >
                        RÈGLES DU MARCHÉ : BRISÉES.
                    </h2>
                </motion.div>

                {/* Terminal Text with corruption */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="space-y-4 font-mono text-sm md:text-base text-left max-w-xl mx-auto"
                >
                    <p className="text-gray-400 animate-line-teleport-1 relative">
                        <span className="text-white">&gt;</span> ANALYSE : Le standard industriel (Sucre + Marge 80%) est incompatible avec l'architecture AETHER.
                    </p>
                    <p className="text-gray-400 animate-line-teleport-2 relative">
                        <span className="text-white">&gt;</span> ACTION : Réécriture du code source. Suppression des intermédiaires. Priorité aux actifs.
                    </p>
                    <p className="text-red-500 mt-6 font-bold text-base md:text-lg animate-emergency-flash">
                        <span className="text-white">&gt;</span> STATUS : ANOMALIE DÉTECTÉE. NE PAS REVENIR EN ARRIÈRE.
                    </p>
                </motion.div>
            </div>

            {/* CSS Keyframes */}
            <style>{`
                @keyframes screen-shake {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    2% { transform: translate(-3px, 2px) rotate(-0.5deg); }
                    4% { transform: translate(3px, -2px) rotate(0.5deg); }
                    6% { transform: translate(-2px, -1px) rotate(-0.3deg); }
                    8% { transform: translate(2px, 1px) rotate(0.3deg); }
                    10% { transform: translate(0, 0) rotate(0deg); }
                    40% { transform: translate(0, 0) rotate(0deg); }
                    42% { transform: translate(-4px, 3px) rotate(-0.8deg); }
                    44% { transform: translate(4px, -3px) rotate(0.8deg); }
                    46% { transform: translate(0, 0) rotate(0deg); }
                    70% { transform: translate(0, 0) rotate(0deg); }
                    72% { transform: translate(2px, -1px) rotate(0.4deg); }
                    74% { transform: translate(-2px, 1px) rotate(-0.4deg); }
                    76% { transform: translate(0, 0) rotate(0deg); }
                }

                @keyframes text-distort {
                    0%, 100% { transform: translate(0, 0) skewX(0deg); filter: blur(0); }
                    3% { transform: translate(-5px, 0) skewX(-3deg); filter: blur(1px); }
                    6% { transform: translate(5px, 0) skewX(3deg); filter: blur(0); }
                    9% { transform: translate(0, 0) skewX(0deg); }
                    50% { transform: translate(0, 0) skewX(0deg); }
                    53% { transform: translate(-3px, 2px) skewX(-2deg); filter: blur(2px); }
                    56% { transform: translate(3px, -2px) skewX(2deg); filter: blur(0); }
                    59% { transform: translate(0, 0) skewX(0deg); }
                }

                @keyframes glitch-hard-1 {
                    0%, 100% { clip-path: inset(0 0 0 0); transform: translate(0, 0); }
                    5% { clip-path: inset(5% 0 85% 0); transform: translate(-12px, 0); }
                    10% { clip-path: inset(70% 0 10% 0); transform: translate(12px, 0); }
                    15% { clip-path: inset(0 0 0 0); transform: translate(0, 0); }
                    30% { clip-path: inset(0 0 0 0); transform: translate(0, 0); }
                    35% { clip-path: inset(40% 0 40% 0); transform: translate(-8px, 0); }
                    40% { clip-path: inset(0 0 0 0); transform: translate(0, 0); }
                    60% { clip-path: inset(15% 0 70% 0); transform: translate(15px, 0); }
                    65% { clip-path: inset(80% 0 5% 0); transform: translate(-15px, 0); }
                    70% { clip-path: inset(0 0 0 0); transform: translate(0, 0); }
                }

                @keyframes glitch-hard-2 {
                    0%, 100% { clip-path: inset(0 0 0 0); transform: translate(0, 0); }
                    8% { clip-path: inset(60% 0 20% 0); transform: translate(14px, 0); }
                    12% { clip-path: inset(0 0 0 0); transform: translate(0, 0); }
                    25% { clip-path: inset(20% 0 65% 0); transform: translate(-16px, 0); }
                    30% { clip-path: inset(0 0 0 0); transform: translate(0, 0); }
                    55% { clip-path: inset(90% 0 2% 0); transform: translate(10px, 0); }
                    62% { clip-path: inset(0 0 0 0); transform: translate(0, 0); }
                }

                /* EXTREME TELEPORT SLICES - Text fragments jumping wildly in 2D space */
                @keyframes teleport-slice-1 {
                    0%, 100% { clip-path: inset(0 0 100% 0); transform: translate(0, 0); opacity: 0; }
                    5% { clip-path: inset(0% 0 85% 0); transform: translate(-25vw, -60px); opacity: 0.9; }
                    8% { clip-path: inset(0 0 100% 0); transform: translate(0, 0); opacity: 0; }
                    25% { clip-path: inset(35% 0 50% 0); transform: translate(30vw, 75px); opacity: 1; }
                    28% { clip-path: inset(0 0 100% 0); transform: translate(0, 0); opacity: 0; }
                    45% { clip-path: inset(75% 0 10% 0); transform: translate(-28vw, -50px); opacity: 0.8; }
                    48% { clip-path: inset(0 0 100% 0); transform: translate(0, 0); opacity: 0; }
                    70% { clip-path: inset(20% 0 65% 0); transform: translate(22vw, 65px); opacity: 0.9; }
                    73% { clip-path: inset(0 0 100% 0); transform: translate(0, 0); opacity: 0; }
                }

                @keyframes teleport-slice-2 {
                    0%, 100% { clip-path: inset(0 0 100% 0); transform: translate(0, 0); opacity: 0; }
                    12% { clip-path: inset(50% 0 35% 0); transform: translate(32vw, -70px); opacity: 1; }
                    15% { clip-path: inset(0 0 100% 0); transform: translate(0, 0); opacity: 0; }
                    35% { clip-path: inset(10% 0 75% 0); transform: translate(-30vw, 80px); opacity: 0.9; }
                    38% { clip-path: inset(0 0 100% 0); transform: translate(0, 0); opacity: 0; }
                    58% { clip-path: inset(60% 0 25% 0); transform: translate(26vw, -55px); opacity: 0.8; }
                    61% { clip-path: inset(0 0 100% 0); transform: translate(0, 0); opacity: 0; }
                    82% { clip-path: inset(85% 0 5% 0); transform: translate(-24vw, 45px); opacity: 1; }
                    85% { clip-path: inset(0 0 100% 0); transform: translate(0, 0); opacity: 0; }
                }

                @keyframes teleport-slice-3 {
                    0%, 100% { clip-path: inset(0 0 100% 0); transform: translate(0, 0) skewX(0deg); opacity: 0; }
                    18% { clip-path: inset(25% 0 60% 0); transform: translate(-28vw, 70px) skewX(-15deg); opacity: 0.85; }
                    21% { clip-path: inset(0 0 100% 0); transform: translate(0, 0) skewX(0deg); opacity: 0; }
                    42% { clip-path: inset(70% 0 15% 0); transform: translate(25vw, -80px) skewX(10deg); opacity: 0.9; }
                    45% { clip-path: inset(0 0 100% 0); transform: translate(0, 0) skewX(0deg); opacity: 0; }
                    65% { clip-path: inset(5% 0 80% 0); transform: translate(-32vw, 60px) skewX(-20deg); opacity: 0.95; }
                    68% { clip-path: inset(0 0 100% 0); transform: translate(0, 0) skewX(0deg); opacity: 0; }
                    88% { clip-path: inset(45% 0 40% 0); transform: translate(30vw, -65px) skewX(12deg); opacity: 0.8; }
                    91% { clip-path: inset(0 0 100% 0); transform: translate(0, 0) skewX(0deg); opacity: 0; }
                }

                @keyframes teleport-slice-4 {
                    0%, 100% { clip-path: inset(0 0 100% 0); transform: translate(0, 0) scale(1); opacity: 0; }
                    8% { clip-path: inset(40% 0 45% 0); transform: translate(28vw, 85px) scale(1.2); opacity: 0.75; }
                    11% { clip-path: inset(0 0 100% 0); transform: translate(0, 0) scale(1); opacity: 0; }
                    30% { clip-path: inset(80% 0 8% 0); transform: translate(-26vw, -75px) scale(0.9); opacity: 0.85; }
                    33% { clip-path: inset(0 0 100% 0); transform: translate(0, 0) scale(1); opacity: 0; }
                    52% { clip-path: inset(15% 0 70% 0); transform: translate(33vw, 55px) scale(1.1); opacity: 0.9; }
                    55% { clip-path: inset(0 0 100% 0); transform: translate(0, 0) scale(1); opacity: 0; }
                    75% { clip-path: inset(55% 0 30% 0); transform: translate(-30vw, -90px) scale(1.15); opacity: 0.7; }
                    78% { clip-path: inset(0 0 100% 0); transform: translate(0, 0) scale(1); opacity: 0; }
                }

                @keyframes hard-blink {
                    0%, 100% { opacity: 1; }
                    45% { opacity: 1; }
                    46% { opacity: 0; }
                    48% { opacity: 1; }
                    49% { opacity: 0; }
                    51% { opacity: 1; }
                    70% { opacity: 1; }
                    71% { opacity: 0; }
                    73% { opacity: 1; }
                }

                /* Line teleporting - text lines jump around */
                @keyframes line-teleport-1 {
                    0%, 100% { transform: translate(0, 0); opacity: 1; }
                    15% { transform: translate(30px, 0); opacity: 0.3; }
                    17% { transform: translate(-50px, 0); opacity: 0.8; }
                    19% { transform: translate(0, 0); opacity: 1; }
                    50% { transform: translate(0, 0); opacity: 1; }
                    52% { transform: translate(-40px, 5px); opacity: 0.2; }
                    54% { transform: translate(25px, -5px); opacity: 0.9; }
                    56% { transform: translate(0, 0); opacity: 1; }
                    80% { transform: translate(0, 0); opacity: 1; }
                    82% { transform: translate(60px, 0); opacity: 0.4; }
                    84% { transform: translate(0, 0); opacity: 1; }
                }

                @keyframes line-teleport-2 {
                    0%, 100% { transform: translate(0, 0); opacity: 1; }
                    25% { transform: translate(-45px, -3px); opacity: 0.4; }
                    27% { transform: translate(35px, 0); opacity: 0.7; }
                    29% { transform: translate(0, 0); opacity: 1; }
                    60% { transform: translate(0, 0); opacity: 1; }
                    62% { transform: translate(55px, 8px); opacity: 0.3; }
                    64% { transform: translate(-30px, -4px); opacity: 0.8; }
                    66% { transform: translate(0, 0); opacity: 1; }
                }

                @keyframes emergency-flash {
                    0%, 100% { opacity: 1; text-shadow: 0 0 5px #ff0000; }
                    25% { opacity: 1; text-shadow: 0 0 30px #ff0000, 0 0 60px #ff0000; }
                    30% { opacity: 0.3; text-shadow: 0 0 5px #ff0000; }
                    35% { opacity: 1; text-shadow: 0 0 20px #ff0000; }
                    75% { opacity: 1; text-shadow: 0 0 5px #ff0000; }
                    80% { opacity: 0.2; text-shadow: 0 0 40px #ff0000; }
                    85% { opacity: 1; text-shadow: 0 0 5px #ff0000; }
                }

                @keyframes noise {
                    0%, 100% { transform: translate(0, 0); }
                    10% { transform: translate(-5%, -5%); }
                    20% { transform: translate(5%, 5%); }
                    30% { transform: translate(-5%, 5%); }
                    40% { transform: translate(5%, -5%); }
                    50% { transform: translate(-3%, -3%); }
                    60% { transform: translate(3%, 3%); }
                    70% { transform: translate(-3%, 3%); }
                    80% { transform: translate(3%, -3%); }
                    90% { transform: translate(-1%, -1%); }
                }

                .animate-screen-shake { animation: screen-shake 1.5s infinite; }
                .animate-text-distort { animation: text-distort 2s infinite; }
                .animate-glitch-hard-1 { animation: glitch-hard-1 0.8s infinite; }
                .animate-glitch-hard-2 { animation: glitch-hard-2 0.6s infinite; }
                .animate-teleport-slice-1 { animation: teleport-slice-1 1.2s infinite; }
                .animate-teleport-slice-2 { animation: teleport-slice-2 1.4s infinite; }
                .animate-teleport-slice-3 { animation: teleport-slice-3 1.1s infinite; }
                .animate-teleport-slice-4 { animation: teleport-slice-4 1.3s infinite; }
                .animate-hard-blink { animation: hard-blink 0.6s infinite; }
                .animate-line-teleport-1 { animation: line-teleport-1 2s infinite; }
                .animate-line-teleport-2 { animation: line-teleport-2 2.5s infinite; }
                .animate-emergency-flash { animation: emergency-flash 1s infinite; }
                .animate-noise { animation: noise 0.5s infinite steps(10); }
            `}</style>
        </section>
    );
}

'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

export function SystemFailure() {
    const [isHolding, setIsHolding] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const holdStartRef = useRef<number | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const stableSectionRef = useRef<HTMLElement | null>(null);

    const HOLD_DURATION = 10000; // 10 seconds

    const [showFlash, setShowFlash] = useState(false);

    const updateProgress = useCallback(() => {
        if (!holdStartRef.current) return;

        const elapsed = Date.now() - holdStartRef.current;
        const newProgress = Math.min((elapsed / HOLD_DURATION) * 100, 100);
        setProgress(newProgress);

        if (newProgress >= 100) {
            setIsComplete(true);
            setIsHolding(false);

            // Flash effect before teleport
            setShowFlash(true);

            // Instant teleport after brief flash
            setTimeout(() => {
                if (stableSectionRef.current) {
                    stableSectionRef.current.scrollIntoView({ behavior: 'instant' });
                }
                // Hide flash after teleport
                setTimeout(() => setShowFlash(false), 200);
            }, 150);
        } else {
            animationFrameRef.current = requestAnimationFrame(updateProgress);
        }
    }, []);

    const handleHoldStart = () => {
        if (isComplete) return;
        setIsHolding(true);
        holdStartRef.current = Date.now();
        animationFrameRef.current = requestAnimationFrame(updateProgress);
    };

    const handleHoldEnd = () => {
        setIsHolding(false);
        holdStartRef.current = null;
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
        if (!isComplete) {
            setProgress(0);
        }
    };

    useEffect(() => {
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    return (
        <>
            {/* TELEPORT FLASH OVERLAY */}
            {showFlash && (
                <div
                    className="fixed inset-0 z-[9999] bg-white pointer-events-none animate-flash-out"
                    style={{
                        animation: 'flashOut 350ms ease-out forwards'
                    }}
                />
            )}
            <style>{`
                @keyframes flashOut {
                    0% { opacity: 1; }
                    100% { opacity: 0; }
                }
            `}</style>

            {/* ═══════════════════════════════════════════════════════════════════
                PART 1: GLITCHED SECTION - The corrupted system
            ════════════════════════════════════════════════════════════════════ */}
            <section className="relative bg-black py-16 md:py-24 mt-20 md:mt-32 overflow-hidden">
                {/* Heavy Scanlines - only when not holding */}
                <div
                    className={`absolute inset-0 pointer-events-none z-10 transition-opacity duration-300 ${isHolding ? 'opacity-0' : 'opacity-50'}`}
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

                {/* Noise/static overlay - only when not holding */}
                <div className={`absolute inset-0 pointer-events-none z-5 transition-opacity duration-300 ${isHolding ? 'opacity-0' : 'opacity-10'} ${isHolding ? '' : 'animate-noise'}`}
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    }}
                />

                {/* Screen shake container - stops shaking when holding */}
                <div className={`relative z-30 w-[85%] max-w-[1400px] mx-auto text-center ${isHolding ? '' : 'animate-screen-shake'}`}>

                    {/* Alert Badge - Aggressive blink */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                        className={`inline-block font-mono text-red-500 text-xs tracking-widest mb-6 ${isHolding ? '' : 'animate-hard-blink'}`}
                    >
                        [ SYSTEM_UPDATE // STANDARD CALIBRATION ]
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
                        <h2 className={`font-headline text-2xl sm:text-3xl md:text-5xl text-white font-black uppercase tracking-tight ${isHolding ? '' : 'animate-text-distort'}`}>
                            /// SYSTEME CORROMPU : MISE À JOUR FORCÉE ///
                        </h2>

                        {/* Cyan glitch layer - hidden when holding */}
                        <h2
                            className={`absolute top-0 left-0 right-0 font-sans text-2xl sm:text-3xl md:text-5xl text-cyan-400 font-black uppercase tracking-tight mix-blend-screen transition-opacity duration-300 ${isHolding ? 'opacity-0' : 'opacity-80 animate-glitch-hard-1'}`}
                            aria-hidden="true"
                        >
                            /// SYSTEME CORROMPU : MISE À JOUR FORCÉE ///
                        </h2>

                        {/* Red glitch layer - hidden when holding */}
                        <h2
                            className={`absolute top-0 left-0 right-0 font-sans text-2xl sm:text-3xl md:text-5xl text-red-500 font-black uppercase tracking-tight mix-blend-screen transition-opacity duration-300 ${isHolding ? 'opacity-0' : 'opacity-80 animate-glitch-hard-2'}`}
                            aria-hidden="true"
                        >
                            /// SYSTEME CORROMPU : MISE À JOUR FORCÉE ///
                        </h2>

                        {/* EXTREME TELEPORT SLICES - hidden when holding */}
                        <h2 className={`absolute top-0 left-0 right-0 font-sans text-2xl sm:text-3xl md:text-5xl text-white font-black uppercase tracking-tight transition-opacity duration-300 ${isHolding ? 'opacity-0' : 'animate-teleport-slice-1'}`} aria-hidden="true">
                            /// SYSTEME CORROMPU : MISE À JOUR FORCÉE ///
                        </h2>
                        <h2 className={`absolute top-0 left-0 right-0 font-sans text-2xl sm:text-3xl md:text-5xl text-white font-black uppercase tracking-tight transition-opacity duration-300 ${isHolding ? 'opacity-0' : 'animate-teleport-slice-2'}`} aria-hidden="true">
                            /// SYSTEME CORROMPU : MISE À JOUR FORCÉE ///
                        </h2>
                        <h2 className={`absolute top-0 left-0 right-0 font-sans text-2xl sm:text-3xl md:text-5xl text-white font-black uppercase tracking-tight transition-opacity duration-300 ${isHolding ? 'opacity-0' : 'opacity-90 animate-teleport-slice-3'}`} aria-hidden="true">
                            /// SYSTEME CORROMPU : MISE À JOUR FORCÉE ///
                        </h2>
                        <h2 className={`absolute top-0 left-0 right-0 font-sans text-2xl sm:text-3xl md:text-5xl text-white font-black uppercase tracking-tight transition-opacity duration-300 ${isHolding ? 'opacity-0' : 'opacity-80 animate-teleport-slice-4'}`} aria-hidden="true">
                            /// SYSTEME CORROMPU : MISE À JOUR FORCÉE ///
                        </h2>
                    </motion.div>

                    {/* Terminal Text - THE PROBLEM */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="space-y-6 font-mono text-sm md:text-base border-l-2 border-white/10 pl-6 my-12 text-left max-w-xl mx-auto"
                    >
                        {/* HEADER TECHNIQUE */}
                        <div className="text-[#E6DCC8] text-xs tracking-widest uppercase mb-4">
                            [ M.A.J SYSTEME // EFFACEMENT DES TAXES // DIMINUTION DU PRIX ]
                        </div>

                        {/* TITRE PRINCIPAL */}
                        <h3 className="font-headline text-2xl md:text-3xl text-white mb-6">
                            /// TAXE MARKETING : SUPPRIMÉE ///
                        </h3>

                        {/* LE LOGICIEL DU CHANGEMENT */}
                        <div className="space-y-4">
                            {/* 1. LE CONSTAT */}
                            <div className={`text-white/80 ${isHolding ? '' : 'animate-line-teleport-1'}`}>
                                <span className="text-[#E6DCC8] font-bold mr-2">{'>'} ANALYSE :</span>
                                Le marché est BRISÉ. Les leaders dominent par le budget pub, plus par la qualité. Nous payons 70% de "taxe MARKETING" pour nos produits.
                            </div>

                            {/* 1.5 LA CONSEQUENCE */}
                            <div className={`text-red-400/90 ${isHolding ? '' : 'animate-line-teleport-1'}`}>
                                <span className="text-red-500 font-bold mr-2">{'>'} CONSÉQUENCE :</span>
                                PRIX TROP ÉLEVÉS. QUALITÉ DIMINUÉE.
                            </div>

                            {/* 2. L'ACTION CORRECTIVE */}
                            <div className={`text-white/80 ${isHolding ? '' : 'animate-emergency-flash'}`}>
                                <span className="text-[#E6DCC8] font-bold mr-2">{'>'} AMÉLIORATION :</span>
                                SUPPRESSION DE LA TAXE MARKETING. AUGMENTATION DE L'INVESTISSEMENT DANS LA FORMULATION.
                            </div>
                        </div>
                    </motion.div>

                    {/* ═══════════════════════════════════════════════════════════════════
                        HOLD TO UPDATE BUTTON
                    ════════════════════════════════════════════════════════════════════ */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, margin: "-50px" }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="mt-12 flex flex-col items-center"
                    >
                        {/* Hold Button with Circular Progress */}
                        <div className="relative">
                            {/* Circular progress ring */}
                            <svg
                                className="absolute -inset-4 w-[calc(100%+32px)] h-[calc(100%+32px)] -rotate-90"
                                viewBox="0 0 100 100"
                            >
                                {/* Background circle */}
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="45"
                                    fill="none"
                                    stroke="rgba(255,255,255,0.1)"
                                    strokeWidth="2"
                                />
                                {/* Progress circle */}
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="45"
                                    fill="none"
                                    stroke={isComplete ? "#10B981" : "#E6DCC8"}
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeDasharray={`${progress * 2.83} 283`}
                                    className="transition-all duration-100"
                                />
                            </svg>

                            {/* The Button */}
                            <button
                                onMouseDown={handleHoldStart}
                                onMouseUp={handleHoldEnd}
                                onMouseLeave={handleHoldEnd}
                                onTouchStart={handleHoldStart}
                                onTouchEnd={handleHoldEnd}
                                disabled={isComplete}
                                className={`
                                    relative px-8 py-4 font-mono text-sm tracking-widest uppercase
                                    border-2 transition-all duration-300 select-none
                                    ${isComplete
                                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 cursor-default'
                                        : isHolding
                                            ? 'bg-[#E6DCC8]/20 border-[#E6DCC8] text-[#E6DCC8] scale-95'
                                            : 'bg-transparent border-red-500/50 text-red-400 hover:border-red-500 hover:bg-red-500/10'}
                                `}
                            >
                                {isComplete
                                    ? '✓ MISE À JOUR TERMINÉE'
                                    : isHolding
                                        ? `CHARGEMENT... ${Math.floor(progress)}%`
                                        : '⟳ MAINTENIR POUR CORRIGER'}
                            </button>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-8 w-full max-w-md">
                            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    className={`h-full ${isComplete ? 'bg-emerald-500' : 'bg-[#E6DCC8]'}`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.1 }}
                                />
                            </div>
                            <div className="mt-2 flex justify-between text-xs font-mono text-white/30">
                                <span>0%</span>
                                <span className={isHolding ? 'text-[#E6DCC8]' : ''}>
                                    {isHolding ? 'CORRECTION EN COURS...' : 'MAINTENEZ 10 SECONDES'}
                                </span>
                                <span>100%</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* CSS Keyframes for glitch effects */}
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
                    }

                    @keyframes glitch-hard-2 {
                        0%, 100% { clip-path: inset(0 0 0 0); transform: translate(0, 0); }
                        8% { clip-path: inset(60% 0 20% 0); transform: translate(14px, 0); }
                        12% { clip-path: inset(0 0 0 0); transform: translate(0, 0); }
                        25% { clip-path: inset(20% 0 65% 0); transform: translate(-16px, 0); }
                        30% { clip-path: inset(0 0 0 0); transform: translate(0, 0); }
                    }

                    @keyframes teleport-slice-1 {
                        0%, 100% { clip-path: inset(0 0 100% 0); transform: translate(0, 0); opacity: 0; }
                        5% { clip-path: inset(0% 0 85% 0); transform: translate(-25vw, -60px); opacity: 0.9; }
                        8% { clip-path: inset(0 0 100% 0); transform: translate(0, 0); opacity: 0; }
                        25% { clip-path: inset(35% 0 50% 0); transform: translate(30vw, 75px); opacity: 1; }
                        28% { clip-path: inset(0 0 100% 0); transform: translate(0, 0); opacity: 0; }
                    }

                    @keyframes teleport-slice-2 {
                        0%, 100% { clip-path: inset(0 0 100% 0); transform: translate(0, 0); opacity: 0; }
                        12% { clip-path: inset(50% 0 35% 0); transform: translate(32vw, -70px); opacity: 1; }
                        15% { clip-path: inset(0 0 100% 0); transform: translate(0, 0); opacity: 0; }
                        35% { clip-path: inset(10% 0 75% 0); transform: translate(-30vw, 80px); opacity: 0.9; }
                        38% { clip-path: inset(0 0 100% 0); transform: translate(0, 0); opacity: 0; }
                    }

                    @keyframes teleport-slice-3 {
                        0%, 100% { clip-path: inset(0 0 100% 0); transform: translate(0, 0) skewX(0deg); opacity: 0; }
                        18% { clip-path: inset(25% 0 60% 0); transform: translate(-28vw, 70px) skewX(-15deg); opacity: 0.85; }
                        21% { clip-path: inset(0 0 100% 0); transform: translate(0, 0) skewX(0deg); opacity: 0; }
                        42% { clip-path: inset(70% 0 15% 0); transform: translate(25vw, -80px) skewX(10deg); opacity: 0.9; }
                        45% { clip-path: inset(0 0 100% 0); transform: translate(0, 0) skewX(0deg); opacity: 0; }
                    }

                    @keyframes teleport-slice-4 {
                        0%, 100% { clip-path: inset(0 0 100% 0); transform: translate(0, 0) scale(1); opacity: 0; }
                        8% { clip-path: inset(40% 0 45% 0); transform: translate(28vw, 85px) scale(1.2); opacity: 0.75; }
                        11% { clip-path: inset(0 0 100% 0); transform: translate(0, 0) scale(1); opacity: 0; }
                        30% { clip-path: inset(80% 0 8% 0); transform: translate(-26vw, -75px) scale(0.9); opacity: 0.85; }
                        33% { clip-path: inset(0 0 100% 0); transform: translate(0, 0) scale(1); opacity: 0; }
                    }

                    @keyframes hard-blink {
                        0%, 100% { opacity: 1; }
                        45% { opacity: 1; }
                        46% { opacity: 0; }
                        48% { opacity: 1; }
                        49% { opacity: 0; }
                        51% { opacity: 1; }
                    }

                    @keyframes line-teleport-1 {
                        0%, 100% { transform: translate(0, 0); opacity: 1; }
                        15% { transform: translate(30px, 0); opacity: 0.3; }
                        17% { transform: translate(-50px, 0); opacity: 0.8; }
                        19% { transform: translate(0, 0); opacity: 1; }
                        50% { transform: translate(0, 0); opacity: 1; }
                        52% { transform: translate(-40px, 5px); opacity: 0.2; }
                        54% { transform: translate(25px, -5px); opacity: 0.9; }
                        56% { transform: translate(0, 0); opacity: 1; }
                    }

                    @keyframes emergency-flash {
                        0%, 100% { opacity: 1; text-shadow: 0 0 5px #ff0000; }
                        25% { opacity: 1; text-shadow: 0 0 30px #ff0000, 0 0 60px #ff0000; }
                        30% { opacity: 0.3; text-shadow: 0 0 5px #ff0000; }
                        35% { opacity: 1; text-shadow: 0 0 20px #ff0000; }
                    }

                    @keyframes noise {
                        0%, 100% { transform: translate(0, 0); }
                        10% { transform: translate(-5%, -5%); }
                        20% { transform: translate(5%, 5%); }
                        30% { transform: translate(-5%, 5%); }
                        40% { transform: translate(5%, -5%); }
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
                    .animate-emergency-flash { animation: emergency-flash 1s infinite; }
                    .animate-noise { animation: noise 0.5s infinite steps(10); }
                `}</style>
            </section>

            {/* ═══════════════════════════════════════════════════════════════════
                PART 2: CALM SECTION - The fix is applied, system is stable
            ════════════════════════════════════════════════════════════════════ */}
            <section
                ref={stableSectionRef}
                className="relative bg-void py-24 md:py-32 mb-20 md:mb-32 overflow-hidden"
            >

                <div className="relative w-[85%] max-w-[1400px] mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="text-center relative"
                    >
                        {/* Content container with hover shadow */}
                        <div className="relative inline-block">
                            {/* Success indicator */}
                            <div className="inline-flex items-center gap-3 mb-8 px-6 py-3 border border-emerald-500/30 bg-emerald-500/5 rounded-sm">
                                <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                                <span className="font-mono text-emerald-500 text-sm tracking-widest">
                                    SYSTÈME STABILISÉ
                                </span>
                            </div>

                            {/* Main message */}
                            <h3 className="font-headline text-3xl md:text-5xl text-white font-bold mb-6">
                                <span className="text-[#E6DCC8]">MISE À JOUR EFFECTUÉE :</span>
                            </h3>

                            <p className="font-sans text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed">
                                Le prix est maintenant <span className="text-emerald-400 font-semibold">diminué</span>.
                                <br />
                                La qualité est <span className="text-emerald-400 font-semibold">augmentée</span>.
                            </p>

                            {/* Ground shadow - creates hovering effect */}
                            <div
                                className="absolute -bottom-16 left-1/2 -translate-x-1/2"
                                style={{
                                    width: '80%',
                                    height: '40px',
                                    background: 'radial-gradient(ellipse 100% 100% at 50% 50%, rgba(0,0,0,0.5) 0%, transparent 70%)',
                                    filter: 'blur(15px)',
                                }}
                            />
                        </div>

                        {/* Decorative line */}
                        <div className="mt-16 mx-auto w-24 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                    </motion.div>
                </div>
            </section>
        </>
    );
}

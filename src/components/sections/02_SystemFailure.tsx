'use client';

import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useLenis } from 'lenis/react';

gsap.registerPlugin(ScrollTrigger);

// ═══════════════════════════════════════════════════════════════════════════
//  CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════
const RING_RADIUS = 45;
const CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export function SystemFailure() {
    const containerRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<SVGCircleElement>(null);
    const percentRef = useRef<HTMLSpanElement>(null);
    const teleportedRef = useRef(false);
    const stableContentRef = useRef<HTMLDivElement>(null);
    const stableCenterRef = useRef<HTMLDivElement>(null);

    // We only use React state for the "complete" flag — it controls structural DOM changes
    const [isComplete, setIsComplete] = useState(false);

    const lenis = useLenis();

    // ─────────────────────────────────────────────────────────────────────
    //  TELEPORT — The Visual Rupture (KINETIC KILL-SWITCH PROTOCOL)
    // ─────────────────────────────────────────────────────────────────────
    const executeTeleport = () => {
        if (teleportedRef.current) return;
        teleportedRef.current = true;

        // 1. ENGINE SHUTDOWN
        if (lenis) lenis.stop();

        // 2. THE KINETIC KILL-SWITCH
        // Physically destroy hardware momentum from Apple trackpads/touch screens
        const killInertia = (e: Event) => e.preventDefault();
        window.addEventListener('wheel', killInertia, { passive: false });
        window.addEventListener('touchmove', killInertia, { passive: false });

        // 3. THE FARADAY CAGE
        // Lock both body AND html to prevent iOS Safari bleed
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';

        const trigger = ScrollTrigger.getById("failure-runway-st");
        if (trigger) trigger.kill();

        document.querySelectorAll('.sticky-core [class*="animate-"]').forEach((el) => {
            (el as HTMLElement).style.animation = 'none';
        });

        // 1. MASSIVE DEPTH OF FIELD
        // We push the camera back to 4000px so nothing clips behind the user's head.
        gsap.set('.sticky-core', {
            perspective: 4000,
            transformStyle: "preserve-3d",
            willChange: 'transform, opacity'
        });

        gsap.set(['.animate-text-distort', '.animate-glitch-hard-1', '.animate-glitch-hard-2'], {
            willChange: 'transform, opacity'
        });

        const punctureTl = gsap.timeline({
            onComplete: () => {

                gsap.set('#stable-section', { position: 'fixed', top: 0, left: 0, width: '100%', height: '100dvh', zIndex: 9999 });

                const stableEl = stableContentRef.current;
                if (!stableEl) return;

                // Sync the arrival camera to the same 4000px depth
                gsap.set(stableEl, { opacity: 1, perspective: 4000, transformStyle: "preserve-3d" });

                const arrivalElements = [
                    stableEl.querySelector('h3'),
                    stableEl.querySelector('p'),
                    stableEl.querySelector('.inline-flex'),
                    stableEl.querySelector('.absolute.-bottom-16')
                ];

                // 2. CINEMATIC REASSEMBLY MATH
                gsap.fromTo(arrivalElements,
                    {
                        z: 2800, // Very deep, but safely IN FRONT of the 4000px camera
                        scale: 3, // Reduced from 8 to prevent GPU frame dropping
                        opacity: 0,
                        filter: 'blur(20px)', // Reduced from 40px to guarantee 60FPS on mobile
                        rotationX: () => gsap.utils.random(-45, 45),
                        rotationY: () => gsap.utils.random(-45, 45),
                        rotationZ: () => gsap.utils.random(-15, 15),
                        x: () => gsap.utils.random(-window.innerWidth * 0.6, window.innerWidth * 0.6),
                        y: () => gsap.utils.random(-window.innerHeight * 0.6, window.innerHeight * 0.6),
                        willChange: 'transform, opacity, filter'
                    },
                    {
                        z: 0,
                        scale: 1,
                        opacity: 1,
                        filter: 'blur(0px)',
                        rotationX: 0,
                        rotationY: 0,
                        rotationZ: 0,
                        x: 0,
                        y: 0,
                        duration: 2.2, // Extended from 1.5s to 2.2s for majesty
                        stagger: 0.15,
                        ease: 'power3.out', // Changed from expo.out. Power3 is cinematic and smooth, not aggressive.
                        onComplete: () => {
                            if (containerRef.current) containerRef.current.style.display = 'none';
                            setIsComplete(true);

                            void document.body.offsetHeight;
                            ScrollTrigger.refresh();
                            if (lenis) lenis.resize();

                            gsap.set('#stable-section', { clearProps: 'position, top, left, width, height, zIndex' });

                            const target = document.querySelector('#stable-section');
                            if (target) {
                                const targetY = target.getBoundingClientRect().top + window.scrollY;
                                window.scrollTo(0, targetY);

                                // 4. DISENGAGE KILL-SWITCH & FARADAY CAGE
                                // Only release the locks once the new coordinates are absolute
                                document.body.style.overflow = '';
                                document.documentElement.style.overflow = '';
                                window.removeEventListener('wheel', killInertia);
                                window.removeEventListener('touchmove', killInertia);

                                if (lenis) {
                                    lenis.scrollTo(targetY, { immediate: true, force: true });
                                    lenis.start();
                                }
                            }

                            gsap.set([stableEl, ...arrivalElements], { clearProps: 'transform, filter, willChange' });
                        }
                    }
                );
            }
        });

        // ═══════════════════════════════════════════════════════════════
        //  EXECUTE THE 3D TEAR (DEPARTURE)
        // ═══════════════════════════════════════════════════════════════
        // Pushed z targets back so they don't clip through the new 4000px camera too early
        punctureTl.to('.sticky-core', { scale: 5, opacity: 0, duration: 1.2, ease: 'expo.in' }, 0);
        punctureTl.to('.space-y-6.font-mono', { y: 200, z: -800, scale: 0.5, opacity: 0, duration: 1.0, ease: 'power3.in' }, 0);
        punctureTl.to('.animate-text-distort', { scale: 30, z: 2500, rotationZ: 15, opacity: 0, duration: 1.2, ease: 'expo.in' }, 0);

        punctureTl.to('.animate-glitch-hard-1', {
            scale: 60, z: 3000, x: -window.innerWidth * 0.8, y: window.innerHeight * 0.5,
            rotationZ: -35, opacity: 0, duration: 1.1, ease: 'expo.in'
        }, 0);

        punctureTl.to('.animate-glitch-hard-2', {
            scale: 50, z: 3500, x: window.innerWidth * 0.8, y: -window.innerHeight * 0.5,
            rotationZ: 45, opacity: 0, duration: 0.9, ease: 'expo.in'
        }, 0);
    };

    // ─────────────────────────────────────────────────────────────────────
    //  GSAP SCROLL ENGINE — Hardware-accelerated, SSR-safe, auto-cleanup
    // ─────────────────────────────────────────────────────────────────────
    useGSAP(
        () => {
            if (!containerRef.current || !ringRef.current) return;

            // Initialize SVG ring to empty
            gsap.set(ringRef.current, {
                strokeDasharray: CIRCUMFERENCE,
                strokeDashoffset: CIRCUMFERENCE,
            });

            // The Master Timeline — scrubbed by scroll position
            gsap.timeline({
                scrollTrigger: {
                    id: "failure-runway-st", // <--- ADD THIS EXACT LINE
                    trigger: containerRef.current,
                    start: 'top top',
                    end: '+=1080dvh', // Scroll runway
                    pin: '.sticky-core', // Pins the UI while invisible runway scrolls
                    scrub: 0.1, // Minimal smoothing to filter OS scroll jitter
                    onUpdate: (self) => {
                        if (teleportedRef.current) return;

                        // ─── DIRECT DOM MUTATION. ZERO REACT RE-RENDERS. ───
                        const currentOffset =
                            CIRCUMFERENCE - CIRCUMFERENCE * self.progress;
                        if (ringRef.current) {
                            ringRef.current.style.strokeDashoffset =
                                String(currentOffset);
                        }

                        // Update percentage display — direct DOM, no setState
                        if (percentRef.current) {
                            percentRef.current.textContent = `${Math.floor(
                                self.progress * 100
                            )}%`;
                        }

                        // The Teleport Threshold
                        if (self.progress >= 0.99) {
                            executeTeleport();
                        }
                    },
                },
            });
        },
        { scope: containerRef }
    );



    // ─────────────────────────────────────────────────────────────────────
    //  RENDER (STATE-BOUND ARCHITECTURE)
    // ─────────────────────────────────────────────────────────────────────
    return (
        <>
            {/* ═══════════════════════════════════════════════════════════════
                SCROLL RUNWAY — Dies permanently when isComplete is true
            ════════════════════════════════════════════════════════════════ */}
            <section
                id="system-failure-section"
                ref={containerRef}
                className={`relative w-full bg-black ${isComplete ? 'hidden' : 'block'}`}
                style={{ height: isComplete ? '0px' : '1180dvh' }}
            >
                <div className="sticky-core sticky top-0 h-[100dvh] w-full flex flex-col items-center justify-center overflow-hidden">

                    <div className="absolute inset-0 pointer-events-none z-10 opacity-50" style={{ background: `repeating-linear-gradient(to bottom, transparent 0px, transparent 1px, rgba(0, 0, 0, 0.9) 2px, rgba(0, 0, 0, 0.9) 3px)` }} />

                    <div className="absolute inset-0 pointer-events-none z-5 opacity-10 animate-noise" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />

                    <div className="relative z-30 w-[85%] max-w-[1400px] mx-auto text-center animate-screen-shake">

                        <div className="inline-block font-mono text-neon-orange text-xs tracking-widest mb-6 animate-hard-blink">
                            [ SYSTEM_UPDATE // STANDARD CALIBRATION ]
                        </div>

                        <div className="relative mb-8">
                            <h2 className="font-headline text-2xl sm:text-3xl md:text-5xl text-white font-black uppercase tracking-widest animate-text-distort will-change-transform">
                                /// SYSTEME CORROMPU : MISE À JOUR FORCÉE ///
                            </h2>
                            <h2 className="absolute top-0 left-0 right-0 font-sans text-2xl sm:text-3xl md:text-5xl text-neon-orange font-black uppercase tracking-widest mix-blend-screen opacity-80 animate-glitch-hard-1 will-change-transform" aria-hidden="true">
                                /// SYSTEME CORROMPU : MISE À JOUR FORCÉE ///
                            </h2>
                            <h2 className="absolute top-0 left-0 right-0 font-sans text-2xl sm:text-3xl md:text-5xl text-bone font-black uppercase tracking-tight mix-blend-screen opacity-80 animate-glitch-hard-2 will-change-transform" aria-hidden="true">
                                /// SYSTEME CORROMPU : MISE À JOUR FORCÉE ///
                            </h2>
                        </div>

                        <div className="space-y-6 font-mono text-base md:text-xl border-l-4 border-white/10 pl-8 my-6 text-left max-w-3xl mx-auto bg-black/40 backdrop-blur-sm p-6 rounded-r-lg">
                            <div className="text-[#E6DCC8] text-sm md:text-base tracking-widest uppercase mb-4 font-bold">
                                [ M.A.J SYSTEME // EFFACEMENT DES TAXES // DIMINUTION DU PRIX ]
                            </div>
                            <h3 className="font-headline text-3xl md:text-5xl text-white mb-6 tracking-widest leading-tight">
                                /// DANGER TAXE MARKETING ///
                            </h3>
                            <div className="space-y-4">
                                <div className="text-white/90 leading-relaxed animate-line-teleport">
                                    <span className="text-[#E6DCC8] font-black mr-3 text-lg md:text-2xl">{'>'} ANALYSE :</span>
                                    70% DU PRIX = MARKETING. (Standard Industrie)
                                </div>
                                <div className="text-red-400/90 leading-relaxed animate-line-teleport">
                                    <span className="text-neon-orange font-black mr-3 text-lg md:text-2xl">{'>'} CONSÉQUENCES :</span>
                                    PRIX ÉLEVÉ. QUALITÉ MÉDIOCRE.
                                </div>
                                <div className="text-white/90 leading-relaxed animate-emergency-flash">
                                    <span className="text-[#E6DCC8] font-black mr-3 text-lg md:text-2xl">{'>'} CORRECTIF :</span>
                                    SUPPRESSION TAXE MARKETING.
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex flex-col items-center">
                            <div className="mb-4 font-mono text-white/40 text-xs tracking-widest uppercase animate-pulse">
                                ↓ SCROLL POUR CHARGER ↓
                            </div>
                            <div className="relative flex items-center justify-center">
                                <svg width="192" height="192" className="-rotate-90" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r={RING_RADIUS} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                                    <circle ref={ringRef} cx="50" cy="50" r={RING_RADIUS} fill="none" stroke="#E6DCC8" strokeWidth="3" strokeLinecap="round" className="transition-none" />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-xs md:text-sm font-mono text-white/60 tracking-widest uppercase mb-1">MISE À JOUR</span>
                                    <span ref={percentRef} className="text-xl md:text-2xl font-mono font-black text-[#E6DCC8] tracking-widest">0%</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════
                STABLE SECTION — THE ARRIVAL ZONE (Permanently Locked)
            ════════════════════════════════════════════════════════════════ */}
            <section
                id="stable-section"
                className="relative bg-[#050505] min-h-screen flex items-center justify-center overflow-hidden"
            >
                {/* THE FIX: Dynamic opacity class bounds to React state */}
                <div
                    ref={stableContentRef}
                    className={`relative w-[85%] max-w-[1400px] mx-auto ${isComplete ? 'opacity-100' : 'opacity-0'}`}
                >
                    <div className="text-center relative">
                        <div ref={stableCenterRef} className="relative inline-block">

                            <div className="inline-flex items-center gap-3 mb-8 px-6 py-3 border border-emerald-500/30 bg-emerald-500/5 rounded-sm">
                                <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                                <span className="font-mono text-emerald-500 text-sm tracking-widest">
                                    SYSTÈME STABILISÉ
                                </span>
                            </div>

                            <h3 className="font-headline text-3xl md:text-5xl text-white font-bold mb-6">
                                <span className="text-[#E6DCC8]">MISE À JOUR EFFECTUÉE :</span>
                            </h3>

                            <p className="font-sans text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed">
                                Le prix est maintenant <span className="text-emerald-400 font-semibold">diminué</span>.<br />
                                La qualité est <span className="text-emerald-400 font-semibold">augmentée</span>.
                            </p>

                            <div
                                className="absolute -bottom-16 left-1/2 -translate-x-1/2"
                                style={{
                                    width: '80%', height: '40px',
                                    background: 'radial-gradient(ellipse 100% 100% at 50% 50%, rgba(0,0,0,0.5) 0%, transparent 70%)',
                                    filter: 'blur(15px)',
                                }}
                            />
                        </div>
                        <div className="mt-16 mx-auto w-24 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                    </div>
                </div>
            </section>
        </>
    );
}

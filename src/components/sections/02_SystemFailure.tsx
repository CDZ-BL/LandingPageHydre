'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useLenis } from 'lenis/react';

gsap.registerPlugin(ScrollTrigger);

// ═══════════════════════════════════════════════════════════════════════════
//  CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════
const RING_RADIUS   = 45;
const CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

// Acceleration-based fill: speed = BASE + ACCEL × seconds_held
// At t=0: 0.10 prog/s — intentionally slow, reads as deliberate.
// At t=1s: 0.40 prog/s — perceptible ramp, rewards commitment.
// At t=2s: 0.70 prog/s — near full speed, feel of inevitability.
// Total fill time (0→100%) ≈ 2.2s (vs 3s flat).
const HOLD_BASE_SPEED    = 0.10;   // progress/sec at first frame of hold
const HOLD_ACCELERATION  = 0.30;   // extra progress/sec per second held

// How long the ring takes to drain back to 0 after an early release.
// Creates healthy tension: you must commit.
const RING_DRAIN_DURATION = 1.5;

const NAV_GUARD_MS = 2000;

// ═══════════════════════════════════════════════════════════════════════════
//  INTERACTION DESIGN
//
//  Hold to Update mechanic:
//  - Section is min-h-screen, no scroll-pinning, no timing hacks.
//  - User reads the content at their own pace, then chooses to hold.
//  - Hold: ring fills (linear), stroke shifts bone → neon-orange, glow grows.
//  - Release early: ring drains smoothly back to 0 (must re-hold from start).
//  - 100%: brief flash then the 3D reveal animation.
//  - Works on mouse and touch via Pointer Events API (passive-safe).
// ═══════════════════════════════════════════════════════════════════════════

export function SystemFailure() {
    // ─── REFS ─────────────────────────────────────────────────────────────
    const containerRef   = useRef<HTMLDivElement>(null);
    const glitchRef      = useRef<HTMLDivElement>(null);
    const stableRef      = useRef<HTMLDivElement>(null);
    const ringRef        = useRef<SVGCircleElement>(null);
    const percentRef     = useRef<HTMLSpanElement>(null);
    const shieldRef      = useRef<HTMLDivElement>(null);
    const holdZoneRef    = useRef<HTMLDivElement>(null);

    const revealedRef      = useRef(false);
    const isHoldingRef     = useRef(false);
    const navScrollActive  = useRef(false);
    const progressRef      = useRef({ value: 0 });
    const drainTweenRef    = useRef<gsap.core.Tween | null>(null);
    const rafIdRef         = useRef<number | null>(null);
    const holdStartTimeRef = useRef<number>(0);
    const lastFrameTimeRef = useRef<number>(0);

    // ─── STATE (visual only) ──────────────────────────────────────────────
    const [isHolding,   setIsHolding]   = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isComplete,  setIsComplete]  = useState(false);

    const lenis = useLenis();

    // ─────────────────────────────────────────────────────────────────────
    //  RING MUTATION HELPER — direct DOM, zero re-renders
    // ─────────────────────────────────────────────────────────────────────
    const syncRing = useCallback(() => {
        const v = progressRef.current.value;
        if (ringRef.current)    ringRef.current.style.strokeDashoffset = String(CIRCUMFERENCE - CIRCUMFERENCE * v);
        if (percentRef.current) percentRef.current.textContent = `${Math.floor(v * 100)}%`;
    }, []);

    // ─────────────────────────────────────────────────────────────────────
    //  SCROLL ABSORPTION SHIELD (during reveal animation only)
    // ─────────────────────────────────────────────────────────────────────
    useEffect(() => {
        const shield = shieldRef.current;
        if (!shield || !isAnimating) return;

        const block = (e: Event) => { e.preventDefault(); e.stopPropagation(); };
        const blockKey = (e: KeyboardEvent) => {
            if (['ArrowDown','ArrowUp','Space','PageDown','PageUp','Home','End'].includes(e.code))
                e.preventDefault();
        };

        shield.addEventListener('wheel',     block,    { passive: false });
        shield.addEventListener('touchmove', block,    { passive: false });
        document.addEventListener('keydown', blockKey, { passive: false });

        return () => {
            shield.removeEventListener('wheel',     block);
            shield.removeEventListener('touchmove', block);
            document.removeEventListener('keydown', blockKey);
        };
    }, [isAnimating]);

    // ─────────────────────────────────────────────────────────────────────
    //  NAV GUARD — `clearNavStart` from Header
    // ─────────────────────────────────────────────────────────────────────
    useEffect(() => {
        let timer: ReturnType<typeof setTimeout> | null = null;
        const onNavStart = () => {
            navScrollActive.current = true;
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => { navScrollActive.current = false; }, NAV_GUARD_MS);
        };
        window.addEventListener('clearNavStart', onNavStart);
        return () => {
            window.removeEventListener('clearNavStart', onNavStart);
            if (timer) clearTimeout(timer);
        };
    }, []);

    // ─────────────────────────────────────────────────────────────────────
    //  FORCE COMPLETE — `forceCompleteSystemFailure` from Header nav.
    //  If user nav-clicks past this section, silently complete it so
    //  scroll-back never reveals a half-loaded section.
    // ─────────────────────────────────────────────────────────────────────
    useEffect(() => {
        const onForce = () => {
            if (revealedRef.current) return;
            revealedRef.current = true;
            isHoldingRef.current = false;
            if (rafIdRef.current !== null) { cancelAnimationFrame(rafIdRef.current); rafIdRef.current = null; }
            if (drainTweenRef.current) { drainTweenRef.current.kill(); drainTweenRef.current = null; }
            // Instant state flip — no animation
            progressRef.current.value = 1;
            syncRing();
            if (glitchRef.current) glitchRef.current.style.display = 'none';
            if (stableRef.current) stableRef.current.style.opacity = '1';
            setIsHolding(false);
            setIsComplete(true);
        };
        window.addEventListener('forceCompleteSystemFailure', onForce);
        return () => window.removeEventListener('forceCompleteSystemFailure', onForce);
    }, [syncRing]);

    // ─────────────────────────────────────────────────────────────────────
    //  GLOBAL FAILSAFE
    // ─────────────────────────────────────────────────────────────────────
    useEffect(() => {
        return () => {
            document.documentElement.style.overflow = '';
            if (lenis) lenis.start();
            if (rafIdRef.current !== null) { cancelAnimationFrame(rafIdRef.current); rafIdRef.current = null; }
        };
    }, [lenis]);

    // ─────────────────────────────────────────────────────────────────────
    //  REVEAL — Glitch explodes out, stable content materialises in-place.
    // ─────────────────────────────────────────────────────────────────────
    const executeReveal = useCallback(() => {
        if (revealedRef.current) return;
        revealedRef.current = true;

        if (lenis) lenis.stop();
        document.documentElement.style.overflow = 'hidden';
        setIsAnimating(true);

        document.querySelectorAll('.sf-glitch [class*="animate-"]').forEach(el => {
            (el as HTMLElement).style.animation = 'none';
        });

        gsap.set('.sf-glitch', { perspective: 4000, transformStyle: 'preserve-3d', willChange: 'transform, opacity' });

        const departure = gsap.timeline({
            onComplete: () => {
                if (!stableRef.current) return;
                gsap.set(stableRef.current, { opacity: 1, perspective: 3000, transformStyle: 'preserve-3d' });

                const els = [
                    stableRef.current.querySelector('.sf-stable-badge'),
                    stableRef.current.querySelector('h3'),
                    stableRef.current.querySelector('p'),
                ];

                gsap.fromTo(els,
                    {
                        z: 1800, scale: 2.5, opacity: 0, filter: 'blur(15px)',
                        rotationX: () => gsap.utils.random(-35, 35),
                        rotationY: () => gsap.utils.random(-35, 35),
                        x: () => gsap.utils.random(-window.innerWidth * 0.4, window.innerWidth * 0.4),
                        y: () => gsap.utils.random(-150, 150),
                    },
                    {
                        z: 0, scale: 1, opacity: 1, filter: 'blur(0px)',
                        rotationX: 0, rotationY: 0, x: 0, y: 0,
                        duration: 1.8, stagger: 0.12, ease: 'power3.out',
                        onComplete: () => {
                            if (glitchRef.current) glitchRef.current.style.display = 'none';
                            gsap.set(els, { clearProps: 'transform, filter, willChange' });
                            setIsComplete(true);
                            requestAnimationFrame(() => requestAnimationFrame(() => {
                                setIsAnimating(false);
                                document.documentElement.style.overflow = '';
                                if (lenis) lenis.start();
                            }));
                        },
                    }
                );
            },
        });

        departure.to('.sf-glitch',            { scale: 5,  opacity: 0, duration: 1.0, ease: 'expo.in' }, 0);
        departure.to('.animate-text-distort',  { scale: 25, z: 2000, rotationZ: 12,   opacity: 0, duration: 1.0, ease: 'expo.in' }, 0);
        departure.to('.animate-glitch-hard-1', { scale: 50, z: 2500, x: -window.innerWidth * 0.7, rotationZ: -30, opacity: 0, duration: 0.9, ease: 'expo.in' }, 0);
        departure.to('.animate-glitch-hard-2', { scale: 40, z: 3000, x:  window.innerWidth * 0.7, rotationZ:  40, opacity: 0, duration: 0.8, ease: 'expo.in' }, 0);
    }, [lenis]);

    // ─────────────────────────────────────────────────────────────────────
    //  RING INIT
    // ─────────────────────────────────────────────────────────────────────
    useGSAP(() => {
        if (!ringRef.current) return;
        gsap.set(ringRef.current, {
            strokeDasharray:  CIRCUMFERENCE,
            strokeDashoffset: CIRCUMFERENCE,
        });
    }, { scope: containerRef });

    // ─────────────────────────────────────────────────────────────────────
    //  HOLD HANDLERS — Pointer Events API (covers mouse + touch)
    // ─────────────────────────────────────────────────────────────────────
    const startHold = useCallback(() => {
        if (revealedRef.current || isHoldingRef.current) return;
        isHoldingRef.current = true;
        setIsHolding(true);

        // Kill any active drain
        if (drainTweenRef.current) { drainTweenRef.current.kill(); drainTweenRef.current = null; }

        // Acceleration loop: speed = BASE + ACCEL × elapsed_hold_time
        // Each fresh hold resets the acceleration clock — feels intentional at start,
        // then rewards commitment with a satisfying ramp to completion.
        holdStartTimeRef.current = performance.now();
        lastFrameTimeRef.current = performance.now();

        const tick = (now: number) => {
            const delta       = Math.min((now - lastFrameTimeRef.current) / 1000, 0.1); // cap at 100ms
            lastFrameTimeRef.current = now;

            const holdElapsed = (now - holdStartTimeRef.current) / 1000;
            const speed       = HOLD_BASE_SPEED + HOLD_ACCELERATION * holdElapsed;

            progressRef.current.value = Math.min(1, progressRef.current.value + speed * delta);
            syncRing();

            if (progressRef.current.value >= 1) {
                rafIdRef.current = null;
                isHoldingRef.current = false;
                setIsHolding(false);
                if (!navScrollActive.current) executeReveal();
                return;
            }

            rafIdRef.current = requestAnimationFrame(tick);
        };

        rafIdRef.current = requestAnimationFrame(tick);
    }, [syncRing, executeReveal]);

    const stopHold = useCallback(() => {
        if (!isHoldingRef.current) return;
        isHoldingRef.current = false;
        setIsHolding(false);

        if (rafIdRef.current !== null) { cancelAnimationFrame(rafIdRef.current); rafIdRef.current = null; }
        if (revealedRef.current) return;

        // Drain ring back to 0 — proportional speed
        const drainTime = progressRef.current.value * RING_DRAIN_DURATION;
        if (drainTime < 0.02) return; // already near 0

        drainTweenRef.current = gsap.to(progressRef.current, {
            value:    0,
            duration: drainTime,
            ease:     'power2.in',
            onUpdate: syncRing,
            onComplete() { drainTweenRef.current = null; },
        });
    }, [syncRing]);

    // Attach non-passive pointer listeners to the hold zone via ref
    // (React's onPointerDown is passive on some browsers)
    useEffect(() => {
        const el = holdZoneRef.current;
        if (!el) return;

        const onDown = (e: PointerEvent) => {
            e.preventDefault();
            el.setPointerCapture(e.pointerId);
            startHold();
        };
        const onUp   = () => stopHold();
        const onLeave = (e: PointerEvent) => {
            // Only release if pointer is no longer captured
            if (!el.hasPointerCapture(e.pointerId)) stopHold();
        };

        el.addEventListener('pointerdown',   onDown,  { passive: false });
        el.addEventListener('pointerup',     onUp,    { passive: false });
        el.addEventListener('pointercancel', onUp,    { passive: false });
        el.addEventListener('lostpointercapture', onLeave, { passive: false });

        return () => {
            el.removeEventListener('pointerdown',   onDown);
            el.removeEventListener('pointerup',     onUp);
            el.removeEventListener('pointercancel', onUp);
            el.removeEventListener('lostpointercapture', onLeave);
        };
    }, [startHold, stopHold]);

    // ─────────────────────────────────────────────────────────────────────
    //  RENDER
    // ─────────────────────────────────────────────────────────────────────
    return (
        <>
            {/* Scroll shield — active only during reveal */}
            {isAnimating && (
                <div
                    ref={shieldRef}
                    style={{
                        position: 'fixed', inset: 0, zIndex: 99999,
                        touchAction: 'none', overscrollBehavior: 'none',
                        pointerEvents: 'all', background: 'transparent',
                    }}
                />
            )}

            <section
                id="system-failure-section"
                ref={containerRef}
                className="relative z-[60] w-full bg-black min-h-screen flex items-center justify-center overflow-hidden"
            >

                {/* ── GLITCH CONTENT ───────────────────────────────────────────
                    Visible until the reveal fires.                            */}
                <div
                    ref={glitchRef}
                    className={`sf-glitch absolute inset-0 flex items-center justify-center ${isComplete ? 'hidden' : ''}`}
                >
                    {/* Scanlines */}
                    <div className="absolute inset-0 pointer-events-none z-10 opacity-50"
                        style={{ background: 'repeating-linear-gradient(to bottom, transparent 0px, transparent 1px, rgba(0,0,0,0.9) 2px, rgba(0,0,0,0.9) 3px)' }} />
                    {/* Noise */}
                    <div className="absolute inset-0 pointer-events-none z-5 opacity-10"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />

                    <div className="relative z-30 w-[85%] max-w-[1200px] mx-auto text-center animate-screen-shake">

                        {/* Status badge */}
                        <div className="inline-block font-mono text-neon-orange text-[10px] tracking-widest mb-4 animate-hard-blink">
                            [ SYSTEM_UPDATE // STANDARD CALIBRATION ]
                        </div>

                        {/* Main headline — triple layer glitch */}
                        <div className="relative mb-12">
                            <h2
                                className="font-headline text-white font-black uppercase tracking-widest animate-text-distort will-change-transform"
                                style={{ fontSize: 'clamp(1.4rem, 2.8vw + 0.5rem, 3rem)' }}
                            >
                                /// SYSTEME CORROMPU : MISE À JOUR FORCÉE ///
                            </h2>
                            <h2
                                className="absolute top-0 left-0 right-0 font-sans text-neon-orange font-black uppercase tracking-widest mix-blend-screen opacity-80 animate-glitch-hard-1 will-change-transform"
                                style={{ fontSize: 'clamp(1.4rem, 2.8vw + 0.5rem, 3rem)' }}
                                aria-hidden="true"
                            >/// SYSTEME CORROMPU : MISE À JOUR FORCÉE ///</h2>
                            <h2
                                className="absolute top-0 left-0 right-0 font-sans text-bone font-black uppercase tracking-tight mix-blend-screen opacity-80 animate-glitch-hard-2 will-change-transform"
                                style={{ fontSize: 'clamp(1.4rem, 2.8vw + 0.5rem, 3rem)' }}
                                aria-hidden="true"
                            >/// SYSTEME CORROMPU : MISE À JOUR FORCÉE ///</h2>
                        </div>

                        {/* Info block */}
                        <div className="space-y-4 font-mono border-l-4 border-white/10 pl-6 my-5 text-left max-w-2xl mx-auto bg-black/40 backdrop-blur-sm p-5 rounded-r-lg">
                            <div className="text-[#E6DCC8] text-[10px] tracking-widest uppercase mb-3 font-bold">
                                [ M.A.J SYSTEME // EFFACEMENT DES TAXES // DIMINUTION DU PRIX ]
                            </div>
                            <h3
                                className="font-headline text-white mb-4 tracking-widest leading-tight"
                                style={{ fontSize: 'clamp(1rem, 2vw + 0.25rem, 1.75rem)' }}
                            >
                                /// DANGER TAXE MARKETING ///
                            </h3>
                            <div className="space-y-3 text-sm md:text-base">
                                <div className="text-white/90 leading-relaxed animate-line-teleport">
                                    <span className="text-[#E6DCC8] font-black mr-2 text-base md:text-lg">{'>'} ANALYSE :</span>
                                    70% DU PRIX = MARKETING. (Standard Industrie)
                                </div>
                                <div className="text-white/70 leading-relaxed animate-line-teleport">
                                    <span className="text-neon-orange font-black mr-2 text-base md:text-lg">{'>'} CONSÉQUENCES :</span>
                                    PRIX ÉLEVÉ. QUALITÉ MÉDIOCRE.
                                </div>
                                <div className="text-white/90 leading-relaxed animate-emergency-flash">
                                    <span className="text-[#E6DCC8] font-black mr-2 text-base md:text-lg">{'>'} CORRECTIF :</span>
                                    SUPPRESSION TAXE MARKETING.
                                </div>
                            </div>
                        </div>

                        {/* ── HOLD TO UPDATE — interactive ring ──────────────── */}
                        <div className="mt-6 flex flex-col items-center gap-4">

                            {/* Ring hold zone */}
                            <div
                                ref={holdZoneRef}
                                className="relative flex items-center justify-center rounded-full"
                                style={{
                                    cursor: isComplete ? 'default' : 'pointer',
                                    touchAction: 'none',
                                    userSelect: 'none',
                                    // Glow expands as ring fills — driven by CSS transition
                                    filter: isHolding
                                        ? 'drop-shadow(0 0 24px rgba(255,107,0,0.7)) drop-shadow(0 0 8px rgba(255,107,0,0.4))'
                                        : 'drop-shadow(0 0 6px rgba(230,220,200,0.15))',
                                    transition: 'filter 0.4s ease',
                                }}
                            >
                                <svg width="160" height="160" className="-rotate-90" viewBox="0 0 100 100">
                                    {/* Track */}
                                    <circle
                                        cx="50" cy="50" r={RING_RADIUS}
                                        fill="none"
                                        stroke={isHolding ? 'rgba(255,107,0,0.15)' : 'rgba(255,255,255,0.08)'}
                                        strokeWidth="2"
                                        style={{ transition: 'stroke 0.4s ease' }}
                                    />
                                    {/* Fill */}
                                    <circle
                                        ref={ringRef}
                                        cx="50" cy="50" r={RING_RADIUS}
                                        fill="none"
                                        stroke={isHolding ? '#FF6B00' : '#E6DCC8'}
                                        strokeWidth={isHolding ? '4' : '2.5'}
                                        strokeLinecap="round"
                                        className="transition-none"
                                        style={{ transition: 'stroke 0.3s ease, stroke-width 0.3s ease' }}
                                    />
                                </svg>

                                {/* Center label */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span
                                        className="text-[9px] font-mono tracking-widest uppercase mb-0.5 transition-colors duration-300"
                                        style={{ color: isHolding ? '#FF6B00' : 'rgba(255,255,255,0.4)' }}
                                    >
                                        {isHolding ? 'CHARGEMENT' : 'MISE À JOUR'}
                                    </span>
                                    <span
                                        ref={percentRef}
                                        className="text-lg font-mono font-black tracking-widest transition-colors duration-300"
                                        style={{ color: isHolding ? '#FF6B00' : '#E6DCC8' }}
                                    >
                                        0%
                                    </span>
                                </div>
                            </div>

                            {/* Instruction text */}
                            <div
                                className="font-mono text-[9px] tracking-[0.3em] uppercase transition-all duration-300"
                                style={{
                                    color:  isHolding ? '#FF6B00'          : 'rgba(255,255,255,0.25)',
                                    opacity: isHolding ? 1                  : 0.8,
                                    letterSpacing: isHolding ? '0.35em'    : '0.3em',
                                }}
                            >
                                {isHolding
                                    ? '█ CHARGEMENT EN COURS — NE PAS RELÂCHER'
                                    : '[ PRESSEZ ET MAINTENEZ POUR METTRE À JOUR ]'
                                }
                            </div>

                        </div>
                        {/* ── end hold zone ───────────────────────────────────── */}

                    </div>
                </div>

                {/* ── STABLE CONTENT — revealed after ring completes ───────────
                    In-place reveal, no teleportation, no separate section.   */}
                <div
                    ref={stableRef}
                    className={`relative z-10 w-[85%] max-w-[1400px] mx-auto text-center transition-opacity duration-500 ${isComplete ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                >
                    <div className="relative inline-block">

                        <div className="sf-stable-badge inline-flex items-center gap-3 mb-8 px-6 py-3 border border-neon-orange/30 bg-neon-orange/5 rounded-sm">
                            <span className="w-3 h-3 bg-neon-orange rounded-full animate-pulse" />
                            <span className="font-mono text-neon-orange text-sm tracking-widest">SYSTÈME STABILISÉ</span>
                        </div>

                        <h3 className="font-headline text-h2 text-white font-bold mb-6">
                            <span className="text-[#E6DCC8]">MISE À JOUR EFFECTUÉE :</span>
                        </h3>

                        <p className="font-sans text-h3 text-[#D9D9D9] max-w-2xl mx-auto leading-relaxed">
                            Le prix est maintenant <span className="text-[#E6DCC8] font-semibold">diminué</span>.<br />
                            La qualité est <span className="text-[#E6DCC8] font-semibold">augmentée</span>.
                        </p>

                    </div>
                    <div className="mt-16 mx-auto w-24 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                </div>

            </section>
        </>
    );
}

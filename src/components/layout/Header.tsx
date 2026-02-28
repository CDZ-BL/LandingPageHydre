'use client';

import { useLenis } from 'lenis/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHydreStore } from '@/lib/store';
import { useRouter, usePathname } from 'next/navigation';

// ─── EASING ───────────────────────────────────────────────────────────────────
const SILK_EASE = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

export function Header() {
    const lenis = useLenis();
    const router = useRouter();
    const pathname = usePathname();

    const { isAuthenticated, user, openAuthModal, logout } = useHydreStore();

    // ─────────────────────────────────────────────────────────────────────────
    //  SMART NAV SCROLL
    // ─────────────────────────────────────────────────────────────────────────
    const handleNavScroll = (selector: string) => {
        if (!selector || !lenis) return;

        // If on account page, navigate home first
        if (pathname !== '/') {
            router.push('/');
            return;
        }

        window.dispatchEvent(new CustomEvent('clearNavStart'));
        window.dispatchEvent(new CustomEvent('forceCompleteSystemFailure'));

        lenis.scrollTo(selector, { duration: 0.8, easing: SILK_EASE });
    };

    const handleCTA = () => {
        if (isAuthenticated) {
            router.push('/account');
        } else {
            openAuthModal('signup');
        }
    };

    const handleLogout = () => {
        logout();
        localStorage.removeItem('hydre_access_token');
        localStorage.removeItem('hydre_refresh_token');
        if (pathname === '/account') {
            router.push('/');
        }
    };

    return (
        <nav className="absolute top-0 left-0 w-full z-[99999] pointer-events-none">

            {/* ━━━ MAIN HEADER ━━━ */}
            <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="w-full px-6 md:px-10 lg:px-14 py-4 md:py-5 flex justify-between items-center"
            >

                {/* ━━━ WORDMARK — CLEAR / Nutrition stacked (brand guide) ━━━
                    "CLEAR" in heavy bone at full width.
                    "Nutrition" below with wider tracking → golden ratio width
                    relationship: W_NUTRITION ≈ W_CLEAR / φ (1.618).           */}
                <button
                    onClick={() => router.push('/')}
                    className="pointer-events-auto flex flex-col items-center select-none"
                    style={{ gap: '0.18em' }}
                >
                    <h1
                        className="font-headline font-black text-[#E6DCC8] uppercase leading-none"
                        style={{
                            fontSize: 'clamp(1.55rem, 2.6vw, 2.4rem)',
                            letterSpacing: '0.22em',
                        }}
                    >
                        CLEAR
                    </h1>
                    {/* Wider letter-spacing + smaller size → visual ~61.8% width of CLEAR */}
                    <span
                        className="font-sans font-light text-white/35 uppercase leading-none tracking-[0.55em]"
                        style={{ fontSize: 'clamp(0.55rem, 0.85vw, 0.72rem)', marginRight: '-0.55em' }}
                    >
                        Nutrition
                    </span>
                </button>

                {/* ━━━ CENTER: Discreet navigation ━━━ */}
                <div className="hidden lg:flex items-center gap-10 pointer-events-auto">
                    {(['Manifeste', 'Produit', 'Alliance', 'Roadmap'] as const).map((item, i) => {
                        const targets: Record<string, string> = {
                            Manifeste: '#system-failure-section',
                            Produit: '#specs',
                            Alliance: '#alliance',
                            Roadmap: '#roadmap',
                        };
                        return (
                            <motion.button
                                key={item}
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.6 + i * 0.08 }}
                                onClick={() => handleNavScroll(targets[item])}
                                className="relative font-mono text-[10px] text-white/35 tracking-[0.22em] uppercase
                                           hover:text-white/75 transition-colors duration-500 mix-blend-difference
                                           after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-px
                                           after:bg-white/50 hover:after:w-full after:transition-all after:duration-500"
                            >
                                {item}
                            </motion.button>
                        );
                    })}
                </div>

                {/* ━━━ RIGHT: Auth-aware CTA ━━━ */}
                <div className="pointer-events-auto flex items-center gap-4">
                    <AnimatePresence mode="wait">
                        {isAuthenticated ? (
                            <motion.div
                                key="auth-actions"
                                initial={{ opacity: 0, x: 12 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 12 }}
                                transition={{ duration: 0.4 }}
                                className="flex items-center gap-4"
                            >
                                {/* Points badge */}
                                <span className="hidden md:flex items-center gap-1.5 font-mono text-[10px] text-[#E6DCC8]/60 tracking-[0.15em]">
                                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                    </svg>
                                    {user?.founderPointsTotal ?? 0}
                                </span>

                                {/* Account button */}
                                <button
                                    onClick={() => router.push('/account')}
                                    className="group relative overflow-hidden mix-blend-difference"
                                >
                                    <div className="relative border border-white/20 group-hover:border-white/50 transition-all duration-700">
                                        <div className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                                        <div className="relative z-10 flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5">
                                            <svg className="w-3.5 h-3.5 text-white/60 group-hover:text-black transition-colors duration-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                            </svg>
                                            <span className="font-mono text-[9px] md:text-[10px] text-white group-hover:text-black tracking-[0.2em] uppercase transition-colors duration-500">
                                                Compte
                                            </span>
                                        </div>
                                    </div>
                                </button>

                                {/* Logout */}
                                <button
                                    onClick={handleLogout}
                                    className="font-mono text-[9px] text-white/25 tracking-[0.15em] uppercase hover:text-white/60 transition-colors duration-500"
                                >
                                    Sortir
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="guest-actions"
                                initial={{ opacity: 0, x: 12 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 12 }}
                                transition={{ duration: 0.4 }}
                            >
                                {/* Se connecter — solid white, permanent, no theatre */}
                                <button
                                    onClick={() => openAuthModal('login')}
                                    className="group flex items-center gap-2.5 bg-white hover:bg-white/90 active:bg-white/80 px-5 md:px-6 py-2.5 md:py-3 transition-all duration-300"
                                >
                                    <svg
                                        className="w-3 h-3 text-black/50 group-hover:text-black transition-colors duration-300"
                                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                                    </svg>
                                    <span className="font-mono text-[10px] md:text-[11px] text-black tracking-[0.25em] uppercase">
                                        Se connecter
                                    </span>
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </motion.div>

            {/* ━━━ Bottom hairline ━━━ */}
            <div className="w-full h-px bg-white/[0.06]" />
        </nav>
    );
}

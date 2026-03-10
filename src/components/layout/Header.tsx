'use client';

import { useState } from 'react';
import { useLenis } from 'lenis/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHydreStore } from '@/lib/store';
import { useRouter, usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useThemeInit } from '@/hooks/useThemeInit';

// ─── EASING ───────────────────────────────────────────────────────────────────
const SILK_EASE = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

export function Header() {
    useThemeInit();
    const lenis = useLenis();
    const router = useRouter();
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const { isAuthenticated, user, openAuthModal, logout } = useHydreStore();

    // ─────────────────────────────────────────────────────────────────────────
    //  SMART NAV SCROLL
    // ─────────────────────────────────────────────────────────────────────────
    const handleNavScroll = (selector: string) => {
        if (!selector || !lenis) return;
        setMobileMenuOpen(false);

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
        // Fire-and-forget server-side session invalidation
        const token = localStorage.getItem('hydre_auth_token');
        if (token) {
            fetch('/api/auth/logout', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
            }).catch(() => { /* non-blocking */ });
        }

        logout();
        localStorage.removeItem('hydre_auth_token');
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
                        SMART
                    </h1>
                    {/* Wider letter-spacing + smaller size → visual ~61.8% width of CLEAR */}
                    <span
                        className="font-sans font-light text-[var(--text-muted)] uppercase leading-none tracking-[0.55em]"
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
                                className="relative font-mono text-[10px] text-[var(--text-muted)] tracking-[0.22em] uppercase
                                           hover:text-[var(--text-secondary)] transition-colors duration-500 mix-blend-difference
                                           after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-px
                                           after:bg-[var(--text-muted)] hover:after:w-full after:transition-all after:duration-500"
                            >
                                {item}
                            </motion.button>
                        );
                    })}
                </div>

                {/* ━━━ Hamburger (mobile only) ━━━ */}
                <button
                    onClick={() => setMobileMenuOpen((v) => !v)}
                    className="lg:hidden pointer-events-auto flex flex-col items-center justify-center gap-[5px] w-8 h-8 shrink-0"
                    aria-label="Menu"
                >
                    <span className={`block w-5 h-px bg-[var(--text-tertiary)] transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-[6px]' : ''}`} />
                    <span className={`block w-5 h-px bg-[var(--text-tertiary)] transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`} />
                    <span className={`block w-5 h-px bg-[var(--text-tertiary)] transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-[6px]' : ''}`} />
                </button>

                {/* ━━━ RIGHT: Theme Toggle + Auth-aware CTA ━━━ */}
                <div className="pointer-events-auto flex items-center gap-4">
                    <ThemeToggle />
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
                                    className="group relative overflow-hidden border border-[var(--stroke-hover)] hover:border-[var(--text-muted)] px-4 md:px-5 py-2 md:py-2.5 transition-all duration-500"
                                >
                                    <div className="absolute inset-0 bg-[var(--bg-surface)]/5 group-hover:bg-[var(--bg-surface)]/10 transition-colors duration-500" />
                                    <div className="relative z-10 flex items-center gap-2">
                                        <svg className="w-3.5 h-3.5 text-[var(--text-primary)]/45 group-hover:text-[var(--text-primary)]/80 transition-colors duration-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                        </svg>
                                        <span className="font-mono text-[9px] md:text-[10px] text-[var(--text-primary)] group-hover:text-[var(--text-primary)] tracking-[0.2em] uppercase transition-colors duration-500">
                                            Compte
                                        </span>
                                    </div>
                                </button>

                                {/* Logout */}
                                <button
                                    onClick={handleLogout}
                                    className="font-mono text-[9px] text-[#E6DCC8]/25 tracking-[0.15em] uppercase hover:text-[#E6DCC8]/55 transition-colors duration-500"
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
                                <button
                                    onClick={() => openAuthModal('login')}
                                    className="group relative overflow-hidden border border-[var(--stroke-hover)] hover:border-[var(--text-muted)] px-4 md:px-5 py-2 md:py-2.5 transition-all duration-500"
                                >
                                    <div className="absolute inset-0 bg-[var(--bg-surface)]/5 group-hover:bg-[var(--bg-surface)]/10 transition-colors duration-500" />
                                    <div className="relative flex items-center gap-2.5">
                                        <svg
                                            className="w-3 h-3 text-[var(--text-primary)] group-hover:text-[var(--text-primary)] transition-colors duration-500"
                                            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                        </svg>
                                        <span className="font-mono text-[9px] md:text-[10px] text-[var(--text-primary)] group-hover:text-[var(--text-primary)] tracking-[0.2em] uppercase transition-colors duration-500">
                                            Se connecter
                                        </span>
                                    </div>
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </motion.div>

            {/* ━━━ Bottom hairline ━━━ */}
            <div className="w-full h-px bg-[var(--stroke)]" />

            {/* ━━━ Mobile dropdown menu ━━━ */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        key="mobile-menu"
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="lg:hidden pointer-events-auto bg-[var(--bg-primary)]/90 backdrop-blur-xl border-b border-[var(--stroke)] px-6 py-5 flex flex-col gap-4"
                    >
                        {(['Manifeste', 'Produit', 'Alliance', 'Roadmap'] as const).map((item) => {
                            const targets: Record<string, string> = {
                                Manifeste: '#system-failure-section',
                                Produit: '#specs',
                                Alliance: '#alliance',
                                Roadmap: '#roadmap',
                            };
                            return (
                                <button
                                    key={item}
                                    onClick={() => handleNavScroll(targets[item])}
                                    className="font-mono text-[11px] text-[var(--text-tertiary)] tracking-[0.22em] uppercase text-left hover:text-[var(--text-secondary)] transition-colors duration-300"
                                >
                                    {item}
                                </button>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}

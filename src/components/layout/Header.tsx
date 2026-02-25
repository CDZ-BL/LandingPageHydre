'use client';

import { useLenis } from 'lenis/react';

export function Header() {
    const lenis = useLenis();

    const handleCTA = () => {
        if (lenis) {
            lenis.scrollTo('#close', { duration: 2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
        } else {
            document.querySelector('#close')?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav className="fixed top-0 left-0 w-full px-6 md:px-10 py-5 z-[99999] flex justify-between items-center pointer-events-none">

            {/* ━━━ CLEAR WORDMARK ━━━ */}
            <div className="pointer-events-auto mix-blend-difference">
                <h1
                    className="text-white font-headline leading-none select-none"
                    style={{
                        fontSize: 'clamp(1.8rem, 4vw, 3.2rem)',
                        letterSpacing: '0.25em',
                        fontWeight: 800,
                    }}
                >
                    CLEAR
                </h1>
            </div>

            {/* ━━━ CTA — Minimal line button ━━━ */}
            <button
                onClick={handleCTA}
                className="pointer-events-auto group relative overflow-hidden mix-blend-difference"
            >
                <span className="relative z-10 font-mono text-[10px] md:text-xs text-white tracking-[0.25em] uppercase py-3 px-6 block transition-colors duration-500 group-hover:text-black">
                    Rejoindre
                </span>
                {/* Fill on hover */}
                <div className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                {/* Bottom line */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-white/40 group-hover:bg-white transition-colors duration-300" />
            </button>

        </nav>
    );
}

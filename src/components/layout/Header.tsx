'use client';




export function Header() {
    return (
        <nav className="fixed top-0 left-0 w-full px-8 py-6 z-[9999] pointer-events-none flex justify-between items-center">

            {/* THE AETHER WORDMARK - NATIVE DOM RENDERING */}
            <div className="relative mix-blend-difference">
                <h1
                    className="text-white font-black uppercase pointer-events-auto"
                    style={{
                        fontFamily: "'var(--font-clash)', 'Arial Black', sans-serif", // Using project's elite font
                        fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                        letterSpacing: '0.15em', // The mathematical void
                        lineHeight: '1',
                        transform: 'scaleX(1.05)', // Brutalist micro-stretch
                        WebkitFontSmoothing: 'antialiased',
                        MozOsxFontSmoothing: 'grayscale'
                    }}
                >
                    Aether
                </h1>
            </div>

            {/* BATCH INVENTORY UI - SECONDARY READ */}
            <div className="font-mono text-xs text-[#E6DCC8] tracking-widest border border-white/10 bg-black/50 backdrop-blur-md px-4 py-2 pointer-events-auto">
                BATCH 001 // SECURE
            </div>

        </nav>
    );
}

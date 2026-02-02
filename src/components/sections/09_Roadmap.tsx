'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useScramble } from '@/hooks/useScramble';

const ROADMAP_ITEMS = [
    {
        phase: 'PHASE 1.0',
        title: 'FOUNDATION PROTOCOL',
        date: 'Q4 2025',
        status: 'COMPLETED',
        description: 'Déploiement de l\'architecture HYDRE V1. Initialisation des systèmes de production.',
        features: ['200mg Magnésium', 'Zéro Sucre', 'Packaging Isotherme']
    },
    {
        phase: 'PHASE 1.5',
        title: 'BATCH 001 DEPLOYMENT',
        date: 'NOW',
        status: 'ACTIVE',
        description: 'Ouverture des accès Pionniers. Distribution exclusive aux membres fondateurs.',
        features: ['Carte Titanium', 'Accès R&D', 'Canal Privé']
    },
    {
        phase: 'PHASE 2.0',
        title: 'CYBER-LIME MATRIX',
        date: '+3 MONTHS',
        status: 'UPCOMING',
        description: 'Nouvelle matrice aromatique en développement. Profil : Acide / Électrique / Rafraîchissant.',
        features: ['Nouveaux Électrolytes', 'Goût "Neon Citrus"']
    },
    {
        phase: 'PHASE 3.0',
        title: 'NIGHT RECOVERY SYSTEM',
        date: '+6 MONTHS',
        status: 'LOCKED',
        description: 'Module de récupération nocturne. Optimisation du sommeil et de la régénération cellulaire.',
        features: ['Zinc + Magnésium', 'Mélatonine Vectorisée']
    }
];

// Find the index of the ACTIVE (present) phase
const PRESENT_INDEX = ROADMAP_ITEMS.findIndex(item => item.status === 'ACTIVE');

// Decrypt title component for future phases
function DecryptTitle({ title, isFuture }: { title: string; isFuture: boolean }) {
    const { displayText, onMouseEnter, onMouseLeave } = useScramble(title, 30);

    if (!isFuture) {
        return <>{title}</>;
    }

    return (
        <span
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className="cursor-pointer"
        >
            {displayText}
        </span>
    );
}

export function Roadmap() {
    const [activeIndex, setActiveIndex] = useState(PRESENT_INDEX);
    const containerRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
    const sectionRef = useRef<HTMLElement>(null);
    const isInView = useInView(sectionRef, { amount: "some", margin: "-100px 0px -100px 0px" });

    // Scroll to active item
    const scrollToIndex = (index: number) => {
        const item = itemRefs.current[index];
        if (item) {
            item.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'center'
            });
        }
        setActiveIndex(index);
    };

    // Handle wheel scroll within the roadmap
    const handleWheel = (e: React.WheelEvent) => {
        // Only intercept horizontal-style navigation
        if (Math.abs(e.deltaY) > 10) {
            e.preventDefault();
            if (e.deltaY > 0 && activeIndex < ROADMAP_ITEMS.length - 1) {
                scrollToIndex(activeIndex + 1);
            } else if (e.deltaY < 0 && activeIndex > 0) {
                scrollToIndex(activeIndex - 1);
            }
        }
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowDown' && activeIndex < ROADMAP_ITEMS.length - 1) {
                scrollToIndex(activeIndex + 1);
            } else if (e.key === 'ArrowUp' && activeIndex > 0) {
                scrollToIndex(activeIndex - 1);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeIndex]);

    const isOnPresent = activeIndex === PRESENT_INDEX;

    return (
        <section ref={sectionRef} className="relative py-24 md:py-32 bg-black overflow-hidden border-t border-void-800">
            {/* Background Grid */}
            <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundSize: '30px 30px',
                    backgroundImage: 'linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)'
                }}
            />

            <div className="relative z-10 w-[85%] max-w-[1400px] mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="mb-12 text-center"
                >
                    <h2 className="font-mono text-cyan-400 text-sm tracking-widest mb-4">
                        [ SYSTEM_LOGS // ROADMAP ]
                    </h2>
                    <h3 className="font-sans text-3xl md:text-5xl text-white font-bold tracking-tight mb-4">
                        VISION : LONG TERM.
                    </h3>
                    <p className="font-mono text-xs text-gray-500 tracking-wider">
                        SCROLL OU UTILISEZ ↑↓ POUR NAVIGUER
                    </p>
                </motion.div>

                {/* Navigation dots */}
                <div className="flex justify-center gap-3 mb-8">
                    {ROADMAP_ITEMS.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => scrollToIndex(index)}
                            className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${index === activeIndex
                                ? 'bg-white border-white shadow-[0_0_15px_rgba(255,255,255,0.8)] scale-125'
                                : index === PRESENT_INDEX
                                    ? 'bg-amber-500/50 border-amber-500'
                                    : 'bg-transparent border-void-500 hover:border-white/50'
                                }`}
                            aria-label={`Aller à ${item.phase}`}
                        />
                    ))}
                </div>

                {/* Interactive scroll container */}
                <div
                    ref={containerRef}
                    className="relative"
                    onWheel={handleWheel}
                >
                    {/* Timeline line */}
                    <div className="absolute left-8 md:left-12 top-0 bottom-0 w-px bg-void-700">
                        {/* Progress indicator */}
                        <motion.div
                            className="absolute left-0 w-px bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                            initial={{ height: 0 }}
                            animate={{
                                height: `${((activeIndex + 1) / ROADMAP_ITEMS.length) * 100}%`
                            }}
                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        />
                    </div>

                    {/* Roadmap items */}
                    <div className="space-y-8 pl-16 md:pl-24">
                        {ROADMAP_ITEMS.map((item, index) => {
                            const isActive = index === activeIndex;
                            const distance = Math.abs(index - activeIndex);
                            const isFuture = item.status === 'UPCOMING' || item.status === 'LOCKED';

                            // Calculate styles based on distance from active
                            const scale = isActive ? 1 : 0.85;
                            const opacity = isActive ? 1 : distance === 1 ? 0.5 : 0.3;

                            return (
                                <motion.div
                                    key={index}
                                    ref={(el) => { itemRefs.current[index] = el; }}
                                    onClick={() => scrollToIndex(index)}
                                    animate={{
                                        scale,
                                        opacity,
                                    }}
                                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                    className={`relative cursor-pointer origin-left ${isActive ? 'z-10' : 'z-0'}`}
                                >
                                    {/* Dot on timeline */}
                                    <div className={`absolute -left-[52px] md:-left-[68px] top-2 w-4 h-4 rounded-full border-2 transition-all duration-300
                                        ${isActive
                                            ? 'bg-white border-white shadow-[0_0_25px_rgba(255,255,255,1)]'
                                            : index < activeIndex
                                                ? 'bg-gray-600 border-gray-600'
                                                : 'bg-black border-void-500'
                                        }`}
                                    >
                                        {isActive && (
                                            <div className="absolute inset-0 rounded-full bg-white animate-ping opacity-40" />
                                        )}
                                    </div>

                                    {/* Card */}
                                    <div className={`p-6 border transition-all duration-300 ${isActive
                                        ? 'border-white/30 bg-white/5 shadow-[0_0_30px_rgba(255,255,255,0.1)]'
                                        : 'border-void-700 bg-transparent hover:border-void-500'
                                        }`}>
                                        {/* Header */}
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className={`font-mono text-xs tracking-widest px-2 py-0.5 border transition-all ${isActive
                                                ? 'border-white text-white bg-white/10'
                                                : 'border-void-600 text-gray-500'
                                                }`}>
                                                {item.phase} // {item.status}
                                            </span>
                                            <span className="font-mono text-xs text-gray-500">{item.date}</span>
                                        </div>

                                        {/* Title */}
                                        <h4 className={`font-sans font-bold tracking-tight transition-all mb-3 ${isActive
                                            ? 'text-2xl md:text-3xl text-white'
                                            : 'text-lg md:text-xl text-gray-400'
                                            }`}>
                                            <DecryptTitle title={item.title} isFuture={isFuture} />
                                        </h4>

                                        {/* Description - only show when active */}
                                        <AnimatePresence>
                                            {isActive && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="overflow-hidden"
                                                >
                                                    <p className="font-mono text-sm md:text-base text-gray-300 mb-4 leading-relaxed">
                                                        {item.description}
                                                    </p>

                                                    <ul className="flex flex-wrap gap-2">
                                                        {item.features.map((feature, i) => (
                                                            <li key={i} className="font-mono text-xs px-3 py-1.5 rounded border text-white bg-white/5 border-white/20">
                                                                {feature}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Return to Present button */}
                <AnimatePresence>
                    {!isOnPresent && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.3 }}
                            className="mt-8 flex justify-center"
                        >
                            <button
                                onClick={() => scrollToIndex(PRESENT_INDEX)}
                                className="px-6 py-3 bg-white text-black font-mono text-sm tracking-wider font-semibold hover:bg-amber-400 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.3)] flex items-center gap-2"
                            >
                                <span className="animate-pulse">●</span>
                                RETOUR AU PRÉSENT
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}

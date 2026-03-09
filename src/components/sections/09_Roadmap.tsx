'use client';

import { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useLenis } from 'lenis/react';
import { useScramble } from '@/hooks/useScramble'; // Ensure this path is correct

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

const PRESENT_INDEX = ROADMAP_ITEMS.findIndex(item => item.status === 'ACTIVE');

function DecryptTitle({ title, isFuture }: { title: string; isFuture: boolean }) {
    const { displayText, onMouseEnter, onMouseLeave } = useScramble(title, 30);
    if (!isFuture) return <>{title}</>;

    return (
        <span onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} className="cursor-pointer">
            {displayText}
        </span>
    );
}

export function Roadmap() {
    const [activeIndex, setActiveIndex] = useState(PRESENT_INDEX);
    const sectionRef = useRef<HTMLElement>(null);
    const lenis = useLenis();

    // The Unified Scroll & State Action
    const handleEngagePhase = (index: number) => {
        if (activeIndex === index) return;

        setActiveIndex(index);

        // Lenis hardware-accelerated scroll integration
        if (lenis) {
            const cards = gsap.utils.toArray('.roadmap-card', sectionRef.current) as HTMLElement[];
            if (cards[index]) {
                lenis.scrollTo(cards[index], { offset: -400, duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
            }
        }
    };

    // The Unified Physics Engine
    useGSAP(() => {
        const cards = gsap.utils.toArray('.roadmap-card') as HTMLElement[];
        const contentWrappers = gsap.utils.toArray('.card-content-wrapper') as HTMLElement[];

        // 1. Update Timeline Progress
        gsap.to('.timeline-progress', {
            height: `${((activeIndex + 1) / ROADMAP_ITEMS.length) * 100}%`,
            duration: 0.8,
            ease: "expo.out"
        });

        // 2. Iterate and mutate DOM
        cards.forEach((card, index) => {
            const isActive = index === activeIndex;
            const content = contentWrappers[index];

            // Select the new light engine layers
            const physicsWrapper = card.querySelector('.card-physics-wrapper');
            const surface = card.querySelector('.card-surface');
            const ambientGlow = card.querySelector('.ambient-glow');
            const kineticBorder = card.querySelector('.kinetic-border');
            const rotatingBeam = card.querySelector('.rotating-beam');

            gsap.killTweensOf([card, content, physicsWrapper, surface, ambientGlow, kineticBorder, rotatingBeam]);

            if (isActive) {
                // Expand Height
                gsap.to(content, { height: 'auto', opacity: 1, duration: 0.5, ease: "power3.out" });

                // Spin the inner light beam continuously
                gsap.to(rotatingBeam, { rotation: 360, duration: 3, repeat: -1, ease: 'linear' });

                // Turn on the lights (Opacity)
                gsap.to([ambientGlow, kineticBorder], { opacity: 0.4, duration: 0.8 });

                // Levitation Matrix (Applied to the whole wrapper)
                gsap.to(physicsWrapper, {
                    y: -15,
                    scale: 1.05,
                    zIndex: 10,
                    duration: 1.2,
                    ease: 'elastic.out(1, 0.7)',
                    boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.9)'
                });

                // Remove the static CSS border when active so the light shines through
                gsap.to(surface, { borderColor: 'transparent', duration: 0.3 });

            } else {
                // Collapse Height
                gsap.to(content, { height: 0, opacity: 0, duration: 0.4, ease: "power3.inOut" });

                // CRITICAL: Stop the infinite rotation when hidden
                gsap.killTweensOf(rotatingBeam);
                gsap.set(rotatingBeam, { rotation: 0 }); // Reset position

                // Turn off the lights
                gsap.to([ambientGlow, kineticBorder], { opacity: 0, duration: 0.5 });

                // Slam to grid
                const distance = Math.abs(index - activeIndex);
                gsap.to(physicsWrapper, {
                    y: 0,
                    scale: index < activeIndex ? 0.98 : 1,
                    zIndex: 0,
                    duration: 0.5,
                    ease: 'power3.out',
                    boxShadow: '0 0px 0px 0px rgba(0,0,0,0)'
                });

                // Restore static border
                gsap.to(surface, { borderColor: '#111', duration: 0.3 });
            }
        });
    }, { scope: sectionRef, dependencies: [activeIndex] });

    return (
        <section ref={sectionRef} className="relative py-14 md:py-24 lg:py-32 bg-[#050505] overflow-hidden border-t border-[#111]">

            {/* Background Grid */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundSize: '30px 30px', backgroundImage: 'linear-gradient(to right, #222 1px, transparent 1px), linear-gradient(to bottom, #222 1px, transparent 1px)' }} />

            <div className="relative z-10 w-[85%] max-w-[1400px] mx-auto">

                {/* Header */}
                <div className="mb-12 max-w-3xl">
                    <span className="font-mono text-[10px] text-white/25 tracking-[0.3em] mb-5 block uppercase">
                        Feuille de route
                    </span>
                    <h2 className="font-headline text-h1 text-white font-bold tracking-wide leading-[1.05] mb-4">
                        Les prochaines étapes.
                    </h2>
                </div>

                {/* Navigation Nodes */}
                {/* Core Interactive Area (RESTORED ARCHITECTURE) */}
                <div className="relative">

                    {/* The Timeline Track */}
                    <div className="absolute left-8 md:left-12 top-0 bottom-0 w-1.5 bg-[#111] rounded-full border border-white/5 transform -translate-x-1/2 z-0 overflow-hidden">
                        {/* The GSAP Timeline Progress */}
                        <div className="timeline-progress absolute top-0 left-0 right-0 w-full bg-gradient-to-b from-[#111] via-gray-400 to-white shadow-[0_0_15px_rgba(255,255,255,0.8)]">
                            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent opacity-80" />
                        </div>
                    </div>

                    {/* Nodes Wrapper (Restores the left padding so the dots align with the track) */}
                    <div className="space-y-6 pl-16 md:pl-24">
                        {ROADMAP_ITEMS.map((item, index) => {
                            const isFuture = item.status === 'UPCOMING' || item.status === 'LOCKED';
                            const isActive = index === activeIndex;

                            return (
                                <div key={`card-${index}`} onClick={() => handleEngagePhase(index)} className="relative cursor-pointer origin-left roadmap-card">

                                    {/* Connection Point (Left Dot) */}
                                    <div className={`absolute -left-[40px] md:-left-[56px] top-4 w-4 h-4 rounded-full border-2 transition-all duration-300 z-20 ${isActive ? 'bg-white border-white shadow-[0_0_20px_rgba(255,255,255,0.8)] scale-125' : index < activeIndex ? 'bg-gray-600 border-gray-600 opacity-50' : 'bg-[#050505] border-[#333]'}`}>
                                        {isActive && <div className="absolute inset-0 rounded-full bg-white animate-ping opacity-40" />}
                                    </div>

                                    {/* THE LIGHT ENGINE STRUCTURE */}
                                    <div className="card-physics-wrapper relative rounded-xl w-full">
                                        <div className="ambient-glow absolute -inset-2 bg-[#00E5FF] rounded-xl blur-2xl opacity-0 z-0 pointer-events-none" />
                                        <div className="kinetic-border absolute -inset-[1px] rounded-xl overflow-hidden opacity-0 z-0 pointer-events-none">
                                            <div className="rotating-beam absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_70%,rgba(0,229,255,1)_95%,transparent_100%)]" />
                                        </div>

                                        <div className="card-surface relative z-10 p-6 md:p-8 bg-[#050505] border border-[#111] rounded-xl transition-colors duration-300">

                                            <div className="flex flex-wrap items-center gap-2 mb-4">
                                                <span className={`font-mono text-[10px] md:text-xs tracking-wider md:tracking-widest px-2 py-0.5 border transition-all ${isActive ? 'border-[#00E5FF] text-[#00E5FF] bg-[#00E5FF]/10' : 'border-[#333] text-gray-500'}`}>
                                                    {item.phase} {'//'} {item.status}
                                                </span>
                                                <span className="font-mono text-[10px] md:text-xs text-gray-600">{item.date}</span>
                                            </div>

                                            <h4 className={`font-sans font-bold tracking-tight transition-all mb-2 ${isActive ? 'text-2xl md:text-3xl text-white' : 'text-lg text-gray-500'}`}>
                                                <DecryptTitle title={item.title} isFuture={isFuture} />
                                            </h4>

                                            <div className="card-content-wrapper overflow-hidden" style={{ height: isActive ? 'auto' : 0, opacity: isActive ? 1 : 0 }}>
                                                <div className="pt-4 border-t border-white/5 mt-4">
                                                    <p className="font-mono text-sm md:text-base text-gray-400 mb-6 leading-relaxed">
                                                        {item.description}
                                                    </p>
                                                    <ul className="flex flex-wrap gap-2">
                                                        {item.features.map((feature, i) => (
                                                            <li key={i} className="font-mono text-xs px-3 py-1.5 rounded border text-gray-300 bg-white/5 border-white/10">
                                                                {feature}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* END OF ROADMAP */}
            </div>
        </section>
    );
}
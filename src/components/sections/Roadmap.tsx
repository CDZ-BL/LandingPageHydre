'use client';

import { motion } from 'framer-motion';

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

export function Roadmap() {
    return (
        <section className="relative py-24 md:py-32 bg-black overflow-hidden border-t border-void-800">
            {/* Background Grid */}
            <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundSize: '30px 30px',
                    backgroundImage: 'linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)'
                }}
            />

            <div className="relative z-10 w-[90%] max-w-[800px] mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="mb-16 text-center md:text-left"
                >
                    <h2 className="font-mono text-cyan-400 text-sm tracking-widest mb-4">
                        [ SYSTEM_LOGS // ROADMAP ]
                    </h2>
                    <h3 className="font-sans text-3xl md:text-5xl text-white font-bold tracking-tight">
                        VISION : LONG TERM.
                    </h3>
                </motion.div>

                <div className="relative border-l border-void-700 ml-4 md:ml-8 pl-8 md:pl-12 py-4 space-y-16">
                    {ROADMAP_ITEMS.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="relative"
                        >
                            {/* Dot on timeline */}
                            <div className={`absolute -left-[41px] md:-left-[57px] top-2 w-4 h-4 rounded-full border-2 
                                ${item.status === 'ACTIVE'
                                    ? 'bg-neon-orange border-neon-orange shadow-[0_0_15px_rgba(255,122,0,0.5)]'
                                    : item.status === 'COMPLETED'
                                        ? 'bg-void-500 border-void-500'
                                        : 'bg-black border-void-500'
                                }`}
                            >
                                {item.status === 'ACTIVE' && (
                                    <div className="absolute inset-0 rounded-full bg-neon-orange animate-ping opacity-50" />
                                )}
                            </div>

                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-2">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className={`font-mono text-xs tracking-widest px-2 py-0.5 border ${item.status === 'ACTIVE'
                                            ? 'border-neon-orange text-neon-orange'
                                            : 'border-void-600 text-gray-400'
                                            }`}>
                                            {item.phase} // {item.status}
                                        </span>
                                        <span className="font-mono text-xs text-gray-500">{item.date}</span>
                                    </div>
                                    <h4 className={`font-sans text-xl md:text-2xl font-bold tracking-tight ${item.status === 'LOCKED' ? 'text-gray-500' : 'text-white'}`}>
                                        {item.title}
                                    </h4>
                                </div>
                            </div>

                            <p className="font-mono text-sm md:text-base text-gray-300 mb-4 max-w-xl leading-relaxed">
                                {item.description}
                            </p>

                            <ul className="flex flex-wrap gap-2">
                                {item.features.map((feature, i) => (
                                    <li key={i} className="font-mono text-xs text-void-800 bg-void-200 px-2 py-1 rounded border border-void-300">
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

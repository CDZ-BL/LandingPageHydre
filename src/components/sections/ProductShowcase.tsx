'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { AI_COACH_CLAIMS } from '@/constants/claims';

interface Protocol {
    sport: string;
    duration: string;
    steps: string[];
}

// Hardcoded fallback protocols (Gemini API can be added later)
const PROTOCOLS: Record<string, Protocol> = {
    'hyrox': {
        sport: 'HYROX',
        duration: '60-90 MIN',
        steps: [
            'PRÉ-COURSE: 500ml AETHER + 20g glucides, 45min avant départ. Phase de saturation électrolytique.',
            'MI-COURSE: 250ml toutes les 15min pendant les phases de course. Éviter pendant les stations fitness.',
            'POST-COURSE: 500ml immédiat dans les 15min. Protéines dans les 30min suivantes.',
        ],
    },
    'crossfit': {
        sport: 'CROSSFIT',
        duration: '45-60 MIN',
        steps: [
            'PRÉ-WOD: 300ml AETHER 30min avant. Éviter de boire pendant l\'échauffement.',
            'INTRA-WOD: Petites gorgées uniquement entre les mouvements. Jamais pendant les bursts haute intensité.',
            'POST-WOD: 500ml immédiat après le time cap. Fenêtre critique pour la reconstitution du glycogène.',
        ],
    },
    'running': {
        sport: 'ENDURANCE',
        duration: '90+ MIN',
        steps: [
            'PRÉ-RUN: 400ml AETHER 1h avant. Commencez hydraté, pas assoiffé.',
            'MI-RUN: 150-200ml toutes les 20min. Programmez des alertes. N\'attendez pas la soif.',
            'POST-RUN: 1.5x fluide perdu. Pesez-vous avant/après. Ajoutez protéines pour adaptation.',
        ],
    },
    'general': {
        sport: 'ENTRAÎNEMENT GÉNÉRAL',
        duration: '30-60 MIN',
        steps: [
            'PRÉ-TRAINING: 250ml AETHER 30min avant session. Hydratation de base.',
            'INTRA-TRAINING: Boire selon besoin. Faites confiance aux signaux corporels.',
            'POST-TRAINING: Minimum 500ml dans les 30min. Accompagner d\'un repas équilibré.',
        ],
    },
};

export function AICoach() {
    const [sport, setSport] = useState('');
    const [duration, setDuration] = useState('');
    const [protocol, setProtocol] = useState<Protocol | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const generateProtocol = () => {
        setIsGenerating(true);

        // Simulate API delay
        setTimeout(() => {
            const sportLower = sport.toLowerCase();
            let selected: Protocol;

            if (sportLower.includes('hyrox')) {
                selected = PROTOCOLS.hyrox;
            } else if (sportLower.includes('crossfit') || sportLower.includes('wod')) {
                selected = PROTOCOLS.crossfit;
            } else if (sportLower.includes('run') || sportLower.includes('marathon') || sportLower.includes('course')) {
                selected = PROTOCOLS.running;
            } else {
                selected = PROTOCOLS.general;
            }

            setProtocol(selected);
            setIsGenerating(false);
        }, 1500);
    };

    return (
        <section id="ai-coach" className="relative min-h-screen py-32 bg-void">
            {/* Grid overlay */}
            <div
                className="absolute inset-0 opacity-5"
                style={{
                    backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
                    backgroundSize: '50px 50px',
                }}
            />

            <div className="relative z-10 w-[85%] max-w-[1600px] mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <p className="font-data text-void-900 mb-4">{AI_COACH_CLAIMS.sectionLabel}</p>
                    <h2 className="font-display text-4xl md:text-5xl text-white mb-4">
                        {AI_COACH_CLAIMS.headline}
                    </h2>
                    <p className="font-data text-void-900">
                        {AI_COACH_CLAIMS.description}
                    </p>
                </motion.div>

                {/* Terminal Interface */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="border border-void-300 p-8 md:p-12"
                >
                    {/* Input Fields */}
                    <div className="space-y-8 mb-12">
                        <div>
                            <label className="font-data text-white text-xs block mb-2">
                                {AI_COACH_CLAIMS.sportLabel}
                            </label>
                            <input
                                type="text"
                                value={sport}
                                onChange={(e) => setSport(e.target.value)}
                                placeholder={AI_COACH_CLAIMS.sportPlaceholder}
                                className="terminal-input"
                            />
                        </div>

                        <div>
                            <label className="font-data text-white text-xs block mb-2">
                                {AI_COACH_CLAIMS.durationLabel}
                            </label>
                            <input
                                type="text"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                placeholder={AI_COACH_CLAIMS.durationPlaceholder}
                                className="terminal-input"
                            />
                        </div>
                    </div>

                    {/* Generate Button */}
                    <button
                        onClick={generateProtocol}
                        disabled={!sport || isGenerating}
                        className="w-full py-4 border border-void-300 text-white font-display text-sm tracking-widest
                       hover:bg-white hover:text-black transition-all duration-300
                       disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        {isGenerating ? AI_COACH_CLAIMS.generating : AI_COACH_CLAIMS.generateButton}
                    </button>

                    {/* Protocol Output */}
                    {protocol && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-12 border-t border-void-300 pt-8"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <span className="font-data text-void-900 text-xs">{AI_COACH_CLAIMS.protocolLabel}</span>
                                <span className="font-data text-neon-orange text-sm font-semibold">{protocol.sport} • {protocol.duration}</span>
                            </div>

                            <div className="space-y-6">
                                {protocol.steps.map((step, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.2 }}
                                        className="flex gap-4"
                                    >
                                        <span className="font-data text-white text-xs flex-shrink-0 pt-1">
                                            {String(i + 1).padStart(2, '0')}
                                        </span>
                                        <p className="font-sans text-sm text-white leading-relaxed">
                                            {step}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="mt-8 pt-6 border-t border-void-200">
                                <p className="font-data text-white text-xs">
                                    {AI_COACH_CLAIMS.disclaimer}
                                </p>
                            </div>
                        </motion.div>
                    )}
                </motion.div>

                {/* API Note for Developers */}
                <p className="font-data text-white text-xs text-center mt-8">
                    {AI_COACH_CLAIMS.apiNote}
                </p>
            </div>
        </section>
    );
}


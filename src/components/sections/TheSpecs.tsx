'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { getAssetPath } from '@/lib/utils';
import { TacticalGlass } from '@/components/ui/TacticalGlass';

interface Ingredient {
    id: string;
    number: string;
    name: string;
    amount: string;
    function: string;
    specificity: string;
}

const INGREDIENTS: Ingredient[] = [
    {
        id: 'magnesium',
        number: '01',
        name: 'MAGNÉSIUM BISGLYCINATE',
        amount: '200mg',
        function: 'Neuro-transmission & Récupération musculaire.',
        specificity: 'Forme chélatée. Biodisponibilité maximale. Zéro trouble digestif.'
    },
    {
        id: 'sodium',
        number: '02',
        name: 'SODIUM',
        amount: '500mg',
        function: 'Rétention hydrique & Volumisation.',
        specificity: 'Dosage calibré pour compenser la perte sudorale intense (Hyrox/Zone 2).'
    },
    {
        id: 'potassium',
        number: '03',
        name: 'POTASSIUM',
        amount: '300mg',
        function: 'Équilibre électrolytique intracellulaire.',
        specificity: 'Prévient les crampes mécaniques sous tension.'
    },
    {
        id: 'flavor',
        number: '04',
        name: 'VECTEUR DE GOÛT',
        amount: 'N/A',
        function: 'Extraction réelle.',
        specificity: 'L\'amertume des minéraux est masquée, pas supprimée par du sucre. Le goût est une fonction, pas une friandise.'
    }
];

export function TheSpecs() {
    const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);

    return (
        <section className="relative py-32 bg-void overflow-hidden">
            {/* Grid background */}
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

            <div className="relative z-10 w-[85%] max-w-[1400px] mx-auto">
                {/* Title */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="mb-16 text-center"
                >
                    <span className="font-mono text-neon-cyan text-xs font-bold tracking-wider">COMPOSITION</span>
                    <h2 className="font-sans text-4xl md:text-6xl text-white font-bold tracking-tight mt-2">
                        ARCHITECTURE MOLÉCULAIRE
                    </h2>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* X-Ray Image */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <TacticalGlass label="X-RAY" className="p-8" scanLine={true}>
                            <div className="relative w-full aspect-square">
                                <Image
                                    src={getAssetPath('/images/Xraytube.png')}
                                    alt="X-Ray Formula"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <div className="mt-6 font-mono text-xs text-neon-cyan tracking-wider text-center">
                                [X-RAY MODE] — FORMULE V1.0
                            </div>
                        </TacticalGlass>
                    </motion.div>

                    {/* Ingredient List - Code Style */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="space-y-6"
                    >
                        {INGREDIENTS.map((ingredient, i) => (
                            <motion.div
                                key={ingredient.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: false }}
                                transition={{ duration: 0.6, delay: i * 0.1 }}
                                onClick={() => setSelectedIngredient(ingredient)}
                                className="tactical-glass p-6 hover:neon-border transition-all cursor-pointer targeting-reticle"
                            >
                                <div className="font-mono text-neon-cyan text-sm mb-3">
                                    // {ingredient.number}. {ingredient.name} ({ingredient.amount})
                                </div>
                                <div className="space-y-2 font-mono text-sm text-void-600">
                                    <div>
                                        <span className="text-void-400">Fonction :</span> {ingredient.function}
                                    </div>
                                    <div>
                                        <span className="text-void-400">Spécificité :</span> {ingredient.specificity}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Detail Panel */}
                <AnimatePresence>
                    {selectedIngredient && (
                        <TacticalGlass
                            label="ANALYSIS"
                            className="mt-12 p-8 md:p-12"
                            scanLine={true}
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <div className="font-mono text-neon-cyan text-xs font-bold tracking-wider">
                                        ANALYSE DÉTAILLÉE — {selectedIngredient.number}
                                    </div>
                                    <h3 className="font-sans text-3xl text-white font-bold mt-2">
                                        {selectedIngredient.name}
                                    </h3>
                                    <div className="font-mono text-neon-cyan text-xl font-semibold mt-1">
                                        {selectedIngredient.amount}
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedIngredient(null)}
                                    className="font-mono text-void-500 hover:text-neon-cyan transition-colors text-2xl"
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="space-y-4 font-sans text-lg text-void-700">
                                <div>
                                    <span className="text-neon-cyan font-semibold">Fonction : </span>
                                    {selectedIngredient.function}
                                </div>
                                <div>
                                    <span className="text-neon-cyan font-semibold">Spécificité : </span>
                                    {selectedIngredient.specificity}
                                </div>
                            </div>
                        </TacticalGlass>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}

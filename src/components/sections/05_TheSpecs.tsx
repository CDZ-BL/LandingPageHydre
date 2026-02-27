'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { getAssetPath } from '@/lib/utils';

// ═══════════════════════════════════════════════════════════════════════════
// INGREDIENT DATA — Real formulation per tablet
// ═══════════════════════════════════════════════════════════════════════════

interface Ingredient {
    id: string;
    name: string;
    source: string;
    amount: number;
    unit: string;
    category: 'electrolyte' | 'vitamin';
}

const INGREDIENTS: Ingredient[] = [
    // ── ELECTROLYTES ──
    { id: 'sodium',    name: 'SODIUM',    source: 'Sodium Bicarbonate',               amount: 280, unit: 'mg', category: 'electrolyte' },
    { id: 'potassium', name: 'POTASSIUM', source: 'Potassium Chloride, Citrate',      amount: 150, unit: 'mg', category: 'electrolyte' },
    { id: 'chlore',    name: 'CHLORE',    source: 'Potassium Chloride',               amount: 70,  unit: 'mg', category: 'electrolyte' },
    { id: 'magnesium', name: 'MAGNÉSIUM', source: 'Magnesium Citrate',                amount: 60,  unit: 'mg', category: 'electrolyte' },
    { id: 'zinc',      name: 'ZINC',      source: 'Zinc Citrate',                     amount: 3,   unit: 'mg', category: 'electrolyte' },
    // ── VITAMINS ──
    { id: 'vitc',      name: 'VITAMINE C',   source: 'Acide L-Ascorbique',            amount: 60,  unit: 'mg', category: 'vitamin' },
    { id: 'vitb3',     name: 'VITAMINE B3',  source: 'Niacine',                       amount: 8,   unit: 'mg', category: 'vitamin' },
    { id: 'vitb5',     name: 'VITAMINE B5',  source: 'Acide Pantothénique',           amount: 2,   unit: 'mg', category: 'vitamin' },
    { id: 'vitb6',     name: 'VITAMINE B6',  source: 'Pyridoxine',                    amount: 2,   unit: 'mg', category: 'vitamin' },
    { id: 'vitb12',    name: 'VITAMINE B12', source: 'Cyanocobalamine',               amount: 2,   unit: 'mcg', category: 'vitamin' },
];

const ELECTROLYTES = INGREDIENTS.filter(i => i.category === 'electrolyte');
const VITAMINS = INGREDIENTS.filter(i => i.category === 'vitamin');

// Max dosage for bar scaling (within each category)
const MAX_ELECTROLYTE = Math.max(...ELECTROLYTES.map(i => i.amount));
const MAX_VITAMIN = Math.max(...VITAMINS.map(i => i.amount));

// ═══════════════════════════════════════════════════════════════════════════
// INGREDIENT ROW — Single row in the datasheet
// ═══════════════════════════════════════════════════════════════════════════

function IngredientRow({
    ingredient,
    index,
    maxAmount,
    accentColor,
}: {
    ingredient: Ingredient;
    index: number;
    maxAmount: number;
    accentColor: string;
}) {
    const barWidth = Math.max((ingredient.amount / maxAmount) * 100, 4); // min 4% for visibility

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: index * 0.06 }}
            className="group"
        >
            {/* Row */}
            <div className="flex items-center gap-4 py-3 border-b border-white/[0.04] group-hover:border-white/10 transition-colors duration-300">

                {/* Name + Source */}
                <div className="w-[140px] md:w-[180px] shrink-0">
                    <div className="font-mono text-xs md:text-sm text-white font-bold tracking-wider group-hover:text-white transition-colors">
                        {ingredient.name}
                    </div>
                    <div className="font-mono text-[10px] text-white/25 tracking-wide mt-0.5 truncate">
                        {ingredient.source}
                    </div>
                </div>

                {/* Bar */}
                <div className="flex-1 h-[6px] bg-white/[0.04] rounded-full overflow-hidden relative">
                    <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${barWidth}%` }}
                        viewport={{ once: true, margin: '-30px' }}
                        transition={{ duration: 1, delay: 0.2 + index * 0.06, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full rounded-full relative"
                        style={{
                            background: `linear-gradient(90deg, ${accentColor}40, ${accentColor})`,
                            boxShadow: `0 0 12px ${accentColor}30`,
                        }}
                    />
                </div>

                {/* Dosage */}
                <div className="w-[70px] md:w-[80px] shrink-0 text-right">
                    <span className="font-mono text-sm md:text-base font-bold tabular-nums" style={{ color: accentColor }}>
                        {ingredient.amount}
                    </span>
                    <span className="font-mono text-[10px] text-white/30 ml-0.5">
                        {ingredient.unit}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// CATEGORY HEADER — Divider between electrolytes and vitamins
// ═══════════════════════════════════════════════════════════════════════════

function CategoryHeader({ label, count, color }: { label: string; count: number; color: string }) {
    return (
        <div className="flex items-center gap-3 mb-2 mt-2">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}60` }} />
            <span className="font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">
                {label}
            </span>
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="font-mono text-[10px] text-white/20 tabular-nums">
                {count.toString().padStart(2, '0')} COMPOSANTS
            </span>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

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
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="mb-16"
                >
                    <span className="font-mono text-xs text-neon-orange tracking-widest mb-4 block">
                        [ SECTION 3 : LA FORMULE ]
                    </span>
                    <h2 className="font-headline text-4xl md:text-6xl text-white font-bold tracking-widest">
                        ARCHITECTURE MOLÉCULAIRE.
                    </h2>
                    <p className="font-mono text-sm text-white/40 mt-4 tracking-wide max-w-2xl">
                        Composition complète par pastille effervescente. Chaque molécule a une fonction. Rien de superflu.
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-12 xl:gap-16 items-start">

                    {/* ━━━ LEFT: X-Ray Image ━━━ */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="border border-white/[0.06] p-8 bg-white/[0.01] relative">
                            {/* HUD Corners */}
                            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-white/20" />
                            <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/20" />
                            <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-white/20" />
                            <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-white/20" />

                            <div className="relative w-full aspect-square">
                                <Image
                                    src={getAssetPath('/images/Xraytube.png')}
                                    alt="Radiographie de la formule HYDRE — composition par pastille"
                                    fill
                                    className="object-contain"
                                    sizes="(max-width: 1024px) 85vw, 42vw"
                                />
                            </div>
                            <div className="mt-6 flex items-center justify-center gap-3">
                                <div className="h-px flex-1 bg-white/[0.06]" />
                                <span className="font-mono text-[10px] text-white/30 tracking-[0.15em]">
                                    [X-RAY MODE] — FORMULE V1.0
                                </span>
                                <div className="h-px flex-1 bg-white/[0.06]" />
                            </div>
                        </div>
                    </motion.div>

                    {/* ━━━ RIGHT: Ingredient Datasheet ━━━ */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Datasheet Container */}
                        <div className="border border-white/[0.06] bg-white/[0.01] relative">
                            {/* HUD Corners */}
                            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-white/20" />
                            <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/20" />
                            <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-white/20" />
                            <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-white/20" />

                            {/* Header Bar */}
                            <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="font-mono text-[10px] text-white/50 tracking-[0.2em] uppercase">
                                        Fiche Technique — 1 Pastille
                                    </span>
                                </div>
                                <span className="font-mono text-[10px] text-white/20 tracking-wider">
                                    {INGREDIENTS.length} ACTIFS
                                </span>
                            </div>

                            {/* Content */}
                            <div className="px-6 py-5">

                                {/* ── ELECTROLYTES ── */}
                                <CategoryHeader
                                    label="Électrolytes"
                                    count={ELECTROLYTES.length}
                                    color="#FF6B00"
                                />
                                {ELECTROLYTES.map((ingredient, i) => (
                                    <IngredientRow
                                        key={ingredient.id}
                                        ingredient={ingredient}
                                        index={i}
                                        maxAmount={MAX_ELECTROLYTE}
                                        accentColor="#FF6B00"
                                    />
                                ))}

                                {/* Spacer */}
                                <div className="h-6" />

                                {/* ── VITAMINS ── */}
                                <CategoryHeader
                                    label="Vitamines"
                                    count={VITAMINS.length}
                                    color="#CCFF00"
                                />
                                {VITAMINS.map((ingredient, i) => (
                                    <IngredientRow
                                        key={ingredient.id}
                                        ingredient={ingredient}
                                        index={i + ELECTROLYTES.length}
                                        maxAmount={MAX_VITAMIN}
                                        accentColor="#CCFF00"
                                    />
                                ))}
                            </div>

                            {/* Footer */}
                            <div className="px-6 py-4 border-t border-white/[0.06] flex items-center justify-between">
                                <span className="font-mono text-[10px] text-white/20 tracking-wider">
                                    0 SUCRE // 0 COLORANT // 0 ÉDULCORANT
                                </span>
                                <span className="font-mono text-[10px] text-white/20 tracking-wider">
                                    100% ACTIFS
                                </span>
                            </div>
                        </div>

                        {/* Bottom Note */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.8 }}
                            className="mt-4 font-mono text-[10px] text-white/15 tracking-wider text-right"
                        >
                            [DATA] FORMULATION OUVERTE — AUCUN PROPRIETARY BLEND
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

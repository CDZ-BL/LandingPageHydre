'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { XRayTubeCanvas } from '@/components/three/XRayTubeCanvas';

// ═══════════════════════════════════════════════════════════════════════════
// INGREDIENT DATA — Real formulation per tablet
// ═══════════════════════════════════════════════════════════════════════════

interface Ingredient {
    id: string;
    name: string;
    source: string;
    amount: number;
    unit: string;
    ajr: number; // EU AJR (Reg. 1169/2011)
    category: 'electrolyte' | 'vitamin';
}

const INGREDIENTS: Ingredient[] = [
    // ── ELECTROLYTES ── (AJR: EU Regulation 1169/2011)
    { id: 'sodium', name: 'SODIUM', source: 'Sodium Bicarbonate', amount: 280, unit: 'mg', ajr: 2000, category: 'electrolyte' },
    { id: 'potassium', name: 'POTASSIUM', source: 'Potassium Chloride, Citrate', amount: 150, unit: 'mg', ajr: 2000, category: 'electrolyte' },
    { id: 'chlore', name: 'CHLORE', source: 'Potassium Chloride', amount: 70, unit: 'mg', ajr: 800, category: 'electrolyte' },
    { id: 'magnesium', name: 'MAGNÉSIUM', source: 'Magnesium Citrate', amount: 60, unit: 'mg', ajr: 375, category: 'electrolyte' },
    { id: 'zinc', name: 'ZINC', source: 'Zinc Citrate', amount: 3, unit: 'mg', ajr: 10, category: 'vitamin' },
    // ── VITAMINS ──
    { id: 'vitc', name: 'VITAMINE C', source: 'Acide L-Ascorbique', amount: 60, unit: 'mg', ajr: 80, category: 'vitamin' },
    { id: 'vitb3', name: 'VITAMINE B3', source: 'Niacine', amount: 8, unit: 'mg', ajr: 16, category: 'vitamin' },
    { id: 'vitb5', name: 'VITAMINE B5', source: 'Acide Pantothénique', amount: 2, unit: 'mg', ajr: 6, category: 'vitamin' },
    { id: 'vitb6', name: 'VITAMINE B6', source: 'Pyridoxine', amount: 2, unit: 'mg', ajr: 1.4, category: 'vitamin' },
    { id: 'vitb12', name: 'VITAMINE B12', source: 'Cyanocobalamine', amount: 2, unit: 'mcg', ajr: 2.5, category: 'vitamin' },
];

const ELECTROLYTES = INGREDIENTS.filter(i => i.category === 'electrolyte');
const VITAMINS = INGREDIENTS.filter(i => i.category === 'vitamin');

// ═══════════════════════════════════════════════════════════════════════════
// INGREDIENT ROW — Single row in the datasheet
// ═══════════════════════════════════════════════════════════════════════════

function IngredientRow({
    ingredient,
    index,
    accentColor,
    barMode = 'ajr',
    maxAmount = 1,
}: {
    ingredient: Ingredient;
    index: number;
    accentColor: string;
    barMode?: 'ajr' | 'amount';
    maxAmount?: number;
}) {
    const ajrPercent = Math.round((ingredient.amount / ingredient.ajr) * 100);
    // For 'amount' mode: normalize bar to the highest amount in the group
    const barWidth = barMode === 'amount'
        ? Math.min(Math.max((ingredient.amount / maxAmount) * 100, 4), 100)
        : Math.min(Math.max(ajrPercent, 4), 100);

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

                {/* Dosage + % AJR */}
                <div className="w-[100px] md:w-[120px] shrink-0 text-right">
                    <span className="font-mono text-sm md:text-base font-bold tabular-nums" style={{ color: accentColor }}>
                        {ingredient.amount}
                    </span>
                    <span className="font-mono text-[10px] text-white/30 ml-0.5">
                        {ingredient.unit}
                    </span>
                    <span className="font-mono text-[10px] text-white/40 ml-1.5 tabular-nums">
                        {ajrPercent}%
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

            </span>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export function TheSpecs() {
    const [activeTab, setActiveTab] = useState<'ingredients' | 'nutrition'>('nutrition');
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
                    <h2 className="font-headline text-4xl md:text-6xl text-white font-bold tracking-widest">
                        ARCHITECTURE MOLÉCULAIRE.
                    </h2>
                    <p className="font-mono text-sm text-white/40 mt-4 tracking-wide max-w-2xl">
                        Composition complète par pastille effervescente. Chaque molécule a une fonction. Rien de superflu.
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-12 xl:gap-16 items-stretch">

                    {/* ━━━ LEFT: X-Ray Image ━━━ */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="relative h-full min-h-[50vh] lg:min-h-0 flex flex-col"
                    >
                        <div className="relative w-[120%] -ml-[10%] lg:w-full lg:ml-0 flex-1 h-full flex items-center justify-center -mt-10 lg:mt-0">
                            <XRayTubeCanvas />

                            {/* Floating Label */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-xs flex items-center justify-center gap-3 opacity-50 pointer-events-none">
                                <div className="h-px flex-1 bg-white/[0.06]" />
                                <span className="font-mono text-[10px] text-white/50 tracking-[0.15em] whitespace-nowrap">
                                    RADIOGRAPHIE 3D — TEMPS RÉEL
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

                            {/* Header Bar — Tab Buttons */}
                            <div className="px-6 py-3 border-b border-white/[0.06] flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                                <button
                                    onClick={() => setActiveTab('ingredients')}
                                    className={`font-mono text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 rounded-sm transition-all duration-300 ${activeTab === 'ingredients'
                                        ? 'bg-white/10 text-white border border-white/20'
                                        : 'text-white/40 hover:text-white/60 border border-transparent'
                                        }`}
                                >
                                    Ingrédients
                                </button>
                                <button
                                    onClick={() => setActiveTab('nutrition')}
                                    className={`font-mono text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 rounded-sm transition-all duration-300 ${activeTab === 'nutrition'
                                        ? 'bg-white/10 text-white border border-white/20'
                                        : 'text-white/40 hover:text-white/60 border border-transparent'
                                        }`}
                                >
                                    Apport Nutritionnel
                                </button>
                            </div>

                            {/* Content */}
                            <div className="px-6 py-5">

                                {activeTab === 'nutrition' ? (
                                    <>
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
                                                accentColor="#FF6B00"
                                                barMode="amount"
                                                maxAmount={Math.max(...ELECTROLYTES.map(e => e.amount))}
                                            />
                                        ))}

                                        {/* Spacer */}
                                        <div className="h-6" />

                                        {/* ── VITAMINS ── */}
                                        <CategoryHeader
                                            label="Vitamines et minéraux"
                                            count={VITAMINS.length}
                                            color="#CCFF00"
                                        />
                                        {VITAMINS.map((ingredient, i) => (
                                            <IngredientRow
                                                key={ingredient.id}
                                                ingredient={ingredient}
                                                index={i + ELECTROLYTES.length}
                                                accentColor="#CCFF00"
                                            />
                                        ))}
                                    </>
                                ) : (
                                    /* ── INGREDIENTS LIST ── */
                                    <div className="space-y-3">
                                        <div className="font-mono text-[10px] text-white/30 tracking-[0.15em] uppercase mb-4">
                                            Liste des ingrédients — 1 pastille effervescente
                                        </div>
                                        <p className="font-mono text-xs text-white/60 leading-relaxed">
                                            Acide citrique, bicarbonate de sodium, carbonate de sodium, sorbitol, chlorure de potassium,
                                            citrate de potassium, acide L-ascorbique (vitamine C), citrate de magnésium, arôme naturel Yuzu & Pêche,
                                            citrate de zinc, niacine (vitamine B3), D-pantothénate de calcium (vitamine B5),
                                            chlorhydrate de pyridoxine (vitamine B6), cyanocobalamine (vitamine B12),
                                            édulcorant : sucralose.
                                        </p>
                                        <div className="h-4" />
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                                            <span className="font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">
                                                Allergènes
                                            </span>
                                            <div className="flex-1 h-px bg-white/[0.06]" />
                                        </div>
                                        <p className="font-mono text-xs text-white/50 leading-relaxed">
                                            Aucun allergène majeur. Sans gluten, sans lactose, sans OGM.
                                        </p>
                                        <div className="h-4" />
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                                            <span className="font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">
                                                Conseils d&apos;utilisation
                                            </span>
                                            <div className="flex-1 h-px bg-white/[0.06]" />
                                        </div>
                                        <p className="font-mono text-xs text-white/50 leading-relaxed">
                                            Dissoudre 1 pastille dans un verre d&apos;eau froide (200 ml).
                                            Ne pas dépasser la dose journalière recommandée.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="px-6 py-4 border-t border-white/[0.06] flex items-center justify-between">
                                <span className="font-mono text-[10px] text-white/20 tracking-wider">
                                    *% AJR — Apports Journaliers Recommandés
                                </span>
                                <span className="font-mono text-[10px] text-white/15 tracking-wider">
                                    UE Reg. 1169/2011
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

                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

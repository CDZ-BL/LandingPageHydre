'use client';

import { motion } from 'framer-motion';
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
// FROSTED GLASS PANEL — Shared wrapper with backdrop blur
// ═══════════════════════════════════════════════════════════════════════════

function GlassPanel({
    children,
    className = '',
    delay = 0,
}: {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
            className={`
                relative
                border border-[var(--stroke)]
                bg-[var(--bg-surface)]/5
                backdrop-blur-xl
                ${className}
            `}
            style={{
                backdropFilter: 'blur(16px) saturate(1.2)',
                WebkitBackdropFilter: 'blur(16px) saturate(1.2)',
            }}
        >
            {/* HUD Corners */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[var(--stroke-hover)]" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[var(--stroke-hover)]" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[var(--stroke-hover)]" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[var(--stroke-hover)]" />
            {children}
        </motion.div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// INGREDIENT ROW — Ultra-sharp mono datasheet row
// ═══════════════════════════════════════════════════════════════════════════

function IngredientRow({
    ingredient,
    index,
    accentColor,
    maxAmount = 1,
}: {
    ingredient: Ingredient;
    index: number;
    accentColor: string;
    maxAmount?: number;
}) {
    const ajrPercent = Math.round((ingredient.amount / ingredient.ajr) * 100);
    const barWidth = Math.min(Math.max((ingredient.amount / maxAmount) * 100, 4), 100);

    return (
        <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.5, delay: index * 0.06 }}
            className="group"
        >
            <div className="flex items-center gap-3 py-2.5 border-b border-[var(--stroke)] group-hover:border-[var(--stroke-hover)] transition-colors duration-300">
                {/* Name */}
                <div className="w-[100px] md:w-[130px] shrink-0">
                    <div className="font-mono text-[11px] md:text-xs text-[var(--text-primary)] font-bold tracking-wider group-hover:text-[var(--text-primary)] transition-colors">
                        {ingredient.name}
                    </div>
                    <div className="font-mono text-[9px] text-[var(--text-muted)] tracking-wide mt-0.5 truncate">
                        {ingredient.source}
                    </div>
                </div>

                {/* Bar */}
                <div className="flex-1 h-[4px] bg-[var(--stroke)] rounded-full overflow-hidden relative">
                    <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${barWidth}%` }}
                        viewport={{ once: true, margin: '-20px' }}
                        transition={{ duration: 1, delay: 0.15 + index * 0.06, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full rounded-full"
                        style={{
                            background: `linear-gradient(90deg, ${accentColor}40, ${accentColor})`,
                            boxShadow: `0 0 10px ${accentColor}25`,
                        }}
                    />
                </div>

                {/* Value + AJR */}
                <div className="w-[65px] md:w-[80px] shrink-0 text-right">
                    <span className="font-mono text-xs md:text-sm font-bold tabular-nums" style={{ color: accentColor }}>
                        {ingredient.amount}
                    </span>
                    <span className="font-mono text-[9px] text-[var(--text-muted)] ml-0.5">
                        {ingredient.unit}
                    </span>
                    <span className="font-mono text-[9px] text-[var(--text-muted)] ml-1 tabular-nums">
                        {ajrPercent}%
                    </span>
                </div>
            </div>
        </motion.div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// CATEGORY HEADER
// ═══════════════════════════════════════════════════════════════════════════

function CategoryHeader({ label, color }: { label: string; color: string }) {
    return (
        <div className="flex items-center gap-2.5 mb-2 mt-1">
            <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}60` }}
            />
            <span className="font-mono text-[9px] tracking-[0.2em] text-[var(--text-muted)] uppercase">
                {label}
            </span>
            <div className="flex-1 h-px bg-[var(--stroke)]" />
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT — Centered Tube + Flanking Glass Panels
// ═══════════════════════════════════════════════════════════════════════════

export function TheSpecs() {
    const maxElectrolyteAmount = Math.max(...ELECTROLYTES.map(e => e.amount));

    return (
        <section className="relative py-20 md:py-32 bg-[var(--bg-primary)] overflow-hidden">
            {/* Subtle grid background */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
                    `,
                    backgroundSize: '60px 60px',
                }}
            />

            {/* Radial glow behind tube */}
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
                style={{
                    background: 'radial-gradient(circle, rgba(255,255,255,0.02) 0%, transparent 70%)',
                }}
            />

            <div className="relative z-10 w-[90%] max-w-[1500px] mx-auto">

                {/* ━━━ SECTION HEADER ━━━ */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16 md:mb-20"
                >
                    <h2 className="font-headline text-h1 text-[var(--text-primary)] font-bold tracking-wide">
                        Composition de votre produit
                    </h2>
                    <p className="font-mono text-sm text-[var(--text-muted)] mt-4 tracking-wide max-w-xl mx-auto">
                        Chaque molécule a une fonction. Rien de superflu.
                    </p>
                </motion.div>

                {/* ━━━ MAIN LAYOUT — 3 columns: Left Panel | Tube | Right Panel ━━━ */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr_1fr] gap-6 xl:gap-8 items-stretch">

                    {/* ── LEFT GLASS PANEL: Nutritional Data ── */}
                    <GlassPanel className="p-5 md:p-6 order-2 lg:order-1" delay={0.1}>
                        {/* Panel header */}
                        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[var(--stroke)]">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="font-mono text-[10px] tracking-[0.15em] text-[var(--text-muted)] uppercase">
                                Apport Nutritionnel
                            </span>
                        </div>

                        {/* Electrolytes */}
                        <CategoryHeader label="Électrolytes" color="#FF6B00" />
                        {ELECTROLYTES.map((ingredient, i) => (
                            <IngredientRow
                                key={ingredient.id}
                                ingredient={ingredient}
                                index={i}
                                accentColor="#FF6B00"
                                maxAmount={maxElectrolyteAmount}
                            />
                        ))}

                        <div className="h-4" />

                        {/* Vitamins */}
                        <CategoryHeader label="Vitamines & minéraux" color="#CCFF00" />
                        {VITAMINS.map((ingredient, i) => (
                            <IngredientRow
                                key={ingredient.id}
                                ingredient={ingredient}
                                index={i + ELECTROLYTES.length}
                                accentColor="#CCFF00"
                            />
                        ))}

                        {/* AJR footer */}
                        <div className="mt-4 pt-3 border-t border-[var(--stroke)]">
                            <span className="font-mono text-[9px] text-[var(--text-muted)] tracking-wider">
                                *% AJR — Apports Journaliers Recommandés · UE Reg. 1169/2011
                            </span>
                        </div>
                    </GlassPanel>

                    {/* ── CENTER: 3D Tube — Majestic & Levitating ── */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: '-100px' }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="relative order-1 lg:order-2 min-h-[45vh] md:min-h-[55vh] lg:min-h-0 flex items-center justify-center"
                    >
                        {/* Ambient glow ring */}
                        <div
                            className="absolute inset-0 pointer-events-none opacity-30"
                            style={{
                                background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.04) 0%, transparent 60%)',
                            }}
                        />
                        <div className="w-full h-full min-h-[400px] lg:min-h-[550px]">
                            <XRayTubeCanvas />
                        </div>
                    </motion.div>

                    {/* ── RIGHT GLASS PANEL: Ingredient List ── */}
                    <GlassPanel className="p-5 md:p-6 order-3" delay={0.2}>
                        {/* Panel header */}
                        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[var(--stroke)]">
                            <div className="w-2 h-2 rounded-full bg-white/30 animate-pulse" />
                            <span className="font-mono text-[10px] tracking-[0.15em] text-[var(--text-muted)] uppercase">
                                Liste des ingrédients
                            </span>
                        </div>

                        {/* Ingredient text */}
                        <div className="font-mono text-[10px] text-[var(--text-muted)] tracking-[0.15em] uppercase mb-3">
                            1 pastille effervescente
                        </div>
                        <p className="font-mono text-[11px] md:text-xs text-[var(--text-secondary)] leading-[1.8] tracking-wide">
                            Acide citrique, bicarbonate de sodium, carbonate de sodium, sorbitol, chlorure de potassium,
                            citrate de potassium, acide L-ascorbique (vitamine C), citrate de magnésium, arôme naturel Yuzu &amp; Pêche,
                            citrate de zinc, niacine (vitamine B3), D-pantothénate de calcium (vitamine B5),
                            chlorhydrate de pyridoxine (vitamine B6), cyanocobalamine (vitamine B12),
                            édulcorant : sucralose.
                        </p>

                        <div className="h-5" />

                        {/* Allergènes */}
                        <div className="flex items-center gap-2.5 mb-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                            <span className="font-mono text-[9px] tracking-[0.2em] text-[var(--text-muted)] uppercase">
                                Allergènes
                            </span>
                            <div className="flex-1 h-px bg-[var(--stroke)]" />
                        </div>
                        <p className="font-mono text-[11px] text-[var(--text-tertiary)] leading-relaxed tracking-wide">
                            Aucun allergène majeur. Sans gluten, sans lactose, sans OGM.
                        </p>

                        <div className="h-5" />

                        {/* Conseils d'utilisation */}
                        <div className="flex items-center gap-2.5 mb-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                            <span className="font-mono text-[9px] tracking-[0.2em] text-[var(--text-muted)] uppercase">
                                Conseils d&apos;utilisation
                            </span>
                            <div className="flex-1 h-px bg-[var(--stroke)]" />
                        </div>
                        <p className="font-mono text-[11px] text-[var(--text-tertiary)] leading-relaxed tracking-wide">
                            Dissoudre 1 pastille dans un verre d&apos;eau froide (200 ml).
                            Ne pas dépasser la dose journalière recommandée.
                        </p>

                        <div className="h-5" />

                        {/* Conservation */}
                        <div className="flex items-center gap-2.5 mb-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                            <span className="font-mono text-[9px] tracking-[0.2em] text-[var(--text-muted)] uppercase">
                                Conservation
                            </span>
                            <div className="flex-1 h-px bg-[var(--stroke)]" />
                        </div>
                        <p className="font-mono text-[11px] text-[var(--text-tertiary)] leading-relaxed tracking-wide">
                            Conserver dans un endroit frais et sec, à l&apos;abri de la lumière.
                            Refermer le tube après chaque utilisation.
                        </p>
                    </GlassPanel>
                </div>
            </div>
        </section>
    );
}

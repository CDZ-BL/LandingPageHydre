'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { COMPETITORS, Competitor } from '@/data/competitorData';
import { CompetitorSelector } from '@/components/ui/CompetitorSelector';
import { RadarChart } from '@/components/ui/RadarChart';
import { ComparisonTable } from '@/components/ui/ComparisonTable';
import { XRayTubeCanvas } from '@/components/three/XRayTubeCanvas';

// ═══════════════════════════════════════════════════════════════════════════
// PANEL CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

interface PanelConfig {
    id: string;
    label: string;
    shortLabel: string;
    icon: string;
}

const PANELS: PanelConfig[] = [
    { id: 'analyse', label: 'Nous contre la concurrence', shortLabel: 'NOUS CONTRE LA CONCURRENCE', icon: '◉' },
    { id: 'engagement', label: 'Notre engagement', shortLabel: 'NOTRE ENGAGEMENT', icon: '◈' },
    { id: 'formule', label: 'Notre formule', shortLabel: 'NOTRE FORMULE', icon: '◎' },
];

// ═══════════════════════════════════════════════════════════════════════════
// COST DATA — ThePact inline data
// ═══════════════════════════════════════════════════════════════════════════

interface CostSegment {
    label: string;
    percent: number;
    color: string;
    glow?: string;
}

const COMPETITOR_COST: CostSegment[] = [
    { label: 'Marketing & Pub', percent: 40, color: '#FF6B00' },
    { label: 'Marge distributeur', percent: 25, color: 'rgba(255,107,0,0.65)' },
    { label: 'Packaging premium', percent: 12, color: 'rgba(255,107,0,0.4)' },
    { label: 'Marge marque', percent: 8, color: 'rgba(255,107,0,0.2)' },
    { label: 'Ingrédients actifs', percent: 15, color: 'rgba(255,255,255,0.15)' },
];

const SMART_COST: CostSegment[] = [
    { label: 'Ingrédients actifs', percent: 55, color: '#ffffff', glow: '0 0 20px rgba(255,255,255,0.4)' },
    { label: 'Production', percent: 20, color: 'rgba(255,255,255,0.6)' },
    { label: 'R&D + Labo', percent: 15, color: 'rgba(255,255,255,0.35)' },
    { label: 'Opérations', percent: 10, color: 'rgba(255,255,255,0.15)' },
];

const COMPETITOR_PRICE = 9.99;
const SMART_PRICE = 5.90;

// ═══════════════════════════════════════════════════════════════════════════
// INGREDIENT DATA — TheSpecs inline data
// ═══════════════════════════════════════════════════════════════════════════

interface Ingredient {
    id: string;
    name: string;
    source: string;
    amount: number;
    unit: string;
    ajr: number;
    category: 'electrolyte' | 'vitamin';
}

const INGREDIENTS: Ingredient[] = [
    { id: 'sodium', name: 'SODIUM', source: 'Sodium Bicarbonate', amount: 280, unit: 'mg', ajr: 2000, category: 'electrolyte' },
    { id: 'potassium', name: 'POTASSIUM', source: 'Potassium Chloride, Citrate', amount: 150, unit: 'mg', ajr: 2000, category: 'electrolyte' },
    { id: 'chlore', name: 'CHLORE', source: 'Potassium Chloride', amount: 70, unit: 'mg', ajr: 800, category: 'electrolyte' },
    { id: 'magnesium', name: 'MAGNÉSIUM', source: 'Magnesium Citrate', amount: 60, unit: 'mg', ajr: 375, category: 'electrolyte' },
    { id: 'zinc', name: 'ZINC', source: 'Zinc Citrate', amount: 3, unit: 'mg', ajr: 10, category: 'vitamin' },
    { id: 'vitc', name: 'VITAMINE C', source: 'Acide L-Ascorbique', amount: 60, unit: 'mg', ajr: 80, category: 'vitamin' },
    { id: 'vitb3', name: 'VITAMINE B3', source: 'Niacine', amount: 8, unit: 'mg', ajr: 16, category: 'vitamin' },
    { id: 'vitb5', name: 'VITAMINE B5', source: 'Acide Pantothénique', amount: 2, unit: 'mg', ajr: 6, category: 'vitamin' },
    { id: 'vitb6', name: 'VITAMINE B6', source: 'Pyridoxine', amount: 2, unit: 'mg', ajr: 1.4, category: 'vitamin' },
    { id: 'vitb12', name: 'VITAMINE B12', source: 'Cyanocobalamine', amount: 2, unit: 'mcg', ajr: 2.5, category: 'vitamin' },
];

const ELECTROLYTES = INGREDIENTS.filter(i => i.category === 'electrolyte');
const VITAMINS = INGREDIENTS.filter(i => i.category === 'vitamin');

// ═══════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS — CostBar, Legend, PrincipleCard, IngredientRow, etc.
// ═══════════════════════════════════════════════════════════════════════════

function CostBar({ segments, delay }: { segments: CostSegment[]; delay: number }) {
    return (
        <div className="flex w-full h-3 overflow-hidden rounded-sm gap-px">
            {segments.map((seg, i) => (
                <motion.div
                    key={seg.label}
                    initial={{ width: 0 }}
                    animate={{ width: `${seg.percent}%` }}
                    transition={{ duration: 1.2, delay: delay + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full relative"
                    style={{ backgroundColor: seg.color, boxShadow: seg.glow || 'none' }}
                />
            ))}
        </div>
    );
}

function CostLegend({ segments }: { segments: CostSegment[] }) {
    return (
        <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-3">
            {segments.map((seg) => (
                <div key={seg.label} className="flex items-center gap-2">
                    <div
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: seg.color, boxShadow: seg.glow || 'none' }}
                    />
                    <span className="font-mono text-[10px] text-[var(--text-muted)] tracking-wider">
                        {seg.label} ({seg.percent}%)
                    </span>
                </div>
            ))}
        </div>
    );
}

function PrincipleCard({ number, title, description, delay }: {
    number: string; title: string; description: string; delay: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay }}
            className="group relative"
        >
            <div className="relative border border-[var(--stroke)] bg-[var(--bg-surface)]/5 p-4 md:p-5 hover:border-[var(--stroke-hover)] transition-colors duration-500">
                <span className="font-mono text-[10px] text-[var(--text-muted)] tracking-[0.3em] block mb-2">{number}</span>
                <h4 className="font-headline text-base md:text-lg text-[var(--text-primary)] tracking-wider mb-2">{title}</h4>
                <p className="font-mono text-[11px] md:text-xs text-[var(--text-tertiary)] leading-relaxed tracking-wide">{description}</p>
                <div className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full bg-gradient-to-r from-[var(--text-muted)]/30 to-transparent transition-all duration-700" />
            </div>
        </motion.div>
    );
}

function IngredientRow({ ingredient, index, accentColor, barMode = 'ajr', maxAmount = 1 }: {
    ingredient: Ingredient; index: number; accentColor: string; barMode?: 'ajr' | 'amount'; maxAmount?: number;
}) {
    const ajrPercent = Math.round((ingredient.amount / ingredient.ajr) * 100);
    const barWidth = barMode === 'amount'
        ? Math.min(Math.max((ingredient.amount / maxAmount) * 100, 4), 100)
        : Math.min(Math.max(ajrPercent, 4), 100);

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.04 }}
            className="group"
        >
            <div className="flex items-center gap-2 py-1 border-b border-[var(--stroke)] group-hover:border-[var(--stroke-hover)] transition-colors duration-300">
                <div className="w-[90px] sm:w-[110px] md:w-[140px] shrink-0">
                    <div className="font-mono text-[11px] md:text-xs text-[var(--text-primary)] font-bold tracking-wider">
                        {ingredient.name}
                    </div>
                </div>
                <div className="flex-1 max-w-[55%] h-[4px] bg-[var(--stroke)] rounded-full overflow-hidden relative">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${barWidth}%` }}
                        transition={{ duration: 1, delay: 0.1 + index * 0.04, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full rounded-full relative"
                        style={{
                            background: `linear-gradient(90deg, ${accentColor}40, ${accentColor})`,
                            boxShadow: `0 0 8px ${accentColor}20`,
                        }}
                    />
                </div>
                <div className="w-[70px] sm:w-[85px] md:w-[100px] shrink-0 text-right">
                    <span className="font-mono text-xs md:text-sm font-bold tabular-nums" style={{ color: accentColor }}>
                        {ingredient.amount}
                    </span>
                    <span className="font-mono text-[9px] text-[var(--text-muted)] ml-0.5">{ingredient.unit}</span>
                    <span className="font-mono text-[9px] text-[var(--text-muted)] ml-1 tabular-nums">{ajrPercent}%</span>
                </div>
            </div>
        </motion.div>
    );
}

function CategoryHeader({ label, color }: { label: string; color: string }) {
    return (
        <div className="flex items-center gap-2 mb-1 mt-1">
            <div className="w-1 h-1 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}60` }} />
            <span className="font-mono text-[9px] tracking-[0.2em] text-[var(--text-muted)] uppercase">{label}</span>
            <div className="flex-1 h-px bg-[var(--stroke)]" />
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// CAROUSEL STRIP TRANSITION — all panels stay mounted, strip slides
// ═══════════════════════════════════════════════════════════════════════════

const STRIP_TRANSITION = {
    type: 'tween' as const,
    duration: 0.7,
    ease: [0.25, 0.1, 0.25, 1.0],
};

const SWIPE_THRESHOLD = 50;

// ═══════════════════════════════════════════════════════════════════════════
// PANEL CONTENT COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

function PanelAnalyse() {
    const [selectedCompetitor, setSelectedCompetitor] = useState<Competitor>(COMPETITORS[0]);

    return (
        <div className="space-y-3">
            {/* Header */}
            <div>
                <h2 className="font-headline text-h2 text-[var(--text-primary)] font-bold tracking-wide">
                    Ce que contiennent vraiment vos boissons.
                </h2>
                <p className="font-mono text-xs md:text-sm text-[var(--text-tertiary)] mt-2 tracking-wide">
                    Les chiffres ne mentent pas. <span className="text-[var(--text-primary)]">Le marketing, si.</span>
                </p>
            </div>

            {/* Comparative Analysis */}
            <div>
                <div className="flex items-center gap-3 mb-3 pt-3 border-t border-[var(--stroke)]">
                    <div className="flex-1 h-[1px] bg-[var(--stroke)]" />
                    <h3 className="font-data text-[10px] text-neon-orange tracking-widest">
                        [ ANALYSE COMPARATIVE ]
                    </h3>
                    <div className="flex-1 h-[1px] bg-[var(--stroke)]" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
                    <div className="lg:col-span-5 space-y-3">
                        <CompetitorSelector selectedId={selectedCompetitor.id} onSelect={setSelectedCompetitor} />
                        <ComparisonTable competitor={selectedCompetitor} />
                    </div>
                    <div className="lg:col-span-7 flex items-center justify-center">
                        <div className="w-full max-w-sm">
                            <RadarChart competitor={selectedCompetitor} />
                        </div>
                    </div>
                </div>

                {/* Bottom insight */}
                <motion.div
                    key={selectedCompetitor.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mt-3 p-3 border border-[var(--stroke)] bg-[var(--bg-surface)]/5 rounded-machined text-center"
                >
                    <p className="font-data text-[10px] text-tertiary tracking-wider mb-1">
                        DIAGNOSTIC : {selectedCompetitor.codeName}
                    </p>
                    <p className="text-[var(--text-secondary)] text-xs leading-relaxed max-w-lg mx-auto">
                        {selectedCompetitor.description}
                    </p>
                </motion.div>
            </div>
        </div>
    );
}

function PanelEngagement() {
    const savings = Math.round(((COMPETITOR_PRICE - SMART_PRICE) / COMPETITOR_PRICE) * 100);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="max-w-3xl">
                <h2 className="font-headline text-h2 text-[var(--text-primary)] font-bold tracking-wide leading-[1.05] mb-4">
                    Vous payez le produit.<br />
                    <span className="text-[#E6DCC8] italic font-light tracking-normal">Pas le bruit.</span>
                </h2>
                <p className="font-mono text-xs md:text-sm text-[var(--text-tertiary)] leading-relaxed tracking-wide">
                    Le modèle standard est cassé — 85% du prix finance le marketing, pas vos performances.
                    Smart supprime l&apos;inutile et investit tout dans la formule.
                </p>
            </div>

            {/* Cost Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                {/* Competitor */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="border border-[var(--stroke)] bg-[var(--bg-surface)]/5 p-5 md:p-6 relative"
                >
                    <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[var(--stroke)]" />
                    <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[var(--stroke)]" />
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[var(--stroke)]" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[var(--stroke)]" />
                    <div className="flex items-baseline justify-between mb-3">
                        <div>
                            <span className="font-mono text-[10px] text-[var(--text-muted)] tracking-[0.2em] block mb-0.5">CONCURRENT PREMIUM</span>
                            <span className="font-mono text-xl md:text-2xl text-[var(--text-muted)] tabular-nums">{COMPETITOR_PRICE.toFixed(2)}€</span>
                        </div>
                        <span className="font-mono text-[10px] text-neon-orange/60 tracking-wider">INEFFICIENT</span>
                    </div>
                    <CostBar segments={COMPETITOR_COST} delay={0.2} />
                    <CostLegend segments={COMPETITOR_COST} />
                    <div className="mt-3 pt-2 border-t border-[var(--stroke)]">
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-neon-orange/60" />
                            <span className="font-mono text-[9px] text-neon-orange/40 tracking-wider">
                                SEULEMENT 15% DU PRIX ATTEINT LE PRODUIT
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* SMART */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.15 }}
                    className="border border-[var(--stroke-hover)] bg-[var(--bg-surface)]/5 p-5 md:p-6 relative"
                >
                    <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[var(--stroke-hover)]" />
                    <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[var(--stroke-hover)]" />
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[var(--stroke-hover)]" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[var(--stroke-hover)]" />
                    <div className="flex items-baseline justify-between mb-3">
                        <div>
                            <span className="font-mono text-[10px] text-[var(--text-muted)] tracking-[0.2em] block mb-0.5">SMART PROTOCOLE</span>
                            <span className="font-mono text-xl md:text-2xl text-[var(--text-primary)] tabular-nums">{SMART_PRICE.toFixed(2)}€</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#E6DCC8] animate-pulse" />
                            <span className="font-mono text-[10px] text-[#E6DCC8]/70 tracking-wider">−{savings}% VS MARCHÉ</span>
                        </div>
                    </div>
                    <CostBar segments={SMART_COST} delay={0.4} />
                    <CostLegend segments={SMART_COST} />
                    <div className="mt-3 pt-2 border-t border-[var(--stroke)]">
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-white/60" />
                            <span className="font-mono text-[9px] text-[var(--text-muted)] tracking-wider">
                                100% DU BUDGET AU SERVICE DE LA FORMULE
                            </span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Three Principles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                <PrincipleCard number="001" title="DIRECT-TO-CONSUMER" description="Zéro intermédiaire, zéro distributeur. Du labo à votre porte." delay={0.1} />
                <PrincipleCard number="002" title="TRANSPARENCE RADICALE" description="Formule ouverte, analyses labo publiées, coûts de production partagés." delay={0.2} />
                <PrincipleCard number="003" title="CO-DÉVELOPPEMENT" description="Les fondateurs votent sur les prochaines formules et testent les prototypes." delay={0.3} />
            </div>
        </div>
    );
}

function CarouselGlassPanel({
    children,
    className = '',
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div
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
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[var(--stroke-hover)]" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[var(--stroke-hover)]" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[var(--stroke-hover)]" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[var(--stroke-hover)]" />
            {children}
        </div>
    );
}

function PanelFormule() {
    const maxElectrolyteAmount = Math.max(...ELECTROLYTES.map(e => e.amount));

    return (
        <div className="space-y-3">
            {/* Header */}
            <div className="text-center">
                <h2 className="font-headline text-h2 text-[var(--text-primary)] font-bold tracking-wide">
                    Composition de votre produit
                </h2>
                <p className="font-mono text-xs text-[var(--text-muted)] mt-2 tracking-wide max-w-xl mx-auto">
                    Chaque molécule a une fonction. Rien de superflu.
                </p>
            </div>

            {/* 3-column: Left Data | Center Tube | Right Ingredients */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr_1fr] gap-4 xl:gap-6 items-stretch">

                {/* LEFT — Nutritional Data */}
                <CarouselGlassPanel className="p-4 order-2 lg:order-1">
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[var(--stroke)]">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="font-mono text-[10px] tracking-[0.15em] text-[var(--text-muted)] uppercase">
                            Apport Nutritionnel
                        </span>
                    </div>

                    <CategoryHeader label="Électrolytes" color="#FF6B00" />
                    {ELECTROLYTES.map((ingredient, i) => (
                        <IngredientRow
                            key={ingredient.id}
                            ingredient={ingredient}
                            index={i}
                            accentColor="#FF6B00"
                            barMode="amount"
                            maxAmount={maxElectrolyteAmount}
                        />
                    ))}
                    <div className="h-2" />
                    <CategoryHeader label="Vitamines & minéraux" color="#CCFF00" />
                    {VITAMINS.map((ingredient, i) => (
                        <IngredientRow
                            key={ingredient.id}
                            ingredient={ingredient}
                            index={i + ELECTROLYTES.length}
                            accentColor="#CCFF00"
                        />
                    ))}

                    <div className="mt-3 pt-2 border-t border-[var(--stroke)]">
                        <span className="font-mono text-[9px] text-[var(--text-muted)] tracking-wider">
                            *% AJR · UE Reg. 1169/2011
                        </span>
                    </div>
                </CarouselGlassPanel>

                {/* CENTER — 3D Tube */}
                <div className="relative order-1 lg:order-2 min-h-[25vh] lg:min-h-0 flex items-center justify-center">
                    <div
                        className="absolute inset-0 pointer-events-none opacity-25"
                        style={{
                            background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.04) 0%, transparent 60%)',
                        }}
                    />
                    <div className="w-full h-full min-h-[300px] lg:min-h-[450px]">
                        <XRayTubeCanvas />
                    </div>
                </div>

                {/* RIGHT — Ingredient List */}
                <CarouselGlassPanel className="p-4 order-3">
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[var(--stroke)]">
                        <div className="w-2 h-2 rounded-full bg-white/30 animate-pulse" />
                        <span className="font-mono text-[10px] tracking-[0.15em] text-[var(--text-muted)] uppercase">
                            Liste des ingrédients
                        </span>
                    </div>

                    <div className="font-mono text-[10px] text-[var(--text-muted)] tracking-[0.15em] uppercase mb-2">
                        1 pastille effervescente
                    </div>
                    <p className="font-mono text-[11px] text-[var(--text-secondary)] leading-[1.8] tracking-wide">
                        Acide citrique, bicarbonate de sodium, carbonate de sodium, sorbitol, chlorure de potassium,
                        citrate de potassium, acide L-ascorbique (vitamine C), citrate de magnésium, arôme naturel Yuzu &amp; Pêche,
                        citrate de zinc, niacine (vitamine B3), D-pantothénate de calcium (vitamine B5),
                        chlorhydrate de pyridoxine (vitamine B6), cyanocobalamine (vitamine B12),
                        édulcorant : sucralose.
                    </p>

                    <div className="h-4" />

                    <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                        <span className="font-mono text-[9px] tracking-[0.2em] text-[var(--text-muted)] uppercase">Allergènes</span>
                        <div className="flex-1 h-px bg-[var(--stroke)]" />
                    </div>
                    <p className="font-mono text-[11px] text-[var(--text-tertiary)] leading-relaxed tracking-wide">
                        Aucun allergène majeur. Sans gluten, sans lactose, sans OGM.
                    </p>

                    <div className="h-4" />

                    <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                        <span className="font-mono text-[9px] tracking-[0.2em] text-[var(--text-muted)] uppercase">Conseils d&apos;utilisation</span>
                        <div className="flex-1 h-px bg-[var(--stroke)]" />
                    </div>
                    <p className="font-mono text-[11px] text-[var(--text-tertiary)] leading-relaxed tracking-wide">
                        Dissoudre 1 pastille dans un verre d&apos;eau froide (200 ml).
                        Ne pas dépasser la dose journalière recommandée.
                    </p>
                </CarouselGlassPanel>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN CAROUSEL HUB
// ═══════════════════════════════════════════════════════════════════════════

export function CarouselHub() {
    const [activeIndex, setActiveIndex] = useState(0);
    const constraintsRef = useRef<HTMLDivElement>(null);

    const goTo = useCallback((index: number) => {
        if (index === activeIndex) return;
        setActiveIndex(index);
    }, [activeIndex]);

    // ── Live drag offset (follows pointer, springs back on release) ──
    const dragOffset = useMotionValue(0);
    const springOffset = useSpring(dragOffset, { stiffness: 300, damping: 30 });

    // Pointer-event swipe detection with live drag feedback
    const pointerStart = useRef<{ x: number; t: number } | null>(null);

    const onPointerDown = useCallback((e: React.PointerEvent) => {
        pointerStart.current = { x: e.clientX, t: Date.now() };
        dragOffset.jump(0); // reset instantly, no spring
    }, [dragOffset]);

    const onPointerMove = useCallback((e: React.PointerEvent) => {
        if (!pointerStart.current) return;
        const dx = e.clientX - pointerStart.current.x;
        // Elastic resistance: movement is dampened the further you pull
        dragOffset.set(dx * 0.35);
    }, [dragOffset]);

    const onPointerUp = useCallback((e: React.PointerEvent) => {
        if (!pointerStart.current) return;
        const dx = e.clientX - pointerStart.current.x;
        const dt = Math.max(Date.now() - pointerStart.current.t, 1);
        const vx = (dx / dt) * 1000; // px/s
        pointerStart.current = null;

        // Spring the offset back to 0
        dragOffset.set(0);

        if (dx < -SWIPE_THRESHOLD || vx < -500) {
            if (activeIndex < PANELS.length - 1) goTo(activeIndex + 1);
        } else if (dx > SWIPE_THRESHOLD || vx > 500) {
            if (activeIndex > 0) goTo(activeIndex - 1);
        }
    }, [activeIndex, goTo, dragOffset]);

    const onPointerCancel = useCallback(() => {
        pointerStart.current = null;
        dragOffset.set(0);
    }, [dragOffset]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' && activeIndex < PANELS.length - 1) {
                goTo(activeIndex + 1);
            } else if (e.key === 'ArrowLeft' && activeIndex > 0) {
                goTo(activeIndex - 1);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeIndex, goTo]);

    const progressPercent = ((activeIndex + 1) / PANELS.length) * 100;

    return (
        <section className="relative py-16 md:py-24 bg-[var(--bg-primary)] overflow-hidden">
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

            {/* ━━━ PROGRESS BAR ━━━ */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/[0.04]">
                <motion.div
                    className="h-full bg-gradient-to-r from-white/60 to-white/30"
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ type: 'spring', stiffness: 200, damping: 30 }}
                />
            </div>

            <div className="relative z-10 w-[85%] max-w-[1400px] mx-auto">

                {/* ━━━ TOP NAVIGATION TABS ━━━ */}
                <div className="flex items-center gap-2 mb-12">
                    {PANELS.map((panel, i) => (
                        <button
                            key={panel.id}
                            onClick={() => goTo(i)}
                            className={`
                                group relative flex items-center gap-3 px-5 py-3 rounded-sm
                                font-mono text-xs tracking-[0.15em] uppercase
                                transition-all duration-500 border carousel-tab-glow
                                ${i === activeIndex
                                    ? 'bg-[var(--bg-surface)]/10 text-[var(--text-primary)] border-[var(--stroke-hover)] carousel-tab-glow--active'
                                    : 'bg-transparent text-[var(--text-tertiary)] border-[var(--stroke)] hover:text-[var(--text-secondary)] hover:border-[var(--stroke-hover)] hover:bg-[var(--bg-surface)]/5'
                                }
                            `}
                        >
                            {/* Active line indicator */}
                            {i === activeIndex && (
                                <motion.div
                                    layoutId="carousel-tab-indicator"
                                    className="absolute -bottom-[1px] left-3 right-3 h-[2px] bg-white/50"
                                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                />
                            )}

                            {/* Icon */}
                            <span className={`text-sm transition-all duration-300 ${i === activeIndex ? 'opacity-100 scale-110' : 'opacity-50 scale-100 group-hover:opacity-70'}`}>
                                {panel.icon}
                            </span>

                            {/* Label */}
                            <span>{panel.shortLabel}</span>

                            {/* Step counter */}
                            <span className={`
                                font-mono text-[9px] ml-1 tabular-nums
                                ${i === activeIndex ? 'text-[var(--text-muted)]' : 'text-[var(--text-muted)]'}
                            `}>
                                {String(i + 1).padStart(2, '0')}/{String(PANELS.length).padStart(2, '0')}
                            </span>
                        </button>
                    ))}

                    {/* Spacer and keyboard hint */}
                    <div className="flex-1" />
                    <div className="hidden md:flex items-center gap-2 text-[var(--text-muted)]">
                        <kbd className="font-mono text-[9px] px-1.5 py-0.5 border border-[var(--stroke)] rounded">←</kbd>
                        <kbd className="font-mono text-[9px] px-1.5 py-0.5 border border-[var(--stroke)] rounded">→</kbd>
                    </div>
                </div>

                {/* ━━━ PANEL CONTENT — persistent horizontal strip ━━━ */}
                <div
                    ref={constraintsRef}
                    className="relative overflow-hidden touch-pan-y min-h-[710px] cursor-grab active:cursor-grabbing"
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                    onPointerLeave={onPointerCancel}
                    onPointerCancel={onPointerCancel}
                >
                    {/* Outer: live drag offset (springs back) */}
                    <motion.div style={{ x: springOffset }}>
                        {/* Inner: animated panel slide */}
                        <motion.div
                            className="flex w-full"
                            animate={{ x: `${-activeIndex * 100}%` }}
                            transition={STRIP_TRANSITION}
                        >
                            {/* Each panel is 100% width, flex-shrink-0 keeps them side-by-side */}
                            <div className="w-full flex-shrink-0">
                                <PanelAnalyse />
                            </div>
                            <div className="w-full flex-shrink-0">
                                <PanelEngagement />
                            </div>
                            <div className="w-full flex-shrink-0">
                                <PanelFormule />
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* ━━━ BOTTOM NAVIGATION ━━━ */}
                <div className="flex items-center justify-between mt-12 pt-6 border-t border-[var(--stroke)]">
                    {/* Previous */}
                    <button
                        onClick={() => activeIndex > 0 && goTo(activeIndex - 1)}
                        disabled={activeIndex === 0}
                        className={`
                            group flex items-center gap-3 px-4 py-2 font-mono text-xs tracking-wider
                            transition-all duration-300 rounded-sm border
                            ${activeIndex === 0
                                ? 'text-[var(--text-muted)] border-transparent cursor-not-allowed'
                                : 'text-[var(--text-primary)] border-[var(--stroke)] hover:border-[var(--stroke-hover)] hover:bg-[var(--bg-surface)]/5'
                            }
                        `}
                    >
                        <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
                        <span className="text-[var(--text-primary)]">{activeIndex > 0 ? PANELS[activeIndex - 1].label : ''}</span>
                    </button>

                    {/* Dot indicators */}
                    <div className="flex items-center gap-3">
                        {PANELS.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => goTo(i)}
                                className="relative p-1"
                            >
                                <div className={`
                                    w-2 h-2 rounded-full transition-all duration-500
                                    ${i === activeIndex
                                        ? 'bg-white scale-100'
                                        : 'bg-white/20 scale-75 hover:bg-white/40 hover:scale-90'
                                    }
                                `} />
                                {i === activeIndex && (
                                    <motion.div
                                        layoutId="carousel-dot"
                                        className="absolute inset-0 rounded-full border border-white/30"
                                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Next */}
                    <button
                        onClick={() => activeIndex < PANELS.length - 1 && goTo(activeIndex + 1)}
                        disabled={activeIndex === PANELS.length - 1}
                        className={`
                            group flex items-center gap-3 px-4 py-2 font-mono text-xs tracking-wider
                            transition-all duration-300 rounded-sm border
                            ${activeIndex === PANELS.length - 1
                                ? 'text-[var(--text-muted)] border-transparent cursor-not-allowed'
                                : 'text-[var(--text-primary)] border-[var(--stroke)] hover:border-[var(--stroke-hover)] hover:bg-[var(--bg-surface)]/5'
                            }
                        `}
                    >
                        <span className="text-[var(--text-primary)]">{activeIndex < PANELS.length - 1 ? PANELS[activeIndex + 1].label : ''}</span>
                        <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </button>
                </div>
            </div>
        </section>
    );
}

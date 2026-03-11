'use client';

import { motion } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════════════
// DATA — Cost structure comparison
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
// STACKED BAR — Horizontal cost breakdown
// ═══════════════════════════════════════════════════════════════════════════

function CostBar({ segments, delay }: { segments: CostSegment[]; delay: number }) {
    return (
        <div className="flex w-full h-3 overflow-hidden rounded-sm gap-px">
            {segments.map((seg, i) => (
                <motion.div
                    key={seg.label}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${seg.percent}%` }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{
                        duration: 1.2,
                        delay: delay + i * 0.08,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                    className="h-full relative"
                    style={{
                        backgroundColor: seg.color,
                        boxShadow: seg.glow || 'none',
                    }}
                />
            ))}
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// LEGEND — Dots + labels under bar
// ═══════════════════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════════════════
// PRINCIPLE CARD — Minimal value prop card
// ═══════════════════════════════════════════════════════════════════════════

function PrincipleCard({
    number,
    title,
    description,
    delay,
}: {
    number: string;
    title: string;
    description: string;
    delay: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay }}
            className="group relative"
        >
            <div className="relative border border-[var(--stroke)] bg-[var(--bg-surface)]/5 p-6 md:p-8 hover:border-[var(--stroke-hover)] transition-colors duration-500">
                {/* Number */}
                <span className="font-mono text-[10px] text-[var(--text-muted)] tracking-[0.3em] block mb-4">
                    {number}
                </span>
                {/* Title */}
                <h4 className="font-headline text-lg md:text-xl text-[var(--text-primary)] tracking-wider mb-3">
                    {title}
                </h4>
                {/* Body */}
                <p className="font-mono text-xs md:text-sm text-[var(--text-tertiary)] leading-relaxed tracking-wide">
                    {description}
                </p>
                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full bg-gradient-to-r from-[var(--text-muted)]/30 to-transparent transition-all duration-700" />
            </div>
        </motion.div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export function ThePact() {
    const savings = Math.round(((COMPETITOR_PRICE - SMART_PRICE) / COMPETITOR_PRICE) * 100);

    return (
        <section className="relative py-16 md:py-32 lg:py-40 bg-[var(--bg-primary)] overflow-hidden">
            {/* Subtle grid */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)
                    `,
                    backgroundSize: '80px 80px',
                }}
            />

            <div className="relative z-10 w-[85%] max-w-[1400px] mx-auto">

                {/* ━━━ SECTION HEADER ━━━ */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.8 }}
                    className="mb-10 md:mb-20 max-w-3xl"
                >
                    <span className="font-mono text-[10px] text-[var(--text-muted)] tracking-[0.3em] mb-5 block">

                    </span>
                    <h2 className="font-headline text-h1 text-[var(--text-primary)] font-bold tracking-wide leading-[1.05] mb-6">
                        Vous payez le produit.<br />
                        <span className="text-[var(--text-primary)] italic font-light tracking-normal">Pas le bruit.</span>
                    </h2>
                    <p className="font-mono text-sm md:text-base text-[var(--text-tertiary)] leading-relaxed tracking-wide">
                        Le modèle standard est cassé — 85% du prix finance le marketing, pas vos performances.
                        Smart supprime l'inutile et investit tout dans la formule.
                    </p>
                </motion.div>

                {/* ━━━ COST COMPARISON — Side by side ━━━ */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12 md:mb-24">

                    {/* COMPETITOR */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.7 }}
                        className="border border-[var(--stroke)] bg-[var(--bg-surface)]/5 p-6 md:p-8 relative"
                    >
                        {/* HUD corners */}
                        <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[var(--stroke)]" />
                        <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[var(--stroke)]" />
                        <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[var(--stroke)]" />
                        <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[var(--stroke)]" />

                        <div className="flex items-baseline justify-between mb-6">
                            <div>
                                <span className="font-mono text-[10px] text-[var(--text-muted)] tracking-[0.2em] block mb-1">CONCURRENT PREMIUM</span>
                                <span className="font-mono text-2xl md:text-3xl text-[var(--text-muted)] tabular-nums">{COMPETITOR_PRICE.toFixed(2)}€</span>
                            </div>
                            <span className="font-mono text-[10px] text-neon-orange tracking-wider opacity-80">
                                INEFFICIENT
                            </span>
                        </div>

                        <CostBar segments={COMPETITOR_COST} delay={0.2} />
                        <CostLegend segments={COMPETITOR_COST} />

                        {/* Callout */}
                        <div className="mt-6 pt-4 border-t border-[var(--stroke)]">
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-1 rounded-full bg-neon-orange/60" />
                                <span className="font-mono text-[10px] text-neon-orange tracking-wider opacity-70">
                                    SEULEMENT 15% DU PRIX ATTEINT LE PRODUIT
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* SMART */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.7, delay: 0.15 }}
                        className="border border-[var(--stroke-hover)] bg-[var(--bg-surface)]/5 p-6 md:p-8 relative"
                    >
                        {/* HUD corners */}
                        <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[var(--stroke-hover)]" />
                        <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[var(--stroke-hover)]" />
                        <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[var(--stroke-hover)]" />
                        <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[var(--stroke-hover)]" />

                        <div className="flex items-baseline justify-between mb-6">
                            <div>
                                <span className="font-mono text-[10px] text-[var(--text-muted)] tracking-[0.2em] block mb-1">SMART PROTOCOLE</span>
                                <span className="font-mono text-2xl md:text-3xl text-[var(--text-primary)] tabular-nums">{SMART_PRICE.toFixed(2)}€</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#E6DCC8] animate-pulse" />
                                <span className="font-mono text-[10px] text-[var(--text-primary)] tracking-wider opacity-80">
                                    −{savings}% VS MARCHÉ
                                </span>
                            </div>
                        </div>

                        <CostBar segments={SMART_COST} delay={0.4} />
                        <CostLegend segments={SMART_COST} />

                        {/* Callout */}
                        <div className="mt-6 pt-4 border-t border-[var(--stroke)]">
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-1 rounded-full bg-white/60" />
                                <span className="font-mono text-[10px] text-[var(--text-muted)] tracking-wider">
                                    100% DU BUDGET AU SERVICE DE LA FORMULE
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* ━━━ THREE PRINCIPLES ━━━ */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.6 }}
                    className="mb-10"
                >
                    <div className="flex items-center gap-4 mb-10">
                        <div className="h-px flex-1 bg-[var(--stroke)]" />
                        <span className="font-mono text-[10px] text-[var(--text-muted)] tracking-[0.25em]">

                        </span>
                        <div className="h-px flex-1 bg-[var(--stroke)]" />
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                    <PrincipleCard
                        number="001"
                        title="DIRECT-TO-CONSUMER"
                        description="Zéro intermédiaire, zéro distributeur. Du labo à votre porte. Chaque euro finance la qualité, pas la logistique."
                        delay={0.1}
                    />
                    <PrincipleCard
                        number="002"
                        title="TRANSPARENCE RADICALE"
                        description="Formule ouverte, analyses labo publiées, coûts de production partagés avec les membres. Aucun proprietary blend."
                        delay={0.2}
                    />
                    <PrincipleCard
                        number="003"
                        title="CO-DÉVELOPPEMENT"
                        description="Les fondateurs votent sur les prochaines formules, testent les prototypes, et influencent la roadmap produit."
                        delay={0.3}
                    />
                </div>

                {/* ━━━ BOTTOM LINE ━━━ */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="mt-16 text-center"
                >
                    <p className="font-mono text-[10px] text-[var(--text-muted)] tracking-[0.2em]">
                        [DATA] VOTRE INVESTISSEMENT EST BIOLOGIQUE, PAS MÉDIATIQUE.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}

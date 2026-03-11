'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Competitor, AETHER_DATA } from '@/data/competitorData';

interface ComparisonTableProps {
    competitor: Competitor;
}

// Animated counter component
function AnimatedValue({ value, suffix = '', decimals = 0 }: { value: number; suffix?: string; decimals?: number }) {
    const [displayValue, setDisplayValue] = useState(value);

    useEffect(() => {
        const duration = 500;
        const startValue = displayValue;
        const diff = value - startValue;
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplayValue(startValue + diff * eased);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [value]);

    return <span>{displayValue.toFixed(decimals)}{suffix}</span>;
}

// DELTA PILL (The new visual highlight)
function DeltaPill({ aether, competitor, inverted = false }: { aether: number, competitor: number, inverted?: boolean }) {
    // Calculate difference
    const diff = aether - competitor;
    const better = inverted ? diff < 0 : diff > 0;
    const percent = competitor !== 0 ? ((aether - competitor) / competitor) * 100 : 0;

    // Formatting: "+25%" or "-50%"
    let showPercent = true;
    let label = '';

    // Logic for cleaner labels
    if (Math.abs(percent) > 100) {
        const multiplier = aether / competitor;
        label = `x${multiplier.toFixed(1)}`; // "x2.5"
    } else {
        label = `${percent > 0 ? '+' : ''}${percent.toFixed(0)}%`;
    }

    if (aether === competitor) return <span className="text-[10px] uppercase font-bold tracking-widest" style={{ color: 'var(--radar-idem-text)' }}>Idem</span>;

    return (
        <div className={`
            inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider
            ${better
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-red-500/10 text-red-500 border border-red-500/20'}
        `}>
            {better ? 'MEILLEUR' : 'INFÉRIEUR'}
            <span className="ml-1 opacity-70 font-mono scale-90">{label}</span>
        </div>
    );
}

// Special case for Text comparison (Forms)
function TextComparison({ aether, competitor }: { aether: string, competitor: string }) {
    const goodForms = ['Citrate', 'Bisglycinate'];
    const badForms = ['Oxyde', 'Aucun'];
    const aetherGood = goodForms.some(f => aether.includes(f));
    const competitorBad = badForms.some(f => competitor.includes(f));

    const isWin = aetherGood && competitorBad;

    if (aether === competitor) return <span className="text-[10px] uppercase font-bold tracking-widest" style={{ color: 'var(--radar-idem-text)' }}>Idem</span>;

    return (
        <div
            className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider"
            style={isWin ? {} : {
                backgroundColor: 'var(--radar-neutral-pill-bg)',
                color: 'var(--radar-neutral-pill-text)',
                border: '1px solid var(--radar-neutral-pill-border)',
            }}
        >
            {isWin
                ? <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider">MEILLEUR</span>
                : 'DIFFÉRENT'
            }
        </div>
    );
}

export function ComparisonTable({ competitor }: ComparisonTableProps) {
    const rows = [
        {
            label: 'PRIX / DOSE',
            aether: AETHER_DATA.metrics.price,
            competitor: competitor.metrics.price,
            suffix: '€',
            decimals: 2,
            inverted: true // Lower price is better
        },
        {
            label: 'SUCRE',
            aether: AETHER_DATA.metrics.sugar,
            competitor: competitor.metrics.sugar,
            suffix: 'g',
            decimals: 1,
            inverted: true // Lower sugar is better
        },
        {
            label: 'ELECTROLYTES (NA+)',
            aether: AETHER_DATA.metrics.sodium,
            competitor: competitor.metrics.sodium,
            suffix: 'mg',
            decimals: 0,
            inverted: false
        },
        {
            label: 'MAGNÉSIUM',
            aether: AETHER_DATA.metrics.magnesium,
            competitor: competitor.metrics.magnesium,
            suffix: 'mg',
            decimals: 0,
            inverted: false
        },
        {
            label: 'BIODISPONIBILITÉ', // Forme MG renamed for clarity
            aether: AETHER_DATA.metrics.magnesiumForm,
            competitor: competitor.metrics.magnesiumForm,
            isText: true
        },
        {
            label: 'VITAMINE C',
            aether: AETHER_DATA.metrics.vitaminC,
            competitor: competitor.metrics.vitaminC,
            suffix: 'mg',
            decimals: 0,
            inverted: false
        },
        {
            label: 'COMPLEXE B',
            aether: AETHER_DATA.metrics.totalVitaminB,
            competitor: competitor.metrics.totalVitaminB,
            suffix: 'mg',
            decimals: 1,
            inverted: false
        },
    ];

    return (
        <div
            className="relative overflow-x-auto rounded-machined backdrop-blur-sm custom-scrollbar max-w-lg"
            style={{
                border: '1px solid var(--radar-table-border)',
                backgroundColor: 'var(--radar-table-bg)',
            }}
        >
            <div className="min-w-[420px]">
                {/* Header */}
                <div
                    className="grid grid-cols-4 gap-2 px-3 py-2 items-center"
                    style={{
                        backgroundColor: 'var(--radar-table-header-bg)',
                        borderBottom: '1px solid var(--radar-table-border)',
                    }}
                >
                    <div className="font-data text-[10px] tracking-widest uppercase" style={{ color: 'var(--radar-table-text-muted)' }}>MÉTRIQUE</div>
                    <div className="font-data text-[10px] font-bold tracking-widest text-center flex flex-col items-center gap-1" style={{ color: 'var(--radar-table-text)' }}>
                        <span>SMART</span>
                        <div className="w-12 h-[1px]" style={{ backgroundColor: 'var(--radar-table-text-dim)' }} />
                    </div>
                    <div className="font-data text-[10px] text-orange-500/80 tracking-widest text-center truncate flex flex-col items-center gap-1">
                        <span>{competitor.codeName}</span>
                        <div className="w-12 h-[1px] bg-orange-500/30" />
                    </div>
                    <div className="font-data text-[10px] tracking-widest text-center" style={{ color: 'var(--radar-table-text-muted)' }}>ANALYSE</div>
                </div>

                {/* Rows */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={competitor.id}
                        initial={{ opacity: 0.5, filter: 'blur(2px)' }}
                        animate={{ opacity: 1, filter: 'blur(0px)' }}
                        transition={{ duration: 0.3 }}
                    >
                        {rows.map((row, i) => (
                            <div
                                key={row.label}
                                className="grid grid-cols-4 gap-2 px-3 py-1.5 items-center transition-colors duration-200 group"
                                style={{
                                    borderBottom: '1px solid var(--radar-table-col-border)',
                                    backgroundColor: i % 2 === 0 ? 'transparent' : 'var(--radar-table-row-alt)',
                                }}
                            >
                                {/* Label */}
                                <div
                                    className="font-mono text-[10px] tracking-wider transition-colors"
                                    style={{ color: 'var(--radar-table-text-muted)' }}
                                >
                                    {row.label}
                                </div>

                                {/* AETHER value (Highlighted) */}
                                <div
                                    className="font-data text-xs text-center font-bold py-1 rounded-sm mx-2"
                                    style={{
                                        color: 'var(--radar-table-text)',
                                        backgroundColor: 'var(--radar-table-cell-bg)',
                                    }}
                                >
                                    {row.isText ? (
                                        <span className="text-emerald-400 text-[10px]">{row.aether}</span>
                                    ) : (
                                        <AnimatedValue
                                            value={row.aether as number}
                                            suffix={row.suffix}
                                            decimals={row.decimals}
                                        />
                                    )}
                                </div>

                                {/* Competitor value */}
                                <div className="font-data text-xs text-center" style={{ color: 'var(--radar-table-text-dim)' }}>
                                    {row.isText ? (
                                        <span className="text-[10px]">{row.competitor}</span>
                                    ) : (
                                        <AnimatedValue
                                            value={row.competitor as number}
                                            suffix={row.suffix}
                                            decimals={row.decimals}
                                        />
                                    )}
                                </div>

                                {/* DELTA / STATUS PILL */}
                                <div className="flex justify-center">
                                    {row.isText ? (
                                        <TextComparison
                                            aether={row.aether as string}
                                            competitor={row.competitor as string}
                                        />
                                    ) : (
                                        <DeltaPill
                                            aether={row.aether as number}
                                            competitor={row.competitor as number}
                                            inverted={row.inverted}
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </AnimatePresence>

                {/* Footer / Summary */}
                <div
                    className="px-4 py-1.5 flex justify-between items-center text-[9px] font-mono"
                    style={{
                        backgroundColor: 'var(--radar-table-footer-bg)',
                        borderTop: '1px solid var(--radar-table-footer-border)',
                        color: 'var(--radar-table-text-muted)',
                    }}
                >
                </div>
            </div>
        </div>
    );
}

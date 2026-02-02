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
            // Ease out cubic
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

// Comparison indicator
function CompareIndicator({ aetherValue, competitorValue, inverted = false }: {
    aetherValue: number;
    competitorValue: number;
    inverted?: boolean
}) {
    const aetherBetter = inverted
        ? aetherValue < competitorValue
        : aetherValue > competitorValue;

    if (aetherValue === competitorValue) {
        return <span className="text-white/40">=</span>;
    }

    return (
        <span className={aetherBetter ? 'text-emerald-500' : 'text-red-500'}>
            {aetherBetter ? '✓' : '✗'}
        </span>
    );
}

export function ComparisonTable({ competitor }: ComparisonTableProps) {
    const rows = [
        {
            label: 'PRIX',
            aether: AETHER_DATA.metrics.price,
            competitor: competitor.metrics.price,
            suffix: '€',
            decimals: 2,
            inverted: true // Lower is better
        },
        {
            label: 'SUCRE',
            aether: AETHER_DATA.metrics.sugar,
            competitor: competitor.metrics.sugar,
            suffix: 'g',
            decimals: 1,
            inverted: true
        },
        {
            label: 'SODIUM',
            aether: AETHER_DATA.metrics.sodium,
            competitor: competitor.metrics.sodium,
            suffix: 'mg',
            decimals: 0,
            inverted: false // Higher is better for electrolytes
        },
        {
            label: 'MAGNÉSIUM',
            aether: AETHER_DATA.metrics.magnesium,
            competitor: competitor.metrics.magnesium,
            suffix: 'mg',
            decimals: 1,
            inverted: false
        },
        {
            label: 'FORME MG',
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
            label: 'VITAMINES B',
            aether: AETHER_DATA.metrics.totalVitaminB,
            competitor: competitor.metrics.totalVitaminB,
            suffix: 'mg',
            decimals: 1,
            inverted: false
        },
    ];

    return (
        <div className="relative overflow-hidden rounded-machined border border-white/10">
            {/* Header */}
            <div className="grid grid-cols-4 gap-4 px-4 py-3 bg-white/[0.02] border-b border-white/10">
                <div className="font-data text-xs text-tertiary tracking-wider">MÉTRIQUE</div>
                <div className="font-data text-xs text-white tracking-wider text-center">AETHER</div>
                <div className="font-data text-xs text-orange-500 tracking-wider text-center truncate">
                    {competitor.codeName}
                </div>
                <div className="font-data text-xs text-tertiary tracking-wider text-center">ΔELTA</div>
            </div>

            {/* Rows */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={competitor.id}
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    {rows.map((row, i) => (
                        <div
                            key={row.label}
                            className={`
                                grid grid-cols-4 gap-4 px-4 py-3
                                ${i % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.01]'}
                            `}
                        >
                            {/* Label */}
                            <div className="font-data text-xs text-tertiary tracking-wider">
                                {row.label}
                            </div>

                            {/* AETHER value */}
                            <div className="font-data text-xs text-white text-center">
                                {row.isText ? (
                                    <span className="text-emerald-500">{row.aether}</span>
                                ) : (
                                    <AnimatedValue
                                        value={row.aether as number}
                                        suffix={row.suffix}
                                        decimals={row.decimals}
                                    />
                                )}
                            </div>

                            {/* Competitor value */}
                            <div className="font-data text-xs text-orange-500/80 text-center">
                                {row.isText ? (
                                    <span>{row.competitor}</span>
                                ) : (
                                    <AnimatedValue
                                        value={row.competitor as number}
                                        suffix={row.suffix}
                                        decimals={row.decimals}
                                    />
                                )}
                            </div>

                            {/* Comparison indicator */}
                            <div className="font-data text-xs text-center">
                                {row.isText ? (
                                    // For magnesium form: Citrate/Bisglycinate > Oxyde/Aucun
                                    (() => {
                                        const goodForms = ['Citrate', 'Bisglycinate'];
                                        const badForms = ['Oxyde', 'Aucun'];
                                        const aetherGood = goodForms.includes(row.aether as string);
                                        const competitorBad = badForms.includes(row.competitor as string);

                                        if (row.aether === row.competitor) {
                                            return <span className="text-white/40">=</span>;
                                        }
                                        if (aetherGood && competitorBad) {
                                            return <span className="text-emerald-500">✓</span>;
                                        }
                                        return <span className="text-white/40">=</span>;
                                    })()
                                ) : (
                                    <CompareIndicator
                                        aetherValue={row.aether as number}
                                        competitorValue={row.competitor as number}
                                        inverted={row.inverted}
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

// Radar chart metrics - higher is better for AETHER
const METRICS = [
    { label: 'QUALITÉ INGRÉDIENTS', aether: 95, competitors: 35 },
    { label: 'EFFICACITÉ', aether: 90, competitors: 40 },
    { label: 'BIODISPONIBILITÉ', aether: 95, competitors: 25 },
    { label: 'RAPPORT QUALITÉ/PRIX', aether: 85, competitors: 30 },
    { label: 'TRANSPARENCE', aether: 100, competitors: 20 },
    { label: 'ZÉRO SUCRE', aether: 100, competitors: 15 },
];

function RadarChart({ showAether, showCompetitors }: { showAether: boolean; showCompetitors: boolean }) {
    const size = 300;
    const center = size / 2;
    const radius = 120;
    const levels = 5;

    // Calculate point position on radar
    const getPoint = (index: number, value: number) => {
        const angle = (Math.PI * 2 * index) / METRICS.length - Math.PI / 2;
        const r = (value / 100) * radius;
        return {
            x: center + r * Math.cos(angle),
            y: center + r * Math.sin(angle),
        };
    };

    // Generate polygon path
    const getPolygonPath = (values: number[]) => {
        return values
            .map((value, i) => {
                const point = getPoint(i, value);
                return `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
            })
            .join(' ') + ' Z';
    };

    // Generate grid lines
    const gridLines = [];
    for (let level = 1; level <= levels; level++) {
        const levelRadius = (radius * level) / levels;
        const points = METRICS.map((_, i) => {
            const angle = (Math.PI * 2 * i) / METRICS.length - Math.PI / 2;
            return `${center + levelRadius * Math.cos(angle)},${center + levelRadius * Math.sin(angle)}`;
        }).join(' ');
        gridLines.push(
            <polygon
                key={level}
                points={points}
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
            />
        );
    }

    // Generate axis lines
    const axisLines = METRICS.map((_, i) => {
        const angle = (Math.PI * 2 * i) / METRICS.length - Math.PI / 2;
        return (
            <line
                key={i}
                x1={center}
                y1={center}
                x2={center + radius * Math.cos(angle)}
                y2={center + radius * Math.sin(angle)}
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="1"
            />
        );
    });

    // Generate labels
    const labels = METRICS.map((metric, i) => {
        const angle = (Math.PI * 2 * i) / METRICS.length - Math.PI / 2;
        const labelRadius = radius + 35;
        const x = center + labelRadius * Math.cos(angle);
        const y = center + labelRadius * Math.sin(angle);
        return (
            <text
                key={i}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-white text-[9px] font-mono"
            >
                {metric.label}
            </text>
        );
    });

    return (
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[400px] mx-auto">
            {/* Grid */}
            {gridLines}
            {axisLines}

            {/* Competitors polygon */}
            {showCompetitors && (
                <motion.path
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    d={getPolygonPath(METRICS.map(m => m.competitors))}
                    fill="rgba(239, 68, 68, 0.2)"
                    stroke="#ef4444"
                    strokeWidth="2"
                />
            )}

            {/* AETHER polygon */}
            {showAether && (
                <motion.path
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    d={getPolygonPath(METRICS.map(m => m.aether))}
                    fill="rgba(255, 122, 0, 0.25)"
                    stroke="#ff7a00"
                    strokeWidth="2"
                />
            )}

            {/* Labels */}
            {labels}

            {/* Data points */}
            {showCompetitors && METRICS.map((metric, i) => {
                const point = getPoint(i, metric.competitors);
                return (
                    <circle
                        key={`comp-${i}`}
                        cx={point.x}
                        cy={point.y}
                        r="4"
                        fill="#ef4444"
                    />
                );
            })}
            {showAether && METRICS.map((metric, i) => {
                const point = getPoint(i, metric.aether);
                return (
                    <circle
                        key={`aether-${i}`}
                        cx={point.x}
                        cy={point.y}
                        r="4"
                        fill="#ff7a00"
                    />
                );
            })}
        </svg>
    );
}

export function TheProblem() {
    const [showAether, setShowAether] = useState(true);
    const [showCompetitors, setShowCompetitors] = useState(true);

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
                    backgroundSize: '40px 40px',
                }}
            />

            <div className="relative z-10 w-[85%] max-w-[1200px] mx-auto">
                {/* Title */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="mb-16"
                >
                    <h2 className="font-sans text-4xl md:text-6xl text-white font-bold tracking-tight">
                        LE MENSONGE DU MARCHÉ
                    </h2>
                </motion.div>

                {/* Body Text */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="mb-16"
                >
                    <p className="font-sans text-xl md:text-2xl text-white leading-relaxed max-w-3xl">
                        Vous ne payez pas pour l'hydratation. Vous payez pour leurs publicités, leurs couleurs néons et leur sucre industriel.
                    </p>
                    <p className="font-sans text-xl md:text-2xl text-white leading-relaxed max-w-3xl mt-6">
                        La majorité des boissons "sportives" sont des <span className="text-red-500 font-semibold">confiseries liquides déguisées en performance</span>.
                    </p>
                    <p className="font-sans text-xl md:text-2xl text-white leading-relaxed max-w-3xl mt-6">
                        Votre corps est une <span className="text-neon-orange font-semibold">machine thermique</span>, pas une poubelle.
                    </p>
                </motion.div>

                {/* Spider Chart Comparison */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="mb-16"
                >
                    <div className="border border-void-300 p-8 md:p-12">
                        {/* Toggle Buttons */}
                        <div className="flex justify-center gap-4 mb-8">
                            <button
                                onClick={() => setShowCompetitors(!showCompetitors)}
                                className={`px-6 py-3 font-mono text-sm tracking-wider border transition-all ${showCompetitors
                                        ? 'border-red-500 bg-red-500/20 text-red-500'
                                        : 'border-void-300 text-white hover:border-red-500'
                                    }`}
                            >
                                CONCURRENTS
                            </button>
                            <button
                                onClick={() => setShowAether(!showAether)}
                                className={`px-6 py-3 font-mono text-sm tracking-wider border transition-all ${showAether
                                        ? 'border-neon-orange bg-neon-orange/20 text-neon-orange'
                                        : 'border-void-300 text-white hover:border-neon-orange'
                                    }`}
                            >
                                AETHER
                            </button>
                        </div>

                        {/* Radar Chart */}
                        <RadarChart showAether={showAether} showCompetitors={showCompetitors} />

                        {/* Legend */}
                        <div className="flex justify-center gap-8 mt-8">
                            {showCompetitors && (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-red-500/50 border border-red-500" />
                                    <span className="font-mono text-xs text-red-500">CONCURRENTS</span>
                                </div>
                            )}
                            {showAether && (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-neon-orange/50 border border-neon-orange" />
                                    <span className="font-mono text-xs text-neon-orange">AETHER</span>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Comparative Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="border border-void-300 p-8 md:p-12"
                >
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* They */}
                        <div>
                            <div className="font-mono text-red-500 text-xs font-bold tracking-wider mb-6">
                                [EUX]
                            </div>
                            <div className="space-y-4 font-mono text-white">
                                <div className="flex justify-between border-b border-void-300 pb-3">
                                    <span className="text-white">Sucre</span>
                                    <span className="text-red-500 font-semibold">15g</span>
                                </div>
                                <div className="flex justify-between border-b border-void-300 pb-3">
                                    <span className="text-white">Excipient</span>
                                    <span className="text-red-500 font-semibold">Maltodextrine</span>
                                </div>
                                <div className="flex justify-between pb-3">
                                    <span className="text-white">Colorant</span>
                                    <span className="text-red-500 font-semibold">E133</span>
                                </div>
                            </div>
                        </div>

                        {/* AETHER */}
                        <div>
                            <div className="font-mono text-neon-orange text-xs font-bold tracking-wider mb-6">
                                [AETHER]
                            </div>
                            <div className="space-y-4 font-mono text-white">
                                <div className="flex justify-between border-b border-void-300 pb-3">
                                    <span className="text-white">Sucre</span>
                                    <span className="text-neon-orange font-semibold">0g</span>
                                </div>
                                <div className="flex justify-between border-b border-void-300 pb-3">
                                    <span className="text-white">Magnésium</span>
                                    <span className="text-neon-orange font-semibold">Bisglycinate</span>
                                </div>
                                <div className="flex justify-between pb-3">
                                    <span className="text-white">Arôme</span>
                                    <span className="text-neon-orange font-semibold">Naturel</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

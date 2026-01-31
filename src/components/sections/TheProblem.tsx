'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAssetPath } from '@/lib/utils';

// ═══════════════════════════════════════════════════════════════════════════
// COMPETITOR DATA — REAL BRAND COMPARISON
// ═══════════════════════════════════════════════════════════════════════════

const COMPETITORS = [
    {
        id: 'decathlon',
        codename: 'DECATHLON',
        realname: 'Grande Distribution Sport',
        // Stats scored 0-100: higher = better (Aether is baseline 100)
        stats: {
            magnesium: 47,    // 56.3/60 * 50 (Oxyde = poor form, half credit)
            vitamineB: 10,    // 1.17/12.2 = ~10%
            vitamineC: 31,    // 24/77 = ~31%
            sodium: 89,       // 250/280 = ~89%
            price: 86         // 5.99/6.99 = ~86%
        },
        data: {
            price: '6,99€',
            magnesium: '56,3mg Oxyde (Faible abs.)',
            sugar: '0g',
            sodium: '250mg',
            vitamineC: '24mg',
            vitamineB: '1,17mg total',
            zinc: '0mg'
        }
    },
    {
        id: 'hydratis',
        codename: 'HYDRATIS',
        realname: 'Pharmacie Premium',
        stats: {
            magnesium: 27,    // 32.5/60 * 50 (probably Oxyde)
            vitamineB: 0,     // 0/12.2 = 0%
            vitamineC: 0,     // 0/77 = 0%
            sodium: 21,       // 58/280 = ~21%
            price: 60         // 5.99/9.99 = ~60%
        },
        data: {
            price: '9,99€',
            magnesium: '32,5mg (Forme non spécifiée)',
            sugar: '1,8g',
            sodium: '58mg',
            vitamineC: '0mg',
            vitamineB: '0mg',
            zinc: '1mg'
        }
    },
    {
        id: 'waterdrop',
        codename: 'WATERDROP',
        realname: 'Marketing Lifestyle',
        stats: {
            magnesium: 0,     // 0mg
            vitamineB: 49,    // 6/12.2 = ~49%
            vitamineC: 31,    // 24/77 = ~31%
            sodium: 0,        // 0mg
            price: 80         // 5.99/7.49 = ~80%
        },
        data: {
            price: '7,49€',
            magnesium: '0mg',
            sugar: '0g',
            sodium: '0mg',
            vitamineC: '24mg',
            vitamineB: '6mg total',
            zinc: '0mg'
        }
    }
];

// AETHER Reference — Baseline 100%
const AETHER = {
    id: 'aether',
    codename: 'AETHER SYSTEM',
    realname: 'HYDRE V1.0',
    stats: { magnesium: 100, vitamineB: 100, vitamineC: 100, sodium: 100, price: 100 },
    data: {
        price: '5,99€',
        magnesium: '60mg Bisglycinate (Haute abs.)',
        sugar: '0g',
        sodium: '280mg',
        vitamineC: '77mg',
        vitamineB: '12,2mg total (B3, B5, B6, B12)',
        zinc: '3mg'
    }
};

const METRICS = [
    { key: 'magnesium', label: 'MAGNÉSIUM' },
    { key: 'vitamineB', label: 'VITAMINES B' },
    { key: 'vitamineC', label: 'VITAMINE C' },
    { key: 'sodium', label: 'SODIUM' },
    { key: 'price', label: 'PRIX' },
];

// ═══════════════════════════════════════════════════════════════════════════
// RADAR CHART COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function RadarChart({ aetherStats, competitorStats }: {
    aetherStats: Record<string, number>;
    competitorStats: Record<string, number>;
}) {
    const size = 400;
    const center = size / 2;
    const radius = 130;
    const levels = 4;

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
    const getPolygonPath = (stats: Record<string, number>) => {
        return METRICS
            .map((metric, i) => {
                const point = getPoint(i, stats[metric.key] || 0);
                return `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
            })
            .join(' ') + ' Z';
    };

    // Generate grid circles
    const gridCircles = [];
    for (let level = 1; level <= levels; level++) {
        const levelRadius = (radius * level) / levels;
        gridCircles.push(
            <circle
                key={level}
                cx={center}
                cy={center}
                r={levelRadius}
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="1"
            />
        );
    }

    // Generate axis lines and labels
    const axisElements = METRICS.map((metric, i) => {
        const angle = (Math.PI * 2 * i) / METRICS.length - Math.PI / 2;
        const labelRadius = radius + 40;
        const x = center + labelRadius * Math.cos(angle);
        const y = center + labelRadius * Math.sin(angle);

        return (
            <g key={i}>
                <line
                    x1={center}
                    y1={center}
                    x2={center + radius * Math.cos(angle)}
                    y2={center + radius * Math.sin(angle)}
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="1"
                />
                <text
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-white/60 text-[8px] font-mono"
                >
                    {metric.label}
                </text>
            </g>
        );
    });

    return (
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[400px] mx-auto">
            {/* Grid */}
            {gridCircles}
            {axisElements}

            {/* Competitor polygon — RED/ORANGE thin stroke */}
            <motion.path
                key="competitor"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                d={getPolygonPath(competitorStats)}
                fill="rgba(239, 68, 68, 0.15)"
                stroke="#ef4444"
                strokeWidth="2"
            />

            {/* AETHER polygon — WHITE solid with glow */}
            <motion.path
                d={getPolygonPath(aetherStats)}
                fill="rgba(255, 255, 255, 0.08)"
                stroke="#ffffff"
                strokeWidth="2"
                style={{ filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.3))' }}
            />

            {/* AETHER data points */}
            {METRICS.map((metric, i) => {
                const point = getPoint(i, aetherStats[metric.key] || 0);
                return (
                    <circle
                        key={`aether-${i}`}
                        cx={point.x}
                        cy={point.y}
                        r="4"
                        fill="#ffffff"
                    />
                );
            })}

            {/* Competitor data points */}
            {METRICS.map((metric, i) => {
                const point = getPoint(i, competitorStats[metric.key] || 0);
                return (
                    <motion.circle
                        key={`comp-${i}`}
                        initial={{ cx: center, cy: center }}
                        animate={{ cx: point.x, cy: point.y }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        r="4"
                        fill="#ef4444"
                    />
                );
            })}
        </svg>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export function TheProblem() {
    const [selectedTarget, setSelectedTarget] = useState(COMPETITORS[0]);

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
                    <h2 className="font-headline text-4xl md:text-6xl text-white font-bold tracking-tight">
                        L'ILLUSION INDUSTRIELLE
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
                        L'industrie a parié contre notre intelligence. Depuis des décennies, le marché du sport a fait un choix silencieux : la marge avant la performance.
                    </p>
                </motion.div>

                {/* ═══════════════════════════════════════════════════════════════════
                    INTERCEPTOR MODULE — Target Selection + Radar + Data Table
                ═══════════════════════════════════════════════════════════════════ */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="mb-16"
                >
                    <div className="grid md:grid-cols-12 gap-8 border-t border-white/10 pt-12">

                        {/* ZONE A: TARGET SELECTOR */}
                        <div className="md:col-span-4 space-y-2">
                            <h3 className="font-mono text-xs text-[#E6DCC8] mb-6 tracking-widest">
                                [ SELECT TARGET FOR ANALYSIS ]
                            </h3>

                            {COMPETITORS.map((target) => (
                                <button
                                    key={target.id}
                                    onClick={() => setSelectedTarget(target)}
                                    className={`w-full text-left px-4 py-3 font-mono text-sm border-l-2 transition-all duration-300
                                        ${selectedTarget.id === target.id
                                            ? 'border-[#E6DCC8] bg-white/5 text-white'
                                            : 'border-white/5 text-white/40 hover:text-white/80 hover:border-white/20'
                                        }`}
                                >
                                    <div className="font-bold">{target.codename}</div>
                                    <div className="text-xs text-white/30">{target.realname}</div>
                                </button>
                            ))}
                        </div>

                        {/* ZONE B: RADAR + DATA */}
                        <div className="md:col-span-8 bg-[#0A0A0A] border border-white/10 rounded-sm p-6 relative overflow-hidden">

                            {/* Header */}
                            <div className="grid grid-cols-2 mb-6 border-b border-white/10 pb-4">
                                <div className="font-headline text-white text-lg">AETHER V1.0</div>
                                <div className="font-headline text-red-400/80 text-right text-lg">
                                    {selectedTarget.codename}
                                </div>
                            </div>

                            {/* Radar Chart */}
                            <div className="mb-8">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={selectedTarget.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <RadarChart
                                            aetherStats={AETHER.stats}
                                            competitorStats={selectedTarget.stats}
                                        />
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* Legend */}
                            <div className="flex justify-center gap-8 mb-8">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-white/20 border border-white" />
                                    <span className="font-mono text-xs text-white">AETHER</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-red-500/20 border border-red-500" />
                                    <span className="font-mono text-xs text-red-400">CONCURRENT</span>
                                </div>
                            </div>

                            {/* Data Table */}
                            <div className="space-y-3 font-mono text-sm border-t border-white/10 pt-6">

                                {/* Row: SUCRE */}
                                <div className="grid grid-cols-2 items-center">
                                    <div className="text-green-400">
                                        {AETHER.data.sugar}
                                        <span className="text-white/40 text-xs ml-2">SUCRE</span>
                                    </div>
                                    <div className={`text-right ${selectedTarget.data.sugar === '0g' ? 'text-green-400' : 'text-red-400/80'}`}>
                                        {selectedTarget.data.sugar}
                                    </div>
                                </div>

                                {/* Row: MAGNESIUM */}
                                <div className="grid grid-cols-2 items-center">
                                    <div className="text-white text-xs">
                                        {AETHER.data.magnesium}
                                        <span className="text-green-400 ml-1">●</span>
                                    </div>
                                    <div className={`text-right text-xs ${selectedTarget.data.magnesium === '0mg' ? 'text-red-400/60' : 'text-white/60'}`}>
                                        {selectedTarget.data.magnesium}
                                    </div>
                                </div>

                                {/* Row: SODIUM */}
                                <div className="grid grid-cols-2 items-center">
                                    <div className="text-white">
                                        {AETHER.data.sodium}
                                        <span className="text-white/40 text-xs ml-2">SODIUM</span>
                                    </div>
                                    <div className={`text-right ${selectedTarget.data.sodium === '0mg' ? 'text-red-400/60' : 'text-white/60'}`}>
                                        {selectedTarget.data.sodium}
                                    </div>
                                </div>

                                {/* Row: VITAMINE C */}
                                <div className="grid grid-cols-2 items-center">
                                    <div className="text-white">
                                        {AETHER.data.vitamineC}
                                        <span className="text-white/40 text-xs ml-2">VIT. C</span>
                                    </div>
                                    <div className={`text-right ${selectedTarget.data.vitamineC === '0mg' ? 'text-red-400/60' : 'text-white/60'}`}>
                                        {selectedTarget.data.vitamineC}
                                    </div>
                                </div>

                                {/* Row: VITAMINES B */}
                                <div className="grid grid-cols-2 items-center">
                                    <div className="text-white text-xs">
                                        {AETHER.data.vitamineB}
                                        <span className="text-green-400 ml-1">●</span>
                                    </div>
                                    <div className={`text-right text-xs ${selectedTarget.data.vitamineB === '0mg' ? 'text-red-400/60' : 'text-white/60'}`}>
                                        {selectedTarget.data.vitamineB}
                                    </div>
                                </div>

                                {/* Row: ZINC */}
                                <div className="grid grid-cols-2 items-center">
                                    <div className="text-white">
                                        {AETHER.data.zinc}
                                        <span className="text-white/40 text-xs ml-2">ZINC</span>
                                    </div>
                                    <div className={`text-right ${selectedTarget.data.zinc === '0mg' ? 'text-red-400/60' : 'text-white/60'}`}>
                                        {selectedTarget.data.zinc}
                                    </div>
                                </div>

                                {/* Row: PRIX */}
                                <div className="grid grid-cols-2 items-center pt-4 border-t border-white/5">
                                    <div className="text-2xl text-green-400 font-bold">
                                        {AETHER.data.price}
                                        <span className="text-xs text-white/40 ml-2 font-normal">/boîte</span>
                                    </div>
                                    <div className="text-right text-xl text-red-400/60 line-through">
                                        {selectedTarget.data.price}
                                    </div>
                                </div>
                            </div>

                            {/* Alert indicator */}
                            <div className="absolute top-4 right-4 opacity-20 pointer-events-none">
                                <div className="text-6xl leading-none font-headline text-red-500">
                                    !
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Video Evidence Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    className="mt-16 text-center"
                >
                    <h3 className="font-sans text-2xl md:text-4xl text-white font-bold tracking-tight mb-8">
                        DISSOLUTION TOTALE. ZÉRO RÉSIDU.
                    </h3>

                    {/* Cinematic Portal Video Container */}
                    <div
                        className="relative overflow-hidden bg-black"
                        style={{
                            width: '100vw',
                            height: '85vh',
                            marginLeft: 'calc(-50vw + 50%)',
                            marginRight: 'calc(-50vw + 50%)'
                        }}
                    >
                        {/* Gradient Overlay */}
                        <div
                            className="absolute inset-0 z-10 pointer-events-none"
                            style={{
                                background: `linear-gradient(
                                    to bottom,
                                    #050505 0%,
                                    transparent 15%,
                                    transparent 85%,
                                    #050505 100%
                                )`
                            }}
                        />

                        {/* Video */}
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                            style={{
                                opacity: 0.9,
                                filter: 'contrast(1.1)'
                            }}
                        >
                            <source src={getAssetPath('/videos/tabletteeffervescence.mp4')} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>

                        {/* Floating Data Overlay */}
                        <div className="absolute bottom-8 right-8 z-20 font-mono text-white/50 text-xs tracking-widest">
                            [ REACTIVE_POWER ] : MAXIMUM
                        </div>
                    </div>

                    <p className="font-mono text-void-500 text-sm mt-8 tracking-wider">
                        [DATA] : DISSOLUTION TIME &lt; 45s // RESIDUE : 0.00%
                    </p>
                </motion.div>
            </div>
        </section>
    );
}

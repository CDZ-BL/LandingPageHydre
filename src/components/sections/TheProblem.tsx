'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAssetPath } from '@/lib/utils';

// Radar chart metrics - higher is better for AETHER
const METRICS = [
    { label: 'QUALITÉ INGRÉDIENTS', aether: 95, competitors: 35 },
    { label: 'EFFICACITÉ', aether: 90, competitors: 40 },
    { label: 'BIODISPONIBILITÉ', aether: 95, competitors: 25 },
    { label: 'RAPPORT QUALITÉ/PRIX', aether: 85, competitors: 30 },
    { label: 'TRANSPARENCE', aether: 100, competitors: 20 },
    { label: 'ZÉRO SUCRE', aether: 100, competitors: 15 },
];

const FUI_COLORS = {
    background: '#050505',
    cyan: '#00F0FF',
    red: '#FF2A6D',
    grid: 'rgba(0, 240, 255, 0.1)',
    text: 'rgba(255, 255, 255, 0.7)'
};

function RadarChart({ activeAether, activeCompetitors }: { activeAether: boolean; activeCompetitors: boolean }) {
    const size = 500;
    const center = size / 2;
    const radius = 150; // Slightly smaller radius to give labels more room
    const levels = 5;
    const [hoveredData, setHoveredData] = useState<{ value: number, label: string, type: 'AETHER' | 'COMPETITORS' } | null>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [ping, setPing] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // Trigger ping on toggle
    useEffect(() => {
        setPing(prev => prev + 1);
    }, [activeAether, activeCompetitors]);

    // High-frequency elastic bounce
    const springConfig = { type: "spring", stiffness: 300, damping: 20, mass: 1 };

    // Calculate point position
    const getPoint = (index: number, value: number) => {
        const angle = (Math.PI * 2 * index) / METRICS.length - Math.PI / 2;
        const r = (value / 100) * radius;
        return {
            x: center + r * Math.cos(angle),
            y: center + r * Math.sin(angle),
        };
    };

    // Generate path string
    const getPathString = (values: number[]) => {
        return values.map((value, i) => {
            const point = getPoint(i, value);
            return `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
        }).join(' ') + ' Z';
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
            x: e.clientX - rect.left - center,
            y: e.clientY - rect.top - center
        });
    };

    return (
        <div
            ref={containerRef}
            className="relative w-full max-w-[600px] mx-auto overflow-hidden rounded-sm bg-[#050505] border border-white/5"
            onMouseMove={handleMouseMove}
            style={{ boxShadow: '0 0 40px rgba(0,0,0,0.8)' }}
        >
            {/* Header Readout */}
            <div className="absolute top-4 left-6 flex items-center gap-3 z-20">
                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
                <span className="text-[8px] font-mono text-cyan-400/60 uppercase tracking-[0.2em]">RADAR_ANALYSIS_VIEWPORT // BATCH_001</span>
            </div>

            {/* Background Grid with Distortion */}
            <motion.div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(${FUI_COLORS.grid} 1px, transparent 1px), linear-gradient(90deg, ${FUI_COLORS.grid} 1px, transparent 1px)`,
                    backgroundSize: '30px 30px',
                    x: mousePos.x * 0.015,
                    y: mousePos.y * 0.015
                }}
            />

            {/* Subtle Scanning horizontal bar */}
            <motion.div
                className="absolute left-0 right-0 h-[100px] bg-gradient-to-b from-transparent via-[#00F0FF]/5 to-transparent z-0 pointer-events-none"
                animate={{ top: ['-20%', '120%'] }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            />

            {/* Ping Ripple */}
            <AnimatePresence>
                {ping > 0 && (
                    <motion.div
                        key={ping}
                        className="absolute top-1/2 left-1/2 rounded-full border border-cyan-500/30 -translate-x-1/2 -translate-y-1/2 z-0"
                        initial={{ width: 0, height: 0, opacity: 1 }}
                        animate={{ width: 600, height: 600, opacity: 0 }}
                        transition={{ duration: 2, ease: "easeOut" }}
                    />
                )}
            </AnimatePresence>

            <svg viewBox={`0 0 ${size} ${size}`} className="w-full relative z-10 p-12">
                <defs>
                    <filter id="bloom" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                        <feBlend mode="screen" in="SourceGraphic" in2="coloredBlur" />
                    </filter>
                    <filter id="chromatic-light" x="-1%" y="-1%" width="102%" height="102%">
                        <feOffset in="SourceGraphic" dx="0.5" dy="0" result="red" />
                        <feColorMatrix in="red" result="redOnly" type="matrix" values="1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" />
                        <feBlend mode="screen" in="SourceGraphic" in2="redOnly" />
                    </filter>
                    <linearGradient id="aetherGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgba(0, 240, 255, 0.2)" />
                        <stop offset="100%" stopColor="rgba(0, 240, 255, 0.05)" />
                    </linearGradient>
                </defs>

                {/* Radar Grid Levels (Hex Rings) */}
                {Array.from({ length: levels }).map((_, i) => {
                    const levelRadius = (radius * (i + 1)) / levels;
                    const points = METRICS.map((_, j) => {
                        const angle = (Math.PI * 2 * j) / METRICS.length - Math.PI / 2;
                        return `${center + levelRadius * Math.cos(angle)},${center + levelRadius * Math.sin(angle)}`;
                    }).join(' ');

                    return (
                        <g key={`grid-lvl-${i}`}>
                            <polygon
                                points={points}
                                fill="none"
                                stroke={FUI_COLORS.grid}
                                strokeWidth="0.5"
                                className="opacity-30"
                            />
                            {/* Measurement ticks at 50% and 100% */}
                            {(i === 2 || i === 4) && (
                                <text
                                    x={center + 5}
                                    y={center - levelRadius + 2}
                                    className="fill-cyan-500/20 text-[6px] font-mono"
                                >
                                    {((i + 1) * 20)}%
                                </text>
                            )}
                        </g>
                    );
                })}

                {/* Axis Lines */}
                {METRICS.map((_, i) => {
                    const angle = (Math.PI * 2 * i) / METRICS.length - Math.PI / 2;
                    return (
                        <line
                            key={`axis-line-${i}`}
                            x1={center}
                            y1={center}
                            x2={center + radius * Math.cos(angle)}
                            y2={center + radius * Math.sin(angle)}
                            stroke={FUI_COLORS.grid}
                            strokeWidth="0.5"
                            strokeDasharray="2 2"
                            className="opacity-20"
                        />
                    );
                })}

                {/* Competitors Polygon (Red) - IMPROVED CONTRAST */}
                <motion.path
                    filter="url(#chromatic-light)"
                    initial={false}
                    animate={{
                        d: getPathString(METRICS.map(m => activeCompetitors ? m.competitors : 0)),
                        opacity: activeCompetitors ? 0.8 : 0
                    }}
                    transition={springConfig}
                    fill="rgba(255, 42, 109, 0.15)"
                    stroke={FUI_COLORS.red}
                    strokeWidth="2"
                    style={{ filter: 'drop-shadow(0 0 8px rgba(255, 42, 109, 0.4))' }}
                />

                {/* AETHER Polygon (Cyan) */}
                <motion.path
                    initial={false}
                    animate={{
                        d: getPathString(METRICS.map(m => activeAether ? m.aether : 0)),
                        opacity: activeAether ? 1 : 0
                    }}
                    transition={springConfig}
                    fill="url(#aetherGradient)"
                />

                {/* AETHER Core Lines (Glow effect) */}
                <g filter="url(#bloom)">
                    <motion.path
                        initial={false}
                        animate={{
                            d: getPathString(METRICS.map(m => activeAether ? m.aether : 0)),
                            opacity: activeAether ? 1 : 0
                        }}
                        transition={springConfig}
                        fill="none"
                        stroke={FUI_COLORS.cyan}
                        strokeWidth="3"
                        strokeOpacity="0.4"
                    />
                    <motion.path
                        initial={false}
                        animate={{
                            d: getPathString(METRICS.map(m => activeAether ? m.aether : 0)),
                            opacity: activeAether ? 1 : 0
                        }}
                        transition={springConfig}
                        fill="none"
                        stroke="#FFF"
                        strokeWidth="1"
                    />
                </g>

                {/* Nodes and Targeting reticles */}
                {METRICS.map((metric, i) => {
                    const point = getPoint(i, activeAether ? metric.aether : 0);
                    const compPoint = getPoint(i, activeCompetitors ? metric.competitors : 0);
                    return (
                        <g key={`nodes-${i}`}>
                            {/* Competitor Node */}
                            <motion.circle
                                initial={false}
                                animate={{
                                    cx: compPoint.x,
                                    cy: compPoint.y,
                                    opacity: activeCompetitors ? 1 : 0
                                }}
                                transition={springConfig}
                                r="2.5"
                                fill={FUI_COLORS.red}
                                stroke="rgba(0,0,0,0.5)"
                                strokeWidth="1"
                            />

                            {/* Aether Node with mini brackets */}
                            <motion.g
                                initial={false}
                                animate={{
                                    x: point.x,
                                    y: point.y,
                                    opacity: activeAether ? 1 : 0
                                }}
                                transition={springConfig}
                            >
                                <circle r="3" fill="#FFF" className="drop-shadow-[0_0_8px_#00F0FF]" />
                                <motion.g
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                >
                                    <path d="M -7 -7 L -4 -7 M -7 -7 L -7 -4" stroke={FUI_COLORS.cyan} strokeWidth="1" fill="none" />
                                    <path d="M 7 7 L 4 7 M 7 7 L 7 4" stroke={FUI_COLORS.cyan} strokeWidth="1" fill="none" />
                                </motion.g>
                            </motion.g>

                            {/* Transparent Hitboxes */}
                            <circle
                                cx={point.x}
                                cy={point.y}
                                r="25"
                                fill="transparent"
                                className="cursor-crosshair"
                                onMouseEnter={() => setHoveredData({ value: metric.aether, label: metric.label, type: 'AETHER' })}
                                onMouseLeave={() => setHoveredData(null)}
                            />
                        </g>
                    );
                })}

                {/* Labels - ADJUSTED POSITIONING */}
                {METRICS.map((metric, i) => {
                    const angle = (Math.PI * 2 * i) / METRICS.length - Math.PI / 2;
                    const labelRadius = radius + 60; // Pushed further out
                    const x = center + labelRadius * Math.cos(angle);
                    const y = center + labelRadius * Math.sin(angle);

                    // Smart Alignment
                    const textAnchor = Math.abs(x - center) < 10 ? 'middle' : x < center ? 'end' : 'start';

                    return (
                        <motion.text
                            key={`radar-label-${i}`}
                            x={x}
                            y={y}
                            textAnchor={textAnchor}
                            dominantBaseline="middle"
                            className="fill-white/70 text-[10px] uppercase font-mono tracking-tighter"
                        >
                            {metric.label}
                        </motion.text>
                    );
                })}
            </svg>

            {/* Clipping Glass Overlay */}
            <motion.div
                className="absolute inset-0 z-0 pointer-events-none"
                initial={false}
                animate={{
                    clipPath: `path('${getPathString(METRICS.map(m => activeAether ? m.aether : 0))}')`,
                    opacity: activeAether ? 1 : 0
                }}
                transition={springConfig}
            >
                <div className="w-full h-full backdrop-blur-[6px] bg-cyan-400/5 shadow-inner" />
            </motion.div>

            {/* Float-over Tooltip */}
            <AnimatePresence>
                {hoveredData && (
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/80 backdrop-blur-md border-l-2 border-cyan-400 p-4 z-40"
                    >
                        <div className="text-[10px] font-mono text-cyan-400 mb-1 tracking-widest uppercase">{hoveredData.label}</div>
                        <div className="flex items-center gap-2">
                            <span className="text-3xl font-bold text-white font-mono">{hoveredData.value}</span>
                            <div className="h-1 flex-1 bg-void-300 w-24 relative overflow-hidden">
                                <motion.div
                                    className="absolute inset-y-0 left-0 bg-cyan-400"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${hoveredData.value}%` }}
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
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
                        Votre corps est une <span className="text-neon-cyan font-semibold">machine thermique</span>, pas une poubelle.
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
                    <div className="border border-white/5 bg-void/50 backdrop-blur-sm p-6 md:p-10 relative">
                        {/* Interactive Toggle Buttons - SHARPER / SMALLER */}
                        <div className="flex justify-center gap-6 mb-12 relative z-20">
                            <button
                                onClick={() => setShowCompetitors(!showCompetitors)}
                                className={`group flex items-center gap-3 px-4 py-2 border font-mono text-[10px] tracking-widest transition-all ${showCompetitors
                                    ? 'border-red-500/50 bg-red-500/10 text-red-500'
                                    : 'border-white/10 text-white/40 hover:border-white/20'
                                    }`}
                            >
                                <div className={`w-2 h-2 border ${showCompetitors ? 'bg-red-500 border-red-400' : 'border-white/20'}`} />
                                COMPETITORS_DATA
                                {showCompetitors && <span className="text-[8px] animate-pulse">[ACTIVE]</span>}
                            </button>
                            <button
                                onClick={() => setShowAether(!showAether)}
                                className={`group flex items-center gap-3 px-4 py-2 border font-mono text-[10px] tracking-widest transition-all ${showAether
                                    ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-500'
                                    : 'border-white/10 text-white/40 hover:border-white/20'
                                    }`}
                            >
                                <div className={`w-2 h-2 border ${showAether ? 'bg-cyan-400 border-cyan-300' : 'border-white/20'}`} />
                                AETHER_SYSTEM
                                {showAether && <span className="text-[8px] animate-pulse">[OPTIMIZED]</span>}
                            </button>
                        </div>

                        {/* Radar Chart */}
                        <RadarChart activeAether={showAether} activeCompetitors={showCompetitors} />

                        {/* Tactical Footer Note */}
                        <div className="mt-8 flex justify-center gap-12 font-mono text-[7px] text-white/20 tracking-[0.3em] uppercase">
                            <span>// UNIT: PERCENTAGE_OF_DAILY_REQ</span>
                            <span>// SOURCE: R-D_LAB_09</span>
                        </div>
                    </div>
                </motion.div>

                {/* Comparative Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="space-y-6"
                >
                    {/* Enemy Card - Standard Market */}
                    <div className="relative opacity-60 border border-void-300 bg-[#0a0a0a] p-6 md:p-8">
                        <div className="absolute -top-3 left-4 bg-void px-2 py-0.5 font-mono text-[10px] text-void-500 uppercase tracking-widest">
                            Standard Market
                        </div>
                        <div className="space-y-3 font-mono text-sm md:text-base">
                            <div className="text-void-500">
                                <span className="text-red-800 font-semibold">[ DETECTED ]</span> 15g Sucre
                            </div>
                            <div className="text-void-500">
                                <span className="text-red-800 font-semibold">[ DETECTED ]</span> Maltodextrine
                            </div>
                            <div className="text-void-500">
                                <span className="text-red-800 font-semibold">[ DETECTED ]</span> Colorant E133
                            </div>
                        </div>
                    </div>

                    {/* Hero Card - AETHER SYSTEM */}
                    <div className="relative border border-void-400 bg-void p-6 md:p-8" style={{ boxShadow: '0 0 20px rgba(255, 255, 255, 0.05)' }}>
                        <div className="absolute -top-3 left-4 bg-void px-2 py-0.5 border border-void-400 font-mono text-[10px] text-white uppercase tracking-widest">
                            AETHER SYSTEM
                        </div>
                        <div className="space-y-3 font-mono text-sm md:text-base">
                            <div className="text-void-600">
                                <span className="text-white font-bold">// 0.00g</span> Sucre
                            </div>
                            <div className="text-void-600">
                                <span className="text-white font-bold">// 200mg</span> Magnésium Bisglycinate
                            </div>
                            <div className="text-void-600">
                                <span className="text-white font-bold">// PURE</span> Arôme Naturel
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

                    <div
                        className="relative left-1/2 -translate-x-1/2 w-screen border-y border-void-300 overflow-hidden"
                        style={{ boxShadow: '0 0 50px rgba(255,255,255,0.05)' }}
                    >
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full block"
                        >
                            <source src={getAssetPath('/videos/tabletteeffervescence.mp4')} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>

                    <p className="font-mono text-void-500 text-sm mt-4 tracking-wider">
                        [DATA] : DISSOLUTION TIME &lt; 45s // RESIDUE : 0.00%
                    </p>
                </motion.div>
            </div>
        </section>
    );
}

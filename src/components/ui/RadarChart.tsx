'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { Competitor, AETHER_DATA, RADAR_AXES, normalizeMetric } from '@/data/competitorData';

interface RadarChartProps {
    competitor: Competitor;
}

export function RadarChart({ competitor }: RadarChartProps) {
    const size = 300;
    const padding = 50; // Extra space for labels
    const viewBoxSize = size + padding * 2;
    const center = viewBoxSize / 2;
    const radius = size * 0.4;
    const axisCount = RADAR_AXES.length;
    const angleStep = (2 * Math.PI) / axisCount;

    // Calculate polygon points for a given competitor
    const getPolygonPoints = (data: Competitor): string => {
        return RADAR_AXES.map((axis, i) => {
            const value = data.metrics[axis.key as keyof typeof data.metrics] as number;
            const normalizedValue = normalizeMetric(value, axis);
            const angle = i * angleStep - Math.PI / 2; // Start from top
            const x = center + radius * normalizedValue * Math.cos(angle);
            const y = center + radius * normalizedValue * Math.sin(angle);
            return `${x},${y}`;
        }).join(' ');
    };

    const aetherPoints = useMemo(() => getPolygonPoints(AETHER_DATA), []);
    const competitorPoints = useMemo(() => getPolygonPoints(competitor), [competitor]);

    // Axis label positions
    const axisLabels = RADAR_AXES.map((axis, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const labelRadius = radius + 35;
        return {
            x: center + labelRadius * Math.cos(angle),
            y: center + labelRadius * Math.sin(angle),
            label: axis.label,
        };
    });

    return (
        <div className="relative">
            <svg
                viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
                className="w-full max-w-[380px] mx-auto"
            >
                {/* Definitions for glow effects */}
                <defs>
                    <filter id="glow-white" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                    <filter id="glow-red" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Concentric circles */}
                {[0.25, 0.5, 0.75, 1].map((scale, i) => (
                    <circle
                        key={i}
                        cx={center}
                        cy={center}
                        r={radius * scale}
                        fill="none"
                        stroke="rgba(255,255,255,0.08)"
                        strokeWidth="1"
                    />
                ))}

                {/* Axis lines */}
                {RADAR_AXES.map((_, i) => {
                    const angle = i * angleStep - Math.PI / 2;
                    const x2 = center + radius * Math.cos(angle);
                    const y2 = center + radius * Math.sin(angle);
                    return (
                        <line
                            key={i}
                            x1={center}
                            y1={center}
                            x2={x2}
                            y2={y2}
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="1"
                        />
                    );
                })}

                {/* AETHER polygon (white, filled) */}
                <motion.polygon
                    points={aetherPoints}
                    fill="rgba(255,255,255,0.15)"
                    stroke="rgba(255,255,255,0.9)"
                    strokeWidth="2"
                    filter="url(#glow-white)"
                />

                {/* Competitor polygon (red/orange, stroke only) */}
                <motion.polygon
                    initial={{ opacity: 0 }}
                    animate={{
                        points: competitorPoints,
                        opacity: 1
                    }}
                    transition={{
                        points: { type: 'spring', stiffness: 100, damping: 15 },
                        opacity: { duration: 0.3 }
                    }}
                    fill="rgba(255,100,50,0.1)"
                    stroke="rgba(255,100,50,0.9)"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                    filter="url(#glow-red)"
                />

                {/* Center dot */}
                <circle
                    cx={center}
                    cy={center}
                    r="3"
                    fill="rgba(255,255,255,0.5)"
                />

                {/* Axis labels */}
                {axisLabels.map((axis, i) => (
                    <text
                        key={i}
                        x={axis.x}
                        y={axis.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="fill-current text-tertiary font-data text-[8px] tracking-wider"
                    >
                        {axis.label}
                    </text>
                ))}
            </svg>

            {/* Legend */}
            <div className="flex justify-center gap-6 mt-4 font-data text-xs">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-[2px] bg-white rounded" />
                    <span className="text-white">AETHER</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-[2px] bg-orange-500 rounded" style={{ backgroundImage: 'repeating-linear-gradient(90deg, rgb(249,115,22), rgb(249,115,22) 4px, transparent 4px, transparent 6px)' }} />
                    <span className="text-orange-500">{competitor.codeName}</span>
                </div>
            </div>
        </div>
    );
}

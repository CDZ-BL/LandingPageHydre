'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { Competitor, AETHER_DATA, RADAR_AXES, normalizeMetric } from '@/data/competitorData';

interface RadarChartProps {
    competitor: Competitor;
}

// ═══════════════════════════════════════════════════════════════════════════
//  SONAR CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════
const SONAR_INTERVAL_MS = 3000;
const SONAR_DURATION_MS = 1500; // Time for wave to travel center → edge
const DOT_FLASH_DURATION_MS = 600;

export function RadarChart({ competitor }: RadarChartProps) {
    const size = 220;
    const padding = 50; // Extra space for labels
    const viewBoxSize = size + padding * 2;
    const center = viewBoxSize / 2;
    const radius = size * 0.45;
    const axisCount = RADAR_AXES.length;
    const angleStep = (2 * Math.PI) / axisCount;

    const [hoveredAxis, setHoveredAxis] = useState<number | null>(null);
    const [sonarKey, setSonarKey] = useState(0); // Triggers sonar wave re-mount
    const [flashingDots, setFlashingDots] = useState<Set<number>>(new Set());

    // Calculate polygon points for a given competitor
    const getPoint = (value: number, axis: any, index: number) => {
        const normalizedValue = normalizeMetric(value, axis);
        const angle = index * angleStep - Math.PI / 2;
        const x = center + radius * normalizedValue * Math.cos(angle);
        const y = center + radius * normalizedValue * Math.sin(angle);
        return { x, y, value, normalizedValue };
    };

    const getPolygonString = (points: { x: number; y: number }[]) => {
        return points.map(p => `${p.x},${p.y}`).join(' ');
    };

    const aetherPoints = useMemo(() => {
        return RADAR_AXES.map((axis, i) =>
            getPoint(AETHER_DATA.metrics[axis.key as keyof typeof AETHER_DATA.metrics] as number, axis, i)
        );
    }, []);

    const competitorPoints = useMemo(() => {
        return RADAR_AXES.map((axis, i) =>
            getPoint(competitor.metrics[axis.key as keyof typeof competitor.metrics] as number, axis, i)
        );
    }, [competitor]);

    const aetherString = getPolygonString(aetherPoints);
    const competitorString = getPolygonString(competitorPoints);

    // ═══════════════════════════════════════════════════════════════════
    //  SONAR WAVE — Expanding circle from center, every 3s
    //  When wave reaches a data point's distance, flash that dot
    // ═══════════════════════════════════════════════════════════════════
    const triggerDotFlashes = useCallback(() => {
        // For each aether data point, calculate when the wave reaches it
        // based on its normalized distance from center
        aetherPoints.forEach((point, index) => {
            const distanceRatio = point.normalizedValue; // 0-1, where 1 = at edge
            const triggerTime = distanceRatio * SONAR_DURATION_MS;

            setTimeout(() => {
                setFlashingDots(prev => new Set(prev).add(index));

                setTimeout(() => {
                    setFlashingDots(prev => {
                        const next = new Set(prev);
                        next.delete(index);
                        return next;
                    });
                }, DOT_FLASH_DURATION_MS);
            }, triggerTime);
        });

        // Same for competitor points — offset indices
        competitorPoints.forEach((point, index) => {
            const distanceRatio = point.normalizedValue;
            const triggerTime = distanceRatio * SONAR_DURATION_MS;

            setTimeout(() => {
                setFlashingDots(prev => new Set(prev).add(index + axisCount));

                setTimeout(() => {
                    setFlashingDots(prev => {
                        const next = new Set(prev);
                        next.delete(index + axisCount);
                        return next;
                    });
                }, DOT_FLASH_DURATION_MS);
            }, triggerTime);
        });
    }, [aetherPoints, competitorPoints, axisCount]);

    useEffect(() => {
        // Fire first sonar immediately
        const firstTimeout = setTimeout(() => {
            setSonarKey(k => k + 1);
            triggerDotFlashes();
        }, 500);

        const interval = setInterval(() => {
            setSonarKey(k => k + 1);
            triggerDotFlashes();
        }, SONAR_INTERVAL_MS);

        return () => {
            clearTimeout(firstTimeout);
            clearInterval(interval);
        };
    }, [triggerDotFlashes]);

    // Axis label positions
    const axisLabels = RADAR_AXES.map((axis, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const labelRadius = radius + 35;
        return {
            x: center + labelRadius * Math.cos(angle),
            y: center + labelRadius * Math.sin(angle),
            label: axis.label,
            angle: angle,
            index: i
        };
    });

    return (
        <div className="relative group">
            <svg
                viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
                className="w-full max-w-[420px] mx-auto select-none"
            >
                {/* Definitions for glow effects */}
                <defs>
                    <filter id="glow-white" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feColorMatrix in="blur" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                    <filter id="glow-orange" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feComponentTransfer>
                            <feFuncA type="linear" slope="1.5" />
                        </feComponentTransfer>
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                    <filter id="glow-sonar-dot" x="-100%" y="-100%" width="300%" height="300%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                    <linearGradient id="scan-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(255, 255, 255, 0)" />
                        <stop offset="100%" stopColor="rgba(255, 255, 255, 0.15)" />
                    </linearGradient>
                </defs>

                {/* 1. Radar Grid (Concentric) */}
                {[0.25, 0.5, 0.75, 1].map((scale, i) => (
                    <circle
                        key={i}
                        cx={center}
                        cy={center}
                        r={radius * scale}
                        fill="none"
                        stroke={i === 3 ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.05)"}
                        strokeWidth={i === 3 ? 1.5 : 1}
                        strokeDasharray={i === 3 ? "0" : "4 4"}
                    />
                ))}

                {/* 2. Axis lines */}
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
                            stroke="rgba(255,255,255,0.08)"
                            strokeWidth="1"
                        />
                    );
                })}

                {/* ═══════════════════════════════════════════════════════
                    SONAR WAVE — Expanding circle pulse from center
                ════════════════════════════════════════════════════════ */}
                <circle
                    key={sonarKey}
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="none"
                    stroke="rgba(255,255,255,0.25)"
                    strokeWidth="1.5"
                    style={{
                        animation: `sonar-expand ${SONAR_DURATION_MS}ms cubic-bezier(0.25, 0.1, 0.25, 1.0) forwards`,
                        transformOrigin: `${center}px ${center}px`,
                    }}
                />

                {/* 3. AETHER Polygon (White/Blue) */}
                <motion.polygon
                    points={aetherString}
                    fill="rgba(255, 255, 255, 0.03)"
                    stroke="white"
                    strokeWidth="2"
                    strokeOpacity="0.8"
                    filter="url(#glow-white)"
                />

                {/* Aether Points — with sonar flash */}
                {aetherPoints.map((p, i) => {
                    const isFlashing = flashingDots.has(i);
                    return (
                        <circle
                            key={i}
                            cx={p.x}
                            cy={p.y}
                            r={isFlashing ? 4 : 2}
                            fill="white"
                            opacity={isFlashing ? 1 : 0.5}
                            filter={isFlashing ? "url(#glow-sonar-dot)" : undefined}
                            style={{
                                transition: 'r 0.2s ease-out, opacity 0.2s ease-out',
                            }}
                        />
                    );
                })}

                {/* 4. Competitor Polygon (Orange/Neon) */}
                <motion.polygon
                    initial={{ opacity: 0 }}
                    animate={{
                        points: competitorString,
                        opacity: 1
                    }}
                    transition={{
                        points: { type: 'spring', stiffness: 80, damping: 15 },
                        opacity: { duration: 0.3 }
                    }}
                    fill="rgba(249, 115, 22, 0.15)"
                    stroke="#F97316"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                    filter="url(#glow-orange)"
                />

                {/* Competitor Interactive Points — with sonar flash */}
                {competitorPoints.map((p, i) => {
                    const isFlashing = flashingDots.has(i + axisCount);
                    return (
                        <motion.circle
                            key={`${competitor.id}-${i}`}
                            cx={p.x}
                            cy={p.y}
                            r="4"
                            fill={isFlashing ? "#F97316" : "#000"}
                            stroke="#F97316"
                            strokeWidth={isFlashing ? 3 : 2}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1, cx: p.x, cy: p.y }}
                            whileHover={{ scale: 1.5, fill: "#F97316" }}
                            transition={{ type: "spring" }}
                            onMouseEnter={() => setHoveredAxis(i)}
                            onMouseLeave={() => setHoveredAxis(null)}
                            className="cursor-crosshair"
                            filter={isFlashing ? "url(#glow-sonar-dot)" : undefined}
                            style={{
                                transition: 'fill 0.2s ease-out, stroke-width 0.2s ease-out',
                            }}
                        />
                    );
                })}

                {/* 5. Scanner Sweep Animation */}
                <motion.g
                    animate={{ rotate: 360 }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                    style={{ originX: "50%", originY: "50%" }}
                >
                    <path
                        d={`M${center},${center} L${center},${center - radius} A${radius},${radius} 0 0,1 ${center + 10},${center - radius} Z`}
                        fill="url(#scan-gradient)"
                        className="opacity-50"
                        transform={`translate(${center},${center}) scale(2) translate(-${center},-${center})`} // Hack to ensure large sweep
                    />
                    <line
                        x1={center}
                        y1={center}
                        x2={center}
                        y2={center - radius}
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="1"
                    />
                </motion.g>

                {/* 6. Axis Labels */}
                {axisLabels.map((axis, i) => (
                    <g key={i}>
                        <text
                            x={axis.x}
                            y={axis.y}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className={`
                                font-mono text-[10px] tracking-widest transition-colors duration-300
                                ${hoveredAxis === i ? 'fill-neon-orange font-bold drop-shadow-[0_0_8px_rgba(255,107,0,0.8)]' : 'fill-white drop-shadow-[0_0_4px_rgba(0,0,0,0.8)]'}
                            `}
                        >
                            {axis.label}
                        </text>
                    </g>
                ))}

                {/* 7. Floating Tooltip (On Data Point) */}
                <AnimatePresence>
                    {hoveredAxis !== null && (() => {
                        const point = competitorPoints[hoveredAxis];
                        return (
                            <motion.g
                                initial={{ opacity: 0, scale: 0.8, y: 0 }}
                                animate={{ opacity: 1, scale: 1, y: -10 }}
                                exit={{ opacity: 0, scale: 0.8, y: 0 }}
                                transition={{ duration: 0.15 }}
                                transform={`translate(${point.x}, ${point.y})`}
                            >
                                {/* Background Pill */}
                                <rect
                                    x="-20"
                                    y="-22"
                                    width="40"
                                    height="18"
                                    rx="2"
                                    fill="#F97316"
                                    stroke="white"
                                    strokeWidth="1"
                                />
                                {/* Value Text */}
                                <text
                                    x="0"
                                    y="-13"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    className="font-mono text-[10px] font-bold fill-white"
                                >
                                    {competitor.metrics[RADAR_AXES[hoveredAxis].key as keyof typeof competitor.metrics]}
                                </text>
                                {/* Connecting Line */}
                                <line x1="0" y1="-4" x2="0" y2="0" stroke="#F97316" strokeWidth="1" />
                            </motion.g>
                        );
                    })()}
                </AnimatePresence>

                {/* Center Crosshair */}
                <circle cx={center} cy={center} r="2" fill="white" />
                <line x1={center - 5} y1={center} x2={center + 5} y2={center} stroke="white" strokeWidth="0.5" opacity="0.5" />
                <line x1={center} y1={center - 5} x2={center} y2={center + 5} stroke="white" strokeWidth="0.5" opacity="0.5" />
            </svg>

            {/* Sonar wave keyframes */}
            <style>{`
                @keyframes sonar-expand {
                    0% {
                        r: 0;
                        opacity: 0.4;
                        stroke-width: 2;
                    }
                    70% {
                        opacity: 0.15;
                    }
                    100% {
                        r: ${radius};
                        opacity: 0;
                        stroke-width: 0.5;
                    }
                }
            `}</style>

        </div>
    );
}

'use client';

import { motion } from 'framer-motion';
import { Competitor, COMPETITORS } from '@/data/competitorData';

interface CompetitorSelectorProps {
    selectedId: string;
    onSelect: (competitor: Competitor) => void;
}

export function CompetitorSelector({ selectedId, onSelect }: CompetitorSelectorProps) {
    return (
        <div className="relative">
            {/* Label */}
            <div className="font-data text-tertiary mb-4 tracking-widest">
                [ SÉLECTIONNER UNE CIBLE ]
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2">
                {COMPETITORS.map((competitor) => (
                    <button
                        key={competitor.id}
                        onClick={() => onSelect(competitor)}
                        className={`
                            relative px-4 py-2 font-data text-xs tracking-wider
                            border border-white/10 rounded-machined
                            transition-all duration-300
                            ${selectedId === competitor.id
                                ? 'text-white bg-white/5'
                                : 'text-tertiary hover:text-white hover:bg-white/[0.02]'
                            }
                        `}
                    >
                        {/* Category tag */}
                        <span className="block text-[10px] text-amber-500/80 mb-1">
                            {competitor.category}
                        </span>

                        {/* Code name */}
                        <span className="block">
                            {competitor.codeName}
                        </span>

                        {/* Active indicator */}
                        {selectedId === competitor.id && (
                            <motion.div
                                layoutId="selector-indicator"
                                className="absolute -bottom-[1px] left-2 right-2 h-[2px] bg-amber-500"
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}

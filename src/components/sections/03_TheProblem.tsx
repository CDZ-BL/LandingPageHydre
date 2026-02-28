'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { getAssetPath } from '@/lib/utils';
import { COMPETITORS, Competitor } from '@/data/competitorData';
import { CompetitorSelector } from '@/components/ui/CompetitorSelector';
import { RadarChart } from '@/components/ui/RadarChart';
import { ComparisonTable } from '@/components/ui/ComparisonTable';

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export function TheProblem() {
    const [selectedCompetitor, setSelectedCompetitor] = useState<Competitor>(COMPETITORS[0]);

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

            <div className="relative z-10 w-[85%] max-w-[1400px] mx-auto">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="mb-8"
                >
                    <h2 className="font-headline text-h1 text-white font-bold tracking-widest">
                        AUDIT DE FORMULATION.
                    </h2>
                    <p className="font-mono text-lg md:text-xl text-white/60 mt-4 tracking-wide">
                        Les chiffres ne mentent pas. <span className="text-white">Le marketing, si.</span>
                    </p>
                </motion.div>

                {/* Body Text */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="mb-12"
                >
                    {/* Paragraph removed for minimalism */}
                </motion.div>

                {/* ═══════════════════════════════════════════════════════════════════
                    ANALYSE COMPARATIVE — Using shared components from Reciprocity
                ═══════════════════════════════════════════════════════════════════ */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="mb-16"
                >
                    {/* Section Divider */}
                    <div className="flex items-center gap-4 mb-12 pt-12 border-t border-white/10">
                        <div className="flex-1 h-[1px] bg-white/10" />
                        <h3 className="font-data text-xs text-neon-orange tracking-widest">
                            [ ANALYSE COMPARATIVE ]
                        </h3>
                        <div className="flex-1 h-[1px] bg-white/10" />
                    </div>

                    {/* Two-column layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                        <div className="lg:col-span-5 space-y-8">
                            <CompetitorSelector
                                selectedId={selectedCompetitor.id}
                                onSelect={setSelectedCompetitor}
                            />
                            <ComparisonTable competitor={selectedCompetitor} />
                        </div>

                        <div className="lg:col-span-7 flex items-center justify-center">
                            <div className="w-full max-w-md">
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
                        className="mt-12 p-6 border border-white/10 bg-white/[0.02] rounded-machined text-center"
                    >
                        <p className="font-data text-xs text-tertiary tracking-wider mb-2">
                            DIAGNOSTIC : {selectedCompetitor.codeName}
                        </p>
                        <p className="text-white/80 text-sm leading-relaxed max-w-lg mx-auto">
                            {selectedCompetitor.description}
                        </p>
                    </motion.div>
                </motion.div>


            </div>
        </section>
    );
}

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TacticalGlass, TacticalReadout, SystemStatus } from '@/components/ui/TacticalGlass';

export function TheClose() {
    const [selectedOption, setSelectedOption] = useState<'monthly' | 'single'>('monthly');

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

            <div className="relative z-10 w-[85%] max-w-[1000px] mx-auto">
                <TacticalGlass label="TRANSACTION_TERMINAL" className="p-8 md:p-16" scanLine={true}>
                    {/* Header */}
                    <div className="mb-12">
                        <div className="flex items-center gap-4 mb-4">
                            <span className="font-mono text-red-500 text-xs font-bold tracking-widest border border-red-500/30 px-2 py-0.5 animate-pulse">
                                [ ACCESS: LIMITED ]
                            </span>
                            <div className="h-[1px] flex-1 bg-void-300 opacity-30" />
                        </div>
                        <h2 className="font-sans text-4xl md:text-5xl text-white font-bold tracking-tight mb-6">
                            SÉCURISEZ VOTRE ALLOCATION.
                        </h2>
                        <p className="font-sans text-lg text-void-600 leading-relaxed max-w-2xl">
                            Le Batch 001 est en quantité restreinte. Rejoindre AETHER aujourd'hui, c'est intégrer le <span className="text-white">"Founder's Circle"</span>.
                        </p>
                    </div>

                    {/* Benefits Grid */}
                    <div className="mb-12 border border-void-300 bg-void/30 p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl pointer-events-none" />
                        <div className="font-mono text-neon-cyan text-[10px] font-bold tracking-widest mb-6 opacity-60">
                            // PROTOCOL_PERKS // READ_ONLY
                        </div>
                        <div className="grid md:grid-cols-2 gap-6 font-mono text-xs text-[#E0E0E0]">
                            <div className="flex items-start gap-3">
                                <span className="text-neon-cyan">[+]</span>
                                <span>Accès prioritaire R&D</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-neon-cyan">[+]</span>
                                <span>Protocole Tactique (v1.0)</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-neon-cyan">[+]</span>
                                <span>Physical Founder ID Card</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-neon-cyan">[+]</span>
                                <span>Direct Node Support</span>
                            </div>
                        </div>
                    </div>

                    {/* Product Selector */}
                    <div className="mb-12 space-y-4">
                        <div className="flex items-center justify-between mb-4">
                            <div className="font-mono text-white text-[10px] font-bold tracking-widest uppercase opacity-60">
                                [ SELECT_MODE ]
                            </div>
                            <div className="font-mono text-cyan-400 text-[10px]">SUPPLY_OPTIMIZED</div>
                        </div>

                        {/* Monthly Option */}
                        <button
                            onClick={() => setSelectedOption('monthly')}
                            className={`w-full p-6 border group transition-all relative ${selectedOption === 'monthly'
                                ? 'border-neon-cyan bg-neon-cyan/5'
                                : 'border-void-300 hover:border-void-100 hover:bg-white/5'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="text-left">
                                    <div className="font-mono text-xs text-void-500 mb-1">MODE: RECURRING</div>
                                    <div className="font-sans text-xl text-white font-bold tracking-tight">
                                        SUPPLY MENSUEL
                                    </div>
                                    <div className="font-mono text-neon-cyan text-[10px] mt-2 tracking-widest">
                                        REDUCTION: 15% // AUTO-REFILL
                                    </div>
                                </div>
                                <div className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center transition-colors ${selectedOption === 'monthly' ? 'border-neon-cyan bg-neon-cyan' : 'border-void-300'
                                    }`}>
                                    {selectedOption === 'monthly' && (
                                        <div className="w-2 h-2 bg-void" />
                                    )}
                                </div>
                            </div>
                            {selectedOption === 'monthly' && (
                                <span className="absolute -left-[2px] top-1/2 -translate-y-1/2 w-[4px] h-12 bg-neon-cyan" />
                            )}
                        </button>

                        {/* Single Option */}
                        <button
                            onClick={() => setSelectedOption('single')}
                            className={`w-full p-6 border group transition-all relative ${selectedOption === 'single'
                                ? 'border-neon-cyan bg-neon-cyan/5'
                                : 'border-void-300 hover:border-void-100 hover:bg-white/5'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="text-left">
                                    <div className="font-mono text-xs text-void-500 mb-1">MODE: ONE_TIME</div>
                                    <div className="font-sans text-xl text-white font-bold tracking-tight">
                                        SUPPLY UNIQUE
                                    </div>
                                    <div className="font-mono text-void-500 text-[10px] mt-2 tracking-widest">
                                        STANDARD_ALLOCATION
                                    </div>
                                </div>
                                <div className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center transition-colors ${selectedOption === 'single' ? 'border-neon-cyan bg-neon-cyan' : 'border-void-300'
                                    }`}>
                                    {selectedOption === 'single' && (
                                        <div className="w-2 h-2 bg-void" />
                                    )}
                                </div>
                            </div>
                            {selectedOption === 'single' && (
                                <span className="absolute -left-[2px] top-1/2 -translate-y-1/2 w-[4px] h-12 bg-neon-cyan" />
                            )}
                        </button>
                    </div>

                    {/* Stats HUD - Interaction */}
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <span className="block font-mono text-void-500 text-[8px] uppercase">Batch Status</span>
                            <div className="flex items-center gap-2">
                                <SystemStatus status="ACTIVE" />
                                <span className="font-mono text-xs text-white">001.V-45</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="block font-mono text-void-500 text-[8px] uppercase">Allocated Units</span>
                            <span className="font-mono text-[10px] text-red-500 font-bold tracking-widest">CRITICAL SUPPLY &lt; 14%</span>
                        </div>
                    </div>

                    {/* CTA */}
                    <button className="w-full py-8 bg-white text-black font-mono text-sm font-black tracking-[0.3em] hover:bg-neon-cyan hover:scale-[1.01] transition-all duration-300 relative group overflow-hidden">
                        <span className="relative z-10">INITIALISER L'ORDRE</span>
                        <div className="absolute inset-x-0 bottom-0 h-1 bg-void/10 group-hover:bg-void/20 transition-colors" />
                    </button>

                    {/* Footer Note */}
                    <div className="mt-8 flex justify-center items-center gap-6 opacity-40">
                        <div className="font-mono text-[8px] text-white tracking-[0.2em] flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                            ENCRYPTED_AUTH
                        </div>
                        <div className="font-mono text-[8px] text-white tracking-[0.2em] flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                            FAST_DEPLOY
                        </div>
                        <div className="font-mono text-[8px] text-white tracking-[0.2em] flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-void-500 rounded-full" />
                            30D_GUARANTY
                        </div>
                    </div>
                </TacticalGlass>
            </div>
        </section>
    );
}

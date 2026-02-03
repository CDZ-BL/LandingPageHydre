'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

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

            <div className="relative z-10 w-[85%] max-w-[1400px] mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="border border-void-300 p-8 md:p-16"
                >
                    {/* Header */}
                    <div className="mb-12">
                        <span className="font-mono text-red-500 text-xs font-bold tracking-wider">
                            ACCÈS LIMITÉ
                        </span>
                        <h2 className="font-headline text-4xl md:text-5xl text-white font-bold tracking-tight mt-2 mb-6">
                            SÉCURISEZ VOTRE ALLOCATION.
                        </h2>
                        <p className="font-sans text-lg text-white leading-relaxed max-w-2xl">
                            Le Batch 001 est en quantité restreinte. Rejoindre AETHER aujourd&apos;hui, c&apos;est intégrer le &quot;Founder&apos;s Circle&quot;.
                        </p>
                    </div>

                    {/* Benefits */}
                    <div className="mb-12 border border-void-300 p-8">
                        <div className="font-mono text-neon-orange text-xs font-bold tracking-wider mb-6">
                            [FOUNDER&apos;S CIRCLE] — AVANTAGES
                        </div>
                        <div className="space-y-4 font-sans text-white">
                            <div className="flex items-start gap-3">
                                <span className="text-neon-orange text-xl font-bold">→</span>
                                <span>Accès prioritaire aux futures R&D</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-neon-orange text-xl font-bold">→</span>
                                <span>Protocole d&apos;hydratation tactique (PDF) inclus</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-neon-orange text-xl font-bold">→</span>
                                <span>Carte Founder&apos;s Edition numérotée</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-neon-orange text-xl font-bold">→</span>
                                <span>Support technique direct</span>
                            </div>
                        </div>
                    </div>

                    {/* Product Selector */}
                    <div className="mb-12 space-y-4">
                        <div className="font-mono text-white text-xs font-bold tracking-wider mb-4">
                            [SÉLECTION] — SUPPLY MODE
                        </div>

                        {/* Monthly Option */}
                        <button
                            onClick={() => setSelectedOption('monthly')}
                            className={`w-full p-6 border text-left transition-all ${selectedOption === 'monthly'
                                ? 'border-neon-orange bg-neon-orange/10'
                                : 'border-void-300 hover:border-void-100'
                                }`}
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="font-sans text-xl text-white font-semibold mb-2">
                                        SUPPLY MENSUEL
                                    </div>
                                    <div className="font-sans text-sm text-white">
                                        Abonnement — Smart Choice
                                    </div>
                                    <div className="font-mono text-neon-orange text-xs mt-3">
                                        Économisez 15% · Annulation à tout moment
                                    </div>
                                </div>
                                <div className={`w-6 h-6 border-2 rounded-full flex items-center justify-center ${selectedOption === 'monthly' ? 'border-neon-orange' : 'border-void-300'
                                    }`}>
                                    {selectedOption === 'monthly' && (
                                        <div className="w-3 h-3 bg-neon-orange rounded-full" />
                                    )}
                                </div>
                            </div>
                        </button>

                        {/* Single Option */}
                        <button
                            onClick={() => setSelectedOption('single')}
                            className={`w-full p-6 border text-left transition-all ${selectedOption === 'single'
                                ? 'border-neon-orange bg-neon-orange/10'
                                : 'border-void-300 hover:border-void-100'
                                }`}
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="font-sans text-xl text-white font-semibold mb-2">
                                        SUPPLY UNIQUE
                                    </div>
                                    <div className="font-sans text-sm text-white">
                                        One-off
                                    </div>
                                </div>
                                <div className={`w-6 h-6 border-2 rounded-full flex items-center justify-center ${selectedOption === 'single' ? 'border-neon-orange' : 'border-void-300'
                                    }`}>
                                    {selectedOption === 'single' && (
                                        <div className="w-3 h-3 bg-neon-orange rounded-full" />
                                    )}
                                </div>
                            </div>
                        </button>
                    </div>

                    {/* CTA */}
                    <button className="w-full py-6 bg-white text-black font-sans text-sm font-semibold tracking-widest hover:bg-neon-orange hover:text-white transition-all duration-300">
                        COMMANDER LE SYSTÈME
                    </button>

                    {/* Footer Note */}
                    <div className="mt-6 font-mono text-xs text-white text-center">
                        Livraison sécurisée. Paiement crypté. Garantie 30 jours.
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

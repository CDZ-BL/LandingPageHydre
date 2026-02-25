'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function TheClose() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus('submitting');
        // Simulate API delay
        setTimeout(() => {
            setStatus('success');
            setEmail('');
        }, 1500);
    };

    return (
        <section className="relative py-24 md:py-48 bg-black overflow-hidden group">
            {/* Ambient Background Glow - High Luminosity */}
            <div className="absolute inset-0 opacity-40 pointer-events-none transition-opacity duration-1000 group-hover:opacity-60">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-orange/30 blur-[150px] rounded-full mix-blend-screen animate-pulse-slow" />
            </div>

            {/* Machined Grid Background */}
            <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px',
                }}
            />

            <div className="relative z-10 w-[85%] max-w-[1400px] mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="relative overflow-hidden bg-void-100/40 backdrop-blur-2xl border border-white/10 rounded-none md:rounded-3xl shadow-[0_0_100px_rgba(255,107,0,0.25)] ring-1 ring-white/10"
                >
                    {/* Glass sheen */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        {/* LEFT PANEL: Data & Context */}
                        <div className="p-8 md:p-16 border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col justify-between relative">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 border border-neon-orange/50 bg-neon-orange/10 rounded-full mb-8">
                                    <div className="w-1.5 h-1.5 rounded-full bg-neon-orange animate-pulse" />
                                    <span className="font-mono text-[10px] text-neon-orange font-bold tracking-widest uppercase">
                                        Statut : Accès Ouvert
                                    </span>
                                </div>

                                <h2 className="font-headline text-h1 text-white font-bold leading-[0.9] tracking-widest mb-12">
                                    REJOIGNEZ LE<br />
                                    PROTOCOLE.
                                </h2>

                                {/* Benefits Matrix - Minimalist & Large */}
                                <div className="grid grid-cols-1 gap-6 font-mono text-sm tracking-widest">
                                    <div className="flex items-center gap-4 text-white hover:text-neon-orange transition-colors duration-300">
                                        <div className="w-2 h-2 rounded-full bg-neon-orange shadow-[0_0_10px_#FF6B00]" />
                                        <span className="font-bold">STATUT_CO_FONDATEUR</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-white hover:text-neon-orange transition-colors duration-300">
                                        <div className="w-2 h-2 rounded-full bg-neon-orange shadow-[0_0_10px_#FF6B00]" />
                                        <span className="font-bold">DROIT_VOTE_R&D</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-white hover:text-neon-orange transition-colors duration-300">
                                        <div className="w-2 h-2 rounded-full bg-neon-orange shadow-[0_0_10px_#FF6B00]" />
                                        <span className="font-bold">PROTOCOLES_TEST_GRATUITS</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 lg:mt-0 pt-8 border-t border-white/5 font-mono text-[10px] text-void-600 flex justify-between">
                                <span>NIVEAU_ACCREDITATION_ALFA</span>
                                <span>NOEUD : 884-299-X</span>
                            </div>
                        </div>

                        {/* RIGHT PANEL: Input Terminal */}
                        <div className="p-8 md:p-16 bg-black/20 relative flex flex-col justify-center">
                            <AnimatePresence mode="wait">
                                {status === 'success' ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="text-center py-12"
                                    >
                                        <div className="w-16 h-16 mx-auto mb-6 rounded-full border border-neon-orange/50 bg-neon-orange/10 flex items-center justify-center">
                                            <svg className="w-8 h-8 text-neon-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <h3 className="font-headline text-h3 text-white font-bold mb-2">ACCÈS AUTORISÉ</h3>
                                        <p className="font-mono text-xs text-void-500">VÉRIFIEZ VOS MESSAGES.</p>
                                    </motion.div>
                                ) : (
                                    <motion.form
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        onSubmit={handleSubmit}
                                        className="relative"
                                    >
                                        <div className="space-y-6">
                                            <div>
                                                <label htmlFor="email" className="font-mono text-[10px] text-void-500 tracking-widest uppercase ml-1 block mb-3">
                                                    Entrez Identification [Email]
                                                </label>
                                                <div className="relative group">
                                                    <div className="absolute inset-0 bg-neon-orange/20 blur transition-opacity duration-300 opacity-0 group-focus-within:opacity-100" />
                                                    <input
                                                        type="email"
                                                        id="email"
                                                        required
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        className="relative w-full bg-void-100/50 border border-white/10 text-white font-mono text-sm px-6 py-5 outline-none focus:border-neon-orange transition-all duration-300 placeholder:text-void-600 focus:bg-void-100"
                                                        placeholder="OPERATEUR@HYDRE.COM"
                                                    />
                                                    <div className="absolute top-0 right-0 bottom-0 w-1 bg-neon-orange transform scale-y-0 group-focus-within:scale-y-100 transition-transform duration-300 origin-bottom" />
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={status === 'submitting'}
                                                className="relative w-full group overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <div className="absolute inset-0 bg-white transition-transform duration-300 group-hover:translate-x-full" />
                                                <div className="absolute inset-0 bg-neon-orange -translate-x-full transition-transform duration-300 group-hover:translate-x-0" />

                                                <div className="relative py-6 flex items-center justify-center gap-3">
                                                    {status === 'submitting' ? (
                                                        <span className="font-mono text-xs font-bold tracking-[0.2em] animate-pulse text-black">
                                                            TRAITEMENT...
                                                        </span>
                                                    ) : (
                                                        <>
                                                            <span className="font-mono text-xs font-bold tracking-[0.2em] transition-colors duration-300 text-black group-hover:text-white">
                                                                INITIER_SEQUENCE
                                                            </span>
                                                            <svg className="w-4 h-4 transition-colors duration-300 text-black group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                            </svg>
                                                        </>
                                                    )}
                                                </div>
                                            </button>
                                        </div>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FounderCard3D } from '@/components/ui/FounderCard3D';

// ═══════════════════════════════════════════════════════════════
// R&D VOTE DATA
// ═══════════════════════════════════════════════════════════════
interface RDOption {
    id: string;
    label: string;
    subtitle: string;
    baseVotes: number;
    color: string;
}

const RD_OPTIONS: RDOption[] = [
    {
        id: 'sommeil',
        label: 'SOMMEIL',
        subtitle: 'Mélatonine vectorisée + Magnésium',
        baseVotes: 3421,
        color: '#818CF8', // indigo
    },
    {
        id: 'focus',
        label: 'FOCUS',
        subtitle: 'Nootropiques naturels',
        baseVotes: 2876,
        color: '#22D3EE', // cyan
    },
    {
        id: 'endurance',
        label: 'ENDURANCE',
        subtitle: 'Électrolytes renforcés V2',
        baseVotes: 2154,
        color: '#F59E0B', // amber
    },
    {
        id: 'recovery',
        label: 'RECOVERY',
        subtitle: 'Complexe anti-inflammatoire',
        baseVotes: 1549,
        color: '#34D399', // emerald
    },
];

const COMMUNITY_TARGET = 10000;
const COMMUNITY_CURRENT = 847;

// ═══════════════════════════════════════════════════════════════
// VOTE BAR COMPONENT
// ═══════════════════════════════════════════════════════════════
function VoteBar({
    option,
    totalVotes,
    userVote,
    onVote,
}: {
    option: RDOption;
    totalVotes: number;
    userVote: string | null;
    onVote: (id: string) => void;
}) {
    const percentage = Math.round((option.baseVotes / totalVotes) * 100);
    const isSelected = userVote === option.id;
    const hasVoted = userVote !== null;

    return (
        <motion.button
            onClick={() => onVote(option.id)}
            className={`w-full text-left px-4 py-3 border transition-all duration-300 group ${isSelected
                ? 'border-white/20 bg-white/[0.04]'
                : 'border-void-700/50 hover:border-void-500 hover:bg-white/[0.02]'
                }`}
            whileHover={{ scale: 1.005 }}
            whileTap={{ scale: 0.995 }}
        >
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                    <div
                        className={`w-2.5 h-2.5 border-[1.5px] rounded-full transition-all duration-300 ${isSelected ? 'scale-110' : 'border-void-500'
                            }`}
                        style={isSelected ? { backgroundColor: option.color, borderColor: option.color } : {}}
                    />
                    <span className="font-mono text-xs text-white tracking-widest">{option.label}</span>
                    <span className="font-mono text-[10px] text-gray-600">— {option.subtitle}</span>
                </div>
                <span
                    className={`font-mono text-xs tabular-nums transition-opacity duration-300 ${hasVoted ? 'opacity-100' : 'opacity-0'}`}
                    style={{ color: option.color }}
                >
                    {percentage}%
                </span>
            </div>

            {/* Vote bar */}
            <div className="h-[3px] bg-void-800/60 w-full overflow-hidden rounded-full ml-[22px]" style={{ width: 'calc(100% - 22px)' }}>
                <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: option.color }}
                    initial={{ width: 0 }}
                    animate={{ width: hasVoted ? `${percentage}%` : '0%' }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                />
            </div>
        </motion.button>
    );
}

// ═══════════════════════════════════════════════════════════════
// COMMUNITY COUNTER
// ═══════════════════════════════════════════════════════════════
function CommunityCounter() {
    const percentage = (COMMUNITY_CURRENT / COMMUNITY_TARGET) * 100;

    return (
        <div className="border border-void-700/50 p-5">
            <div className="flex items-baseline justify-between mb-3">
                <div className="flex items-baseline gap-2">
                    <motion.span
                        className="font-mono text-2xl md:text-3xl text-white tabular-nums"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: false }}
                    >
                        {COMMUNITY_CURRENT.toLocaleString('fr-FR')}
                    </motion.span>
                    <span className="font-mono text-sm text-gray-600">/</span>
                    <span className="font-mono text-sm text-gray-500">
                        {COMMUNITY_TARGET.toLocaleString('fr-FR')}
                    </span>
                    <span className="font-mono text-[10px] text-gray-600 tracking-wider ml-2">FONDATEURS</span>
                </div>
                <span className="font-mono text-[10px] text-gray-600 tracking-wider">AN 1</span>
            </div>

            {/* Progress bar */}
            <div className="h-1 bg-void-800/60 w-full overflow-hidden rounded-full">
                <motion.div
                    className="h-full rounded-full bg-cyan-500"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${percentage}%` }}
                    viewport={{ once: false }}
                    transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                        boxShadow: '0 0 10px rgba(34, 211, 238, 0.3)',
                    }}
                />
            </div>

            <div className="flex justify-end mt-2">
                <span className="font-mono text-[10px] text-gray-600 tracking-wider">
                    {(COMMUNITY_TARGET - COMMUNITY_CURRENT).toLocaleString('fr-FR')} RESTANTES
                </span>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
export function Alliance() {
    const [userVote, setUserVote] = useState<string | null>(null);

    // Load vote from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('aether-rd-vote');
        if (saved) setUserVote(saved);
    }, []);

    const handleVote = (id: string) => {
        // Toggle logic: click same = unvote, click different = change vote
        const newVote = userVote === id ? null : id;
        setUserVote(newVote);
        if (newVote) {
            localStorage.setItem('aether-rd-vote', newVote);
        } else {
            localStorage.removeItem('aether-rd-vote');
        }
    };

    const totalVotes = RD_OPTIONS.reduce((sum, opt) => sum + opt.baseVotes, 0);

    return (
        <section className="relative py-32 md:py-40 bg-black text-white">
            {/* Background */}
            <div
                className="absolute inset-0 opacity-100 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse at center, #111111 0%, #050505 50%, #050505 100%)',
                }}
            />

            <div className="relative z-10 w-[85%] max-w-[1400px] mx-auto">

                {/* ─── HEADER ─── */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: '-100px' }}
                    transition={{ duration: 0.8 }}
                    className="mb-12"
                >
                    <span className="font-mono text-[10px] text-cyan-400/70 tracking-widest mb-3 block">
                        // BATCH 001 : ACCÈS PIONNIER
                    </span>
                    <h2 className="font-sans text-3xl md:text-4xl lg:text-5xl text-white font-bold tracking-widest mb-4">
                        CONSTRUISONS ENSEMBLE LA MARQUE QUE L'INDUSTRIE N'A JAMAIS OSÉ FAIRE.
                    </h2>
                </motion.div>

                {/* ─── COMMUNITY COUNTER ─── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: '-80px' }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="mb-16"
                >
                    <CommunityCounter />
                </motion.div>

                {/* ─── TWO-COLUMN: VOTE + FOUNDER CARD ─── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                    {/* LEFT: R&D Vote System */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false, margin: '-100px' }}
                        transition={{ duration: 0.8 }}
                    >
                        <h3 className="font-mono text-[10px] text-amber-500/70 tracking-widest mb-4">
                            [ VOTE EN COURS : DEVELOPPEMENT GAMME ]
                        </h3>

                        <div className="space-y-2">
                            {RD_OPTIONS.map((option) => (
                                <VoteBar
                                    key={option.id}
                                    option={option}
                                    totalVotes={totalVotes}
                                    userVote={userVote}
                                    onVote={handleVote}
                                />
                            ))}
                        </div>

                        <AnimatePresence>
                            {userVote && (
                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="font-mono text-xs text-cyan-400/60 mt-4 tracking-wider"
                                >
                                    ✓ VOTE ENREGISTRÉ — {RD_OPTIONS.find((o) => o.id === userVote)?.label}
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* RIGHT: Founder Card + Features */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false, margin: '-100px' }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="space-y-8"
                    >
                        {/* 3D Card */}
                        <div className="h-[60vh] md:h-[65vh] w-full relative">
                            <FounderCard3D />
                        </div>

                        {/* Features */}
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="mt-[7px] w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                                <div>
                                    <h4 className="font-mono text-xs text-white tracking-widest">VOUS VALIDEZ</h4>
                                    <p className="font-mono text-[11px] text-gray-500 mt-1">
                                        Prototypes des futures saveurs (Samples gratuits).
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="mt-[7px] w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                                <div>
                                    <h4 className="font-mono text-xs text-white tracking-widest">VOUS DÉCIDEZ</h4>
                                    <p className="font-mono text-[11px] text-gray-500 mt-1">
                                        Priorités R&D (cf. Vote ci-contre).
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="mt-[7px] w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                                <div>
                                    <h4 className="font-mono text-xs text-white tracking-widest">VOUS SAVEZ</h4>
                                    <p className="font-mono text-[11px] text-gray-500 mt-1">
                                        Feuilles de route 6 mois avant le public.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <p className="font-mono text-[11px] text-gray-600 italic border-l border-void-600 pl-4 py-1">
                            "Construisons la marque que l'industrie n'a jamais osé faire."
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

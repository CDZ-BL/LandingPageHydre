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
            className="w-full text-left relative group"
            whileHover={{ scale: 1.005 }}
            whileTap={{ scale: 0.995 }}
        >
            {/* ── External diffuse glow BEHIND the button (like Hero3D) ── */}
            <div
                className="absolute -inset-3 rounded-lg pointer-events-none transition-all duration-700"
                style={{
                    background: isSelected ? option.color : 'transparent',
                    opacity: isSelected ? 0.3 : 0,
                    filter: 'blur(40px)',
                }}
            />

            {/* ── Button container with external box-shadow glow ── */}
            <div
                className="relative border px-4 py-3 transition-all duration-500 bg-black/90"
                style={{
                    borderColor: isSelected ? `${option.color}50` : 'rgba(255,255,255,0.06)',
                    boxShadow: isSelected
                        ? `0 0 40px ${option.color}40, 0 0 80px ${option.color}20`
                        : 'none',
                }}
            >
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <div
                            className={`w-2.5 h-2.5 border-[1.5px] rounded-full transition-all duration-500 ${isSelected ? 'scale-110' : 'border-void-500'
                                }`}
                            style={isSelected ? {
                                backgroundColor: option.color,
                                borderColor: option.color,
                                boxShadow: `0 0 8px ${option.color}80`,
                            } : {}}
                        />
                        <span className="font-mono text-xs text-white tracking-widest">{option.label}</span>
                        <span className="hidden sm:inline font-mono text-[10px] text-white/30">— {option.subtitle}</span>
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
                    <span className="font-mono text-sm text-white/30">/</span>
                    <span className="font-mono text-sm text-white/40">
                        {COMMUNITY_TARGET.toLocaleString('fr-FR')}
                    </span>
                    <span className="font-mono text-[10px] text-white/30 tracking-wider ml-2">FONDATEURS</span>
                </div>
                <span className="font-mono text-[10px] text-white/30 tracking-wider">AN 1</span>
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
                <span className="font-mono text-[10px] text-white/25 tracking-wider">
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
        <section className="relative py-16 md:py-32 lg:py-40 bg-black text-white">
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
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.8 }}
                    className="mb-12 max-w-3xl"
                >
                    <span className="font-mono text-[10px] text-white/25 tracking-[0.3em] mb-5 block">

                    </span>
                    <h2 className="font-headline text-h1 text-white font-bold tracking-wide leading-[1.05] mb-4">
                        Construisons ensemble.<br />
                        <span className="text-[#E6DCC8] italic font-light tracking-normal">La marque que l'industrie n'a jamais osé faire.</span>
                    </h2>
                    <p className="font-mono text-sm text-white/50 leading-relaxed tracking-wide mt-4">
                        Vous n'êtes pas un consommateur. Vous êtes co-fondateur. Votez, testez, décidez.
                    </p>
                </motion.div>

                {/* ─── UNIFIED BLOCK: STATS + VOTE (Left) | CARD (Right) ─── */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8 xl:gap-12 items-center">

                    {/* LEFT: Community Counter + Vote System + Features */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false, margin: '-100px' }}
                        transition={{ duration: 0.8 }}
                        className="space-y-6"
                    >
                        {/* Community Counter */}
                        <CommunityCounter />

                        {/* Vote Header */}
                        <h3 className="font-mono text-[10px] text-neon-orange/70 tracking-widest">
                            [ VOTE EN COURS : DEVELOPPEMENT GAMME ]
                        </h3>

                        {/* Vote Bars */}
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
                                    className="font-mono text-xs text-[#E6DCC8]/70 tracking-wider"
                                >
                                    ✓ VOTE ENREGISTRÉ — {RD_OPTIONS.find((o) => o.id === userVote)?.label}
                                </motion.p>
                            )}
                        </AnimatePresence>

                        {/* Features */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/[0.06]">
                            <div className="flex items-start gap-2">
                                <div className="mt-[5px] w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                                <div>
                                    <h4 className="font-mono text-[10px] text-white tracking-widest">VOUS VALIDEZ</h4>
                                    <p className="font-mono text-[10px] text-white/40 mt-1">
                                        Prototypes des futures saveurs (Samples gratuits).
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-2">
                                <div className="mt-[5px] w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                                <div>
                                    <h4 className="font-mono text-[10px] text-white tracking-widest">VOUS DÉCIDEZ</h4>
                                    <p className="font-mono text-[10px] text-white/40 mt-1">
                                        Priorités R&D (cf. Vote ci-contre).
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-2">
                                <div className="mt-[5px] w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                                <div>
                                    <h4 className="font-mono text-[10px] text-white tracking-widest">VOUS SAVEZ</h4>
                                    <p className="font-mono text-[10px] text-white/40 mt-1">
                                        Feuilles de route 6 mois avant le public.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* RIGHT: Founder Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false, margin: '-100px' }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <div className="h-[50vh] sm:h-[60vh] md:h-[75vh] w-full relative">
                            <FounderCard3D />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

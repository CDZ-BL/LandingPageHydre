'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FounderCard3D } from '@/components/ui/FounderCard3D';
import { useHydreStore } from '@/lib/store';

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
        id: 'Fruits des bois',
        label: 'FRUITS DES BOIS',
        subtitle: 'Framboise · Myrtille · Cassis',
        baseVotes: 0,
        color: '#C084FC', // purple
    },
    {
        id: 'Melon HoneyDew',
        label: 'MELON HONEYDEW',
        subtitle: 'Melon d\'eau · Fraîcheur douce',
        baseVotes: 0,
        color: '#34D399', // emerald
    },
    {
        id: 'Poire',
        label: 'POIRE',
        subtitle: 'Poire Williams · Notes florales',
        baseVotes: 0,
        color: '#FDE68A', // amber-pale
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
    registeredVote,
    onVote,
}: {
    option: RDOption;
    totalVotes: number;
    /** Currently highlighted selection (always mutable) */
    userVote: string | null;
    /** The vote that has been registered/confirmed in DB */
    registeredVote: string | null;
    onVote: (id: string) => void;
}) {
    const percentage = Math.round((option.baseVotes / totalVotes) * 100);
    const isSelected = userVote === option.id;
    const isRegistered = registeredVote === option.id;
    // Show results whenever user has either selected or already voted
    const hasVoted = userVote !== null || registeredVote !== null;

    return (
        <motion.button
            onClick={() => onVote(option.id)}
            className="w-full text-left relative group"
            whileHover={{ scale: 1.005 }}
            whileTap={{ scale: 0.995 }}
        >
            {/* ── External diffuse glow ── */}
            <div
                className="absolute -inset-3 rounded-lg pointer-events-none transition-all duration-700"
                style={{
                    background: isSelected ? option.color : 'transparent',
                    opacity: isSelected ? 0.3 : 0,
                    filter: 'blur(40px)',
                }}
            />

            {/* ── Button container ── */}
            <div
                className="relative border px-4 py-3 transition-all duration-500 bg-[var(--bg-primary)]/90"
                style={{
                    borderColor: isSelected
                        ? `${option.color}50`
                        : isRegistered
                            ? `${option.color}30`
                            : 'rgba(255,255,255,0.06)',
                    boxShadow: isSelected
                        ? `0 0 40px ${option.color}40, 0 0 80px ${option.color}20`
                        : isRegistered
                            ? `0 0 20px ${option.color}20`
                            : 'none',
                }}
            >
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        {/* Dot: filled if selected, ring if registered, empty otherwise */}
                        <div className="relative flex items-center justify-center w-2.5 h-2.5">
                            <div
                                className="w-2.5 h-2.5 border-[1.5px] rounded-full transition-all duration-500"
                                style={isSelected ? {
                                    backgroundColor: option.color,
                                    borderColor: option.color,
                                    boxShadow: `0 0 8px ${option.color}80`,
                                    transform: 'scale(1.1)',
                                } : isRegistered ? {
                                    // Registered but not currently selected: outlined ring in accent color
                                    borderColor: option.color,
                                    backgroundColor: `${option.color}30`,
                                } : {
                                    borderColor: 'rgba(255,255,255,0.2)',
                                }}
                            />
                            {/* Pulsing ring only for the registered (confirmed) vote */}
                            {isRegistered && !isSelected && (
                                <motion.div
                                    className="absolute inset-0 rounded-full border"
                                    style={{ borderColor: option.color }}
                                    animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
                                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                                />
                            )}
                        </div>
                        <span className="font-mono text-xs text-[var(--text-primary)] tracking-widest">{option.label}</span>
                        <span className="hidden sm:inline font-mono text-[10px] text-[var(--text-muted)]">— {option.subtitle}</span>
                        {isRegistered && (
                            <span
                                className="font-mono text-[9px] tracking-widest px-1.5 py-0.5 rounded-sm"
                                style={{
                                    color: option.color,
                                    backgroundColor: `${option.color}15`,
                                    border: `1px solid ${option.color}35`,
                                }}
                            >
                                ACTIF
                            </span>
                        )}
                    </div>
                    <span
                        className={`font-mono text-xs tabular-nums transition-opacity duration-300 ${hasVoted ? 'opacity-100' : 'opacity-0'}`}
                        style={{ color: option.color }}
                    >
                        {percentage}%
                    </span>
                </div>

                {/* Vote bar */}
                <div className="h-[3px] bg-[var(--bg-secondary)] w-full overflow-hidden rounded-full ml-[22px]" style={{ width: 'calc(100% - 22px)' }}>
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
        <div className="border border-[var(--stroke)] p-5">
            <div className="flex items-baseline justify-between mb-3">
                <div className="flex items-baseline gap-2">
                    <motion.span
                        className="font-mono text-2xl md:text-3xl text-[var(--text-primary)] tabular-nums"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: false }}
                    >
                        {COMMUNITY_CURRENT.toLocaleString('fr-FR')}
                    </motion.span>
                    <span className="font-mono text-sm text-[var(--text-muted)]">/</span>
                    <span className="font-mono text-sm text-[var(--text-muted)]">
                        {COMMUNITY_TARGET.toLocaleString('fr-FR')}
                    </span>
                    <span className="font-mono text-[10px] text-[var(--text-muted)] tracking-wider ml-2">FONDATEURS</span>
                </div>
                <span className="font-mono text-[10px] text-[var(--text-muted)] tracking-wider">AN 1</span>
            </div>

            {/* Progress bar */}
            <div className="h-1 bg-[var(--bg-secondary)] w-full overflow-hidden rounded-full">
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
                <span className="font-mono text-[10px] text-[var(--text-muted)] tracking-wider">
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
    const { openAuthModal } = useHydreStore();
    
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [submittedVote, setSubmittedVote] = useState<string | null>(null);
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [isVoting, setIsVoting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load initial data
    useEffect(() => {
        // Optimistic UI for unauthenticated return
        const saved = localStorage.getItem('aether-rd-vote');
        if (saved) {
            setSubmittedVote(saved);
        }

        // Fetch live active campaigns and percentages
        fetch('/api/votes')
            .then(res => res.json())
            .then(data => {
                if (data.campaigns) {
                    setCampaigns(data.campaigns);
                }
            })
            .catch(err => console.error('Failed to load campaigns', err));
    }, []);

    const handleSelectOption = (id: string) => {
        // Always allow changing the selection — even after a vote has been registered
        setSelectedOption(prev => prev === id ? null : id);
        setError(null);
    };

    const handleSubmitVote = useCallback(async () => {
        if (!selectedOption) return;
        if (selectedOption === submittedVote) return;

        setIsVoting(true);
        setError(null);

        try {
            // Use the same token source as the rest of the app (account page, stats API, etc.)
            const token = typeof window !== 'undefined'
                ? localStorage.getItem('hydre_auth_token')
                : null;

            if (!token) {
                openAuthModal('login');
                setError('Authentification requise — votre vote ne peut être enregistré qu\'auprès d\'un compte fondateur validé.');
                setIsVoting(false);
                return;
            }

            const activeCampaign = campaigns[0];

            if (!activeCampaign?.id) {
                setError('Aucune campagne de vote active pour le moment.');
                setIsVoting(false);
                return;
            }

            // Use PATCH to change an existing vote, POST for a first-time vote
            const method = submittedVote ? 'PATCH' : 'POST';

            const res = await fetch('/api/votes', {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    campaignId: activeCampaign.id,
                    selectedOption,
                })
            });

            if (!res.ok) {
                const errData = await res.json();
                if (res.status === 409) {
                    // Already voted — switch to PATCH on next attempt
                    setSubmittedVote(selectedOption);
                    localStorage.setItem('aether-rd-vote', selectedOption);
                } else if (res.status === 401) {
                    openAuthModal('login');
                    setError('Authentification requise — votre vote ne peut être enregistré qu\'auprès d\'un compte fondateur validé.');
                } else {
                    setError(errData.error || 'Erreur lors de l\'envoi du vote');
                }
            } else {
                setSubmittedVote(selectedOption);
                localStorage.setItem('aether-rd-vote', selectedOption);
            }
        } catch (err) {
            console.error(err);
            setError('Erreur réseau. Veuillez réessayer.');
        } finally {
            setIsVoting(false);
        }
    }, [selectedOption, submittedVote, campaigns, openAuthModal]);

    const totalVotes = RD_OPTIONS.reduce((sum, opt) => sum + opt.baseVotes, 0);

    return (
        <section className="relative py-16 md:py-32 lg:py-40 bg-[var(--bg-primary)] text-[var(--text-primary)]">
            {/* Background */}
            <div
                className="absolute inset-0 opacity-100 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse at center, var(--bg-secondary) 0%, var(--bg-primary) 50%, var(--bg-primary) 100%)',
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
                    <span className="font-mono text-[10px] text-[var(--text-muted)] tracking-[0.3em] mb-5 block">

                    </span>
                    <h2 className="font-headline text-h1 text-[var(--text-primary)] font-bold tracking-wide leading-[1.05] mb-4">
                        Construisons ensemble.<br />
                        <span className="text-[var(--text-primary)] italic font-light tracking-normal">La marque que l'industrie n'a jamais osé faire.</span>
                    </h2>
                    <p className="font-mono text-sm text-[var(--text-tertiary)] leading-relaxed tracking-wide mt-4">
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
                            [ VOTE EN COURS : QUEL SERA LE PROCHAIN NECTAR ]
                        </h3>

                        {/* Vote Bars */}
                        <div className="space-y-2">
                            {RD_OPTIONS.map((option) => (
                                <VoteBar
                                    key={option.id}
                                    option={option}
                                    totalVotes={totalVotes}
                                    userVote={selectedOption}
                                    registeredVote={submittedVote}
                                    onVote={handleSelectOption}
                                />
                            ))}
                        </div>

                        {/* Submit Vote Button & Status */}
                        <div className="pt-2 space-y-3">
                            {error && (
                                <p className="font-mono text-[10px] text-red-500 tracking-widest uppercase">
                                    ! {error}
                                </p>
                            )}

                            {/* Registered vote confirmation — always visible when a vote exists */}
                            <AnimatePresence mode="wait">
                                {submittedVote && (() => {
                                    const registeredOpt = RD_OPTIONS.find(o => o.id === submittedVote);
                                    return (
                                        <motion.div
                                            key={submittedVote}
                                            initial={{ opacity: 0, y: 6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -4 }}
                                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                                            className="flex items-center gap-2"
                                        >
                                            <span className="font-mono text-[10px] text-[var(--text-muted)] tracking-widest">✓ VOTE ENREGISTRÉ</span>
                                            <span
                                                className="font-mono text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-sm"
                                                style={{
                                                    color: registeredOpt?.color,
                                                    backgroundColor: `${registeredOpt?.color}18`,
                                                    border: `1px solid ${registeredOpt?.color}40`,
                                                }}
                                            >
                                                {registeredOpt?.label}
                                            </span>
                                        </motion.div>
                                    );
                                })()}
                            </AnimatePresence>

                            {/* Validate button — visible whenever selection differs from registered vote */}
                            <AnimatePresence>
                                {selectedOption && selectedOption !== submittedVote && (
                                    <motion.button
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                        onClick={handleSubmitVote}
                                        disabled={isVoting}
                                        className="w-full relative group overflow-hidden border border-neon-orange/30 bg-neon-orange/5 hover:bg-neon-orange/10 
                                                   transition-all duration-300 py-3 uppercase font-mono text-xs tracking-[0.2em] text-neon-orange"
                                    >
                                        <div className="absolute inset-0 bg-neon-orange/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        <span className="relative z-10 font-bold flex items-center justify-center gap-2">
                                            {isVoting ? (
                                                <span className="w-3 h-3 border-2 border-neon-orange/30 border-t-neon-orange rounded-full animate-spin" />
                                            ) : submittedVote ? (
                                                'Modifier le vote'
                                            ) : (
                                                'Valider le vote'
                                            )}
                                        </span>
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[var(--stroke)]">
                            <div className="flex items-start gap-2">
                                <div className="mt-[5px] w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                                <div>
                                    <h4 className="font-mono text-[10px] text-[var(--text-primary)] tracking-widest">VOUS VALIDEZ</h4>
                                    <p className="font-mono text-[10px] text-[var(--text-muted)] mt-1">
                                        Prototypes des futures saveurs (Samples gratuits).
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-2">
                                <div className="mt-[5px] w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                                <div>
                                    <h4 className="font-mono text-[10px] text-[var(--text-primary)] tracking-widest">VOUS DÉCIDEZ</h4>
                                    <p className="font-mono text-[10px] text-[var(--text-muted)] mt-1">
                                        Priorités R&D (cf. Vote ci-contre).
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-2">
                                <div className="mt-[5px] w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                                <div>
                                    <h4 className="font-mono text-[10px] text-[var(--text-primary)] tracking-widest">VOUS SAVEZ</h4>
                                    <p className="font-mono text-[10px] text-[var(--text-muted)] mt-1">
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

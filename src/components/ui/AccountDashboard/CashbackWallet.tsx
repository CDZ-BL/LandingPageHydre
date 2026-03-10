'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// ── Types ────────────────────────────────────────────────────

interface CashbackTransaction {
    id: string;
    type: 'purchase_self_cashback' | 'referral_cashback' | 'redemption' | 'commission_withdrawal';
    amountCents: number;
    hasOrder: boolean;
    createdAt: string;
    details: {
        rate: number | null;
        orderTotalCents: number | null;
    };
}

interface CashbackData {
    balanceCents: number;
    lifetimeEarnedCents: number;
    lifetimeSpentCents: number;
}

interface CommissionData {
    balanceCents: number;
    lifetimeEarnedCents: number;
    lifetimeWithdrawnCents: number;
}

interface CashbackWalletProps {
    cashback: CashbackData;
    commission: CommissionData;
}

// ── Helpers ──────────────────────────────────────────────────

const formatEuro = (cents: number): string => {
    const euros = Math.abs(cents) / 100;
    const prefix = cents < 0 ? '-' : '';
    return `${prefix}${euros.toFixed(2)} €`;
};

const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

const TX_LABELS: Record<string, string> = {
    purchase_self_cashback: 'Cashback sur votre achat',
    referral_cashback: 'Commission parrainage',
    redemption: 'Crédit utilisé',
    commission_withdrawal: 'Retrait commission',
};

const TX_ICONS: Record<string, string> = {
    purchase_self_cashback: '↩',
    referral_cashback: '👥',
    redemption: '🛒',
    commission_withdrawal: '🏦',
};

// ── Component ────────────────────────────────────────────────

export const CashbackWallet = ({ cashback, commission }: CashbackWalletProps) => {
    const [transactions, setTransactions] = useState<CashbackTransaction[]>([]);
    const [isLoadingTx, setIsLoadingTx] = useState(false);
    const [txError, setTxError] = useState<string | null>(null);

    // Fetch transaction history
    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                setIsLoadingTx(true);
                const token = typeof window !== 'undefined'
                    ? localStorage.getItem('hydre_auth_token')
                    : null;

                if (!token) return;

                const res = await fetch('/api/account/wallet?limit=20', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) throw new Error('Failed to fetch');

                const data = await res.json();
                setTransactions(data.transactions || []);
            } catch {
                setTxError('Impossible de charger l\'historique');
            } finally {
                setIsLoadingTx(false);
            }
        };

        fetchTransactions();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.04 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 4 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="space-y-6"
        >
            {/* ━━━ SECTION 1: Cashback (Store Credit) ━━━ */}
            <div
                className={cn(
                    'rounded-lg border border-white/[0.06] bg-white/[0.03] backdrop-blur',
                    'p-6 md:p-8'
                )}
            >
                <h2 className="text-xl font-headline font-bold uppercase tracking-[0.2em] text-white mb-6">
                    CAGNOTTE
                </h2>

                {/* Cashback balance */}
                <div className="mb-5 p-5 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                    <p className="text-[10px] font-mono tracking-[0.15em] text-white/40 uppercase mb-2">
                        Solde disponible
                    </p>
                    <p
                        className={cn(
                            'text-3xl md:text-4xl font-headline font-bold',
                            'bg-gradient-to-r from-[#E6DCC8] via-[#FF6B00] to-[#E6DCC8]',
                            'bg-clip-text text-transparent'
                        )}
                    >
                        {formatEuro(cashback.balanceCents)}
                    </p>
                    <p className="text-[10px] font-mono tracking-[0.1em] text-white/30 mt-2">
                        Utilisable uniquement sur votre prochain achat
                    </p>
                </div>

                {/* Cashback stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="px-3 py-2.5 rounded bg-white/[0.02] border border-white/[0.04]">
                        <p className="text-[10px] font-mono tracking-[0.15em] text-white/40 uppercase mb-1">
                            Total gagné
                        </p>
                        <p
                            className={cn(
                                'text-base font-headline font-bold',
                                'bg-gradient-to-r from-green-400/80 to-emerald-400/70',
                                'bg-clip-text text-transparent'
                            )}
                        >
                            +{formatEuro(cashback.lifetimeEarnedCents)}
                        </p>
                    </div>

                    <div className="px-3 py-2.5 rounded bg-white/[0.02] border border-white/[0.04]">
                        <p className="text-[10px] font-mono tracking-[0.15em] text-white/40 uppercase mb-1">
                            Total utilisé
                        </p>
                        <p className="text-base font-headline font-bold text-white/60">
                            {formatEuro(cashback.lifetimeSpentCents)}
                        </p>
                    </div>
                </div>

                {/* Info banner */}
                <div className="px-4 py-3 rounded border border-[#FF6B00]/20 bg-[#FF6B00]/[0.04]">
                    <p className="text-[11px] font-mono text-[#FF6B00]/80 leading-relaxed">
                        <span className="font-bold">5% de cashback à vie</span> sur chacun de
                        vos achats — utilisable comme crédit boutique.
                    </p>
                </div>
            </div>

            {/* ━━━ SECTION 2: Commission (Withdrawable) ━━━ */}
            <div
                className={cn(
                    'rounded-lg border border-emerald-500/[0.12] bg-emerald-500/[0.02] backdrop-blur',
                    'p-6 md:p-8'
                )}
            >
                <h2 className="text-xl font-headline font-bold uppercase tracking-[0.2em] text-white mb-6">
                    COMMISSIONS
                </h2>

                {/* Commission balance */}
                <div className="mb-5 p-5 rounded-lg bg-white/[0.02] border border-emerald-500/[0.12]">
                    <p className="text-[10px] font-mono tracking-[0.15em] text-white/40 uppercase mb-2">
                        Solde retirable
                    </p>
                    <p
                        className={cn(
                            'text-3xl md:text-4xl font-headline font-bold',
                            'bg-gradient-to-r from-emerald-300 via-green-400 to-emerald-300',
                            'bg-clip-text text-transparent'
                        )}
                    >
                        {formatEuro(commission.balanceCents)}
                    </p>
                    <p className="text-[10px] font-mono tracking-[0.1em] text-emerald-400/40 mt-2">
                        Retirable sur votre compte bancaire
                    </p>
                </div>

                {/* Commission stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="px-3 py-2.5 rounded bg-white/[0.02] border border-emerald-500/[0.08]">
                        <p className="text-[10px] font-mono tracking-[0.15em] text-white/40 uppercase mb-1">
                            Total gagné
                        </p>
                        <p
                            className={cn(
                                'text-base font-headline font-bold',
                                'bg-gradient-to-r from-emerald-300/80 to-green-400/70',
                                'bg-clip-text text-transparent'
                            )}
                        >
                            +{formatEuro(commission.lifetimeEarnedCents)}
                        </p>
                    </div>

                    <div className="px-3 py-2.5 rounded bg-white/[0.02] border border-emerald-500/[0.08]">
                        <p className="text-[10px] font-mono tracking-[0.15em] text-white/40 uppercase mb-1">
                            Total retiré
                        </p>
                        <p className="text-base font-headline font-bold text-white/60">
                            {formatEuro(commission.lifetimeWithdrawnCents)}
                        </p>
                    </div>
                </div>

                {/* Info banner */}
                <div className="px-4 py-3 rounded border border-emerald-500/20 bg-emerald-500/[0.04]">
                    <p className="text-[11px] font-mono text-emerald-400/80 leading-relaxed">
                        <span className="font-bold">5% de commission à vie</span> sur chaque achat
                        de vos filleuls — retirable en argent réel.
                    </p>
                </div>
            </div>

            {/* ━━━ SHARED TRANSACTION HISTORY ━━━ */}
            <div
                className={cn(
                    'rounded-lg border border-white/[0.06] bg-white/[0.03] backdrop-blur',
                    'p-6 md:p-8'
                )}
            >
                <p className="text-[10px] font-mono tracking-[0.15em] text-white/40 uppercase mb-4">
                    Historique des transactions
                </p>

                {isLoadingTx ? (
                    <div className="py-6 text-center">
                        <div className="w-6 h-6 border border-white/[0.15] border-t-[#FF6B00] rounded-full animate-spin mx-auto" />
                    </div>
                ) : txError ? (
                    <p className="text-xs font-mono text-white/40 text-center py-4">
                        {txError}
                    </p>
                ) : transactions.length > 0 ? (
                    <motion.div
                        className="space-y-2"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {transactions.map((tx) => (
                            <motion.div
                                key={tx.id}
                                variants={itemVariants}
                                className={cn(
                                    'flex items-center justify-between gap-3',
                                    'px-4 py-3 rounded',
                                    'bg-white/[0.02] border',
                                    tx.type === 'referral_cashback' || tx.type === 'commission_withdrawal'
                                        ? 'border-emerald-500/[0.08]'
                                        : 'border-white/[0.04]',
                                    'hover:bg-white/[0.04] transition-colors duration-300'
                                )}
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <span className="text-sm flex-shrink-0">
                                        {TX_ICONS[tx.type] || '•'}
                                    </span>
                                    <div className="min-w-0">
                                        <p className="text-xs font-mono text-white/70 truncate">
                                            {TX_LABELS[tx.type] || tx.type}
                                        </p>
                                        <p className="text-[10px] font-mono text-white/30 mt-0.5">
                                            {formatDate(tx.createdAt)}
                                        </p>
                                    </div>
                                </div>

                                <p
                                    className={cn(
                                        'text-sm font-mono font-bold flex-shrink-0',
                                        tx.amountCents >= 0
                                            ? tx.type === 'referral_cashback'
                                                ? 'text-emerald-400/90'
                                                : 'text-green-400/90'
                                            : 'text-red-400/80'
                                    )}
                                >
                                    {tx.amountCents >= 0 ? '+' : ''}
                                    {formatEuro(tx.amountCents)}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <div className="py-6 text-center">
                        <p className="text-sm font-mono text-white/40 mb-1">
                            Aucune transaction
                        </p>
                        <p className="text-[10px] font-mono text-white/25">
                            Votre cagnotte et vos commissions se remplissent automatiquement
                        </p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

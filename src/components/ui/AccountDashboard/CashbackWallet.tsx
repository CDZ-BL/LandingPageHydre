'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// ── Types ────────────────────────────────────────────────────

interface CashbackTransaction {
    id: string;
    type: 'purchase_self_cashback' | 'referral_cashback' | 'redemption';
    amountCents: number;
    hasOrder: boolean;
    createdAt: string;
    details: {
        rate: number | null;
        orderTotalCents: number | null;
    };
}

interface WalletData {
    balanceCents: number;
    lifetimeEarnedCents: number;
    lifetimeSpentCents: number;
}

interface CashbackWalletProps {
    wallet: WalletData;
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
};

const TX_ICONS: Record<string, string> = {
    purchase_self_cashback: '↩',
    referral_cashback: '👥',
    redemption: '🛒',
};

// ── Component ────────────────────────────────────────────────

export const CashbackWallet = ({ wallet }: CashbackWalletProps) => {
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
            className={cn(
                'rounded-lg border border-white/[0.06] bg-white/[0.03] backdrop-blur',
                'p-6 md:p-8'
            )}
        >
            {/* Header */}
            <h2 className="text-xl font-headline font-bold uppercase tracking-[0.2em] text-white mb-6">
                CAGNOTTE
            </h2>

            {/* Balance display */}
            <div className="mb-6 p-5 rounded-lg bg-white/[0.02] border border-white/[0.06]">
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
                    {formatEuro(wallet.balanceCents)}
                </p>
                <p className="text-[10px] font-mono tracking-[0.1em] text-white/30 mt-2">
                    Utilisable sur votre prochain achat
                </p>
            </div>

            {/* Lifetime stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="px-4 py-3 rounded bg-white/[0.02] border border-white/[0.04]">
                    <p className="text-[10px] font-mono tracking-[0.15em] text-white/40 uppercase mb-2">
                        Total gagné
                    </p>
                    <p
                        className={cn(
                            'text-lg font-headline font-bold',
                            'bg-gradient-to-r from-green-400/80 to-emerald-400/70',
                            'bg-clip-text text-transparent'
                        )}
                    >
                        +{formatEuro(wallet.lifetimeEarnedCents)}
                    </p>
                </div>

                <div className="px-4 py-3 rounded bg-white/[0.02] border border-white/[0.04]">
                    <p className="text-[10px] font-mono tracking-[0.15em] text-white/40 uppercase mb-2">
                        Total utilisé
                    </p>
                    <p className="text-lg font-headline font-bold text-white/60">
                        {formatEuro(wallet.lifetimeSpentCents)}
                    </p>
                </div>
            </div>

            {/* Cashback info banner */}
            <div className="mb-6 px-4 py-3 rounded border border-[#FF6B00]/20 bg-[#FF6B00]/[0.04]">
                <p className="text-[11px] font-mono text-[#FF6B00]/80 leading-relaxed">
                    <span className="font-bold">5% de cashback à vie</span> sur chacun de
                    vos achats. Parrainez un proche et recevez aussi{' '}
                    <span className="font-bold">5% sur tous ses achats</span>.
                </p>
            </div>

            {/* Transaction history */}
            <div className="border-t border-white/[0.06] pt-4">
                <p className="text-[10px] font-mono tracking-[0.15em] text-white/40 uppercase mb-4">
                    Historique
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
                                    'bg-white/[0.02] border border-white/[0.04]',
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
                                            ? 'text-green-400/90'
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
                            Votre cagnotte se remplit automatiquement à chaque achat
                        </p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

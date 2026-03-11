'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// ── Types ────────────────────────────────────────────────────

interface CashbackTransaction {
  id: string;
  type: 'purchase_self_cashback' | 'referral_cashback' | 'redemption' | 'commission_withdrawal';
  amountCents: number;
  hasOrder: boolean;
  createdAt: string;
  details: { rate: number | null; orderTotalCents: number | null };
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

const formatDate = (dateString: string): string =>
  new Date(dateString).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' });

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

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoadingTx(true);
        const token = typeof window !== 'undefined' ? localStorage.getItem('hydre_auth_token') : null;
        if (!token) return;
        const res = await fetch('/api/account/wallet?limit=20', { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setTransactions(data.transactions || []);
      } catch {
        setTxError("Impossible de charger l'historique");
      } finally {
        setIsLoadingTx(false);
      }
    };
    fetchTransactions();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 4 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const panelBase: React.CSSProperties = {
    border: '1px solid var(--stroke)',
    backgroundColor: 'color-mix(in srgb, var(--bg-surface) 40%, transparent)',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
    >
      {/* ━━━ TOP ROW: COMMISSION (left) | CAGNOTTE (right) ━━━ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

        {/* ── COMMISSIONS ── */}
        <div className="rounded-lg backdrop-blur p-4" style={{ ...panelBase, border: '1px solid rgba(52,211,153,0.15)' }}>
          <div className="flex items-center justify-between mb-3 pb-3" style={{ borderBottom: '1px solid rgba(52,211,153,0.12)' }}>
            <h2 className="text-sm font-headline font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--text-primary)' }}>
              COMMISSIONS
            </h2>
            <span className="font-mono text-[9px] uppercase tracking-widest text-emerald-400/60">Retirable</span>
          </div>

          {/* Balance */}
          <div className="mb-3 px-3 py-2.5 rounded-lg" style={{ background: 'color-mix(in srgb, var(--bg-elevated) 40%, transparent)', border: '1px solid rgba(52,211,153,0.12)' }}>
            <p className="text-[9px] font-mono tracking-widest uppercase mb-1" style={{ color: 'var(--text-muted)' }}>Solde retirable</p>
            <p className="text-2xl font-headline font-bold bg-gradient-to-r from-emerald-300 via-green-400 to-emerald-300 bg-clip-text text-transparent">
              {formatEuro(commission.balanceCents)}
            </p>
            <p className="text-[9px] font-mono mt-1 text-emerald-400/40">Retirable sur votre compte bancaire</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="px-2.5 py-2 rounded" style={{ background: 'color-mix(in srgb, var(--bg-elevated) 40%, transparent)', border: '1px solid rgba(52,211,153,0.08)' }}>
              <p className="text-[9px] font-mono tracking-widest uppercase mb-1" style={{ color: 'var(--text-muted)' }}>Total gagné</p>
              <p className="text-sm font-headline font-bold bg-gradient-to-r from-emerald-300/80 to-green-400/70 bg-clip-text text-transparent">
                +{formatEuro(commission.lifetimeEarnedCents)}
              </p>
            </div>
            <div className="px-2.5 py-2 rounded" style={{ background: 'color-mix(in srgb, var(--bg-elevated) 40%, transparent)', border: '1px solid rgba(52,211,153,0.08)' }}>
              <p className="text-[9px] font-mono tracking-widest uppercase mb-1" style={{ color: 'var(--text-muted)' }}>Total retiré</p>
              <p className="text-sm font-headline font-bold" style={{ color: 'var(--text-tertiary)' }}>
                {formatEuro(commission.lifetimeWithdrawnCents)}
              </p>
            </div>
          </div>

          {/* Info */}
          <div className="px-3 py-2 rounded" style={{ border: '1px solid rgba(52,211,153,0.2)', background: 'rgba(52,211,153,0.04)' }}>
            <p className="text-[9px] font-mono text-emerald-400/80 leading-relaxed">
              <span className="font-bold">5% de commission à vie</span> sur chaque achat de vos filleuls — retirable en argent réel.
            </p>
          </div>
        </div>

        {/* ── CAGNOTTE ── */}
        <div className="rounded-lg backdrop-blur p-4" style={{ ...panelBase, border: '1px solid rgba(255,107,0,0.15)' }}>
          <div className="flex items-center justify-between mb-3 pb-3" style={{ borderBottom: '1px solid rgba(255,107,0,0.12)' }}>
            <h2 className="text-sm font-headline font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--text-primary)' }}>
              CAGNOTTE
            </h2>
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#FF6B00]/60">Store credit</span>
          </div>

          {/* Balance */}
          <div className="mb-3 px-3 py-2.5 rounded-lg" style={{ background: 'color-mix(in srgb, var(--bg-elevated) 40%, transparent)', border: '1px solid rgba(255,107,0,0.12)' }}>
            <p className="text-[9px] font-mono tracking-widest uppercase mb-1" style={{ color: 'var(--text-muted)' }}>Solde disponible</p>
            <p className="text-2xl font-headline font-bold bg-gradient-to-r from-[#E6DCC8] via-[#FF6B00] to-[#E6DCC8] bg-clip-text text-transparent">
              {formatEuro(cashback.balanceCents)}
            </p>
            <p className="text-[9px] font-mono mt-1 text-[#FF6B00]/40">Utilisable sur votre prochain achat</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="px-2.5 py-2 rounded" style={{ background: 'color-mix(in srgb, var(--bg-elevated) 40%, transparent)', border: '1px solid var(--stroke)' }}>
              <p className="text-[9px] font-mono tracking-widest uppercase mb-1" style={{ color: 'var(--text-muted)' }}>Total gagné</p>
              <p className="text-sm font-headline font-bold bg-gradient-to-r from-green-400/80 to-emerald-400/70 bg-clip-text text-transparent">
                +{formatEuro(cashback.lifetimeEarnedCents)}
              </p>
            </div>
            <div className="px-2.5 py-2 rounded" style={{ background: 'color-mix(in srgb, var(--bg-elevated) 40%, transparent)', border: '1px solid var(--stroke)' }}>
              <p className="text-[9px] font-mono tracking-widest uppercase mb-1" style={{ color: 'var(--text-muted)' }}>Total utilisé</p>
              <p className="text-sm font-headline font-bold" style={{ color: 'var(--text-tertiary)' }}>
                {formatEuro(cashback.lifetimeSpentCents)}
              </p>
            </div>
          </div>

          {/* Info */}
          <div className="px-3 py-2 rounded" style={{ border: '1px solid rgba(255,107,0,0.2)', background: 'rgba(255,107,0,0.04)' }}>
            <p className="text-[9px] font-mono text-[#FF6B00]/80 leading-relaxed">
              <span className="font-bold">5% de cashback à vie</span> sur chacun de vos achats — utilisable comme crédit boutique.
            </p>
          </div>
        </div>

      </div>

      {/* ━━━ TRANSACTION HISTORY ━━━ */}
      <div className="rounded-lg backdrop-blur p-4" style={{ border: '1px solid var(--stroke)', backgroundColor: 'color-mix(in srgb, var(--bg-surface) 40%, transparent)' }}>
        <p className="text-[9px] font-mono tracking-widest uppercase mb-3" style={{ color: 'var(--text-muted)' }}>
          Historique des transactions
        </p>

        {isLoadingTx ? (
          <div className="py-4 text-center">
            <div className="w-5 h-5 border border-[var(--stroke-hover)] border-t-[#FF6B00] rounded-full animate-spin mx-auto" />
          </div>
        ) : txError ? (
          <p className="text-xs font-mono text-center py-3" style={{ color: 'var(--text-muted)' }}>{txError}</p>
        ) : transactions.length > 0 ? (
          <motion.div className="space-y-1.5" variants={containerVariants} initial="hidden" animate="visible">
            {transactions.map((tx) => (
              <motion.div
                key={tx.id}
                variants={itemVariants}
                className="flex items-center justify-between gap-3 px-3 py-2 rounded transition-colors duration-300"
                style={{
                  background: 'color-mix(in srgb, var(--bg-elevated) 40%, transparent)',
                  border: `1px solid ${tx.type === 'referral_cashback' || tx.type === 'commission_withdrawal' ? 'rgba(52,211,153,0.1)' : 'var(--stroke)'}`,
                }}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-sm flex-shrink-0">{TX_ICONS[tx.type] || '•'}</span>
                  <div className="min-w-0">
                    <p className="text-xs font-mono truncate" style={{ color: 'var(--text-secondary)' }}>
                      {TX_LABELS[tx.type] || tx.type}
                    </p>
                    <p className="text-[9px] font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {formatDate(tx.createdAt)}
                    </p>
                  </div>
                </div>
                <p className={`text-xs font-mono font-bold flex-shrink-0 ${
                  tx.amountCents >= 0
                    ? tx.type === 'referral_cashback' ? 'text-emerald-400/90' : 'text-green-400/90'
                    : 'text-red-400/80'
                }`}>
                  {tx.amountCents >= 0 ? '+' : ''}{formatEuro(tx.amountCents)}
                </p>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="py-4 text-center">
            <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>Aucune transaction</p>
            <p className="text-[9px] font-mono mt-1" style={{ color: 'var(--text-muted)' }}>
              Votre cagnotte et vos commissions se remplissent automatiquement
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

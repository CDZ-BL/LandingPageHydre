'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface Referral {
  referredName: string;
  joinedAt: string;
  pointsEarned: number;
}

interface CashbackInfo {
  lifetimeEarnedCents: number;
}

interface ReferralDashboardProps {
  referralCode: string;
  referrals: Referral[];
  totalReferrals: number;
  totalPointsFromReferrals: number;
  cashback?: CashbackInfo;
}

const maskEmail = (email: string): string => {
  const [name, domain] = email.split('@');
  if (!name || !domain) return email;
  const masked = name.charAt(0) + '*'.repeat(Math.max(0, name.length - 2)) + name.charAt(name.length - 1);
  return `${masked}@${domain}`;
};

const formatEuro = (cents: number): string => `${(cents / 100).toFixed(2)} €`;

export const ReferralDashboard = ({
  referralCode,
  referrals,
  totalReferrals,
  totalPointsFromReferrals,
  cashback,
}: ReferralDashboardProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopyReferral = async () => {
    const referralLink = `${typeof window !== 'undefined' ? window.location.origin : ''}?ref=${referralCode}`;
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString: string): string =>
    new Date(dateString).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 4 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-lg backdrop-blur p-4 h-full"
      style={{ border: '1px solid var(--stroke)', backgroundColor: 'color-mix(in srgb, var(--bg-surface) 40%, transparent)' }}
    >
      {/* Header */}
      <div className="mb-3 pb-3" style={{ borderBottom: '1px solid var(--stroke)' }}>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-headline font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--text-primary)' }}>
            PARRAINAGE
          </h2>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[9px] tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
              {totalReferrals} filleul{totalReferrals !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Referral link */}
        <button
          onClick={handleCopyReferral}
          className="group relative w-full flex items-center justify-between gap-2 px-3 py-2 rounded transition-all duration-300"
          style={{ border: '1px solid var(--stroke)', background: 'color-mix(in srgb, var(--bg-elevated) 40%, transparent)' }}
        >
          <span className="font-mono text-[10px] truncate" style={{ color: 'var(--text-tertiary)' }}>
            smartnutrition.fr/?ref={referralCode.toUpperCase()}
          </span>
          <svg className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          {copied && (
            <span
              className="absolute -top-7 left-1/2 -translate-x-1/2 text-[9px] font-mono whitespace-nowrap px-2 py-0.5 rounded"
              style={{ color: 'var(--text-tertiary)', background: 'var(--bg-elevated)', border: '1px solid var(--stroke)' }}
            >
              COPIÉ
            </span>
          )}
        </button>
      </div>

      {/* Stats row */}
      <div className={`grid gap-2 mb-3 ${cashback ? 'grid-cols-3' : 'grid-cols-2'}`}>
        <div className="px-3 py-2 rounded" style={{ background: 'color-mix(in srgb, var(--bg-elevated) 40%, transparent)', border: '1px solid var(--stroke)' }}>
          <p className="text-[9px] font-mono tracking-widest uppercase mb-1" style={{ color: 'var(--text-muted)' }}>Filleuls</p>
          <p className="text-lg font-headline font-bold" style={{ color: 'var(--text-primary)' }}>{totalReferrals}</p>
        </div>
        <div className="px-3 py-2 rounded" style={{ background: 'color-mix(in srgb, var(--bg-elevated) 40%, transparent)', border: '1px solid var(--stroke)' }}>
          <p className="text-[9px] font-mono tracking-widest uppercase mb-1" style={{ color: 'var(--text-muted)' }}>Points</p>
          <p className="text-lg font-headline font-bold text-green-400/90">+{totalPointsFromReferrals.toLocaleString()}</p>
        </div>
        {cashback && (
          <div className="px-3 py-2 rounded" style={{ background: 'color-mix(in srgb, var(--bg-elevated) 40%, transparent)', border: '1px solid rgba(255,107,0,0.15)' }}>
            <p className="text-[9px] font-mono tracking-widest uppercase mb-1" style={{ color: 'var(--text-muted)' }}>Cashback</p>
            <p className="text-sm font-headline font-bold text-[#FF6B00]/90">+{formatEuro(cashback.lifetimeEarnedCents)}</p>
          </div>
        )}
      </div>

      {/* Orange info banner */}
      <div className="px-3 py-2 rounded mb-3" style={{ border: '1px solid rgba(255,107,0,0.15)', background: 'rgba(255,107,0,0.04)' }}>
        <p className="text-[9px] font-mono text-[#FF6B00]/70 leading-relaxed">
          5% de cashback à vie sur chaque achat de vos filleuls — revenu passif automatique.
        </p>
      </div>

      {/* Referrals list */}
      {referrals.length > 0 ? (
        <motion.div className="space-y-1.5" variants={containerVariants} initial="hidden" animate="visible">
          <p className="text-[9px] font-mono tracking-widest uppercase mb-2" style={{ color: 'var(--text-muted)' }}>Filleuls</p>
          {referrals.map((referral, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="flex items-center justify-between gap-3 px-3 py-2 rounded transition-colors duration-300"
              style={{ background: 'color-mix(in srgb, var(--bg-elevated) 40%, transparent)', border: '1px solid var(--stroke)' }}
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs font-mono truncate" style={{ color: 'var(--text-secondary)' }}>
                  {maskEmail(referral.referredName)}
                </p>
                <p className="text-[9px] font-mono uppercase mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {formatDate(referral.joinedAt)}
                </p>
              </div>
              <p className="text-xs font-mono font-bold text-green-400/90 flex-shrink-0">
                +{referral.pointsEarned.toLocaleString()}
              </p>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="py-4 text-center">
          <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
            Invitez vos proches et gagnez 200 points par filleul
          </p>
        </div>
      )}
    </motion.div>
  );
};

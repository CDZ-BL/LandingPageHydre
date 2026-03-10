'use client';

import { cn } from '@/lib/utils';
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

const formatEuro = (cents: number): string => {
  return `${(cents / 100).toFixed(2)} €`;
};

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

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
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
      transition={{ duration: 0.5, delay: 0.3 }}
      className={cn(
        'rounded-lg border border-white/[0.06] bg-white/[0.03] backdrop-blur',
        'p-6 md:p-8'
      )}
    >
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-white/[0.08]">
        <h2 className="text-xl font-headline font-bold uppercase tracking-[0.2em] text-white mb-4">
          PARRAINAGE
        </h2>

        {/* Referral link copy section */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <p className="text-[10px] font-mono tracking-[0.15em] text-white/40 uppercase whitespace-nowrap">
            Your Link
          </p>
          <button
            onClick={handleCopyReferral}
            className={cn(
              'group relative flex-1 sm:flex-none px-4 py-2 border border-white/[0.1] rounded',
              'bg-white/[0.02] backdrop-blur',
              'hover:bg-white/[0.05] hover:border-white/[0.2]',
              'transition-all duration-300',
              'flex items-center gap-2 justify-between'
            )}
          >
            <span className="font-mono text-[11px] text-white/70 truncate">
              smartnutrition.fr/?ref={referralCode.toUpperCase()}
            </span>
            <svg
              className="w-4 h-4 text-white/40 group-hover:text-white/60 transition-colors flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            {copied && (
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-mono text-white/60 whitespace-nowrap">
                COPIÉ
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className={cn('grid gap-4 mb-8', cashback ? 'grid-cols-3' : 'grid-cols-2')}>
        <div className="px-4 py-3 rounded bg-white/[0.02] border border-white/[0.04]">
          <p className="text-[10px] font-mono tracking-[0.15em] text-white/40 uppercase mb-2">
            Total Referrals
          </p>
          <p className="text-2xl font-headline font-bold text-white">
            {totalReferrals}
          </p>
        </div>

        <div className="px-4 py-3 rounded bg-white/[0.02] border border-white/[0.04]">
          <p className="text-[10px] font-mono tracking-[0.15em] text-white/40 uppercase mb-2">
            Points Earned
          </p>
          <p className={cn(
            'text-2xl font-headline font-bold',
            'bg-gradient-to-r from-green-400/80 to-emerald-400/70',
            'bg-clip-text text-transparent'
          )}>
            +{totalPointsFromReferrals.toLocaleString()}
          </p>
        </div>

        {cashback && (
          <div className="px-4 py-3 rounded bg-white/[0.02] border border-[#FF6B00]/10">
            <p className="text-[10px] font-mono tracking-[0.15em] text-white/40 uppercase mb-2">
              Cashback gagné
            </p>
            <p className={cn(
              'text-2xl font-headline font-bold',
              'bg-gradient-to-r from-[#FF6B00]/90 to-[#E6DCC8]/80',
              'bg-clip-text text-transparent'
            )}>
              +{formatEuro(cashback.lifetimeEarnedCents)}
            </p>
          </div>
        )}
      </div>

      {/* Cashback incentive banner */}
      <div className="mb-6 px-4 py-3 rounded border border-[#FF6B00]/15 bg-[#FF6B00]/[0.03]">
        <p className="text-[10px] font-mono text-[#FF6B00]/70 leading-relaxed">
          5% de cashback à vie sur chaque achat de vos filleuls — revenu passif automatique.
        </p>
      </div>

      {/* Referrals list */}
      {referrals.length > 0 ? (
        <motion.div
          className="space-y-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <p className="text-[10px] font-mono tracking-[0.15em] text-white/40 uppercase mb-4">
            Filleuls
          </p>
          {referrals.map((referral, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className={cn(
                'flex items-center justify-between gap-4',
                'px-4 py-3 rounded',
                'bg-white/[0.02] border border-white/[0.04]',
                'hover:bg-white/[0.05] hover:border-white/[0.08]',
                'transition-colors duration-300'
              )}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-mono text-white/80 truncate">
                  {maskEmail(referral.referredName)}
                </p>
                <p className="text-[10px] font-mono tracking-[0.1em] text-white/30 uppercase mt-1">
                  Joined {formatDate(referral.joinedAt)}
                </p>
              </div>

              <div className="flex-shrink-0 text-right">
                <p className={cn(
                  'text-sm font-mono font-bold',
                  'text-green-400/90'
                )}>
                  +{referral.pointsEarned.toLocaleString()}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="py-8 text-center">
          <p className="text-sm font-mono text-white/50 mb-2">
            Invitez vos proches et gagnez 200 points par filleul
          </p>
        </div>
      )}
    </motion.div>
  );
};

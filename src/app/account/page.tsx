'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useHydreStore } from '@/lib/store';
import {
  ProfileHeader,
  VoteHistory,
  ReferralDashboard,
  CashbackWallet,
  FounderPointsCard,
} from '@/components/ui/AccountDashboard';
import { cn } from '@/lib/utils';

interface AccountStats {
  profile: {
    id: string;
    email: string;
    displayName: string | null;
    referralCode: string;
    founderPointsTotal: number;
    createdAt: string;
    emailVerified: boolean;
  };
  points: Array<{
    amount: number;
    reason: string;
    createdAt: string;
  }>;
  votes: Array<{
    campaignId: string;
    campaignTitle: string;
    selectedOption: string;
    votedAt: string;
    isActive: boolean;
  }>;
  referrals: {
    list: Array<{
      referredName: string;
      joinedAt: string;
      pointsEarned: number;
    }>;
    total: number;
    totalPoints: number;
  };
  cashback: {
    balanceCents: number;
    lifetimeEarnedCents: number;
    lifetimeSpentCents: number;
  };
  commission: {
    balanceCents: number;
    lifetimeEarnedCents: number;
    lifetimeWithdrawnCents: number;
  };
}

export default function AccountPage() {
  const router = useRouter();
  const { logout, openAuthModal } = useHydreStore();
  const [stats, setStats] = useState<AccountStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchAccountStats = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const token = typeof window !== 'undefined' ? localStorage.getItem('hydre_auth_token') : null;

        if (!token) {
          router.push('/');
          openAuthModal('login');
          return;
        }

        const response = await fetch('/api/account/stats', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 401) {
          localStorage.removeItem('hydre_auth_token');
          router.push('/');
          openAuthModal('login');
          return;
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch account stats: ${response.statusText}`);
        }

        const data: AccountStats = await response.json();
        setStats(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load account data';
        setError(message);
        console.error('Account stats error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccountStats();
  // refreshKey triggers a manual refresh; router/openAuthModal are stable refs
  }, [refreshKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogout = () => {
    const token = localStorage.getItem('hydre_auth_token');
    if (token) {
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
    logout();
    localStorage.removeItem('hydre_auth_token');
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] pt-24 pb-16 px-6 md:px-10 lg:px-14 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border border-[var(--stroke-hover)] border-t-[#FF6B00] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-[0.1em]">
            Chargement...
          </p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] pt-24 pb-16 px-6 md:px-10 lg:px-14 flex items-center justify-center">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-headline font-bold uppercase tracking-[0.2em] text-[var(--text-primary)] mb-4">
            Erreur
          </h1>
          <p className="text-sm font-mono text-[var(--text-tertiary)] mb-6">
            {error || 'Failed to load account data'}
          </p>
          <button
            onClick={() => router.push('/')}
            className={cn(
              'px-6 py-3 text-sm font-mono font-medium tracking-[0.1em]',
              'border border-[var(--stroke)] rounded',
              'bg-[var(--bg-surface)]/30 hover:bg-[var(--bg-surface)]/60',
              'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]',
              'transition-all duration-300'
            )}
          >
            Retour à l&apos;accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">

      {/* ━━━ NAV ━━━ */}
      <nav className="sticky top-0 z-50 w-full bg-[var(--bg-primary)]/90 backdrop-blur-xl border-b border-[var(--stroke)]">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full px-6 md:px-10 lg:px-14 py-3.5 flex justify-between items-center"
        >
          {/* Left: Back + Wordmark */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/')}
              className="group flex items-center justify-center w-7 h-7 rounded border border-[var(--stroke)] hover:border-[var(--stroke-hover)] bg-[var(--bg-surface)]/20 hover:bg-[var(--bg-surface)]/50 transition-all duration-300"
              aria-label="Retour à l'accueil"
            >
              <svg className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </button>

            <button onClick={() => router.push('/')} className="flex flex-col items-center select-none" style={{ gap: '0.18em' }}>
              <span className="font-headline font-black text-[var(--text-primary)] uppercase leading-none" style={{ fontSize: 'clamp(1rem, 1.5vw, 1.5rem)', letterSpacing: '0.22em' }}>
                SMART
              </span>
              <span className="font-sans font-light text-[var(--text-muted)] uppercase leading-none tracking-[0.55em]" style={{ fontSize: 'clamp(0.4rem, 0.6vw, 0.55rem)', marginRight: '-0.55em' }}>
                Nutrition
              </span>
            </button>
          </div>

          {/* Center */}
          <p className="hidden md:block font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-[0.25em]">
            Mon Compte
          </p>

          {/* Right: Logout */}
          <button
            onClick={handleLogout}
            className="font-mono text-[9px] text-[var(--text-muted)] tracking-[0.15em] uppercase hover:text-[var(--text-tertiary)] transition-colors duration-500"
          >
            Sortir
          </button>
        </motion.div>
      </nav>

      {/* ━━━ CONTENT ━━━ */}
      <div className="pt-6 pb-16 px-6 md:px-10 lg:px-14">
        <div className="max-w-6xl mx-auto space-y-5">

          {/* ── 1. ACCOUNT header (compact, single line) ── */}
          <ProfileHeader profile={stats.profile} />

          {/* ── 2. COMMISSION | CAGNOTTE — full width, two equal columns ── */}
          <CashbackWallet cashback={stats.cashback} commission={stats.commission} />

          {/* ── 3. VOTES + PARRAINAGE + POINTS — three-column grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* Votes */}
            <div className="lg:col-span-1">
              <VoteHistory votes={stats.votes} />
            </div>

            {/* Parrainage */}
            <div className="lg:col-span-1">
              <ReferralDashboard
                referralCode={stats.profile.referralCode}
                referrals={stats.referrals.list}
                totalReferrals={stats.referrals.total}
                totalPointsFromReferrals={stats.referrals.totalPoints}
                cashback={{ lifetimeEarnedCents: stats.cashback.lifetimeEarnedCents }}
              />
            </div>

            {/* Founder Points */}
            <div className="lg:col-span-1">
              <FounderPointsCard
                points={stats.points}
                total={stats.profile.founderPointsTotal}
              />
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

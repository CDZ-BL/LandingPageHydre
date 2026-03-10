'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useHydreStore } from '@/lib/store';
import {
  ProfileHeader,
  FounderPointsCard,
  VoteHistory,
  ReferralDashboard,
  CashbackWallet,
  ProfileEditor,
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
  const { user, isAuthLoading, openAuthModal, logout } = useHydreStore();
  const [stats, setStats] = useState<AccountStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // Wait for AuthRehydrator to finish before deciding to redirect.
    // Without this, the page redirects before the token is validated.
    if (isAuthLoading) return;

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

    if (user) {
      fetchAccountStats();
    } else {
      // No token and no user after rehydration completes → redirect
      router.push('/');
      openAuthModal('login');
    }
  }, [user, isAuthLoading, router, openAuthModal, refreshKey]);

  if (isAuthLoading || isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] pt-24 pb-16 px-6 md:px-10 lg:px-14 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border border-white/[0.2] border-t-[#FF6B00] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-mono text-white/50 uppercase tracking-[0.1em]">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-[#050505] pt-24 pb-16 px-6 md:px-10 lg:px-14 flex items-center justify-center">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-headline font-bold uppercase tracking-[0.2em] text-white mb-4">
            Error
          </h1>
          <p className="text-sm font-mono text-white/60 mb-6">
            {error || 'Failed to load account data'}
          </p>
          <button
            onClick={() => router.push('/')}
            className={cn(
              'px-6 py-3 text-sm font-mono font-medium tracking-[0.1em]',
              'border border-white/[0.15] rounded',
              'bg-white/[0.02] hover:bg-white/[0.05]',
              'text-white/70 hover:text-white/90',
              'transition-all duration-300'
            )}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* ━━━ ACCOUNT PAGE HEADER ━━━ */}
      <nav className="sticky top-0 z-50 w-full bg-[#050505]/90 backdrop-blur-xl border-b border-white/[0.06]">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full px-6 md:px-10 lg:px-14 py-4 md:py-5 flex justify-between items-center"
        >
          {/* Left: Back arrow + Smart Nutrition wordmark */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/')}
              className="group flex items-center justify-center w-8 h-8 rounded border border-white/10 hover:border-white/25 bg-white/[0.02] hover:bg-white/[0.06] transition-all duration-300"
              aria-label="Retour à l'accueil"
            >
              <svg className="w-4 h-4 text-white/50 group-hover:text-white/90 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </button>

            <button
              onClick={() => router.push('/')}
              className="flex flex-col items-center select-none"
              style={{ gap: '0.18em' }}
            >
              <span
                className="font-headline font-black text-[#E6DCC8] uppercase leading-none"
                style={{
                  fontSize: 'clamp(1.2rem, 2vw, 1.8rem)',
                  letterSpacing: '0.22em',
                }}
              >
                SMART
              </span>
              <span
                className="font-sans font-light text-white/35 uppercase leading-none tracking-[0.55em]"
                style={{ fontSize: 'clamp(0.45rem, 0.7vw, 0.6rem)', marginRight: '-0.55em' }}
              >
                Nutrition
              </span>
            </button>
          </div>

          {/* Center: Page title */}
          <p className="hidden md:block font-mono text-[10px] text-white/30 uppercase tracking-[0.25em]">
            Mon Compte
          </p>

          {/* Right: Points + Logout */}
          <div className="flex items-center gap-4">
            <span className="hidden md:flex items-center gap-1.5 font-mono text-[10px] text-[#E6DCC8]/60 tracking-[0.15em]">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
              {user?.founderPointsTotal ?? 0}
            </span>

            <button
              onClick={handleLogout}
              className="font-mono text-[9px] text-[#E6DCC8]/25 tracking-[0.15em] uppercase hover:text-[#E6DCC8]/55 transition-colors duration-500"
            >
              Sortir
            </button>
          </div>
        </motion.div>
      </nav>

    <div className="pt-8 pb-16 px-6 md:px-10 lg:px-14">
      <div className="max-w-5xl mx-auto">
        {/* Profile Header */}
        <ProfileHeader profile={stats.profile} />

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Left column (2/3): Votes + Referrals */}
          <div className="lg:col-span-2 space-y-6">
            <VoteHistory votes={stats.votes} />

            <ReferralDashboard
              referralCode={stats.profile.referralCode}
              referrals={stats.referrals.list}
              totalReferrals={stats.referrals.total}
              totalPointsFromReferrals={stats.referrals.totalPoints}
              cashback={{ lifetimeEarnedCents: stats.cashback.lifetimeEarnedCents }}
            />
          </div>

          {/* Right column (1/3): Profile Edit + Wallet + Points */}
          <div className="space-y-6">
            <ProfileEditor
              displayName={stats.profile.displayName}
              email={stats.profile.email}
              onUpdate={() => setRefreshKey((k) => k + 1)}
            />

            <CashbackWallet
              cashback={stats.cashback}
              commission={stats.commission}
            />

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

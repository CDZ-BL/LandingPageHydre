'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useHydreStore } from '@/lib/store';
import {
  ProfileHeader,
  FounderPointsCard,
  VoteHistory,
  ReferralDashboard,
  CashbackWallet,
} from '@/components/ui/AccountDashboard';
import { cn } from '@/lib/utils';

interface AccountStats {
  profile: {
    id: string;
    email: string;
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
  wallet: {
    balanceCents: number;
    lifetimeEarnedCents: number;
    lifetimeSpentCents: number;
  };
}

export default function AccountPage() {
  const router = useRouter();
  const { user, openAuthModal } = useHydreStore();
  const [stats, setStats] = useState<AccountStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccountStats = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get token from localStorage (set during auth flow)
        const token = typeof window !== 'undefined' ? localStorage.getItem('hydre_auth_token') : null;

        if (!token) {
          // No token found, redirect to home and open auth modal
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
          // Unauthorized, clear token and redirect
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
      // No user in store, redirect
      router.push('/');
      openAuthModal('login');
    }
  }, [user, router, openAuthModal]);

  if (isLoading) {
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

  return (
    <div className="min-h-screen bg-[#050505] pt-24 pb-16 px-6 md:px-10 lg:px-14">
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
              cashback={{ lifetimeEarnedCents: stats.wallet.lifetimeEarnedCents }}
            />
          </div>

          {/* Right column (1/3): Wallet + Points */}
          <div className="space-y-6">
            <CashbackWallet wallet={stats.wallet} />

            <FounderPointsCard
              points={stats.points}
              total={stats.profile.founderPointsTotal}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

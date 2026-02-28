'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useHydreStore } from '@/lib/store';

interface ProfileHeaderProps {
  profile: {
    email: string;
    referralCode: string;
    founderPointsTotal: number;
    createdAt: string;
    emailVerified: boolean;
  };
}

export const ProfileHeader = ({ profile }: ProfileHeaderProps) => {
  const router = useRouter();
  const logout = useHydreStore((state) => state.logout);
  const [copied, setCopied] = useState(false);

  const handleCopyReferral = async () => {
    const referralLink = `${typeof window !== 'undefined' ? window.location.origin : ''}?ref=${profile.referralCode}`;
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const memberSince = new Date(profile.createdAt).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-12"
    >
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
        {/* Left: Profile info */}
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-headline font-bold uppercase tracking-[0.2em] text-white mb-4">
            ACCOUNT
          </h1>

          <div className="space-y-3 text-white/70">
            <div>
              <p className="text-[11px] font-mono tracking-[0.15em] text-white/40 uppercase mb-1">
                Email
              </p>
              <p className="font-mono text-sm">{profile.email}</p>
              {profile.emailVerified && (
                <p className="text-[10px] font-mono tracking-[0.1em] text-green-400/80 mt-1">
                  ✓ VERIFIED
                </p>
              )}
            </div>

            <div>
              <p className="text-[11px] font-mono tracking-[0.15em] text-white/40 uppercase mb-1">
                Member Since
              </p>
              <p className="font-mono text-sm">{memberSince}</p>
            </div>

            {/* Referral code */}
            <div>
              <p className="text-[11px] font-mono tracking-[0.15em] text-white/40 uppercase mb-2">
                Referral Code
              </p>
              <button
                onClick={handleCopyReferral}
                className={cn(
                  'group relative px-3 py-2 border border-white/[0.1] rounded',
                  'bg-white/[0.02] backdrop-blur',
                  'hover:bg-white/[0.05] hover:border-white/[0.2]',
                  'transition-all duration-300',
                  'flex items-center gap-2'
                )}
              >
                <span className="font-mono text-sm text-white/80">
                  HYDRE-{profile.referralCode.toUpperCase()}
                </span>
                <svg
                  className="w-4 h-4 text-white/40 group-hover:text-white/60 transition-colors"
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
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-mono text-white/60 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {copied ? 'COPIÉ' : 'COPY LINK'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Points + Actions */}
        <div className="flex flex-col items-start md:items-end gap-6">
          {/* Founder Points Total */}
          <div className="text-right">
            <p className="text-[11px] font-mono tracking-[0.15em] text-white/40 uppercase mb-2">
              Founder Points
            </p>
            <div className="flex items-baseline gap-2">
              <p
                className={cn(
                  'text-4xl md:text-5xl font-headline font-bold',
                  'tracking-[0.1em] uppercase',
                  'bg-gradient-to-r from-[#E6DCC8] to-[#D4C9B8]',
                  'bg-clip-text text-transparent'
                )}
              >
                {profile.founderPointsTotal.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className={cn(
              'px-4 py-2 text-sm font-mono font-medium tracking-[0.1em]',
              'border border-white/[0.15] rounded',
              'text-white/70 hover:text-white/90',
              'bg-white/[0.02] hover:bg-white/[0.05]',
              'backdrop-blur transition-all duration-300',
              'hover:border-white/[0.25]'
            )}
          >
            LOGOUT
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="mt-8 h-px bg-gradient-to-r from-white/[0.1] via-white/[0.2] to-transparent" />
    </motion.div>
  );
};

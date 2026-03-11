'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useState } from 'react';

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
  const [copied, setCopied] = useState(false);

  const handleCopyReferral = async () => {
    const referralLink = `${typeof window !== 'undefined' ? window.location.origin : ''}?ref=${profile.referralCode}`;
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const memberSince = new Date(profile.createdAt).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-4"
    >
      {/* ── Single compact row: ACCOUNT | info chips ── */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">

        {/* Title */}
        <h1 className="text-xl font-headline font-bold uppercase tracking-[0.22em] text-[var(--text-primary)] shrink-0">
          ACCOUNT
        </h1>

        {/* Divider */}
        <div className="hidden sm:block w-px h-5 bg-[var(--stroke-hover)]" />

        {/* Email */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest">Email</span>
          <span className="font-mono text-xs text-[var(--text-secondary)]">{profile.email}</span>
          {profile.emailVerified && (
            <span className="text-[9px] font-mono text-green-400/80 tracking-widest">✓</span>
          )}
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-5 bg-[var(--stroke-hover)]" />

        {/* Member since */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest">Depuis</span>
          <span className="font-mono text-xs text-[var(--text-secondary)]">{memberSince}</span>
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-5 bg-[var(--stroke-hover)]" />

        {/* Referral code — copy button */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest">Code</span>
          <button
            onClick={handleCopyReferral}
            className={cn(
              'group relative flex items-center gap-1.5 px-2.5 py-1',
              'border border-[var(--stroke)] rounded',
              'bg-[var(--bg-surface)]/30 hover:bg-[var(--bg-surface)]/60',
              'hover:border-[var(--stroke-hover)]',
              'transition-all duration-300'
            )}
          >
            <span className="font-mono text-[11px] text-[var(--text-secondary)]">
              SMART-{profile.referralCode.toUpperCase()}
            </span>
            <svg
              className="w-3 h-3 text-[var(--text-muted)] group-hover:text-[var(--text-tertiary)] transition-colors"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            {copied && (
              <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[9px] font-mono text-[var(--text-tertiary)] whitespace-nowrap bg-[var(--bg-elevated)] px-2 py-0.5 rounded border border-[var(--stroke)]">
                COPIÉ
              </span>
            )}
          </button>
        </div>

        {/* Spacer + Founder Points (far right) */}
        <div className="ml-auto flex items-center gap-2">
          <svg className="w-3.5 h-3.5 text-[var(--text-muted)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
          </svg>
          <span className="font-headline font-bold text-base tracking-wider text-[var(--text-primary)]">
            {profile.founderPointsTotal.toLocaleString()}
          </span>
          <span className="font-mono text-[9px] text-[var(--text-muted)] uppercase tracking-widest">pts</span>
        </div>

      </div>

      {/* Thin divider */}
      <div className="mt-4 h-px bg-gradient-to-r from-[var(--stroke-hover)] via-[var(--stroke)] to-transparent" />
    </motion.div>
  );
};

'use client';

import { motion } from 'framer-motion';

interface Vote {
  campaignId: string;
  campaignTitle: string;
  selectedOption: string;
  votedAt: string;
  isActive: boolean;
}

interface VoteHistoryProps {
  votes: Vote[];
}

export const VoteHistory = ({ votes }: VoteHistoryProps) => {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  };

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
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-lg backdrop-blur p-4 h-full"
      style={{ border: '1px solid var(--stroke)', backgroundColor: 'color-mix(in srgb, var(--bg-surface) 40%, transparent)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3 pb-3" style={{ borderBottom: '1px solid var(--stroke)' }}>
        <h2 className="text-sm font-headline font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--text-primary)' }}>
          VOTES
        </h2>
        <span className="font-mono text-[9px] tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
          {votes.length} entrée{votes.length !== 1 ? 's' : ''}
        </span>
      </div>

      {votes.length > 0 ? (
        <motion.div className="space-y-2" variants={containerVariants} initial="hidden" animate="visible">
          {votes.map((vote) => (
            <motion.div
              key={vote.campaignId}
              variants={itemVariants}
              className="flex items-center gap-3 px-3 py-2 rounded transition-colors duration-300"
              style={{ background: 'color-mix(in srgb, var(--bg-elevated) 40%, transparent)', border: '1px solid var(--stroke)' }}
            >
              {vote.isActive && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-orange-500/80"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-mono truncate" style={{ color: 'var(--text-secondary)' }}>
                  {vote.campaignTitle}
                </p>
                <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                  <span
                    className="inline-block px-1.5 py-0.5 rounded text-[9px] font-mono uppercase tracking-wide"
                    style={{ background: 'color-mix(in srgb, var(--bg-elevated) 60%, transparent)', color: 'var(--text-tertiary)', border: '1px solid var(--stroke)' }}
                  >
                    {vote.selectedOption}
                  </span>
                  {vote.isActive && (
                    <span className="text-[9px] font-mono text-green-400/80 font-semibold">Active</span>
                  )}
                  <span className="text-[9px] font-mono" style={{ color: 'var(--text-muted)' }}>
                    {formatDate(vote.votedAt)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="py-6 text-center">
          <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
            Aucun vote pour le moment
          </p>
        </div>
      )}
    </motion.div>
  );
};

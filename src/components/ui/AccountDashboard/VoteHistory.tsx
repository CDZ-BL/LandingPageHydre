'use client';

import { cn } from '@/lib/utils';
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
      transition={{ duration: 0.5, delay: 0.2 }}
      className={cn(
        'rounded-lg border border-white/[0.06] bg-white/[0.03] backdrop-blur',
        'p-6 md:p-8'
      )}
    >
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-white/[0.08]">
        <h2 className="text-xl font-headline font-bold uppercase tracking-[0.2em] text-white">
          VOTES
        </h2>
      </div>

      {/* Votes list */}
      {votes.length > 0 ? (
        <motion.div
          className="space-y-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {votes.map((vote) => (
            <motion.div
              key={vote.campaignId}
              variants={itemVariants}
              className={cn(
                'flex items-start gap-4 p-4 rounded',
                'bg-white/[0.02] border border-white/[0.04]',
                'hover:bg-white/[0.05] hover:border-white/[0.08]',
                'transition-colors duration-300'
              )}
            >
              {/* Pulsing active indicator */}
              {vote.isActive && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex-shrink-0 w-2 h-2 rounded-full bg-orange-500/80 mt-1.5"
                />
              )}

              {/* Vote details */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-mono font-medium text-white/80 mb-1">
                  {vote.campaignTitle}
                </p>
                <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-white/50 uppercase tracking-[0.1em]">
                  <span className="px-2 py-1 rounded bg-white/[0.05] border border-white/[0.08]">
                    {vote.selectedOption}
                  </span>
                  {vote.isActive && (
                    <span className="text-green-400/70 font-semibold">
                      Active
                    </span>
                  )}
                  <span className="text-white/30">•</span>
                  <span>{formatDate(vote.votedAt)}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="py-8 text-center">
          <p className="text-sm font-mono text-white/50">
            Aucun vote pour le moment
          </p>
        </div>
      )}
    </motion.div>
  );
};

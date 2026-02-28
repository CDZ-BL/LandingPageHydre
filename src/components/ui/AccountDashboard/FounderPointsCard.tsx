'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface PointEntry {
  amount: number;
  reason: string;
  createdAt: string;
}

interface FounderPointsCardProps {
  points: PointEntry[];
  total: number;
}

const REASON_LABELS: Record<string, string> = {
  signup: 'Inscription',
  verification: 'Vérification',
  referral: 'Parrainage',
  vote: 'Vote',
  newsletter: 'Newsletter',
  referred_bonus: 'Bonus filleul',
  bonus: 'Bonus',
};

export const FounderPointsCard = ({ points, total }: FounderPointsCardProps) => {
  const getReasonLabel = (reason: string): string => {
    return REASON_LABELS[reason] || reason.charAt(0).toUpperCase() + reason.slice(1);
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
      transition={{ duration: 0.5, delay: 0.1 }}
      className={cn(
        'rounded-lg border border-white/[0.06] bg-white/[0.03] backdrop-blur',
        'p-6 md:p-8'
      )}
    >
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-white/[0.08]">
        <h2 className="text-xl font-headline font-bold uppercase tracking-[0.2em] text-white mb-1">
          FOUNDER POINTS
        </h2>
        <div className="flex items-baseline gap-2 mt-3">
          <p className="text-3xl font-headline font-bold tracking-[0.1em] text-white">
            {total.toLocaleString()}
          </p>
          <p className="text-[11px] font-mono tracking-[0.15em] text-white/40 uppercase">
            Total
          </p>
        </div>
      </div>

      {/* Points list */}
      {points.length > 0 ? (
        <motion.div
          className="space-y-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {points.map((point, idx) => (
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
                <p className="text-sm font-mono text-white/80">
                  {getReasonLabel(point.reason)}
                </p>
                <p className="text-[10px] font-mono tracking-[0.1em] text-white/30 uppercase mt-1">
                  {formatDate(point.createdAt)}
                </p>
              </div>

              <div className="flex-shrink-0 text-right">
                <p className={cn(
                  'text-lg font-mono font-bold',
                  'text-green-400/90'
                )}>
                  +{point.amount.toLocaleString()}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="py-8 text-center">
          <p className="text-sm font-mono text-white/50">
            Aucun point pour le moment
          </p>
        </div>
      )}
    </motion.div>
  );
};

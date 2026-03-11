'use client';

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
  const getReasonLabel = (reason: string): string =>
    REASON_LABELS[reason] || reason.charAt(0).toUpperCase() + reason.slice(1);

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
      transition={{ duration: 0.5, delay: 0.1 }}
      className="rounded-lg backdrop-blur p-4 h-full"
      style={{ border: '1px solid var(--stroke)', backgroundColor: 'color-mix(in srgb, var(--bg-surface) 40%, transparent)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3 pb-3" style={{ borderBottom: '1px solid var(--stroke)' }}>
        <h2 className="text-sm font-headline font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--text-primary)' }}>
          FOUNDER POINTS
        </h2>
        <span className="font-headline font-bold text-base tracking-wider" style={{ color: 'var(--text-primary)' }}>
          {total.toLocaleString()}
        </span>
      </div>

      {points.length > 0 ? (
        <motion.div className="space-y-2" variants={containerVariants} initial="hidden" animate="visible">
          {points.map((point, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="flex items-center justify-between gap-4 px-3 py-2 rounded transition-colors duration-300"
              style={{ background: 'color-mix(in srgb, var(--bg-elevated) 40%, transparent)', border: '1px solid var(--stroke)' }}
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
                  {getReasonLabel(point.reason)}
                </p>
                <p className="text-[10px] font-mono uppercase mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {formatDate(point.createdAt)}
                </p>
              </div>
              <p className="text-sm font-mono font-bold text-green-400/90 flex-shrink-0">
                +{point.amount.toLocaleString()}
              </p>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="py-6 text-center">
          <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
            Aucun point pour le moment
          </p>
        </div>
      )}
    </motion.div>
  );
};

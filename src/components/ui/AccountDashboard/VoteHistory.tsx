'use client';

import { motion } from 'framer-motion';

// Color map matching RD_OPTIONS in Alliance — kept local to avoid cross-bundle imports
const OPTION_COLORS: Record<string, string> = {
  'Fruits des bois': '#FF6B00',
  'Melon HoneyDew':  '#34D399',
  'Poire':           '#FDE68A',
};

const OPTION_LABELS: Record<string, string> = {
  'Fruits des bois': 'FRUITS DES BOIS',
  'Melon HoneyDew':  'MELON HONEYDEW',
  'Poire':           'POIRE',
};

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
  const formatDate = (dateString: string): string =>
    new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric', month: 'short', day: 'numeric',
    });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-lg backdrop-blur p-4 h-full"
      style={{
        border: '1px solid var(--stroke)',
        backgroundColor: 'color-mix(in srgb, var(--bg-surface) 40%, transparent)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between mb-3 pb-3"
        style={{ borderBottom: '1px solid var(--stroke)' }}
      >
        <h2
          className="text-sm font-headline font-bold uppercase tracking-[0.2em]"
          style={{ color: 'var(--text-primary)' }}
        >
          VOTES
        </h2>
        <span
          className="font-mono text-[9px] tracking-widest uppercase"
          style={{ color: 'var(--text-muted)' }}
        >
          {votes.length} entrée{votes.length !== 1 ? 's' : ''}
        </span>
      </div>

      {votes.length > 0 ? (
        <motion.div
          className="space-y-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {votes.map((vote) => {
            const color = OPTION_COLORS[vote.selectedOption] ?? 'var(--text-muted)';
            const label = OPTION_LABELS[vote.selectedOption] ?? vote.selectedOption.toUpperCase();

            return (
              <motion.div
                key={vote.campaignId}
                variants={itemVariants}
                className="flex items-start gap-3 px-3 py-2.5 rounded"
                style={{
                  background: 'color-mix(in srgb, var(--bg-elevated) 40%, transparent)',
                  border: `1px solid ${vote.isActive ? `${color}25` : 'var(--stroke)'}`,
                }}
              >
                {/* Active pulse indicator */}
                {vote.isActive && (
                  <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="flex-shrink-0 mt-[5px] w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                )}

                <div className="flex-1 min-w-0">
                  {/* Campaign title */}
                  <p
                    className="text-[10px] font-mono truncate mb-1"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {vote.campaignTitle}
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {/* Colored option badge */}
                    <span
                      className="inline-block px-2 py-0.5 rounded-sm text-[9px] font-mono font-bold uppercase tracking-wider"
                      style={{
                        color,
                        backgroundColor: `${color}18`,
                        border: `1px solid ${color}40`,
                      }}
                    >
                      {label}
                    </span>

                    {vote.isActive && (
                      <span className="text-[9px] font-mono font-semibold" style={{ color }}>
                        En cours
                      </span>
                    )}

                    <span
                      className="text-[9px] font-mono"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {formatDate(vote.votedAt)}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <div className="py-8 text-center space-y-2">
          <div
            className="w-8 h-8 rounded-full border mx-auto flex items-center justify-center"
            style={{ borderColor: 'var(--stroke)' }}
          >
            <span className="font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>0</span>
          </div>
          <p className="text-[10px] font-mono tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
            Aucun vote enregistré
          </p>
          <p className="text-[9px] font-mono" style={{ color: 'var(--text-muted)', opacity: 0.6 }}>
            Participez au vote R&amp;D sur la page d&apos;accueil
          </p>
        </div>
      )}
    </motion.div>
  );
};

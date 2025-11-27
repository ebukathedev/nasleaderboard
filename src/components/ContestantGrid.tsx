'use client';

import { motion } from 'framer-motion';
import { Contestant, getVotePercentage } from '@/utils/mockData';
import Image from 'next/image';

interface ContestantGridProps {
  contestants: Contestant[];
}

export default function ContestantGrid({ contestants }: ContestantGridProps) {
  // Sort by votes descending
  const sortedContestants = [...contestants].sort((a, b) => b.votes - a.votes);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedContestants.map((contestant, index) => {
          const rank = index + 1;
          let statusColor = '';
          let statusText = '';
          let statusAnimation = {};

          if (rank <= 9) {
            statusColor = 'border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]';
            statusText = 'SAFE';
            statusAnimation = {
              boxShadow: ["0 0 15px rgba(34,197,94,0.3)", "0 0 25px rgba(34,197,94,0.6)", "0 0 15px rgba(34,197,94,0.3)"],
              transition: { duration: 2, repeat: Infinity }
            };
          } else if (rank <= 12) {
            statusColor = 'border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)]';
            statusText = 'AT RISK';
            statusAnimation = {
              x: [-1, 1, -1],
              transition: { duration: 0.2, repeat: Infinity }
            };
          } else {
            statusColor = 'border-gray-700 opacity-50 grayscale blur-[0.5px]';
            statusText = 'ELIMINATED';
          }

          return (
            <motion.div
              key={contestant.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: rank > 12 ? 1 : 1.02 }}
              className={`relative bg-nas-dark-gray border-2 ${statusColor} p-4 flex items-center gap-4 overflow-hidden group`}
            >
              {/* Animated Border/Glow for Safe/At Risk */}
              {rank <= 12 && (
                <motion.div 
                  className="absolute inset-0 pointer-events-none"
                  animate={statusAnimation}
                />
              )}

              {/* Rank Badge */}
              <div className="absolute top-0 left-0 bg-white text-black font-bold text-xs px-2 py-1 z-10">
                #{rank}
              </div>

              {/* Image */}
              <div className="relative w-20 h-20 flex-shrink-0">
                {/* <Image
                  src={contestant.image}
                  alt={contestant.name}
                  fill
                  className="object-cover rounded-full border-2 border-white/10"
                /> */}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-white truncate uppercase tracking-wide">
                  {contestant.name}
                </h3>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-2xl font-mono font-bold text-nas-gold">
                    {getVotePercentage(contestant.votes)}%
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    rank <= 9 ? 'bg-green-500/20 text-green-400' :
                    rank <= 12 ? 'bg-orange-500/20 text-orange-400' :
                    'bg-gray-700 text-gray-400'
                  }`}>
                    {statusText}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1 font-mono">
                  {contestant.votes.toLocaleString()} votes
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

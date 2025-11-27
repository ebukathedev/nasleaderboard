'use client';

import { motion } from 'framer-motion';
import { Contestant, getVotePercentage } from '@/utils/mockData';
import Image from 'next/image';
import { AlertTriangle } from 'lucide-react';

interface DangerZoneProps {
  contestants: Contestant[];
}

export default function DangerZone({ contestants }: DangerZoneProps) {
  // Filter for At Risk contestants
  const atRiskContestants = contestants.filter(c => c.status === 'At Risk');

  if (atRiskContestants.length === 0) return null;

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-16">
      <div className="flex items-center gap-4 mb-8">
        <AlertTriangle className="w-8 h-8 text-orange-500 animate-pulse" />
        <h2 className="text-3xl md:text-4xl font-black text-white">
          At Risk <span className="text-orange-500">- Needs Your Support</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {atRiskContestants.map((contestant, index) => (
          <motion.div
            key={contestant.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group relative bg-nas-dark-gray border border-orange-500/30 rounded-xl p-6 overflow-hidden hover:border-orange-500 transition-colors"
          >
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative flex items-center gap-4">
              {/* Image */}
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-orange-500/50">
                <Image
                  src={contestant.image}
                  alt={contestant.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white">{contestant.name}</h3>
                <div className="text-orange-400 font-mono text-sm">
                  {contestant.percentage}% Votes
                </div>
              </div>

              {/* Vote Button */}
              <button className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-sm font-bold rounded-lg transition-colors shadow-lg shadow-orange-900/20">
                VOTE
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

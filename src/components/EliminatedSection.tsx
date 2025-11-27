'use client';

import { motion } from 'framer-motion';
import { Contestant } from '@/utils/mockData';
import Image from 'next/image';
import { XCircle } from 'lucide-react';

interface EliminatedSectionProps {
  contestants: Contestant[];
}

export default function EliminatedSection({ contestants }: EliminatedSectionProps) {
  const eliminatedContestants = contestants.filter(c => c.status === 'Eliminated');

  if (eliminatedContestants.length === 0) return null;

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-16 opacity-75 grayscale hover:grayscale-0 transition-all duration-500">
      <div className="flex items-center gap-4 mb-8">
        <XCircle className="w-8 h-8 text-red-500" />
        <h2 className="text-3xl md:text-4xl font-black text-white">
          Eliminated <span className="text-red-500">- Out of the Race</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {eliminatedContestants.map((contestant, index) => (
          <motion.div
            key={contestant.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group relative bg-nas-dark-gray border border-red-900/30 rounded-xl p-6 overflow-hidden"
          >
            <div className="relative flex items-center gap-4">
              {/* Image */}
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-red-900/50 grayscale">
                <Image
                  src={contestant.image}
                  alt={contestant.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-400 line-through decoration-red-500">{contestant.name}</h3>
                <div className="text-red-900/70 font-mono text-sm">
                  Eliminated
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

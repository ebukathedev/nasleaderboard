'use client';

import { motion } from 'framer-motion';
import { Contestant } from '@/utils/mockData';
import Image from 'next/image';

interface PodiumProps {
  contestants: Contestant[];
}

export default function Podium({ contestants }: PodiumProps) {
  // Ensure we have at least 3 contestants
  if (contestants.length < 3) return null;

  // Reorder for visual podium: [2nd, 1st, 3rd]
  const podiumOrder = [contestants[1], contestants[0], contestants[2]];

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-black mb-2">👑 Leading the Pack</h2>
        <p className="text-gray-400">The current fan favorites.</p>
      </div>

      <div className="flex flex-col md:flex-row items-end justify-center gap-4 md:gap-8 min-h-[400px]">
        {podiumOrder.map((contestant, index) => {
          // Determine rank based on original sorted array
          const rank = contestant === contestants[0] ? 1 : contestant === contestants[1] ? 2 : 3;
          
          let heightClass = 'h-64'; // Default (Rank 3)
          let colorClass = 'border-amber-700 shadow-amber-900/50'; // Bronze
          let scale = 1;
          let zIndex = 10;

          if (rank === 1) {
            heightClass = 'h-80 md:h-96';
            colorClass = 'border-yellow-400 shadow-yellow-500/50'; // Gold
            scale = 1.1;
            zIndex = 20;
          } else if (rank === 2) {
            heightClass = 'h-72 md:h-80';
            colorClass = 'border-gray-300 shadow-gray-400/50'; // Silver
          }

          return (
            <motion.div
              key={contestant.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: rank * 0.2 }}
              className={`relative w-full md:w-1/3 flex flex-col items-center justify-end ${heightClass} z-${zIndex}`}
            >
              {/* Card */}
              <div className={`
                relative w-full h-full bg-gradient-to-b from-gray-900 to-black 
                border-t-4 ${colorClass} rounded-t-2xl p-6 flex flex-col items-center justify-start pt-12
                backdrop-blur-sm bg-opacity-80
              `}>
                {/* Rank Badge */}
                <div className={`
                  absolute -top-6 w-12 h-12 rounded-full flex items-center justify-center font-black text-xl text-black
                  ${rank === 1 ? 'bg-yellow-400' : rank === 2 ? 'bg-gray-300' : 'bg-amber-700 text-white'}
                  shadow-lg
                `}>
                  #{rank}
                </div>

                {/* Image */}
                <div className={`relative rounded-full overflow-hidden border-4 border-white/10 mb-4 ${rank === 1 ? 'w-32 h-32' : 'w-24 h-24'}`}>
                  <Image
                    src={contestant.image}
                    alt={contestant.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Info */}
                <h3 className="text-xl md:text-2xl font-bold text-white text-center mb-1">{contestant.name}</h3>
                <div className="text-nas-gold font-mono font-bold text-lg">
                  {contestant.percentage}% Votes
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

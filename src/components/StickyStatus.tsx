'use client';

import { motion } from 'framer-motion';

export default function StickyStatus() {
  return (
    <div className="sticky top-0 z-50 w-full bg-nas-black/90 backdrop-blur-md border-b border-white/10 py-2 px-4 flex items-center justify-between text-xs md:text-sm font-medium tracking-wider uppercase text-white">
      <div className="flex items-center gap-2">
        <motion.div
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-2 h-2 rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.8)]"
        />
        <span className="text-red-500 font-bold drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]">
          Live Voting In Progress
        </span>
      </div>
      <div className="text-gray-400">
        Auto-refreshing every 10s
      </div>
    </div>
  );
}

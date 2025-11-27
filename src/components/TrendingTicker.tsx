'use client';

import { motion } from 'framer-motion';

export default function TrendingTicker() {
  const messages = [
    "🚀 Aria Vance is rising fast!",
    "🔥 Jax Thorne just broke into the Top 5!",
    "👀 1,000 new votes cast in the last hour.",
    "⚡️ Voting closes in 24 hours!",
    "📈 New record for total votes cast today!"
  ];

  return (
    <div className="w-full bg-nas-gold/10 border-y border-nas-gold/20 py-3 overflow-hidden my-10">
      <motion.div
        animate={{ x: [0, -1000] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="flex items-center gap-12 whitespace-nowrap"
      >
        {[...messages, ...messages, ...messages].map((msg, i) => (
          <span key={i} className="text-nas-gold font-bold uppercase tracking-wider text-sm">
            {msg}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

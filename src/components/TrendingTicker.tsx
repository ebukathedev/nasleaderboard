import { motion } from 'framer-motion';
import { Contestant } from '@/utils/mockData';

interface TrendingTickerProps {
  contestants: Contestant[];
  endDate?: string;
}

export default function TrendingTicker({ contestants, endDate }: TrendingTickerProps) {
  // Calculate stats
  const totalVotes = contestants.reduce((sum, c) => sum + (c.votes || 0), 0);
  const leader = contestants.length > 0 ? contestants[0] : null;
  const formattedTotalVotes = totalVotes.toLocaleString();
  const formattedEndDate = endDate ? new Date(endDate).toLocaleDateString(undefined, { 
    month: 'short', day: 'numeric', year: 'numeric' 
  }) : 'Soon';

  // Generate dynamic messages
  const messages = contestants.length > 0 ? [
    `📊 Total Votes Cast: ${formattedTotalVotes}`,
    leader ? `🏆 Current Leader: ${leader.name}` : "🏆 Race is heating up!",
    "⚡ Live Data: Updates automatically",
    `📅 Voting Ends: ${formattedEndDate}`,
    // "🌍 Official NAS Voting Tracker"
  ] : [
    "🚀 Voting Opening Soon",
    "🔥 Get ready to support your favorite!",
    // "🌍 Official NAS Voting Tracker"
  ];

  return (
    <div className="w-full bg-nas-gold/10 border-y border-nas-gold/20 py-3 overflow-hidden my-10">
      <motion.div
        animate={{ x: [0, -1000] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="flex items-center gap-12 whitespace-nowrap"
      >
        {[...messages, ...messages, ...messages, ...messages].map((msg, i) => (
          <span key={i} className="text-nas-gold font-bold uppercase tracking-wider text-sm">
            {msg}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

import React from "react";
import { VoteItem } from "@/types";

interface LeaderboardItemProps {
	item: VoteItem;
}

const LeaderboardItem: React.FC<LeaderboardItemProps> = ({ item }) => {
  return (
    <div className="group relative flex items-center justify-between p-4 mb-3 rounded-xl overflow-hidden border border-white/10 hover:border-nas-gold/50 transition-colors duration-300">
      
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-purple-900/20 to-black opacity-80" />
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer" />

      <div className="flex items-center gap-4 relative z-10">
        {/* Rank Badge */}
        <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-nas-gold/10 text-nas-gold font-black text-lg md:text-xl border border-nas-gold/20 shadow-[0_0_10px_rgba(255,215,0,0.1)]">
          {item.rank}
        </div>

        {/* Name */}
        <div className="flex items-center gap-3">
          <span className="text-white font-bold text-lg md:text-2xl tracking-wide uppercase italic drop-shadow-md">
            {item.name}
          </span>
        </div>
      </div>

      {/* Percentage */}
      <div className="text-nas-gold font-black text-xl md:text-2xl relative z-10 drop-shadow-[0_0_8px_rgba(255,215,0,0.3)]">
        {item.percentage}%
      </div>
    </div>
  );
};

export default LeaderboardItem;

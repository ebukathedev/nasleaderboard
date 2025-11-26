import React from 'react';
import { VoteItem } from '@/types';

interface LeaderboardItemProps {
  item: VoteItem;
}

const LeaderboardItem: React.FC<LeaderboardItemProps> = ({ item }) => {
  return (
    <div className="flex items-center justify-between bg-gradient-to-r from-nas-dark-gray to-black border-b border-gray-800 p-4 mb-2 rounded-md shadow-md hover:scale-[1.01] transition-transform duration-200">
      <div className="flex items-center gap-4">
        {/* Rank Badge */}
        <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-nas-yellow text-black font-bold text-lg md:text-xl shadow-inner">
          {item.rank}
        </div>
        
        {/* Name and Image (if available) */}
        <div className="flex items-center gap-3">
          {/* {item.image && (
            <img 
              src={item.image} 
              alt={item.name} 
              className="w-10 h-10 rounded-full object-cover border-2 border-nas-yellow hidden md:block"
            />
          )} */}
          <span className="text-white font-bold text-lg md:text-2xl tracking-wide uppercase">
            {item.name}
          </span>
        </div>
      </div>

      {/* Percentage */}
      <div className="text-nas-yellow font-bold text-xl md:text-2xl">
        {item.percentage}%
      </div>
    </div>
  );
};

export default LeaderboardItem;

import React from "react";
import { VoteItem } from "@/types";

interface LeaderboardItemProps {
	item: VoteItem;
}

const LeaderboardItem: React.FC<LeaderboardItemProps> = ({ item }) => {
	return (
		<div className="flex items-center justify-between bg-linear-to-r from-nas-dark-gray to-black border-b border-gray-800 p-4 mb-2 rounded-md shadow-md hover:scale-[1.01] transition-transform duration-200 max-[350px]:scale-[0.9]">
			<div className="flex items-center gap-4">
				{/* Rank Badge */}
				<div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-nas-yellow text-black font-bold text-lg md:text-xl shadow-inner">
					{item.rank}
				</div>

				{/* Name and Image (if available) */}
				<div className="flex items-center gap-3">
					<span className="text-white font-bold text-lg md:text-2xl tracking-wide uppercase italic">
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

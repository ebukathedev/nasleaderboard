import React from 'react';

interface LeaderboardListProps {
  children: React.ReactNode;
}

const LeaderboardList: React.FC<LeaderboardListProps> = ({ children }) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-20">
      <div className="flex flex-col gap-2">
        {children}
      </div>
    </div>
  );
};

export default LeaderboardList;

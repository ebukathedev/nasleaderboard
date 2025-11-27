import React, { useState, useEffect } from 'react';
import { CampaignMetadata } from '@/types';
import { Clock, Calendar, AlertCircle, CheckCircle } from 'lucide-react';

interface VotingStatusProps {
  metadata: CampaignMetadata;
}

type VotingState = 'PRE-GAME' | 'LIVE' | 'POST-GAME';

const VotingStatus: React.FC<VotingStatusProps> = ({ metadata }) => {
  const [status, setStatus] = useState<VotingState>('PRE-GAME');
  const [timeLeft, setTimeLeft] = useState<string>('00:00:00');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!metadata) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const start = new Date(metadata.startDate).getTime();
      const end = new Date(metadata.endDate).getTime();

      let targetDate = start;
      let currentStatus: VotingState = 'PRE-GAME';

      if (now < start) {
        currentStatus = 'PRE-GAME';
        targetDate = start;
      } else if (now >= start && now < end) {
        currentStatus = 'LIVE';
        targetDate = end;
      } else {
        currentStatus = 'POST-GAME';
        targetDate = 0;
      }

      setStatus(currentStatus);

      if (currentStatus === 'POST-GAME') {
        setTimeLeft('00:00:00');
        return;
      }

      const distance = targetDate - now;

      if (distance < 0) {
        setTimeLeft('00:00:00');
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      const daysStr = days > 0 ? `${days}d ` : '';
      const timeStr = `${daysStr}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      setTimeLeft(timeStr);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [metadata]);

  if (!isMounted || !metadata) return null;

  // Render based on state
  if (status === 'PRE-GAME') {
    return (
      <div className="inline-flex items-center gap-3 px-4 py-2 bg-blue-900/20 border border-blue-500/20 rounded-full backdrop-blur-sm mb-6 animate-fade-in">
        <div className="flex items-center gap-2 text-blue-400 font-bold uppercase tracking-widest text-[10px] md:text-xs">
          <Calendar className="w-3 h-3" />
          Opens In:
        </div>
        <div className="font-mono font-bold text-white tracking-tight text-sm md:text-base">
          {timeLeft}
        </div>
      </div>
    );
  }

  if (status === 'LIVE') {
    return (
      <div className="inline-flex items-center gap-3 px-4 py-2 bg-red-900/20 border border-red-500/20 rounded-full backdrop-blur-sm mb-6">
        <div className="flex items-center gap-2 text-red-500 font-bold uppercase tracking-widest text-[10px] md:text-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          Live:
        </div>
        <div className="font-mono font-bold text-white tracking-tight text-sm md:text-base">
          {timeLeft}
        </div>
      </div>
    );
  }

  // POST-GAME
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 bg-nas-gold/10 border border-nas-gold/20 rounded-full backdrop-blur-sm mb-6">
      <CheckCircle className="w-3 h-3 text-nas-gold" />
      <div className="font-bold text-nas-gold tracking-widest uppercase text-[10px] md:text-xs">
        Voting Closed
      </div>
    </div>
  );
};

export default VotingStatus;

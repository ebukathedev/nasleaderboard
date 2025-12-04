'use client';

import React from 'react';
import useSWR from 'swr';
import Header from '@/components/Header';
import LeaderboardList from '@/components/LeaderboardList';
import LeaderboardItem from '@/components/LeaderboardItem';
import { VoteItem } from '@/types';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
};

import StickyStatus from '@/components/StickyStatus';
import MusicLoader from '@/components/MusicLoader';

// ... (imports)

export default function LeaderboardPage() {
  const { data, error, isLoading } = useSWR('/api/fetchVotes', fetcher, {
    refreshInterval: 15000, // Refresh every 15 seconds
    revalidateOnFocus: false,
  });

  const items = data?.contestants || [];
  // isArchived logic is now handled inside StickyStatus via metadata

  if (error) return <div className="text-center text-red-500 mt-10">Failed to load leaderboard data.</div>;
  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-black/35">
      <MusicLoader size="large" />
    </div>
  );

  return (
    <main className="min-h-screen w-full bg-black/35 relative">
      <StickyStatus metadata={data?.metadata} />
      <Header />
      
      <div className="flex justify-center mb-8 px-4">
        <a 
          href="/analysis"
          className="group relative inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:border-nas-gold/30 transition-all duration-300"
        >
          <span className="w-2 h-2 rounded-full bg-nas-gold animate-pulse" />
          <span className="text-gray-300 font-medium group-hover:text-white transition-colors">
            View Web vs App Analysis
          </span>
          <svg className="w-4 h-4 text-gray-500 group-hover:text-nas-gold transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>

      <LeaderboardList>
        {Array.isArray(items) && items
          .filter((item: VoteItem) => item.status !== 'Eliminated')
          .map((item: VoteItem) => (
          <LeaderboardItem key={item.id || item.name} item={item} />
        ))}
      </LeaderboardList>
      <div className="text-center py-4 text-xs text-gray-500 bg-black/80">
        Votes displayed are from the <span className="text-gray-400">nextafrobeatsstar</span> website only, excluding app votes.
      </div>
    </main>
  );
}

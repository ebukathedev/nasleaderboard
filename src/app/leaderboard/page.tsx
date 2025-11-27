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
      <LeaderboardList>
        {Array.isArray(items) && items
          .filter((item: VoteItem) => item.status !== 'Eliminated')
          .map((item: VoteItem) => (
          <LeaderboardItem key={item.id || item.name} item={item} />
        ))}
      </LeaderboardList>
    </main>
  );
}

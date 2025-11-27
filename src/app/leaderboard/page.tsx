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

export default function LeaderboardPage() {
  const { data, error, isLoading } = useSWR<VoteItem[]>('/api/fetchVotes', fetcher, {
    refreshInterval: 15000, // Refresh every 15 seconds
    revalidateOnFocus: false,
  });

  if (error) return <div className="text-center text-red-500 mt-10">Failed to load leaderboard data.</div>;
  if (isLoading) return <div className="text-center text-nas-yellow mt-10 animate-pulse text-xl">Loading Leaderboard...</div>;

  return (
    <main className="min-h-screen w-full">
      <Header />
      <LeaderboardList>
        {Array.isArray(data) && data.map((item) => (
          <LeaderboardItem key={item.id || item.name} item={item} />
        ))}
      </LeaderboardList>
    </main>
  );
}

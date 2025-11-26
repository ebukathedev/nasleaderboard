'use client';

import React from 'react';
import useSWR from 'swr';
import Header from '@/components/Header';
import LeaderboardList from '@/components/LeaderboardList';
import LeaderboardItem from '@/components/LeaderboardItem';
import { VoteItem } from '@/types';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

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
        {data && data.map((item) => (
          <LeaderboardItem key={item.id || item.name} item={item} />
        ))}
      </LeaderboardList>
    </main>
  );
}

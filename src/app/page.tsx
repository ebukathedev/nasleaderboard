'use client';

import useSWR from 'swr';
import Hero from '@/components/Hero';
import Podium from '@/components/Podium';
import DangerZone from '@/components/DangerZone';
import TrendingTicker from '@/components/TrendingTicker';
import Footer from '@/components/Footer';
import EliminatedSection from '@/components/EliminatedSection';
import { getContestantImage } from '@/utils/contestantImages';
import { Contestant } from '@/utils/mockData';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
};

import StickyStatus from '@/components/StickyStatus';

// ... (imports)

export default function Home() {
  const { data, error, isLoading } = useSWR('/api/fetchVotes', fetcher, {
    refreshInterval: 10000, // Auto-refresh every 10s
  });

  // Handle new API response structure { status, contestants }
  const apiData = data?.contestants || [];
  // isArchived logic is now handled inside StickyStatus via metadata

  // Transform API data to Contestant format
  const contestants: Contestant[] = Array.isArray(apiData) ? apiData.map((item: any) => ({
    id: item.id,
    name: item.name,
    votes: item.voteCount,
    percentage: item.percentage || '0.0',
    image: getContestantImage(item.name),
    status: item.status || (item.rank <= 9 ? 'Safe' : item.rank <= 12 ? 'At Risk' : 'Eliminated')
  })) : [];

  // Sort contestants by votes (API should already sort, but safety first)
  const sortedContestants = [...contestants].sort((a, b) => b.votes - a.votes);

  // Top 3 for Podium
  const topThree = sortedContestants.slice(0, 3);

  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">Failed to load data</div>;
  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;

  return (
    <main className="min-h-screen bg-black/50 text-white selection:bg-nas-gold selection:text-black relative">
      <StickyStatus metadata={data?.metadata} />
      <Hero />
      <TrendingTicker />
      <Podium contestants={topThree} />
      <DangerZone contestants={sortedContestants} />
      <EliminatedSection contestants={sortedContestants} />
      <Footer />
    </main>
  );
}

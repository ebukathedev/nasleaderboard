'use client';

import useSWR from 'swr';
import Link from 'next/link';
import { ChevronLeft, Smartphone, Globe, AlertCircle, Minus } from 'lucide-react';
import MusicLoader from '@/components/MusicLoader';

interface HybridStats {
  name: string;
  webVotes: number;
  webRank: number;
  appRank: number;
  rankGap: number;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AnalysisPage() {
  const { data, error, isLoading } = useSWR('/api/hybrid-stats', fetcher, {
    refreshInterval: 10000, // Refresh every 10s
  });

  if (error) return (
    <div className="min-h-screen bg-black/35 text-white flex items-center justify-center">
      <div className="text-center text-red-500">
        <AlertCircle className="w-12 h-12 mx-auto mb-4" />
        <p>Failed to load analysis data.</p>
      </div>
    </div>
  );

  if (isLoading) return (
    <div className="min-h-screen bg-black/35 text-white flex items-center justify-center">
      <MusicLoader size="large" />
    </div>
  );

  const stats: HybridStats[] = data?.data || [];

  return (
    <div className="min-h-screen bg-black/35 text-white p-6 md:p-12 font-sans relative">
      {/* Background Texture (Optional, matching LeaderboardItem feel) */}
      <div className="fixed inset-0 bg-[url('/noise.png')] opacity-10 pointer-events-none mix-blend-overlay" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header (Matching Leaderboard Header Style) */}
        <header className="w-full py-8 mb-12 flex flex-col md:flex-row justify-between items-center relative z-10">
          <Link 
            href="/"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group mb-4 md:mb-0"
          >
            <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </div>
            <span className="font-bold">Back to Home</span>
          </Link>

          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-nas-gold to-yellow-200 tracking-widest uppercase drop-shadow-lg mb-2">
              WEB VS APP ANALYSIS
            </h1>
            <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto">
              See who owns the Web vs. who rules the App.
            </p>
          </div>

          <div className="w-32 hidden md:block" /> {/* Spacer */}
        </header>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {stats.map((contestant) => (
            <div 
              key={contestant.name}
              className="group relative flex flex-col p-6 rounded-xl overflow-hidden border border-white/10 hover:border-nas-gold/50 transition-colors duration-300 bg-gray-900/50"
            >
              {/* Animated Backgrounds */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/10 to-black opacity-80" />
              <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer" />

              {/* Rank Gap Indicator (Subtle Glow) */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl opacity-20 rounded-bl-full -mr-8 -mt-8 pointer-events-none
                ${contestant.rankGap > 0 ? 'from-green-500 to-transparent' : 
                  contestant.rankGap < 0 ? 'from-blue-500 to-transparent' : 'from-gray-500 to-transparent'}`} 
              />

              <div className="relative z-10">
                <h2 className="text-xl md:text-2xl font-bold mb-3 truncate text-white tracking-wide uppercase italic drop-shadow-md">
                  {contestant.name}
                </h2>
                
                {/* Insight Badges */}
                <div className="flex flex-wrap gap-2 mb-6 min-h-[2rem]">
                  {contestant.rankGap > 0 && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-900/40 text-green-400 border border-green-500/30 shadow-[0_0_10px_rgba(74,222,128,0.1)]">
                      <Smartphone className="w-3 h-3 mr-1" />
                      App Favorite (+{contestant.rankGap})
                    </span>
                  )}
                  {contestant.rankGap < 0 && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-900/40 text-blue-400 border border-blue-500/30 shadow-[0_0_10px_rgba(96,165,250,0.1)]">
                      <Globe className="w-3 h-3 mr-1" />
                      Web Favorite ({contestant.rankGap})
                    </span>
                  )}
                  {contestant.rankGap === 0 && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-800/50 text-gray-400 border border-gray-700">
                      <Minus className="w-3 h-3 mr-1" />
                      Consistent
                    </span>
                  )}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  
                  {/* Web Stats */}
                  <div className="bg-black/40 rounded-xl p-3 border border-white/5 backdrop-blur-sm">
                    <div className="flex items-center text-gray-500 text-[10px] mb-1 uppercase tracking-wider font-bold">
                      <Globe className="w-3 h-3 mr-1" /> Web Rank
                    </div>
                    <div className="text-2xl font-black text-white">
                      #{contestant.webRank}
                    </div>
                    <div className="text-xs text-gray-400 mt-1 font-mono">
                      {contestant.webVotes.toLocaleString()}
                    </div>
                  </div>

                  {/* App Stats */}
                  <div className="bg-black/40 rounded-xl p-3 border border-white/5 backdrop-blur-sm">
                    <div className="flex items-center text-gray-500 text-[10px] mb-1 uppercase tracking-wider font-bold">
                      <Smartphone className="w-3 h-3 mr-1" /> App Rank
                    </div>
                    <div className="text-2xl font-black text-nas-gold drop-shadow-[0_0_5px_rgba(255,215,0,0.3)]">
                      #{contestant.appRank}
                    </div>
                    <div className="text-xs text-gray-400 mt-1 italic">
                      (Hidden)
                    </div>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center text-gray-600 text-xs uppercase tracking-widest">
          Data refreshes automatically every 10 seconds
        </div>
      </div>
    </div>
  );
}

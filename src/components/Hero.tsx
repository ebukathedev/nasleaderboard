'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import nasLogo from '@/images/image.png';
import VotingStatus from './VotingStatus';
import { CampaignMetadata } from '@/types';

interface HeroProps {
  metadata?: CampaignMetadata;
}

export default function Hero({ metadata }: HeroProps) {
  return (
    <section className="relative w-full min-h-[80vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      {/* Abstract Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/40 via-black to-black -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-900/20 rounded-full blur-[120px] -z-10 mix-blend-screen" />

      {/* NAS Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-6 relative w-32 h-32 md:w-40 md:h-40"
      >
        <div className="absolute inset-0 bg-nas-gold/20 blur-2xl rounded-full" />
        <Image 
          src={nasLogo}
          alt="NAS Logo"
          fill
          className="object-contain drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]"
        />
      </motion.div>

      {/* Voting Status */}
      {metadata && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 w-full max-w-2xl"
        >
          <VotingStatus metadata={metadata} />
        </motion.div>
      )}

      {/* Headline */}
      <motion.h1 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400 max-w-5xl text-pretty"
      >
        Don&apos;t Let Your Favorite Go Home.
      </motion.h1>

      {/* Subtext */}
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-gray-400 text-lg md:text-2xl max-w-2xl mb-10 font-medium text-pretty"
      >
        Real-time updates. See who is safe and who needs your help
      </motion.p>

      {/* Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col sm:flex-row items-center gap-4"
      >
        <Link 
          href="/leaderboard"
          className="px-8 py-4 bg-nas-gold text-black font-bold text-lg rounded-full hover:bg-nas-yellow transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,215,0,0.3)]"
        >
          View Full Standings
        </Link>
        <Link href="https://nextafrobeatsstar.com/votes" target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-transparent border border-white/20 text-white font-bold text-lg rounded-full hover:bg-white/10 transition-all">
          How Voting Works
        </Link>
      </motion.div>
    </section>
  );
}

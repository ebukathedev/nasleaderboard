'use client';

import { Contestant, getTotalVotes } from '@/utils/mockData';
import { motion } from 'framer-motion';

interface StatsDashboardProps {
  contestants: Contestant[];
}

export default function StatsDashboard({ contestants }: StatsDashboardProps) {
  const totalVotes = getTotalVotes();
  const remainingContestants = contestants.filter(c => c.status !== 'Eliminated').length;
  const totalContestants = contestants.length;

  return (
    <section className="w-full max-w-4xl mx-auto px-4 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          label="Total Votes Cast" 
          value={totalVotes.toLocaleString()} 
          delay={0}
        />
        <StatCard 
          label="Contestants Remaining" 
          value={`${remainingContestants} / ${totalContestants}`} 
          delay={0.1}
        />
        <StatCard 
          label="Last Updated" 
          value={new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
          delay={0.2}
        />
      </div>
    </section>
  );
}

function StatCard({ label, value, delay }: { label: string; value: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="bg-nas-dark-gray border border-white/5 p-6 text-center"
    >
      <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">
        {label}
      </div>
      <div className="text-2xl md:text-3xl font-mono font-bold text-white">
        {value}
      </div>
    </motion.div>
  );
}

'use client';

import { motion } from 'framer-motion';

interface MusicLoaderProps {
  size?: 'small' | 'large';
  color?: string;
}

export default function MusicLoader({ size = 'large', color = 'bg-nas-gold' }: MusicLoaderProps) {
  const barCount = 5;
  const bars = Array.from({ length: barCount });

  const heightVariants = {
    initial: { height: size === 'large' ? 20 : 10 },
    animate: (i: number) => ({
      height: size === 'large' ? [20, 60, 20] : [10, 25, 10],
      transition: {
        repeat: Infinity,
        duration: 1,
        ease: "easeInOut",
        delay: i * 0.15, // Stagger effect
      },
    } as any),
  };

  return (
    <div className="flex items-center justify-center gap-1.5 h-full">
      {bars.map((_, i) => (
        <motion.div
          key={i}
          custom={i}
          variants={heightVariants}
          initial="initial"
          animate="animate"
          className={`rounded-full ${color} ${size === 'large' ? 'w-3' : 'w-1.5'}`}
        />
      ))}
    </div>
  );
}

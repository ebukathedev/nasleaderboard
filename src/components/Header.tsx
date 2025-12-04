import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

const Header = () => {
  return (
    <header className="w-full py-8 px-4 flex justify-between items-center max-w-4xl mx-auto relative z-10">
      <Link 
        href="/"
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
      >
        <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </div>
        <span className="font-bold hidden md:block">Back to Home</span>
      </Link>

      <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-nas-gold to-yellow-200 tracking-widest uppercase drop-shadow-lg">
        Leaderboard
      </h1>

      <div className="w-24 hidden md:block" /> {/* Spacer for centering */}
    </header>
  );
};

export default Header;

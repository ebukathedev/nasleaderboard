import { Coffee } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full py-12 text-center border-t border-white/5 bg-black flex flex-col items-center gap-6">
      <p className="text-gray-600 text-sm">
        This is an unofficial tracker. Data is scraped and may have a slight delay.
      </p>

      <div className="flex flex-col items-center gap-2">
        <a 
          href="https://buymeacoffee.com/ebukathedev" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-nas-gold/50 transition-all duration-300"
        >
          <Coffee className="w-4 h-4 text-gray-400 group-hover:text-nas-gold transition-colors" />
          <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">
            Fuel the Developer
          </span>
        </a>
        <p className="text-[10px] text-gray-700 max-w-xs leading-relaxed">
          Donations go to the site developer, not the contestants. This does not affect voting results.
        </p>
      </div>
    </footer>
  );
}

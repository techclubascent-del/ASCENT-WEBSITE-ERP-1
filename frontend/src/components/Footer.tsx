import React from 'react';
import { AscentLogo } from './AscentLogo';
import { NavSection } from '../types';
import { ArrowUp } from 'lucide-react';

interface FooterProps {
  onNavigate?: (section: NavSection) => void;
  accentColor1?: string;
  accentColor2?: string;
}

export const Footer: React.FC<FooterProps> = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-[#545454]/20 dark:border-[#545454]/40 bg-[#FAF8F5] dark:bg-[#000000] py-10 px-4 sm:px-6 lg:px-8 z-10 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        {/* Ascent Logo & Description */}
        <div className="flex flex-col space-y-2">
          <AscentLogo size={32} showWordmark={true} />
          <p className="font-body text-xs text-[#545454] dark:text-[#A6A6A6] max-w-sm mt-2 leading-relaxed">
            ASCENT is the decentralized discovery and acceleration platform for deep tech engineering,
            uniting researchers and builders globally.
          </p>
        </div>

        {/* Back to Top */}
        <button
          onClick={scrollToTop}
          className="p-2.5 rounded-full bg-white/60 dark:bg-white/[0.06] border border-white/80 dark:border-white/10 backdrop-blur-xl text-[#545454] dark:text-[#A6A6A6] hover:text-[#1E1E1E] dark:hover:text-white transition-all shadow-sm self-start sm:self-center"
          title="Back to top"
          aria-label="Back to top"
        >
          <ArrowUp size={15} />
        </button>
      </div>
    </footer>
  );
};

export default Footer;

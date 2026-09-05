import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { ArrowRight } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

interface NavbarProps {
  onLaunch: () => void;
  onNavigateSection?: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onLaunch, onNavigateSection }) => {
  const [scrolled, setScrolled] = useState(false);
  const { metrics } = useFinance();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (id: string) => {
    if (onNavigateSection) {
      onNavigateSection(id);
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="fixed top-3 sm:top-4 left-0 right-0 z-50 flex justify-center px-3 sm:px-6 pointer-events-none">
      <div
        className={`pointer-events-auto w-full max-w-5xl rounded-2xl sm:rounded-full transition-all duration-300 flex items-center justify-between px-3 sm:px-4 py-2 border shadow-2xl ${
          scrolled
            ? 'bg-[#080C14]/90 backdrop-blur-2xl border-white/[0.12] shadow-black/80 py-2'
            : 'bg-[#090D16]/75 backdrop-blur-xl border-white/[0.08] shadow-black/50 py-2 sm:py-2.5'
        }`}
      >
        {/* Left: Brand Identity + Clean Single-line Badge */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <Logo size={28} compact={true} />
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[10px] font-mono text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00F59B] animate-pulse" />
            <span className="text-slate-400">Razorpay Buildathon 2026</span>
          </div>
        </div>

        {/* Center: Sleek Segmented Nav Pill */}
        <nav className="hidden md:flex items-center gap-1 bg-white/[0.03] p-1 rounded-full border border-white/[0.05]">
          <button
            onClick={() => handleLinkClick('features')}
            className="px-3.5 py-1 rounded-full text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.08] transition-all"
          >
            Product
          </button>
          <button
            onClick={() => handleLinkClick('pipeline')}
            className="px-3.5 py-1 rounded-full text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.08] transition-all"
          >
            Verification Loop
          </button>
          <button
            onClick={() => handleLinkClick('trust')}
            className="px-3.5 py-1 rounded-full text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.08] transition-all"
          >
            Security
          </button>
          <button
            onClick={() => handleLinkClick('metrics')}
            className="px-3 py-1 rounded-full text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.08] transition-all flex items-center gap-1.5"
          >
            <span>Benchmark</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-[#00F59B]/15 text-[#00F59B] font-bold border border-[#00F59B]/25">
              {metrics.matchRate}%
            </span>
          </button>
        </nav>

        {/* Right: Clean, Focused Primary CTA */}
        <div className="flex items-center">
          <button
            onClick={onLaunch}
            className="group relative inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold text-black bg-gradient-to-r from-[#00F59B] to-[#2CEAA0] hover:from-[#05DF72] hover:to-[#00F59B] transition-all duration-200 shadow-[0_0_15px_rgba(0,245,155,0.25)] hover:shadow-[0_0_22px_rgba(0,245,155,0.45)] hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Launch App</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </header>
  );
};

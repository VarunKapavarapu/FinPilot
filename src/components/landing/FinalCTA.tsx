import React from 'react';
import { ArrowRight, Terminal } from 'lucide-react';
import { BrandIcon } from '../common/Logo';

export const FinalCTA: React.FC<{ onLaunch: () => void }> = ({ onLaunch }) => {
  return (
    <section className="py-24 bg-[#07090D] relative overflow-hidden">
      {/* Background glow lines */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,245,155,0.08)_0,transparent_70%)] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-b from-[#0D1117] to-[#111722] border border-white/[0.12] shadow-2xl shadow-black/80">
          <div className="flex justify-center mb-6">
            <BrandIcon size={56} className="shadow-xl shadow-[#00F59B]/30" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Your books shouldn't require detective work.
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Let FinPilot reconcile the routine, investigate the anomalies, and give your finance team a clear view of what's happening.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onLaunch}
              className="group inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-semibold text-black bg-[#00F59B] hover:bg-[#05DF72] transition-all duration-200 shadow-xl shadow-[#00F59B]/25 hover:-translate-y-0.5"
            >
              <span>Launch FinPilot</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onLaunch}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-all"
            >
              <Terminal className="w-4 h-4 text-[#38BDF8]" />
              <span>Explore the Controller</span>
            </button>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-[11px] font-mono text-slate-500">
            <span>✓ Preloaded with 250 records</span>
            <span>✓ Instant sandbox execution</span>
            <span>✓ Zero setup required</span>
          </div>
        </div>
      </div>
    </section>
  );
};

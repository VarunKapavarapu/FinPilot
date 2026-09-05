import React from 'react';
import { Logo } from '../common/Logo';

export const Footer: React.FC<{ onNavigate: (section: string) => void }> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#07090D] border-t border-white/[0.08] py-16 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Info */}
          <div className="col-span-2 space-y-3">
            <Logo size={28} />
            <p className="text-slate-400 text-xs max-w-sm leading-relaxed">
              AI finance operations for modern businesses. Reconcile transactions, detect discrepancies, investigate exceptions, and forecast cash positions.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="w-2 h-2 rounded-full bg-[#00F59B] animate-pulse" />
              <span className="text-[11px] font-mono text-slate-300">All Systems Operational • SOC-2 Type II</span>
            </div>
          </div>

          {/* Nav columns */}
          <div>
            <h5 className="font-mono text-[11px] uppercase tracking-wider text-slate-200 font-semibold mb-3">
              Product
            </h5>
            <ul className="space-y-2">
              <li><button onClick={() => onNavigate('pipeline')} className="hover:text-white transition-colors">Reconciliation Loop</button></li>
              <li><button onClick={() => onNavigate('features')} className="hover:text-white transition-colors">Exception Investigator</button></li>
              <li><button onClick={() => onNavigate('features')} className="hover:text-white transition-colors">Cash Forecasting</button></li>
              <li><button onClick={() => onNavigate('features')} className="hover:text-white transition-colors">AI Ops Agent</button></li>
            </ul>
          </div>

          <div>
            <h5 className="font-mono text-[11px] uppercase tracking-wider text-slate-200 font-semibold mb-3">
              Security
            </h5>
            <ul className="space-y-2">
              <li><button onClick={() => onNavigate('trust')} className="hover:text-white transition-colors">Trust Center</button></li>
              <li><button onClick={() => onNavigate('trust')} className="hover:text-white transition-colors">Human Approval Gate</button></li>
              <li><button onClick={() => onNavigate('trust')} className="hover:text-white transition-colors">Immutable Audit Logs</button></li>
              <li><button onClick={() => onNavigate('trust')} className="hover:text-white transition-colors">Data Privacy</button></li>
            </ul>
          </div>

          <div>
            <h5 className="font-mono text-[11px] uppercase tracking-wider text-slate-200 font-semibold mb-3">
              About
            </h5>
            <ul className="space-y-2">
              <li><span className="text-slate-500">Autonomous Finance</span></li>
              <li><span className="text-slate-500">Documentation</span></li>
              <li><span className="text-slate-500">Hackathon Edition</span></li>
              <li><span className="text-slate-500">API Reference</span></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
          <p>© 2026 FinPilot AI. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Built for high-velocity finance operations</span>
            <span>v2.6.4 Production Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

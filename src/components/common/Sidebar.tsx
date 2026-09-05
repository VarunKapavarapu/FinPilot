import React, { useState } from 'react';
import { Logo, BrandIcon, ProjectLogo } from './Logo';
import {
  LayoutDashboard,
  Layers,
  ArrowRightLeft,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Bot,
  Database,
  ShieldCheck,
  RotateCcw,
  Home,
  Sliders,
  Receipt,
  CreditCard,
  Play,
  Settings2
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { AIModelSettingsModal } from '../dashboard/AIModelSettingsModal';

interface SidebarProps {
  currentView: string;
  onSelectView: (view: string) => void;
  onGoHome: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onSelectView, onGoHome }) => {
  const { metrics, resetToDemoData, executeRunTheBooksLoop, aiSettings } = useFinance();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'reconciliation', label: 'Reconciliation', icon: Layers, badge: `${metrics.matchRate}%` },
    { id: 'taxlines', label: 'Tax-Line Matcher', icon: Receipt, badge: 'TDS 194J', badgeColor: 'bg-[#00F59B]/15 text-[#00F59B] border-[#00F59B]/30' },
    { id: 'settlements', label: 'Settlement Q&A', icon: CreditCard, badge: 'Razorpay', badgeColor: 'bg-[#38BDF8]/15 text-[#38BDF8] border-[#38BDF8]/30' },
    { id: 'transactions', label: 'Transactions', icon: ArrowRightLeft },
    {
      id: 'exceptions',
      label: 'Honest Exceptions',
      icon: AlertTriangle,
      badge: metrics.exceptionsCount > 0 ? metrics.exceptionsCount.toString() : undefined,
      badgeColor: 'bg-amber-500/15 text-amber-400 border-amber-500/30'
    },
    { id: 'forecast', label: 'Cash Forecast', icon: TrendingUp },
    { id: 'controller', label: 'AI Controller', icon: Bot, isSpecial: true },
    { id: 'performance', label: 'Performance & Accuracy', icon: BarChart3 },
    { id: 'datasources', label: 'Data Sources', icon: Database },
    { id: 'audit', label: 'Audit Log', icon: ShieldCheck },
    { id: 'trust', label: 'Trust & Security', icon: Sliders },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-[#07090D] border-r border-white/[0.08] flex flex-col justify-between h-screen sticky top-0 select-none z-30">
      {/* Top Brand Header */}
      <div>
        <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
          <div onClick={onGoHome} className="cursor-pointer">
            <Logo size={28} />
          </div>
          <button
            onClick={onGoHome}
            title="Return to Landing Page"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <Home className="w-4 h-4" />
          </button>
        </div>

        {/* Action Button: Run the Books */}
        <div className="p-3">
          <button
            onClick={executeRunTheBooksLoop}
            className="group w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#00F59B] to-[#2CEAA0] hover:from-[#05DF72] hover:to-[#00F59B] text-black text-xs font-bold transition-all shadow-md shadow-[#00F59B]/20 hover:shadow-lg hover:shadow-[#00F59B]/30 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0"
          >
            <ProjectLogo size={18} />
            <span>Run the Books & Cash</span>
            <Play className="w-3 h-3 fill-current" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="px-3 py-1 space-y-0.5 overflow-y-auto max-h-[calc(100vh-320px)]">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#111722] text-white border border-white/[0.12] shadow-sm shadow-black/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      isActive
                        ? item.isSpecial
                          ? 'text-[#00F59B]'
                          : 'text-[#38BDF8]'
                        : 'text-slate-500'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${
                      item.badgeColor || 'bg-white/[0.06] text-slate-300 border-white/[0.08]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom status & User profile */}
      <div className="p-3 border-t border-white/[0.06] space-y-2.5">
        {/* Quick Reset Demo button */}
        <button
          onClick={resetToDemoData}
          className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-medium text-slate-400 hover:text-slate-200 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] transition-all"
        >
          <RotateCcw className="w-3 h-3 text-slate-400" />
          <span>Reset Demo (250 Records)</span>
        </button>

        {/* AI Controller Status Indicator & Model Selector Trigger */}
        <div
          onClick={() => setIsSettingsOpen(true)}
          className="p-2.5 rounded-xl bg-[#0D1117] border border-white/[0.06] hover:border-white/[0.15] flex items-center justify-between cursor-pointer transition-colors group"
        >
          <div className="flex items-center gap-2">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F59B] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00F59B]"></span>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-slate-200 truncate">
                {aiSettings.selectedModel.split(' ')[0]}
              </p>
              <p className="text-[9px] text-slate-500 font-mono">
                {aiSettings.verificationThreshold}% Confidence Gate
              </p>
            </div>
          </div>
          <Settings2 className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#00F59B] transition-colors" />
        </div>

        {/* User Card */}
        <div className="flex items-center gap-2.5 px-2 py-1">
          <BrandIcon size={28} />
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-medium text-slate-200 truncate">Finance Controller</span>
            <span className="text-[10px] text-slate-500 truncate">Razorpay Buildathon Edition</span>
          </div>
        </div>
      </div>

      <AIModelSettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </aside>
  );
};

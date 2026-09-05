import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import {
  Layers,
  ArrowUpRight,
  AlertTriangle,
  Wallet,
  TrendingUp,
  Cpu,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { ProjectLogo } from '../common/Logo';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { useFinance } from '../../context/FinanceContext';
import { formatINR } from '../../utils/formatters';
import { StatusBadge } from '../common/Badge';
import { SpotlightCard, AnimatedCounter } from '../common/EliteEffects';

const SPARKLINE_DATA = [
  { day: 'Mon', rate: 88.4 },
  { day: 'Tue', rate: 89.2 },
  { day: 'Wed', rate: 90.1 },
  { day: 'Thu', rate: 91.5 },
  { day: 'Fri', rate: 92.8 },
];

const INFLOW_OUTFLOW_DATA = [
  { day: 'Sep 01', inflow: 280000, outflow: 110000 },
  { day: 'Sep 02', inflow: 340000, outflow: 160000 },
  { day: 'Sep 03', inflow: 410000, outflow: 190000 },
  { day: 'Sep 04', inflow: 520000, outflow: 210000 },
];

export const OverviewView: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
  const { metrics, transactions, setSelectedTransaction, setInvestigatingTransaction, auditLogs } = useFinance();
  const containerRef = useRef<HTMLDivElement>(null);

  // GSAP staggered entrance animation for cards & tables
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.gsap-overview-card', {
        y: 20,
        opacity: 0,
        duration: 0.65,
        stagger: 0.07,
        ease: 'power3.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Highlighted exceptions for quick triage
  const priorityExceptions = transactions
    .filter(t => t.status !== 'MATCHED' && t.resolution !== 'HUMAN_APPROVED')
    .slice(0, 4);

  return (
    <div ref={containerRef} className="space-y-6 pb-12">
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#00F59B]/10 text-[#00F59B] text-[11px] font-mono border border-[#00F59B]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00F59B] animate-pulse" />
              Controller running • Autonomous Mode
            </span>
            <span className="text-xs text-slate-500 font-mono">Synced 2m ago</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Good evening, Finance Team.
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Your books are <span className="text-[#00F59B] font-semibold">{metrics.matchRate}% reconciled</span>. 
            {metrics.exceptionsCount > 0 ? ` ${metrics.exceptionsCount} exceptions require your review.` : ' All records reconciled.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('exceptions')}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25 transition-all flex items-center gap-2"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Review Exceptions ({metrics.exceptionsCount})</span>
          </button>

          <button
            onClick={() => onNavigate('controller')}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#00F59B] text-black hover:bg-[#05DF72] transition-all flex items-center gap-2 shadow-sm shadow-[#00F59B]/20"
          >
            <ProjectLogo size={16} />
            <span>Ask AI Controller</span>
          </button>
        </div>
      </div>

      {/* 5 Main Metric Cards with Elite Spotlight Glow */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* 1. Reconciliation Rate */}
        <SpotlightCard
          onClick={() => onNavigate('reconciliation')}
          glowColor="rgba(0, 245, 155, 0.22)"
          className="gsap-overview-card p-5 cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Reconciliation Rate</span>
              <div className="p-1 rounded-md bg-[#00F59B]/10 text-[#00F59B]">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-extrabold font-mono text-white group-hover:text-[#00F59B] transition-colors">
                <AnimatedCounter value={metrics.matchRate} decimals={1} suffix="%" />
              </div>
              <span className="text-xs font-mono font-semibold text-[#00F59B] flex items-center">
                <ArrowUpRight className="w-3 h-3" /> +4.2%
              </span>
            </div>
          </div>
          <div className="h-10 mt-3 -mx-2 -mb-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SPARKLINE_DATA}>
                <defs>
                  <linearGradient id="rateGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00F59B" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#00F59B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="rate" stroke="#00F59B" strokeWidth={2} fillOpacity={1} fill="url(#rateGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SpotlightCard>

        {/* 2. Transactions Processed */}
        <SpotlightCard
          onClick={() => onNavigate('reconciliation')}
          className="gsap-overview-card p-5 cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Processed Records</span>
              <div className="p-1 rounded-md bg-white/[0.05] text-slate-300">
                <Cpu className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold font-mono text-white">
              <AnimatedCounter value={metrics.recordsProcessed} />
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-4 pt-2 border-t border-white/[0.04] flex items-center justify-between font-mono">
            <span>Auto-resolved:</span>
            <span className="text-[#00F59B] font-bold">
              <AnimatedCounter value={metrics.matchedCount} />
            </span>
          </p>
        </SpotlightCard>

        {/* 3. Exceptions */}
        <SpotlightCard
          onClick={() => onNavigate('exceptions')}
          glowColor="rgba(245, 158, 11, 0.2)"
          className="gsap-overview-card p-5 cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Honest Exceptions</span>
              <div className="p-1 rounded-md bg-amber-500/15 text-amber-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold font-mono text-amber-400">
              <AnimatedCounter value={metrics.exceptionsCount} />
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-4 pt-2 border-t border-white/[0.04] flex items-center justify-between font-mono">
            <span>Confidence &lt;95%:</span>
            <span className="text-amber-400 font-bold">Needs Review</span>
          </p>
        </SpotlightCard>

        {/* 4. Cash Position */}
        <SpotlightCard
          onClick={() => onNavigate('forecast')}
          glowColor="rgba(56, 189, 248, 0.2)"
          className="gsap-overview-card p-5 cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Cash Position</span>
              <div className="p-1 rounded-md bg-sky-500/15 text-[#38BDF8]">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold font-mono text-[#38BDF8]">
              {formatINR(metrics.cashPosition, true)}
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-4 pt-2 border-t border-white/[0.04] flex items-center justify-between font-mono">
            <span>30d Projected:</span>
            <span className="text-[#38BDF8] font-bold">₹26.3L</span>
          </p>
        </SpotlightCard>

        {/* 5. Unresolved Value */}
        <SpotlightCard
          onClick={() => onNavigate('exceptions')}
          glowColor="rgba(251, 146, 60, 0.2)"
          className="gsap-overview-card p-5 cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Unresolved Value</span>
              <div className="p-1 rounded-md bg-orange-500/15 text-orange-400">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold font-mono text-orange-400">
              {formatINR(metrics.discrepancyTotal, true)}
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-4 pt-2 border-t border-white/[0.04] flex items-center justify-between font-mono">
            <span>Variance Pool:</span>
            <span className="text-orange-400 font-bold">18 Items</span>
          </p>
        </SpotlightCard>
      </div>

      {/* Middle Section: Cash Velocity & Priority Exceptions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cash Inflow vs Outflow Velocity */}
        <div className="p-6 rounded-2xl bg-[#0D1117] border border-white/[0.08] lg:col-span-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white tracking-tight">
                Cash Flow Velocity
              </h3>
              <span className="text-[10px] font-mono text-[#00F59B] px-2 py-0.5 rounded bg-[#00F59B]/10">
                Net Positive
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Daily customer settlements vs operational payables over the last 4 billing cycles.
            </p>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={INFLOW_OUTFLOW_DATA}>
                  <XAxis dataKey="day" stroke="#64748B" fontSize={10} tickLine={false} />
                  <YAxis
                    stroke="#64748B"
                    fontSize={10}
                    tickLine={false}
                    tickFormatter={val => `₹${(val / 100000).toFixed(1)}L`}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#111722', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '11px' }}
                    formatter={(val: any) => [`₹${Number(val || 0).toLocaleString('en-IN')}`, '']}
                  />
                  <Bar dataKey="inflow" name="Inflow" fill="#00F59B" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="outflow" name="Outflow" fill="#EF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <button
            onClick={() => onNavigate('forecast')}
            className="mt-4 pt-3 border-t border-white/[0.06] text-xs font-medium text-[#38BDF8] hover:underline flex items-center justify-between"
          >
            <span>Inspect 90-Day Liquidity Forecast</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Priority Exception Triage Queue */}
        <div className="p-6 rounded-2xl bg-[#0D1117] border border-white/[0.08] lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Active Exception Triage ({metrics.exceptionsCount} Pending)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Autonomous agent halted; human authorization required.
              </p>
            </div>
            <button
              onClick={() => onNavigate('exceptions')}
              className="text-xs font-medium text-[#00F59B] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {priorityExceptions.map(t => (
              <div
                key={t.id}
                onClick={() => setSelectedTransaction(t)}
                className="p-3.5 rounded-xl bg-[#111722]/70 border border-white/[0.06] hover:border-white/[0.15] transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-200 group-hover:text-[#00F59B]">
                      {t.id}
                    </span>
                    <StatusBadge status={t.status} />
                    <span className="text-[11px] text-slate-400">{t.source}</span>
                  </div>
                  <p className="text-xs text-slate-300 font-medium">{t.customerName}</p>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{t.aiExplanation}</p>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center">
                  <div className="text-right">
                    <div className="text-xs font-mono font-bold text-white">
                      ₹{t.amount.toLocaleString('en-IN')}
                    </div>
                    {t.discrepancyAmount && (
                      <div className="text-[10px] font-mono text-rose-400">
                        Δ ₹{t.discrepancyAmount.toLocaleString('en-IN')}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={e => {
                      e.stopPropagation();
                      setInvestigatingTransaction(t);
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/[0.05] hover:bg-[#00F59B]/20 hover:text-[#00F59B] border border-white/[0.08] transition-colors"
                  >
                    Investigate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Live Audit Feed */}
      <div className="p-6 rounded-2xl bg-[#0D1117] border border-white/[0.08]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">Recent Controller Actions</h3>
          </div>
          <button
            onClick={() => onNavigate('audit')}
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            Open Full Audit Log →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {auditLogs.slice(0, 3).map(log => (
            <div key={log.id} className="p-3 rounded-xl bg-[#111722]/50 border border-white/[0.04] text-xs">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                <span>{log.timestamp}</span>
                <span className="text-[#00F59B]">{log.actor}</span>
              </div>
              <p className="font-semibold text-slate-200">{log.action}</p>
              <p className="text-slate-400 text-[11px] mt-1 line-clamp-2">{log.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Layers, ArrowRight, ShieldAlert, TrendingUp, CheckCircle, ExternalLink } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatINR } from '../../utils/formatters';
import { StatusBadge } from '../common/Badge';
import { SpotlightCard, AnimatedCounter } from '../common/EliteEffects';
import { BrandIcon, ProjectLogo } from '../common/Logo';

export const ProductShowcase: React.FC<{ onLaunch: () => void }> = ({ onLaunch }) => {
  const { metrics, transactions, setSelectedTransaction } = useFinance();
  const [activeTab, setActiveTab] = useState<'reconciliation' | 'exceptions' | 'forecasting'>('reconciliation');

  // Preview transactions
  const previewTxns = transactions.slice(0, 5);

  return (
    <section id="features" className="py-20 bg-[#07090D] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono text-slate-300 mb-4">
            <ProjectLogo size={16} />
            <span>PRODUCT PREVIEW</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Autonomous finance operations on autopilot.
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            Engineered to process massive financial streams, resolve clear matches deterministically,
            and present forensic evidence for every human decision.
          </p>
        </div>

        {/* Top Metric Cards with Spotlight Effect */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          <SpotlightCard className="p-4">
            <span className="text-[11px] font-mono text-slate-400">Processed</span>
            <div className="text-2xl font-bold font-mono text-white mt-1">
              <AnimatedCounter value={metrics.recordsProcessed} />
            </div>
            <span className="text-[10px] text-slate-500 font-mono">100% Ingested</span>
          </SpotlightCard>

          <SpotlightCard className="p-4" glowColor="rgba(0, 245, 155, 0.18)">
            <span className="text-[11px] font-mono text-slate-400">Matched</span>
            <div className="text-2xl font-bold font-mono text-[#00F59B] mt-1">
              <AnimatedCounter value={metrics.matchedCount} />
            </div>
            <span className="text-[10px] text-emerald-500/80 font-mono">Zero variance</span>
          </SpotlightCard>

          <SpotlightCard className="p-4" glowColor="rgba(0, 245, 155, 0.22)">
            <span className="text-[11px] font-mono text-slate-400">Match Rate</span>
            <div className="text-2xl font-bold font-mono text-[#00F59B] mt-1">
              <AnimatedCounter value={metrics.matchRate} decimals={1} suffix="%" />
            </div>
            <span className="text-[10px] text-emerald-500/80 font-mono">+4.2% today</span>
          </SpotlightCard>

          <SpotlightCard className="p-4" glowColor="rgba(245, 158, 11, 0.18)">
            <span className="text-[11px] font-mono text-slate-400">Exceptions</span>
            <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
              <AnimatedCounter value={metrics.exceptionsCount} />
            </div>
            <span className="text-[10px] text-amber-500/80 font-mono">Human review</span>
          </SpotlightCard>

          <SpotlightCard className="p-4" glowColor="rgba(251, 146, 60, 0.18)">
            <span className="text-[11px] font-mono text-slate-400">Discrepancy</span>
            <div className="text-2xl font-bold font-mono text-orange-400 mt-1">
              {formatINR(metrics.discrepancyTotal, true)}
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Under triage</span>
          </SpotlightCard>

          <SpotlightCard className="p-4" glowColor="rgba(56, 189, 248, 0.18)">
            <span className="text-[11px] font-mono text-slate-400">Cash Position</span>
            <div className="text-2xl font-bold font-mono text-[#38BDF8] mt-1">
              {formatINR(metrics.cashPosition, true)}
            </div>
            <span className="text-[10px] text-sky-500/80 font-mono">30-day: ₹26.3L</span>
          </SpotlightCard>
        </div>

        {/* Interactive Dashboard Container */}
        <div className="rounded-2xl bg-[#0D1117] border border-white/[0.1] shadow-2xl overflow-hidden shadow-black/80">
          {/* Mock Window Top Bar */}
          <div className="px-5 py-3.5 bg-[#111722] border-b border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BrandIcon size={20} />
              <div className="flex items-center gap-1.5 pl-1">
                <span className="w-2 h-2 rounded-full bg-rose-500/80" />
                <span className="w-2 h-2 rounded-full bg-amber-500/80" />
                <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-xs font-mono text-slate-400 pl-2">
                FinPilot AI Controller — Workspace / Production Ledger
              </span>
            </div>

            {/* Quick interactive tabs */}
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/[0.06]">
              <button
                onClick={() => setActiveTab('reconciliation')}
                className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                  activeTab === 'reconciliation'
                    ? 'bg-[#111722] text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Reconciliation
              </button>
              <button
                onClick={() => setActiveTab('exceptions')}
                className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                  activeTab === 'exceptions'
                    ? 'bg-[#111722] text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Exceptions (18)
              </button>
            </div>
          </div>

          {/* Table Preview */}
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.06] text-[11px] font-mono text-slate-400 uppercase">
                    <th className="pb-3 font-semibold">Transaction</th>
                    <th className="pb-3 font-semibold">Source</th>
                    <th className="pb-3 font-semibold">Customer / Reference</th>
                    <th className="pb-3 font-semibold text-right">Amount</th>
                    <th className="pb-3 font-semibold text-center">Confidence</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04] text-xs">
                  {previewTxns.map(t => (
                    <tr
                      key={t.id}
                      onClick={() => {
                        setSelectedTransaction(t);
                        onLaunch();
                      }}
                      className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 font-mono font-semibold text-slate-200 group-hover:text-[#00F59B]">
                        {t.id}
                      </td>
                      <td className="py-3.5 text-slate-300">
                        <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">
                          {t.source}
                        </span>
                      </td>
                      <td className="py-3.5">
                        <div className="font-medium text-slate-200">{t.customerName}</div>
                        {t.invoiceId && (
                          <div className="text-[10px] font-mono text-slate-500">{t.invoiceId}</div>
                        )}
                      </td>
                      <td className="py-3.5 font-mono font-medium text-slate-100 text-right">
                        ₹{t.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 text-center">
                        <span
                          className={`font-mono text-[11px] font-bold ${
                            t.confidence >= 95
                              ? 'text-[#00F59B]'
                              : t.confidence >= 85
                              ? 'text-amber-400'
                              : 'text-rose-400'
                          }`}
                        >
                          {t.confidence}%
                        </span>
                      </td>
                      <td className="py-3.5">
                        <StatusBadge status={t.status} />
                      </td>
                      <td className="py-3.5 text-right">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            setSelectedTransaction(t);
                            onLaunch();
                          }}
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-[#00F59B] hover:underline"
                        >
                          <span>Inspect</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bottom Bar inside showcase */}
            <div className="mt-6 pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-400">
                Displaying 5 of 250 processed synthetic records. Click any row to inspect AI evidence.
              </div>
              <button
                onClick={onLaunch}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-black bg-[#00F59B] hover:bg-[#05DF72] transition-colors"
              >
                <span>Launch Full Controller Dashboard</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

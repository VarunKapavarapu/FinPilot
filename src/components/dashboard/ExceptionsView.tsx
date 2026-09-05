import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ShieldAlert,
  Clock,
  Layers
} from 'lucide-react';
import { ProjectLogo } from '../common/Logo';
import { useFinance } from '../../context/FinanceContext';
import { formatINR } from '../../utils/formatters';
import { StatusBadge, SeverityBadge } from '../common/Badge';
import { SeverityLevel } from '../../types/finance';

export const ExceptionsView: React.FC = () => {
  const {
    transactions,
    metrics,
    setSelectedTransaction,
    setInvestigatingTransaction,
    approveTransaction,
    rejectTransaction,
  } = useFinance();

  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');

  // Unresolved exceptions
  const exceptions = useMemo(() => {
    return transactions.filter(t => t.status !== 'MATCHED' && t.resolution !== 'HUMAN_APPROVED');
  }, [transactions]);

  // Aggregate category sums
  const amountMismatchTotal = useMemo(() => {
    return exceptions
      .filter(t => t.status === 'AMOUNT MISMATCH' || t.status === 'PARTIAL MATCH')
      .reduce((sum, t) => sum + (t.discrepancyAmount || 0), 0);
  }, [exceptions]);

  const missingTotal = useMemo(() => {
    return exceptions
      .filter(t => t.status === 'MISSING')
      .reduce((sum, t) => sum + (t.discrepancyAmount || 0), 0);
  }, [exceptions]);

  const duplicateTotal = useMemo(() => {
    return exceptions
      .filter(t => t.status === 'DUPLICATE')
      .reduce((sum, t) => sum + (t.discrepancyAmount || 0), 0);
  }, [exceptions]);

  const unknownTotal = useMemo(() => {
    return exceptions
      .filter(t => t.status === 'REVIEW REQUIRED')
      .reduce((sum, t) => sum + (t.discrepancyAmount || 0), 0);
  }, [exceptions]);

  // Filtered exceptions list
  const filteredExceptions = useMemo(() => {
    return exceptions.filter(t => {
      if (severityFilter !== 'ALL' && t.severity !== severityFilter) return false;
      if (typeFilter !== 'ALL' && t.status !== typeFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          t.id.toLowerCase().includes(q) ||
          t.customerName.toLowerCase().includes(q) ||
          (t.invoiceId && t.invoiceId.toLowerCase().includes(q)) ||
          t.aiExplanation.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [exceptions, severityFilter, typeFilter, search]);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
              Confidence &lt; 95% Threshold
            </span>
            <span className="text-xs text-slate-500 font-mono">• Human Sign-Off Gate</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {metrics.exceptionsCount} Exceptions Require Attention
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            FinPilot automatically quarantined anomalous records. Review forensic evidence and authorize adjustments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-4 py-2 rounded-xl bg-[#0D1117] border border-orange-500/30">
            <span className="text-[10px] font-mono text-slate-400">Total Discrepancy Pool</span>
            <p className="text-lg font-mono font-bold text-orange-400">
              {formatINR(metrics.discrepancyTotal)}
            </p>
          </div>
        </div>
      </div>

      {/* 4 Summary Exception Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Amount mismatch */}
        <div
          onClick={() => setTypeFilter(typeFilter === 'AMOUNT MISMATCH' ? 'ALL' : 'AMOUNT MISMATCH')}
          className={`p-4 rounded-xl bg-[#0D1117] border transition-all cursor-pointer ${
            typeFilter === 'AMOUNT MISMATCH' ? 'border-orange-500 bg-[#111722]' : 'border-white/[0.08] hover:border-orange-500/40'
          }`}
        >
          <span className="text-xs font-medium text-slate-400">Amount Mismatch</span>
          <div className="text-2xl font-bold font-mono text-orange-400 mt-1">
            {formatINR(amountMismatchTotal || 82400)}
          </div>
          <p className="text-[10px] font-mono text-slate-500 mt-2">
            7 records • Disputed balances & TDS
          </p>
        </div>

        {/* 2. Missing settlement */}
        <div
          onClick={() => setTypeFilter(typeFilter === 'MISSING' ? 'ALL' : 'MISSING')}
          className={`p-4 rounded-xl bg-[#0D1117] border transition-all cursor-pointer ${
            typeFilter === 'MISSING' ? 'border-rose-500 bg-[#111722]' : 'border-white/[0.08] hover:border-rose-500/40'
          }`}
        >
          <span className="text-xs font-medium text-slate-400">Missing Settlement</span>
          <div className="text-2xl font-bold font-mono text-rose-400 mt-1">
            {formatINR(missingTotal || 51200)}
          </div>
          <p className="text-[10px] font-mono text-slate-500 mt-2">
            4 records • Unmapped bank deposits
          </p>
        </div>

        {/* 3. Duplicate transaction */}
        <div
          onClick={() => setTypeFilter(typeFilter === 'DUPLICATE' ? 'ALL' : 'DUPLICATE')}
          className={`p-4 rounded-xl bg-[#0D1117] border transition-all cursor-pointer ${
            typeFilter === 'DUPLICATE' ? 'border-purple-500 bg-[#111722]' : 'border-white/[0.08] hover:border-purple-500/40'
          }`}
        >
          <span className="text-xs font-medium text-slate-400">Duplicate Transaction</span>
          <div className="text-2xl font-bold font-mono text-purple-400 mt-1">
            {formatINR(duplicateTotal || 34500)}
          </div>
          <p className="text-[10px] font-mono text-slate-500 mt-2">
            3 records • Gateway multi-capture
          </p>
        </div>

        {/* 4. Unknown transaction */}
        <div
          onClick={() => setTypeFilter(typeFilter === 'REVIEW REQUIRED' ? 'ALL' : 'REVIEW REQUIRED')}
          className={`p-4 rounded-xl bg-[#0D1117] border transition-all cursor-pointer ${
            typeFilter === 'REVIEW REQUIRED' ? 'border-sky-500 bg-[#111722]' : 'border-white/[0.08] hover:border-sky-500/40'
          }`}
        >
          <span className="text-xs font-medium text-slate-400">Unknown / Hold</span>
          <div className="text-2xl font-bold font-mono text-sky-400 mt-1">
            {formatINR(unknownTotal || 18900)}
          </div>
          <p className="text-[10px] font-mono text-slate-500 mt-2">
            4 records • Mandate & FX fees
          </p>
        </div>
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search exceptions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-[#0D1117] border border-white/[0.08] rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00F59B]/50"
          />
        </div>

        {/* Severity Filter pills */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          <span className="text-xs text-slate-500 mr-1 font-mono">Severity:</span>
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(sev => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-2.5 py-1 rounded text-[11px] font-mono font-medium transition-all ${
                severityFilter === sev
                  ? 'bg-white/[0.1] text-white border border-white/[0.2]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Exception Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredExceptions.map(t => (
          <div
            key={t.id}
            onClick={() => setSelectedTransaction(t)}
            className="p-5 rounded-2xl bg-[#0D1117] border border-white/[0.08] hover:border-white/[0.16] transition-all cursor-pointer flex flex-col justify-between group space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-white group-hover:text-[#00F59B]">
                    {t.id}
                  </span>
                  <StatusBadge status={t.status} />
                  <SeverityBadge severity={t.severity} />
                </div>
                <span className="text-[11px] font-mono text-slate-400">{t.source}</span>
              </div>

              <div className="flex items-baseline justify-between mt-1">
                <h4 className="text-sm font-semibold text-slate-200">{t.customerName}</h4>
                <div className="text-right">
                  <span className="font-mono text-sm font-bold text-white">
                    ₹{t.amount.toLocaleString('en-IN')}
                  </span>
                  {t.discrepancyAmount && t.discrepancyAmount > 0 ? (
                    <div className="text-[10px] font-mono text-rose-400">
                      Variance: ₹{t.discrepancyAmount.toLocaleString('en-IN')}
                    </div>
                  ) : null}
                </div>
              </div>

              <p className="text-xs text-slate-400 mt-2.5 leading-relaxed bg-white/[0.02] p-3 rounded-lg border border-white/[0.04]">
                {t.aiExplanation}
              </p>
            </div>

            {/* Card Actions */}
            <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] font-mono">
                <span className="text-slate-500">Confidence:</span>
                <span
                  className={`font-bold ${
                    t.confidence >= 90 ? 'text-amber-400' : 'text-rose-400'
                  }`}
                >
                  {t.confidence}%
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={e => {
                    e.stopPropagation();
                    setInvestigatingTransaction(t);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#00F59B]/10 hover:bg-[#00F59B]/20 text-[#00F59B] border border-[#00F59B]/20 transition-colors flex items-center gap-1.5"
                >
                  <ProjectLogo size={14} />
                  <span>Investigate</span>
                </button>

                <button
                  onClick={e => {
                    e.stopPropagation();
                    approveTransaction(t.id, 'Approved via Exception Center quick action');
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-colors"
                >
                  Approve
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredExceptions.length === 0 && (
        <div className="p-12 rounded-2xl bg-[#0D1117] border border-white/[0.06] text-center">
          <CheckCircle2 className="w-10 h-10 text-[#00F59B] mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">No exceptions match your filter</h3>
          <p className="text-xs text-slate-400 mt-1">
            All records in this category are fully reconciled and verified.
          </p>
        </div>
      )}
    </div>
  );
};

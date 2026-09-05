import React from 'react';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Bot,
  ExternalLink,
  FileText,
  CreditCard
} from 'lucide-react';
import { ProjectLogo } from '../common/Logo';
import { useFinance } from '../../context/FinanceContext';
import { StatusBadge, SeverityBadge } from '../common/Badge';
import { formatINR } from '../../utils/formatters';

export const ExplanationPanel: React.FC = () => {
  const {
    selectedTransaction,
    setSelectedTransaction,
    setInvestigatingTransaction,
    approveTransaction,
    rejectTransaction,
    markAsException,
  } = useFinance();

  if (!selectedTransaction) return null;

  const t = selectedTransaction;
  const isResolved = t.status === 'MATCHED' || t.resolution === 'HUMAN_APPROVED';

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-full max-w-md bg-[#0D1117] border-l border-white/[0.1] shadow-2xl flex flex-col justify-between animate-in slide-in-from-right-5 duration-300">
      {/* Top Header */}
      <div>
        <div className="p-5 border-b border-white/[0.08] flex items-center justify-between bg-[#111722]/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-white">{t.id}</span>
              <StatusBadge status={t.status} />
            </div>
            <span className="text-xs text-slate-400 font-mono mt-0.5 block">
              {t.source} • {t.date} {t.time}
            </span>
          </div>

          <button
            onClick={() => setSelectedTransaction(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 space-y-6 overflow-y-auto max-h-[calc(100vh-170px)]">
          {/* Key Amount & Confidence Overview */}
          <div className="p-4 rounded-xl bg-[#111722] border border-white/[0.06] flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400">Transaction Amount</span>
              <div className="text-2xl font-bold font-mono text-white mt-0.5">
                ₹{t.amount.toLocaleString('en-IN')}
              </div>
              {t.expectedAmount && t.expectedAmount !== t.amount && (
                <div className="text-[11px] font-mono text-slate-400 mt-1">
                  Expected Invoice Total: ₹{t.expectedAmount.toLocaleString('en-IN')}
                </div>
              )}
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono uppercase text-slate-400">AI Confidence</span>
              <div
                className={`text-2xl font-bold font-mono mt-0.5 ${
                  t.confidence >= 95 ? 'text-[#00F59B]' : t.confidence >= 85 ? 'text-amber-400' : 'text-rose-400'
                }`}
              >
                {t.confidence}%
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Threshold: 95%</span>
            </div>
          </div>

          {/* AI Decision & Reasoning */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <ProjectLogo size={16} />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                AI Controller Finding
              </h4>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs text-slate-300 leading-relaxed font-normal">
              {t.aiExplanation}
            </div>
          </div>

          {/* Forensic Evidence Checklist */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              Correlation Evidence
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#111722]/60 border border-white/[0.04]">
                <div className="flex items-center gap-2 text-slate-200">
                  {t.evidence.customerMatched ? (
                    <CheckCircle2 className="w-4 h-4 text-[#00F59B]" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                  )}
                  <span>Customer Identity Verified</span>
                </div>
                <span className="font-mono text-[11px] text-slate-400">{t.customerName}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#111722]/60 border border-white/[0.04]">
                <div className="flex items-center gap-2 text-slate-200">
                  {t.evidence.referenceMatched ? (
                    <CheckCircle2 className="w-4 h-4 text-[#00F59B]" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                  )}
                  <span>Reference Match</span>
                </div>
                <span className="font-mono text-[11px] text-slate-400">
                  {t.invoiceId || 'Unmapped'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#111722]/60 border border-white/[0.04]">
                <div className="flex items-center gap-2 text-slate-200">
                  {t.evidence.dateWithinWindow ? (
                    <CheckCircle2 className="w-4 h-4 text-[#00F59B]" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                  )}
                  <span>Settlement Window (T+2)</span>
                </div>
                <span className="font-mono text-[11px] text-slate-400">{t.date}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#111722]/60 border border-white/[0.04]">
                <div className="flex items-center gap-2 text-slate-200">
                  {t.evidence.amountMatched ? (
                    <CheckCircle2 className="w-4 h-4 text-[#00F59B]" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                  )}
                  <span>Monetary Balance</span>
                </div>
                <span className="font-mono text-[11px] text-slate-400">
                  {t.discrepancyAmount && t.discrepancyAmount > 0
                    ? `Variance: -₹${t.discrepancyAmount.toLocaleString('en-IN')}`
                    : 'Exact (0 Delta)'}
                </span>
              </div>
            </div>
            {t.evidence.notes && (
              <p className="text-[11px] text-slate-400 italic pt-1 pl-1">
                Note: {t.evidence.notes}
              </p>
            )}
          </div>

          {/* Related Invoices & Settlements */}
          {t.invoiceId && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                Linked Financial Records
              </h4>
              <div className="p-3 rounded-lg bg-[#111722] border border-white/[0.06] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#38BDF8]" />
                  <div>
                    <p className="font-mono font-medium text-slate-200">{t.invoiceId}</p>
                    <p className="text-[10px] text-slate-500">Accounts Receivable Ledger</p>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-slate-300">
                  {t.expectedAmount ? `₹${t.expectedAmount.toLocaleString('en-IN')}` : 'Verified'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer: Human-in-the-loop Controls */}
      <div className="p-4 bg-[#111722] border-t border-white/[0.08] space-y-2.5">
        {!isResolved ? (
          <>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  approveTransaction(t.id);
                  setSelectedTransaction(null);
                }}
                className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold text-black bg-[#00F59B] hover:bg-[#05DF72] transition-colors flex items-center justify-center gap-1.5 shadow-sm shadow-[#00F59B]/20"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Approve Match</span>
              </button>

              <button
                onClick={() => {
                  markAsException(t.id);
                  setSelectedTransaction(null);
                }}
                className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold text-amber-300 bg-amber-500/15 border border-amber-500/30 hover:bg-amber-500/25 transition-colors flex items-center justify-center gap-1.5"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Flag Exception</span>
              </button>
            </div>

            <button
              onClick={() => {
                setInvestigatingTransaction(t);
                setSelectedTransaction(null);
              }}
              className="w-full py-2 px-3 rounded-lg text-xs font-medium text-slate-300 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-colors flex items-center justify-center gap-2"
            >
              <Bot className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Launch AI Forensic Investigator</span>
            </button>
          </>
        ) : (
          <div className="p-2.5 rounded-lg bg-[#00F59B]/10 border border-[#00F59B]/20 flex items-center justify-between text-xs text-[#00F59B]">
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              Reconciled & Posted
            </span>
            <span className="text-[10px] font-mono text-slate-400">{t.resolvedAt || 'Verified'}</span>
          </div>
        )}
      </div>
    </div>
  );
};

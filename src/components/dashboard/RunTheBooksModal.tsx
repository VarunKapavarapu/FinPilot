import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Check,
  TrendingUp,
  ShieldCheck,
  FileCheck,
  Layers,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useFinance } from '../../context/FinanceContext';
import { formatINR } from '../../utils/formatters';
import { BrandIcon } from '../common/Logo';

const LOOP_STAGES = [
  { stage: 'IMPORT', title: 'Importing Multi-Source Streams', subtitle: 'Razorpay PG, HDFC Bank, ICICI Bank, RazorpayX, ERP Invoices (250 Records)' },
  { stage: 'UNDERSTAND', title: 'Understanding Semantic Relationships', subtitle: 'Correlating Customer Identifiers, GSTIN, and Idempotency Keys' },
  { stage: 'RECONCILE', title: 'Executing 4-Way Deterministic Matching', subtitle: 'Comparing Gross vs MDR Fees vs Net Bank Credits' },
  { stage: 'TAX_MATCH', title: 'Running Tax-Line Matcher', subtitle: 'Resolving TDS Section 194J (10%), 194C (2%), and GST-TDS lines' },
  { stage: 'DETECT_EXCEPTIONS', title: 'Detecting Anomalies & False Matches', subtitle: 'Quarantining 18 exceptions with confidence < 95%' },
  { stage: 'SAFEGUARD', title: 'Enforcing Human-in-the-Loop Governance', subtitle: 'Halt autonomous posting on duplicates & partial amounts' },
  { stage: 'FORECAST', title: 'Calculating Forward Cash Position', subtitle: 'Projecting 7d (₹21.7L), 30d (₹26.3L), and 90d (₹31.8L) liquidity' },
  { stage: 'REPORT', title: 'Closing Books & Emitting Cryptographic Audit Trail', subtitle: 'Ledger finalized. 232 verified matches auto-posted.' },
];

export const RunTheBooksModal: React.FC = () => {
  const { isRunTheBooksOpen, setIsRunTheBooksOpen, metrics, resetToDemoData } = useFinance();
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  useEffect(() => {
    if (!isRunTheBooksOpen) {
      setCurrentStageIndex(0);
      setIsCompleted(false);
      return;
    }

    setCurrentStageIndex(0);
    setIsCompleted(false);

    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      if (idx < LOOP_STAGES.length) {
        setCurrentStageIndex(idx);
      } else {
        clearInterval(interval);
        setIsCompleted(true);
        // Trigger celebratory confetti
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#00F59B', '#38BDF8', '#F59E0B'],
          });
        } catch {
          // ignore if canvas not supported
        }
      }
    }, 450);

    return () => clearInterval(interval);
  }, [isRunTheBooksOpen]);

  if (!isRunTheBooksOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-[#0D1117] border border-white/[0.12] rounded-3xl shadow-2xl overflow-hidden shadow-black/90 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#111722] via-[#0D1117] to-[#111722] border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BrandIcon size={38} />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
                  Autonomous Finance Ops Loop — Run the Books
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00F59B]/15 text-[#00F59B] border border-[#00F59B]/30 font-bold">
                  LIVE AGENT
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Import → Understand → Reconcile → Verify → Tax-Line Match → Resolve → Forecast
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsRunTheBooksOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 uppercase tracking-wider">
                Verification Capacity Pipeline
              </span>
              <span className="text-[#00F59B] font-bold">
                {isCompleted ? '100% COMPLETE' : `${Math.round(((currentStageIndex + 1) / LOOP_STAGES.length) * 100)}%`}
              </span>
            </div>
            <div className="w-full bg-white/[0.06] h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#00F59B] to-[#38BDF8] h-full transition-all duration-300 rounded-full"
                style={{
                  width: isCompleted ? '100%' : `${((currentStageIndex + 1) / LOOP_STAGES.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Step Timeline */}
          <div className="space-y-2">
            {LOOP_STAGES.map((step, idx) => {
              const isPassed = isCompleted || currentStageIndex > idx;
              const isCurrent = !isCompleted && currentStageIndex === idx;

              return (
                <div
                  key={step.stage}
                  className={`p-3 rounded-xl border text-xs flex items-center justify-between transition-all ${
                    isPassed
                      ? 'bg-emerald-500/5 border-emerald-500/20 text-slate-300'
                      : isCurrent
                      ? 'bg-[#111722] border-[#00F59B]/50 text-white shadow-lg shadow-[#00F59B]/10'
                      : 'border-white/[0.04] text-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isPassed ? (
                      <div className="w-5 h-5 rounded-full bg-[#00F59B]/20 text-[#00F59B] flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    ) : isCurrent ? (
                      <Loader2 className="w-5 h-5 text-[#00F59B] animate-spin" />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-white/[0.04] text-slate-600 flex items-center justify-center text-[10px] font-mono">
                        {idx + 1}
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-slate-200">{step.title}</div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">{step.subtitle}</div>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">
                    {isPassed ? 'VERIFIED' : isCurrent ? 'RUNNING...' : 'QUEUED'}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Completion Scorecard */}
          {isCompleted && (
            <div className="p-5 rounded-2xl bg-gradient-to-b from-[#111722] to-[#0D1117] border border-[#00F59B]/40 space-y-4 animate-in zoom-in-95 duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#00F59B]" />
                  <h3 className="text-base font-bold text-white tracking-tight">
                    Books Successfully Closed & Cash Reconciled!
                  </h3>
                </div>
                <span className="text-xs font-mono text-[#00F59B] font-bold">138 txns/sec</span>
              </div>

              {/* 4 Scorecard Metric Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-xl bg-[#07090D] border border-white/[0.06]">
                  <span className="text-[10px] font-mono text-slate-400">Processed</span>
                  <div className="text-xl font-bold font-mono text-white mt-0.5">
                    {metrics.recordsProcessed} Records
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#07090D] border border-[#00F59B]/30">
                  <span className="text-[10px] font-mono text-slate-400">Match Rate</span>
                  <div className="text-xl font-bold font-mono text-[#00F59B] mt-0.5">
                    {metrics.matchRate}%
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#07090D] border border-amber-500/30">
                  <span className="text-[10px] font-mono text-slate-400">Honest Exceptions</span>
                  <div className="text-xl font-bold font-mono text-amber-400 mt-0.5">
                    {metrics.exceptionsCount} Quarantined
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#07090D] border border-sky-500/30">
                  <span className="text-[10px] font-mono text-slate-400">Current Cash</span>
                  <div className="text-xl font-bold font-mono text-[#38BDF8] mt-0.5">
                    ₹18.4L
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-black/40 p-3 rounded-xl border border-white/[0.06]">
                <span className="font-semibold text-white">Audited Controller Output: </span>
                232 records matched deterministically with zero variance. 
                18 exceptions flagged below the 95% confidence threshold and safely queued for human review. 
                Forward cash runway stands at ₹26.3L at 30 days.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 bg-[#111722] border-t border-white/[0.08] flex items-center justify-between">
          <div className="text-xs text-slate-400 font-mono">
            Model: <span className="text-[#00F59B]">Razorpay-Ops Fine-tuned Fintech</span>
          </div>

          <button
            onClick={() => setIsRunTheBooksOpen(false)}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-black bg-[#00F59B] hover:bg-[#05DF72] transition-colors flex items-center gap-2 shadow-md shadow-[#00F59B]/20"
          >
            <span>{isCompleted ? 'View Reconciled Books' : 'Dismiss'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Bot,
  ArrowRight,
  ShieldAlert,
  Clock,
  Check
} from 'lucide-react';
import { ProjectLogo } from '../common/Logo';
import { useFinance } from '../../context/FinanceContext';
import { AIToolStep, Transaction } from '../../types/finance';
import { StatusBadge } from '../common/Badge';

const INVESTIGATION_STEPS: { name: string; message: string; duration: number }[] = [
  { name: 'search_invoices', message: 'Searching enterprise invoices in ERP...', duration: 500 },
  { name: 'check_bank_records', message: 'Querying bank direct feeds & RTGS settlement webhooks...', duration: 600 },
  { name: 'compare_settlements', message: 'Comparing payment gateway authorization timestamps...', duration: 550 },
  { name: 'check_duplicate_patterns', message: 'Scanning for duplicate fingerprint hashes & idempotency keys...', duration: 650 },
  { name: 'analyze_timing', message: 'Evaluating T+2 cutoff windows & banking clearing cycles...', duration: 500 },
  { name: 'synthesize_findings', message: 'Generating explainable forensic report & recommendation...', duration: 450 },
];

export const InvestigatorModal: React.FC = () => {
  const { investigatingTransaction, setInvestigatingTransaction, approveTransaction, rejectTransaction } = useFinance();
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isDone, setIsDone] = useState<boolean>(false);

  useEffect(() => {
    if (!investigatingTransaction) {
      setCurrentStepIndex(0);
      setIsDone(false);
      return;
    }

    setCurrentStepIndex(0);
    setIsDone(false);

    let step = 0;
    const runNextStep = () => {
      if (step < INVESTIGATION_STEPS.length) {
        setCurrentStepIndex(step);
        const duration = INVESTIGATION_STEPS[step].duration;
        step++;
        setTimeout(runNextStep, duration);
      } else {
        setIsDone(true);
      }
    };

    const timer = setTimeout(runNextStep, 200);
    return () => clearTimeout(timer);
  }, [investigatingTransaction]);

  if (!investigatingTransaction) return null;

  const t = investigatingTransaction;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#0D1117] border border-white/[0.12] rounded-2xl shadow-2xl overflow-hidden shadow-black/80 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 bg-[#111722] border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#00F59B]/15 text-[#00F59B]">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-tight">
                  AI Forensic Investigator
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.06] text-slate-300">
                  {t.id}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Investigating {t.customerName} (₹{t.amount.toLocaleString('en-IN')})
              </p>
            </div>
          </div>

          <button
            onClick={() => setInvestigatingTransaction(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Animated Tool-Execution Timeline */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Agent Tool Execution Trace
              </span>
              <span className="text-[11px] font-mono text-[#00F59B]">
                {!isDone ? 'Analyzing records...' : 'Completed in 3.2s'}
              </span>
            </div>

            <div className="space-y-2">
              {INVESTIGATION_STEPS.map((step, idx) => {
                const isStepFinished = isDone || currentStepIndex > idx;
                const isStepRunning = !isDone && currentStepIndex === idx;

                return (
                  <div
                    key={step.name}
                    className={`p-2.5 rounded-lg border text-xs flex items-center justify-between transition-all ${
                      isStepFinished
                        ? 'bg-emerald-500/5 border-emerald-500/20 text-slate-300'
                        : isStepRunning
                        ? 'bg-[#111722] border-[#00F59B]/40 text-white shadow-sm'
                        : 'bg-transparent border-white/[0.04] text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {isStepFinished ? (
                        <div className="w-4 h-4 rounded-full bg-[#00F59B]/20 text-[#00F59B] flex items-center justify-center">
                          <Check className="w-3 h-3" />
                        </div>
                      ) : isStepRunning ? (
                        <Loader2 className="w-4 h-4 text-[#00F59B] animate-spin" />
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-white/[0.04] text-slate-600 flex items-center justify-center text-[10px] font-mono">
                          {idx + 1}
                        </div>
                      )}
                      <span className="font-mono text-[11px]">{step.message}</span>
                    </div>

                    <span className="text-[10px] font-mono text-slate-500">
                      {isStepFinished ? `${step.duration}ms` : isStepRunning ? 'running' : 'queued'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Forensic Finding Box when done */}
          {isDone && (
            <div className="p-5 rounded-xl bg-[#111722] border border-[#00F59B]/30 space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ProjectLogo size={16} />
                  <h4 className="text-sm font-bold text-white tracking-tight">AI Finding</h4>
                </div>
                <StatusBadge status={t.status} />
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-[#07090D] p-3 rounded-lg border border-white/[0.06]">
                {t.aiExplanation}
              </p>

              {/* Specific Duplicate Evidence Card if Duplicate */}
              {t.status === 'DUPLICATE' && (
                <div className="p-3.5 rounded-lg bg-purple-500/10 border border-purple-500/20 space-y-2">
                  <div className="text-[11px] font-mono font-semibold text-purple-300 uppercase">
                    Duplicate Pair Comparison
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2 rounded bg-black/30 border border-white/[0.04]">
                      <span className="text-[10px] font-mono text-slate-400">Transaction A (Original)</span>
                      <p className="font-mono font-bold text-white mt-1">₹{t.amount.toLocaleString('en-IN')}</p>
                      <p className="text-[10px] text-slate-400 font-mono">09:32 AM • Authorized</p>
                    </div>
                    <div className="p-2 rounded bg-black/30 border border-white/[0.04]">
                      <span className="text-[10px] font-mono text-slate-400">Transaction B ({t.id})</span>
                      <p className="font-mono font-bold text-white mt-1">₹{t.amount.toLocaleString('en-IN')}</p>
                      <p className="text-[10px] text-slate-400 font-mono">09:34 AM • Duplicate Capture</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-purple-200">
                    Same customer ({t.customerName}), invoice reference ({t.invoiceId || 'N/A'}), and amount.
                  </p>
                </div>
              )}

              {/* Guardrail Disclaimer */}
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-start gap-2.5 text-xs text-amber-300">
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Recommended Action: Flag for human approval</p>
                  <p className="text-[11px] text-amber-400/90 mt-0.5">
                    FinPilot governance policy prohibits automated write-offs or refunds without verified human sign-off.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#111722] border-t border-white/[0.08] flex items-center justify-between gap-3">
          <button
            onClick={() => setInvestigatingTransaction(null)}
            className="px-4 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-white/[0.04] border border-white/[0.08] transition-colors"
          >
            Close
          </button>

          {isDone && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  rejectTransaction(t.id, 'Disputed duplicate / anomaly via AI forensic investigation.');
                  setInvestigatingTransaction(null);
                }}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-rose-300 bg-rose-500/15 border border-rose-500/30 hover:bg-rose-500/25 transition-colors"
              >
                Reject & Flag Dispute
              </button>

              <button
                onClick={() => {
                  approveTransaction(t.id, 'Approved resolution based on AI forensic evidence.');
                  setInvestigatingTransaction(null);
                }}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-black bg-[#00F59B] hover:bg-[#05DF72] transition-colors flex items-center gap-1.5 shadow-sm shadow-[#00F59B]/20"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Approve Resolution</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

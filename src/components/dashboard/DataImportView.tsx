import React, { useState } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  Layers,
  Database,
  CheckCircle2,
  Landmark,
  CreditCard,
  FileText,
  ShoppingBag,
  Receipt,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { ProjectLogo } from '../common/Logo';
import { useFinance } from '../../context/FinanceContext';

const PIPELINE_STEPS = [
  'Importing records from banking APIs & gateways...',
  'Normalizing disparate schemas to unified ledger...',
  'Executing 4-way deterministic matching rules...',
  'Detecting monetary anomalies and timing shifts...',
  'Calculating probabilistic confidence scores...',
  'Generating autonomous reconciliation report...',
];

export const DataImportView: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
  const { resetToDemoData, metrics, transactions } = useFinance();
  const [isLoadingPipeline, setIsLoadingPipeline] = useState<boolean>(false);
  const [pipelineIndex, setPipelineIndex] = useState<number>(0);

  const dataSources = [
    { title: 'Bank Feeds', icon: Landmark, count: '100+ Txns', desc: 'Direct RTGS/NEFT webhooks & SFTP' },
    { title: 'ERP Invoices', icon: FileText, count: '200 Invoices', desc: 'Accounts receivable ledger sync' },
    { title: 'Payment Gateways', icon: CreditCard, count: '150 Batches', desc: 'Stripe, Razorpay settlements' },
    { title: 'Customer Orders', icon: ShoppingBag, count: '250 Orders', desc: 'E-commerce & SaaS subscriptions' },
    { title: 'Expenses & Fees', icon: Receipt, count: '50 Records', desc: 'Intermediary bank & FX deductions' },
  ];

  const handleRunPipeline = () => {
    setIsLoadingPipeline(true);
    setPipelineIndex(0);

    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      if (idx < PIPELINE_STEPS.length) {
        setPipelineIndex(idx);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          resetToDemoData();
          setIsLoadingPipeline(false);
          onNavigate('reconciliation');
        }, 500);
      }
    }, 450);
  };

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* Top Heading */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00F59B]/10 border border-[#00F59B]/20 text-xs font-mono text-[#00F59B] mb-3">
          <Database className="w-3.5 h-3.5" />
          <span>MULTI-SOURCE INGESTION</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Connect your financial data
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          FinPilot seamlessly unifies banks, invoices, and settlement channels into a single verified ledger.
        </p>
      </div>

      {/* Connected Source Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {dataSources.map((src, i) => {
          const Icon = src.icon;
          return (
            <div key={i} className="p-4 rounded-xl bg-[#0D1117] border border-white/[0.08] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-white/[0.04] text-[#00F59B]">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    ACTIVE
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-white">{src.title}</h4>
                <p className="text-[11px] text-slate-400 mt-1">{src.desc}</p>
              </div>
              <div className="mt-3 pt-2 border-t border-white/[0.04] text-[10px] font-mono text-slate-400">
                {src.count}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pipeline Loader Overlay if active */}
      {isLoadingPipeline ? (
        <div className="p-8 sm:p-12 rounded-2xl bg-[#0D1117] border border-[#00F59B]/40 shadow-2xl text-center space-y-6 animate-in fade-in">
          <div className="w-16 h-16 rounded-2xl bg-[#00F59B]/10 border border-[#00F59B]/30 flex items-center justify-center text-[#00F59B] mx-auto">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-white">FinPilot is analyzing your books…</h3>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Deterministic 4-way correlation across 250 records
            </p>
          </div>

          {/* Step Progress List */}
          <div className="max-w-md mx-auto space-y-2 text-left">
            {PIPELINE_STEPS.map((step, idx) => {
              const isPassed = pipelineIndex > idx;
              const isCurrent = pipelineIndex === idx;

              return (
                <div
                  key={idx}
                  className={`p-2.5 rounded-lg border text-xs flex items-center justify-between font-mono transition-all ${
                    isPassed
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : isCurrent
                      ? 'bg-[#111722] border-[#00F59B] text-white shadow-md'
                      : 'border-white/[0.04] text-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isPassed ? (
                      <CheckCircle2 className="w-4 h-4 text-[#00F59B]" />
                    ) : isCurrent ? (
                      <Loader2 className="w-4 h-4 text-[#00F59B] animate-spin" />
                    ) : (
                      <div className="w-4 h-4 rounded-full bg-white/[0.04] text-center text-[10px]">
                        {idx + 1}
                      </div>
                    )}
                    <span>{step}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Drag and Drop Zone */
        <div className="p-8 sm:p-12 rounded-2xl bg-[#0D1117] border-2 border-dashed border-white/[0.12] hover:border-white/[0.25] transition-all text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-[#111722] border border-white/[0.08] flex items-center justify-center text-slate-400 mx-auto">
            <UploadCloud className="w-7 h-7 text-[#00F59B]" />
          </div>

          <div>
            <h3 className="text-base font-semibold text-white">
              Drag and drop bank statements, invoices or settlements
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Supported formats: CSV, JSON, MT940, CAMT.053, QuickBooks export.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleRunPipeline}
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold text-black bg-[#00F59B] hover:bg-[#05DF72] transition-all shadow-lg shadow-[#00F59B]/20"
            >
              <ProjectLogo size={16} />
              <span>Load 250-Record Demo Dataset & Run Pipeline</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      )}

      {/* Dataset Statistics Card */}
      <div className="p-6 rounded-2xl bg-[#0D1117] border border-white/[0.08]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white tracking-tight">
            Synthetic Hackathon Dataset Specs
          </h3>
          <span className="text-[10px] font-mono text-[#00F59B] px-2 py-0.5 rounded bg-[#00F59B]/10">
            250 Records Ready
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-3 rounded-lg bg-[#111722] border border-white/[0.04]">
            <span className="text-slate-500 text-[10px]">Exact Matches</span>
            <p className="text-base font-bold text-[#00F59B] mt-0.5">232 records</p>
          </div>
          <div className="p-3 rounded-lg bg-[#111722] border border-white/[0.04]">
            <span className="text-slate-500 text-[10px]">Amount Mismatch</span>
            <p className="text-base font-bold text-orange-400 mt-0.5">7 records (₹82.4k)</p>
          </div>
          <div className="p-3 rounded-lg bg-[#111722] border border-white/[0.04]">
            <span className="text-slate-500 text-[10px]">Missing Invoices</span>
            <p className="text-base font-bold text-rose-400 mt-0.5">4 records (₹51.2k)</p>
          </div>
          <div className="p-3 rounded-lg bg-[#111722] border border-white/[0.04]">
            <span className="text-slate-500 text-[10px]">Duplicate Charges</span>
            <p className="text-base font-bold text-purple-400 mt-0.5">3 records (₹34.5k)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import {
  ShieldCheck,
  Lock,
  Eye,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  FileText,
  UserCheck
} from 'lucide-react';

export const TrustSecurityView: React.FC = () => {
  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="pb-6 border-b border-white/[0.06]">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono text-[#00F59B] px-2 py-0.5 rounded bg-[#00F59B]/10 border border-[#00F59B]/20">
            SOC-2 Type II Certified
          </span>
          <span className="text-xs text-slate-500 font-mono">• Autonomous Financial Governance</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Trust, Security & AI Governance
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Configured safety thresholds, role-based approval gates, and mathematical verification guarantees.
        </p>
      </div>

      {/* Threshold Sliders / Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-[#0D1117] border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white tracking-tight">
              Autonomous Approval Threshold
            </h3>
            <span className="text-xs font-mono text-[#00F59B] font-bold">95.0% Min Confidence</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Any transaction with confidence below 95% is automatically halted and queued for human approval. 
            Prevents erroneous ledger entries.
          </p>
          <div className="w-full bg-white/[0.06] h-2 rounded-full overflow-hidden">
            <div className="bg-[#00F59B] h-full w-[95%]" />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>0% (Manual)</span>
            <span>95% (Current Policy)</span>
            <span>100% (Strict)</span>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#0D1117] border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white tracking-tight">
              Discrepancy Quarantine Ceiling
            </h3>
            <span className="text-xs font-mono text-amber-400 font-bold">₹5,000 Tolerance</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Variance exceeding ₹5,000 (e.g. partial payments, dispute holdbacks, or missing GST invoices) mandates two-person controller authorization.
          </p>
          <div className="w-full bg-white/[0.06] h-2 rounded-full overflow-hidden">
            <div className="bg-amber-400 h-full w-[80%]" />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>₹0 (Zero)</span>
            <span>₹5,000 (Active)</span>
            <span>₹50,000 (Loose)</span>
          </div>
        </div>
      </div>

      {/* 4 Governance Rules */}
      <div className="p-6 rounded-2xl bg-[#0D1117] border border-white/[0.08] space-y-4">
        <h3 className="text-sm font-bold text-white tracking-tight">
          Core AI Governance Guardrails
        </h3>
        <div className="space-y-3">
          <div className="p-3.5 rounded-xl bg-[#111722] border border-white/[0.04] flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-[#00F59B] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-slate-200">No Irreversible Autonomous Actions</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                The agent cannot delete ledger lines, authorize bank disbursements, or waive liabilities autonomously.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#111722] border border-white/[0.04] flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-[#00F59B] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-slate-200">Forensic Mathematical Proofs Required</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Every match must be validated against customer account, reference string, date window, and balance delta.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#111722] border border-white/[0.04] flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-[#00F59B] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-slate-200">Immutable Audit Stamping</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                All tool execution latencies, intermediate payloads, and human overrides are permanently logged.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

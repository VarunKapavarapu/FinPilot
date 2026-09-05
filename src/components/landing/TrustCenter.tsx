import React from 'react';
import { ShieldCheck, Lock, Eye, CheckCircle2, UserCheck, AlertOctagon } from 'lucide-react';

export const TrustCenter: React.FC = () => {
  const trustPillars = [
    {
      icon: Eye,
      title: 'Deterministic & Explainable',
      description: 'Every auto-match includes mathematical proofs, exact invoice references, and customer correlation. No hallucinated figures.',
      tag: 'Zero Hallucinations',
    },
    {
      icon: UserCheck,
      title: 'Human-in-the-Loop Safeguards',
      description: 'The AI controller never executes irreversible financial journal entries without human review whenever confidence drops below 95%.',
      tag: 'Approval Gateways',
    },
    {
      icon: ShieldCheck,
      title: '95% Confidence Threshold',
      description: 'Transactions with missing references, partial amounts, or timing variances are flagged transparently for human confirmation.',
      tag: 'Strict Threshold',
    },
    {
      icon: Lock,
      title: 'Complete Cryptographic Audit Trail',
      description: 'Every tool invocation, comparison, and human resolution is permanently stamped in an immutable audit ledger.',
      tag: 'SOX & SOC2 Ready',
    },
  ];

  return (
    <section id="trust" className="py-20 bg-[#07090D] border-t border-white/[0.06] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00F59B]/10 border border-[#00F59B]/20 text-[11px] font-mono text-[#00F59B] mb-4">
            <Lock className="w-3.5 h-3.5" />
            <span>ENTERPRISE TRUST ARCHITECTURE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Financial systems require proof, not probability.
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            FinPilot combines deterministic ledger accounting with forensic AI reasoning so your finance operations team is always in total command.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustPillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#0D1117] border border-white/[0.08] hover:border-white/[0.16] transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-xl bg-white/[0.04] text-[#00F59B] group-hover:bg-[#00F59B]/10 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-slate-400 border border-white/[0.06]">
                    {pillar.tag}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-white tracking-tight">{pillar.title}</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{pillar.description}</p>
              </div>
            );
          })}
        </div>

        {/* Visual Approval Flow diagram */}
        <div className="mt-12 p-6 rounded-2xl bg-[#111722]/50 border border-white/[0.08] max-w-4xl mx-auto">
          <div className="text-xs font-mono text-slate-400 text-center uppercase tracking-wider mb-6">
            Autonomous Decision & Governance Pipeline
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center">
            <div className="flex-1 p-3 rounded-xl bg-[#0D1117] border border-white/[0.06] w-full">
              <span className="text-[10px] font-mono text-slate-500">STEP 1</span>
              <p className="text-xs font-semibold text-slate-200 mt-1">Multi-Source Ingestion</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Bank + Invoices + Gateways</p>
            </div>

            <span className="text-slate-600 font-mono hidden sm:inline">→</span>

            <div className="flex-1 p-3 rounded-xl bg-[#0D1117] border border-[#00F59B]/30 w-full">
              <span className="text-[10px] font-mono text-[#00F59B]">STEP 2</span>
              <p className="text-xs font-semibold text-[#00F59B] mt-1">AI Correlation Engine</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Confidence Scoring & Match</p>
            </div>

            <span className="text-slate-600 font-mono hidden sm:inline">→</span>

            <div className="flex-1 p-3 rounded-xl bg-[#0D1117] border border-amber-500/30 w-full">
              <span className="text-[10px] font-mono text-amber-400">STEP 3</span>
              <p className="text-xs font-semibold text-amber-300 mt-1">Human Review Gate</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Approve or Investigate (&lt;95%)</p>
            </div>

            <span className="text-slate-600 font-mono hidden sm:inline">→</span>

            <div className="flex-1 p-3 rounded-xl bg-[#0D1117] border border-white/[0.06] w-full">
              <span className="text-[10px] font-mono text-slate-500">STEP 4</span>
              <p className="text-xs font-semibold text-slate-200 mt-1">Verified Books</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Immutable Audit Trail</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

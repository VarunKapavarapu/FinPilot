import React, { useState } from 'react';
import {
  Receipt,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Search,
  ArrowRight,
  ShieldCheck,
  Building,
  RefreshCw
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatINR } from '../../utils/formatters';

export const TaxLineMatcher: React.FC = () => {
  const { taxLines, setNotification } = useFinance();
  const [selectedTaxLine, setSelectedTaxLine] = useState<string | null>(null);

  const matchedCount = taxLines.filter(t => t.status === 'MATCHED').length;
  const discrepancyCount = taxLines.filter(t => t.status !== 'MATCHED').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-[#00F59B] px-2 py-0.5 rounded bg-[#00F59B]/10 border border-[#00F59B]/20">
              Tax-Line Matcher • Indian B2B / Razorpay Edition
            </span>
            <span className="text-xs text-slate-500 font-mono">• Section 194J / 194C / GST-TDS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Tax-Line Matcher & Withholding Auditor
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Reconciles withholding tax discrepancies between invoiced amounts and bank credits before marking false deficits.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-[#0D1117] border border-white/[0.08] text-xs font-mono text-slate-300">
            Matched 26AS: <span className="text-[#00F59B] font-bold">{matchedCount} Lines</span>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-[#0D1117] border border-amber-500/30 text-xs font-mono text-slate-300">
            TDS Variances: <span className="text-amber-400 font-bold">{discrepancyCount} Lines</span>
          </div>
        </div>
      </div>

      {/* Tax Context Explainer Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#111722] to-[#0D1117] border border-[#00F59B]/20 flex items-start gap-3.5">
        <Receipt className="w-5 h-5 text-[#00F59B] mt-0.5 flex-shrink-0" />
        <div className="text-xs text-slate-300 leading-relaxed">
          <span className="font-semibold text-white">Why Tax-Line Matching Matters: </span>
          In Indian enterprise billing, 80% of amount mismatches (e.g. ₹18,000 received on a ₹20,000 invoice) are not payment failures — they are statutory TDS withholdings (10% under Section 194J or 2% under 194C). 
          FinPilot correlates banking deductions directly against Form 26AS & Challan references so your match rate reflects reality.
        </div>
      </div>

      {/* Tax Lines Table */}
      <div className="rounded-2xl bg-[#0D1117] border border-white/[0.08] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#111722] text-[11px] font-mono text-slate-400 uppercase tracking-wider border-b border-white/[0.06]">
                <th className="py-3 px-4">Line ID</th>
                <th className="py-3 px-4">Invoice Ref</th>
                <th className="py-3 px-4">Vendor / Customer</th>
                <th className="py-3 px-4">Tax Section</th>
                <th className="py-3 px-4 text-right">Gross Billed</th>
                <th className="py-3 px-4 text-right">Statutory TDS</th>
                <th className="py-3 px-4 text-right">Actual Deducted</th>
                <th className="py-3 px-4 text-right">Net Received</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4">AI Recommendation</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {taxLines.map(t => (
                <tr
                  key={t.id}
                  onClick={() => setSelectedTaxLine(t.id)}
                  className={`hover:bg-white/[0.02] transition-colors cursor-pointer ${
                    selectedTaxLine === t.id ? 'bg-[#111722]/80' : ''
                  }`}
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-200">
                    {t.id}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[#38BDF8]">
                    {t.invoiceId}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-200">
                    {t.vendor}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-300">
                    <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">
                      {t.taxSection}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-right text-slate-200">
                    ₹{t.grossBilled.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-right text-slate-400">
                    ₹{t.expectedTds.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-right font-semibold text-amber-400">
                    ₹{t.actualDeducted.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-right text-[#00F59B] font-bold">
                    ₹{t.netDisbursed.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold border ${
                        t.status === 'MATCHED'
                          ? 'bg-[#00F59B]/10 text-[#00F59B] border-[#00F59B]/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 max-w-xs text-[11px] leading-snug">
                    {t.aiRecommendation}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setNotification(`Verified TDS matching certificate for ${t.id}. Challan logged.`);
                      }}
                      className="px-2.5 py-1 rounded bg-[#00F59B]/10 hover:bg-[#00F59B]/20 text-[#00F59B] text-[11px] font-semibold transition-colors"
                    >
                      Verify
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

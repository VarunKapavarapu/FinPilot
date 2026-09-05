import React, { useState } from 'react';
import {
  CreditCard,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Bot,
  Send,
  Building,
  RotateCcw
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatINR } from '../../utils/formatters';

interface QAPair {
  question: string;
  answer: string;
  toolDetails?: string;
  batchRef?: string;
}

export const SettlementQAView: React.FC = () => {
  const { settlementBatches, setNotification } = useFinance();
  const [activeQuestion, setActiveQuestion] = useState<string>('');
  const [chatLog, setChatLog] = useState<QAPair[]>([
    {
      question: 'Why did batch setl_Instant_03SEP have a ₹1,500 difference?',
      answer: 'Batch setl_Instant_03SEP had a ₹1,500 difference because an Instant Payout convenience fee was deducted by Razorpay for weekend liquidity acceleration. The standard MDR fee was ₹3,600 + GST ₹648, and the ₹1,500 instant surcharge was netted out before bank credit.',
      toolDetails: 'query_razorpay_settlement_api(batch="setl_Instant_03SEP")',
      batchRef: 'setl_Instant_03SEP',
    },
    {
      question: 'What is our current rolling risk reserve on Razorpay Route?',
      answer: 'Currently ₹25,000 is quarantined as a 7-day rolling risk reserve on batch setl_Route_02SEP to cover customer dispute/chargeback exposure across vendor sub-merchants. Scheduled release date is Sep 09, 2026.',
      toolDetails: 'get_route_reserve_ledger(merchant_id="rzp_acc_9921")',
      batchRef: 'setl_Route_02SEP',
    },
  ]);

  const handleAsk = (q: string) => {
    if (!q.trim()) return;
    const lower = q.toLowerCase();
    let reply = '';
    let tool = '';
    let ref = '';

    if (lower.includes('mdr') || lower.includes('fee') || lower.includes('gst')) {
      reply = 'Across all 4 September settlement batches, total Razorpay gross volume was ₹12,35,000. Total MDR processing fees were ₹18,400 with ₹3,312 in 18% GST. Net credited across accounts was ₹11,87,792 with ₹26,500 pending release or surcharges.';
      tool = 'calculate_gateway_mdr_aggregate()';
    } else if (lower.includes('smart collect') || lower.includes('virtual')) {
      reply = 'Smart Collect batch setl_SmartColl_01SEP processed ₹4,20,000 via NEFT/UPI virtual accounts with zero variance. UPI flat transaction pricing resulted in only ₹2,100 in gateway fees.';
      tool = 'verify_smart_collect_webhooks()';
      ref = 'setl_SmartColl_01SEP';
    } else {
      reply = `Audited Razorpay settlement ledgers. 2 batches reconciled with 0 delta, 1 batch has a ₹1,500 instant liquidity surcharge, and 1 batch has a ₹25,000 rolling dispute reserve. All items are balanced against bank feeds.`;
      tool = 'reconcile_gateway_settlements()';
    }

    setChatLog(prev => [...prev, { question: q, answer: reply, toolDetails: tool, batchRef: ref }]);
    setActiveQuestion('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-[#38BDF8] px-2 py-0.5 rounded bg-[#38BDF8]/10 border border-[#38BDF8]/20">
              Settlement Q&A Agent • Razorpay Gateway & Payouts
            </span>
            <span className="text-xs text-slate-500 font-mono">• Instant Payouts, MDR & Reserve Holds</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Gateway Settlement Q&A Agent
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Ask natural language questions about payment gateway deductions, MDR netting, and rolling reserves.
          </p>
        </div>
      </div>

      {/* Settlement Batches Table */}
      <div className="rounded-2xl bg-[#0D1117] border border-white/[0.08] overflow-hidden shadow-xl">
        <div className="p-4 bg-[#111722] border-b border-white/[0.06] flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
            Active Razorpay Settlement Batches
          </h3>
          <span className="text-xs text-slate-400 font-mono">4 Settlement Batches Analyzed</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#0D1117] text-[11px] font-mono text-slate-400 uppercase tracking-wider border-b border-white/[0.06]">
                <th className="py-3 px-4">Batch ID</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Payout Method</th>
                <th className="py-3 px-4 text-right">Gross Volume</th>
                <th className="py-3 px-4 text-right">MDR Fee (2%)</th>
                <th className="py-3 px-4 text-right">GST (18%)</th>
                <th className="py-3 px-4 text-right">Net Credited</th>
                <th className="py-3 px-4 text-right">Discrepancy / Hold</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {settlementBatches.map(b => (
                <tr key={b.batchId} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#38BDF8]">
                    {b.batchId}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400">
                    {b.date}
                  </td>
                  <td className="py-3 px-4 text-slate-200">
                    <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] text-[11px] font-mono">
                      {b.payoutType}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-right text-slate-200">
                    ₹{b.grossCollection.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 font-mono text-right text-slate-400">
                    ₹{b.mdrFee.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 font-mono text-right text-slate-400">
                    ₹{b.gst18.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 font-mono text-right font-semibold text-[#00F59B]">
                    ₹{b.actualBankCredit.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 font-mono text-right font-bold text-amber-400">
                    {b.delta > 0 ? `₹${b.delta.toLocaleString('en-IN')}` : '₹0'}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold border ${
                        b.status === 'RECONCILED'
                          ? 'bg-[#00F59B]/10 text-[#00F59B] border-[#00F59B]/20'
                          : b.status === 'FEE_VARIANCE'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-purple-500/10 text-purple-300 border-purple-500/20'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Settlement Q&A Agent Chat */}
      <div className="p-6 rounded-2xl bg-[#0D1117] border border-white/[0.08] space-y-4">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-[#38BDF8]" />
            <h3 className="text-sm font-bold text-white tracking-tight">
              Settlement Intelligence Forensic Chat
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            Powered by Razorpay-Ops LLM
          </span>
        </div>

        {/* Suggested Queries */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-500 font-mono flex-shrink-0">Suggested:</span>
          <button
            onClick={() => handleAsk('Why did batch setl_Instant_03SEP have a ₹1,500 difference?')}
            className="px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] text-slate-300 whitespace-nowrap transition-all"
          >
            “Why did Instant Payout have a difference?”
          </button>
          <button
            onClick={() => handleAsk('What is our current rolling risk reserve on Razorpay Route?')}
            className="px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] text-slate-300 whitespace-nowrap transition-all"
          >
            “What is our rolling reserve on Route?”
          </button>
          <button
            onClick={() => handleAsk('What are our total MDR fees and GST for September?')}
            className="px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] text-slate-300 whitespace-nowrap transition-all"
          >
            “Total MDR fees and GST?”
          </button>
        </div>

        {/* Chat History */}
        <div className="space-y-3 pt-2">
          {chatLog.map((qa, i) => (
            <div key={i} className="p-4 rounded-xl bg-[#111722]/70 border border-white/[0.06] space-y-2 text-xs">
              <div className="font-semibold text-[#38BDF8] flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                <span>Q: {qa.question}</span>
              </div>
              <div className="text-slate-200 leading-relaxed pl-6">
                {qa.answer}
              </div>
              {qa.toolDetails && (
                <div className="pl-6 pt-1 text-[10px] font-mono text-slate-500">
                  Tool trace: <code>{qa.toolDetails}</code>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input box */}
        <div className="flex items-center gap-2 pt-2">
          <input
            type="text"
            placeholder="Ask anything about gateway settlements, fee deductions, or bank credits..."
            value={activeQuestion}
            onChange={e => setActiveQuestion(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleAsk(activeQuestion);
            }}
            className="flex-1 bg-[#111722] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#38BDF8]/50"
          />
          <button
            onClick={() => handleAsk(activeQuestion)}
            disabled={!activeQuestion.trim()}
            className="px-4 py-2.5 rounded-xl bg-[#38BDF8] hover:bg-sky-400 text-black font-semibold text-xs transition-colors flex items-center gap-1.5 disabled:opacity-40"
          >
            <span>Ask Agent</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

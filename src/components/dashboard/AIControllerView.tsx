import React, { useState } from 'react';
import {
  Bot,
  Send,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  FileSpreadsheet,
  Layers,
  TrendingUp,
  Cpu,
  Search,
  Check,
  RotateCcw
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatINR } from '../../utils/formatters';
import { StatusBadge } from '../common/Badge';
import { Transaction } from '../../types/finance';
import { BrandIcon } from '../common/Logo';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  toolsExecuted?: { toolName: string; durationMs: number }[];
  embeddedRecords?: Transaction[];
  actionButtons?: { label: string; action: () => void }[];
}

export const AIControllerView: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
  const { transactions, metrics, setSelectedTransaction, setInvestigatingTransaction } = useFinance();
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Unresolved transactions above ₹10k
  const highValueExceptions = transactions.filter(
    t => t.status !== 'MATCHED' && t.resolution !== 'HUMAN_APPROVED' && t.amount >= 10000
  );

  const initialMessages: ChatMessage[] = [
    {
      id: 'msg-1',
      sender: 'user',
      timestamp: '21:30:10',
      text: 'Why is our reconciliation rate down today?',
    },
    {
      id: 'msg-2',
      sender: 'assistant',
      timestamp: '21:30:12',
      text: 'Reconciliation dropped from 96.1% to 92.8% because 11 settlement records from Payment Gateway A are missing invoice references or have partial payments.',
      toolsExecuted: [
        { toolName: 'search_transactions(status="EXCEPTION")', durationMs: 140 },
        { toolName: 'compare_records(period="today", baseline="yesterday")', durationMs: 210 },
        { toolName: 'calculate_difference(gateway="Razorpay/Stripe")', durationMs: 95 },
      ],
      actionButtons: [
        {
          label: 'Investigate Priority Anomaly',
          action: () => {
            const anomaly = transactions.find(t => t.id === 'TXN-1042');
            if (anomaly) setInvestigatingTransaction(anomaly);
          },
        },
        {
          label: 'Show Exception Records',
          action: () => onNavigate('exceptions'),
        },
        {
          label: 'Generate Ops Report',
          action: () => onNavigate('performance'),
        },
      ],
    },
  ];

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputPrompt;
    if (!query.trim() || isProcessing) return;

    const timeNow = new Date().toLocaleTimeString('en-US', { hour12: false });
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      timestamp: timeNow,
      text: query,
    };

    setMessages(prev => [...prev, userMsg]);
    setInputPrompt('');
    setIsProcessing(true);

    // Simulate Agent Tool Reasoning & Execution
    setTimeout(() => {
      const q = query.toLowerCase();
      let replyText = '';
      let tools: { toolName: string; durationMs: number }[] = [];
      let records: Transaction[] | undefined = undefined;
      let actions: { label: string; action: () => void }[] | undefined = undefined;

      if (q.includes('above') || q.includes('10,000') || q.includes('10000') || q.includes('unresolved')) {
        const sum = highValueExceptions.reduce((s, t) => s + t.amount, 0);
        replyText = `I found ${highValueExceptions.length} unresolved transactions totaling ${formatINR(sum, true)} with values above ₹10,000. Here are the prioritized records requiring human sign-off:`;
        tools = [
          { toolName: 'search_transactions(min_amount=10000, status="UNRESOLVED")', durationMs: 120 },
          { toolName: 'get_invoice_linkage()', durationMs: 180 },
          { toolName: 'calculate_aggregate(sum="amount")', durationMs: 60 },
        ];
        records = highValueExceptions.slice(0, 4);
        actions = [
          { label: 'View All in Exceptions Center', action: () => onNavigate('exceptions') },
        ];
      } else if (q.includes('duplicate') || q.includes('double')) {
        replyText = `Identified 3 duplicate authorization anomalies totaling ₹34,500. For example, TXN-1091 (₹12,500) was captured within 2 minutes of TXN-1090 on Stripe.`;
        tools = [
          { toolName: 'find_duplicates(window="5m", fingerprint="customer_amount")', durationMs: 240 },
          { toolName: 'check_settlement_status()', durationMs: 110 },
        ];
        records = transactions.filter(t => t.status === 'DUPLICATE');
      } else if (q.includes('forecast') || q.includes('cash')) {
        replyText = `Current cash is ₹18.4L. Our 30-day forecast projects cash will expand to ₹26.3L (+₹7.9L net growth), supported by ₹8.4L in scheduled enterprise settlements.`;
        tools = [
          { toolName: 'forecast_cash(horizon="30d", confidence=0.95)', durationMs: 310 },
          { toolName: 'check_ar_aging_schedule()', durationMs: 190 },
        ];
        actions = [
          { label: 'Open Interactive Cash Forecast', action: () => onNavigate('forecast') },
        ];
      } else {
        replyText = `Analyzed financial ledger against 250 records. Current reconciliation rate is ${metrics.matchRate}% with ${metrics.exceptionsCount} open exceptions totaling ${formatINR(metrics.discrepancyTotal)}.`;
        tools = [
          { toolName: 'inspect_general_ledger()', durationMs: 150 },
          { toolName: 'verify_confidence_thresholds()', durationMs: 120 },
        ];
      }

      const assistantMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        text: replyText,
        toolsExecuted: tools,
        embeddedRecords: records,
        actionButtons: actions,
      };

      setMessages(prev => [...prev, assistantMsg]);
      setIsProcessing(false);
    }, 700);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-[#00F59B] px-2 py-0.5 rounded bg-[#00F59B]/10 border border-[#00F59B]/20">
              Autonomous Agent Active
            </span>
            <span className="text-xs text-slate-500 font-mono">• Deterministic Tool Orchestrator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Finance Controller
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Your autonomous finance operations assistant with live tool execution.
          </p>
        </div>

        <button
          onClick={() => setMessages(initialMessages)}
          className="p-2 rounded-lg text-slate-400 hover:text-white bg-white/[0.04] border border-white/[0.08] transition-colors"
          title="Reset conversation"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
        <span className="text-slate-500 font-mono flex-shrink-0">Quick prompts:</span>
        <button
          onClick={() => handleSendMessage('Why is our reconciliation rate down today?')}
          className="px-3 py-1.5 rounded-lg bg-[#0D1117] border border-white/[0.08] text-slate-300 hover:text-white hover:border-[#00F59B]/40 whitespace-nowrap transition-all"
        >
          “Why is reconciliation down?”
        </button>
        <button
          onClick={() => handleSendMessage('Find unresolved payments above ₹10,000')}
          className="px-3 py-1.5 rounded-lg bg-[#0D1117] border border-white/[0.08] text-slate-300 hover:text-white hover:border-[#00F59B]/40 whitespace-nowrap transition-all"
        >
          “Find unresolved payments above ₹10,000”
        </button>
        <button
          onClick={() => handleSendMessage('Check for duplicate payments')}
          className="px-3 py-1.5 rounded-lg bg-[#0D1117] border border-white/[0.08] text-slate-300 hover:text-white hover:border-[#00F59B]/40 whitespace-nowrap transition-all"
        >
          “Find duplicate payments”
        </button>
        <button
          onClick={() => handleSendMessage('What is our 30-day cash forecast?')}
          className="px-3 py-1.5 rounded-lg bg-[#0D1117] border border-white/[0.08] text-slate-300 hover:text-white hover:border-[#00F59B]/40 whitespace-nowrap transition-all"
        >
          “What is our 30-day cash forecast?”
        </button>
      </div>

      {/* Chat Thread */}
      <div className="space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <BrandIcon size={30} className="flex-shrink-0 mt-1" />
            )}

            <div
              className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed space-y-3 ${
                msg.sender === 'user'
                  ? 'bg-[#111722] border border-white/[0.12] text-white'
                  : 'bg-[#0D1117] border border-white/[0.08] text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between gap-4 text-[10px] font-mono text-slate-500 pb-1 border-b border-white/[0.04]">
                <span>{msg.sender === 'assistant' ? 'FinPilot Controller Agent' : 'Finance Team'}</span>
                <span>{msg.timestamp}</span>
              </div>

              {/* Tool Execution Visualization */}
              {msg.toolsExecuted && msg.toolsExecuted.length > 0 && (
                <div className="p-2.5 rounded-lg bg-[#07090D] border border-white/[0.06] space-y-1.5 my-2">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00F59B] animate-pulse" />
                    <span>Agent Tool Execution Trace</span>
                  </div>
                  {msg.toolsExecuted.map((t, idx) => (
                    <div key={idx} className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span className="flex items-center gap-1.5 text-emerald-400">
                        <Check className="w-3 h-3 text-[#00F59B]" />
                        <code>{t.toolName}</code>
                      </span>
                      <span className="text-[10px] text-slate-600">{t.durationMs}ms</span>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-slate-200">{msg.text}</p>

              {/* Embedded Transaction Cards */}
              {msg.embeddedRecords && msg.embeddedRecords.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    Returned Financial Records ({msg.embeddedRecords.length})
                  </div>
                  {msg.embeddedRecords.map(rec => (
                    <div
                      key={rec.id}
                      onClick={() => setSelectedTransaction(rec)}
                      className="p-2.5 rounded-lg bg-[#111722] border border-white/[0.06] hover:border-white/[0.15] flex items-center justify-between cursor-pointer group transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-200 group-hover:text-[#00F59B]">
                          {rec.id}
                        </span>
                        <StatusBadge status={rec.status} />
                        <span className="text-slate-400">{rec.customerName}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-white">
                          ₹{rec.amount.toLocaleString('en-IN')}
                        </span>
                        <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              {msg.actionButtons && msg.actionButtons.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {msg.actionButtons.map((btn, idx) => (
                    <button
                      key={idx}
                      onClick={btn.action}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/[0.05] hover:bg-[#00F59B]/20 hover:text-[#00F59B] border border-white/[0.08] transition-all flex items-center gap-1.5"
                    >
                      <span>{btn.label}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isProcessing && (
          <div className="flex items-center gap-3 text-xs text-slate-400 bg-[#0D1117] p-3 rounded-xl border border-white/[0.06] w-fit">
            <span className="w-2 h-2 rounded-full bg-[#00F59B] animate-ping" />
            <span className="font-mono">FinPilot is searching ledger records & verifying math...</span>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="p-2 bg-[#0D1117] border border-white/[0.1] rounded-2xl shadow-xl flex items-center gap-2">
        <input
          type="text"
          placeholder="Ask the AI Controller (e.g., 'Find unresolved payments above ₹10,000')..."
          value={inputPrompt}
          onChange={e => setInputPrompt(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') handleSendMessage();
          }}
          className="flex-1 bg-transparent px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={!inputPrompt.trim() || isProcessing}
          className="px-4 py-2.5 rounded-xl bg-[#00F59B] text-black font-semibold text-xs hover:bg-[#05DF72] disabled:opacity-40 transition-all flex items-center gap-1.5"
        >
          <span>Ask</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

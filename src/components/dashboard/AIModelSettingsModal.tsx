import React from 'react';
import {
  X,
  Bot,
  Check,
  Shield,
  Sliders,
  Layers,
  Cpu,
  Zap
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { AIModelType } from '../../types/finance';

interface AIModelSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIModelSettingsModal: React.FC<AIModelSettingsModalProps> = ({ isOpen, onClose }) => {
  const { aiSettings, setAISettings, setNotification } = useFinance();

  if (!isOpen) return null;

  const models: { id: AIModelType; name: string; tag: string; desc: string; latency: string }[] = [
    {
      id: 'Razorpay-Ops LLM (Fine-tuned Fintech)',
      name: 'Razorpay-Ops LLM',
      tag: 'Buildathon Default',
      desc: 'Fine-tuned on Indian payment gateways, MDR fee netting, Section 194J/194C TDS laws, and NEFT/RTGS clearing cycles.',
      latency: '1.2s / batch',
    },
    {
      id: 'Gemini 1.5 Pro (Financial Reasoning)',
      name: 'Gemini 1.5 Pro',
      tag: 'Multi-Modal Reasoning',
      desc: 'Deep chain-of-thought analysis for complex cross-border SWIFT MT103 and ambiguous invoice line items.',
      latency: '1.8s / batch',
    },
    {
      id: 'FinPilot Neural Matcher v3',
      name: 'FinPilot Neural v3',
      tag: 'Ultra High Throughput',
      desc: 'Deterministic rule engine coupled with gradient-boosted fuzzy entity resolution. 138 txns/sec.',
      latency: '0.4s / batch',
    },
    {
      id: 'Claude 3.5 Sonnet',
      name: 'Claude 3.5 Sonnet',
      tag: 'Forensic Audit',
      desc: 'High precision text extraction from unstructured invoice PDFs and scanned remittance advices.',
      latency: '2.1s / batch',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-[#0D1117] border border-white/[0.12] rounded-3xl shadow-2xl overflow-hidden shadow-black/80 flex flex-col">
        {/* Header */}
        <div className="p-6 bg-[#111722] border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#00F59B]/15 text-[#00F59B]">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                AI Model & Verification Rigor Config
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Configure autonomous agents, confidence thresholds, and model backends.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          {/* Model Selector Cards */}
          <div className="space-y-2.5">
            <label className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Active Financial Reasoning Model
            </label>

            <div className="space-y-2">
              {models.map(m => {
                const isSelected = aiSettings.selectedModel === m.id;

                return (
                  <div
                    key={m.id}
                    onClick={() => {
                      setAISettings(prev => ({ ...prev, selectedModel: m.id }));
                      setNotification(`Switched AI reasoning backend to ${m.name}`);
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'bg-[#111722] border-[#00F59B]/50 shadow-md shadow-[#00F59B]/10'
                        : 'bg-[#0D1117] border-white/[0.06] hover:border-white/[0.14]'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-white">{m.name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00F59B]/10 text-[#00F59B] border border-[#00F59B]/20">
                          {m.tag}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-snug">{m.desc}</p>
                      <div className="text-[10px] font-mono text-slate-500 pt-1">
                        Inference Throughput: {m.latency}
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-1 border ${
                        isSelected
                          ? 'bg-[#00F59B] border-[#00F59B] text-black'
                          : 'border-white/20'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Confidence Threshold Slider */}
          <div className="p-4 rounded-2xl bg-[#111722]/70 border border-white/[0.06] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-white">Autonomous Confidence Gate</span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Matches below this score are quarantined for human review.
                </p>
              </div>
              <span className="text-sm font-mono font-bold text-[#00F59B]">
                {aiSettings.verificationThreshold}%
              </span>
            </div>

            <input
              type="range"
              min="85"
              max="99"
              step="1"
              value={aiSettings.verificationThreshold}
              onChange={e =>
                setAISettings(prev => ({
                  ...prev,
                  verificationThreshold: Number(e.target.value),
                }))
              }
              className="w-full accent-[#00F59B] cursor-pointer"
            />

            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>85% (High Auto-post)</span>
              <span>95% (Enterprise Standard)</span>
              <span>99% (Strict Forensic)</span>
            </div>
          </div>

          {/* Module Toggles */}
          <div className="space-y-2 text-xs">
            <label className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Active Verification Modules
            </label>

            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <div>
                <p className="font-semibold text-white">Tax-Line & TDS Matcher (194J / 194C)</p>
                <p className="text-[11px] text-slate-400">Auto-reconciles statutory tax withholdings</p>
              </div>
              <input
                type="checkbox"
                checked={aiSettings.taxMatcherEnabled}
                onChange={e =>
                  setAISettings(prev => ({ ...prev, taxMatcherEnabled: e.target.checked }))
                }
                className="rounded bg-[#111722] border-white/20 text-[#00F59B] focus:ring-0"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <div>
                <p className="font-semibold text-white">Razorpay Settlement Q&A Engine</p>
                <p className="text-[11px] text-slate-400">Audits MDR fee deductions and rolling reserves</p>
              </div>
              <input
                type="checkbox"
                checked={aiSettings.settlementQAEnabled}
                onChange={e =>
                  setAISettings(prev => ({ ...prev, settlementQAEnabled: e.target.checked }))
                }
                className="rounded bg-[#111722] border-white/20 text-[#00F59B] focus:ring-0"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#111722] border-t border-white/[0.08] flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#00F59B] text-black hover:bg-[#05DF72] transition-colors"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};

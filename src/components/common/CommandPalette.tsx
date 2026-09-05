import React, { useState, useEffect } from 'react';
import { Search, ArrowRight, X, AlertTriangle, TrendingUp, Layers, Bot, RotateCcw, ShieldCheck } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectView: (view: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onSelectView }) => {
  const [query, setQuery] = useState('');
  const { transactions, setSelectedTransaction, resetToDemoData, setFilterStatus } = useFinance();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggling
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const defaultActions = [
    {
      id: 'unresolved',
      title: 'Show unresolved transactions',
      subtitle: 'Filter to 18 exceptions needing attention',
      icon: AlertTriangle,
      action: () => {
        onSelectView('exceptions');
        onClose();
      },
    },
    {
      id: 'reconciliation',
      title: 'Open reconciliation center',
      subtitle: 'Inspect 250 records and auto-matching rules',
      icon: Layers,
      action: () => {
        onSelectView('reconciliation');
        onClose();
      },
    },
    {
      id: 'forecast',
      title: 'Forecast cash position',
      subtitle: 'View 7d, 30d, 90d cash runway & flows',
      icon: TrendingUp,
      action: () => {
        onSelectView('forecast');
        onClose();
      },
    },
    {
      id: 'duplicates',
      title: 'Find duplicate payments',
      subtitle: 'Scan for multi-capture gateway anomalies',
      icon: AlertTriangle,
      action: () => {
        onSelectView('reconciliation');
        setFilterStatus('DUPLICATE');
        onClose();
      },
    },
    {
      id: 'controller',
      title: 'Ask AI Controller',
      subtitle: 'Ask autonomous ops agent questions',
      icon: Bot,
      action: () => {
        onSelectView('controller');
        onClose();
      },
    },
    {
      id: 'reset',
      title: 'Reset demo dataset',
      subtitle: 'Restore clean 250 records and 18 exceptions',
      icon: RotateCcw,
      action: () => {
        resetToDemoData();
        onClose();
      },
    },
  ];

  // Filter actions or matching transactions
  const matchingTxns = query.trim()
    ? transactions.filter(
        t =>
          t.id.toLowerCase().includes(query.toLowerCase()) ||
          t.customerName.toLowerCase().includes(query.toLowerCase()) ||
          (t.invoiceId && t.invoiceId.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 5)
    : [];

  const filteredActions = query.trim()
    ? defaultActions.filter(a => a.title.toLowerCase().includes(query.toLowerCase()) || a.subtitle.toLowerCase().includes(query.toLowerCase()))
    : defaultActions;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-[#0D1117] border border-white/[0.12] rounded-xl shadow-2xl overflow-hidden shadow-black/80">
        {/* Search Input */}
        <div className="flex items-center px-4 py-3 border-b border-white/[0.08] gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            autoFocus
            placeholder="Type a command, search transactions or invoice (e.g. TXN-1042)..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          <kbd className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.06] text-slate-400 border border-white/[0.08]">
            ESC
          </kbd>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {matchingTxns.length > 0 && (
            <div className="mb-2">
              <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-500">
                Matched Transactions
              </div>
              {matchingTxns.map(t => (
                <button
                  key={t.id}
                  onClick={() => {
                    setSelectedTransaction(t);
                    onSelectView('reconciliation');
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs hover:bg-white/[0.04] text-left transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-[#00F59B]">{t.id}</span>
                    <span className="text-slate-300">{t.customerName}</span>
                    {t.invoiceId && <span className="text-slate-500 text-[10px]">({t.invoiceId})</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-300">₹{t.amount.toLocaleString('en-IN')}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              ))}
            </div>
          )}

          <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-500">
            Quick Actions
          </div>
          {filteredActions.map(action => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={action.action}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs hover:bg-white/[0.05] text-left transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-md bg-white/[0.04] text-slate-300 group-hover:text-[#00F59B] group-hover:bg-[#00F59B]/10 transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-200">{action.title}</p>
                    <p className="text-[11px] text-slate-500">{action.subtitle}</p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-[#07090D] border-t border-white/[0.06] flex items-center justify-between text-[10px] text-slate-500">
          <span>Navigate with arrows, press Return to run</span>
          <span>FinPilot Command Center</span>
        </div>
      </div>
    </div>
  );
};

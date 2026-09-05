import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  Download,
  Bot,
  User,
  Cpu,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { AuditCategory } from '../../types/finance';

export const AuditLogView: React.FC = () => {
  const { auditLogs } = useFinance();
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');

  const filteredLogs = useMemo(() => {
    return auditLogs.filter(log => {
      if (categoryFilter !== 'ALL' && log.category !== categoryFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          log.action.toLowerCase().includes(q) ||
          log.detail.toLowerCase().includes(q) ||
          log.actor.toLowerCase().includes(q) ||
          (log.recordId && log.recordId.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [auditLogs, categoryFilter, search]);

  const exportAuditTrail = () => {
    const headers = ['Log ID', 'Timestamp', 'Actor', 'Category', 'Record ID', 'Action', 'Detail'];
    const rows = filteredLogs.map(l => [
      l.id,
      l.timestamp,
      l.actor,
      l.category,
      l.recordId || 'N/A',
      `"${l.action}"`,
      `"${l.detail.replace(/"/g, '""')}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `FinPilot_AuditLog_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-[#00F59B] px-2 py-0.5 rounded bg-[#00F59B]/10 border border-[#00F59B]/20">
              Cryptographically Stamped
            </span>
            <span className="text-xs text-slate-500 font-mono">• SOX Compliance Audit Trail</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            System & Operations Audit Trail
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Complete immutable ledger of all automated AI inferences, human overrides, and exception triage events.
          </p>
        </div>

        <button
          onClick={exportAuditTrail}
          className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-200 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] flex items-center gap-2 transition-all self-start md:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Audit Log (CSV)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search audit trail by action, TXN, or actor..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#0D1117] border border-white/[0.08] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00F59B]/50"
          />
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'ALL', label: 'All Events' },
            { id: 'AI_ACTION', label: 'AI Actions' },
            { id: 'HUMAN_ACTION', label: 'Human Overrides' },
            { id: 'SYSTEM_EVENT', label: 'System Events' },
            { id: 'EXCEPTION_FLAG', label: 'Exceptions' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setCategoryFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                categoryFilter === tab.id
                  ? 'bg-[#111722] text-[#00F59B] border border-[#00F59B]/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Log Feed Table */}
      <div className="rounded-2xl bg-[#0D1117] border border-white/[0.08] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#111722]/80 text-[11px] font-mono text-slate-400 uppercase tracking-wider border-b border-white/[0.06]">
                <th className="py-3 px-4 font-semibold">Timestamp</th>
                <th className="py-3 px-4 font-semibold">Actor</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Record Ref</th>
                <th className="py-3 px-4 font-semibold">Action</th>
                <th className="py-3 px-4 font-semibold">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-400 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="flex items-center gap-1.5 font-medium text-slate-200">
                      {log.actor.includes('AI') ? (
                        <Bot className="w-3.5 h-3.5 text-[#00F59B]" />
                      ) : log.actor.includes('Human') ? (
                        <User className="w-3.5 h-3.5 text-[#38BDF8]" />
                      ) : (
                        <Cpu className="w-3.5 h-3.5 text-slate-400" />
                      )}
                      <span>{log.actor}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        log.category === 'AI_ACTION'
                          ? 'bg-[#00F59B]/10 text-[#00F59B] border-[#00F59B]/20'
                          : log.category === 'HUMAN_ACTION'
                          ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                          : log.category === 'EXCEPTION_FLAG'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-white/[0.04] text-slate-300 border-white/[0.08]'
                      }`}
                    >
                      {log.category.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-300 whitespace-nowrap">
                    {log.recordId || '—'}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-100 whitespace-nowrap">
                    {log.action}
                  </td>
                  <td className="py-3 px-4 text-slate-400 max-w-md">
                    {log.detail}
                    {log.confidence && (
                      <span className="ml-2 font-mono text-[#00F59B]">
                        (Confidence: {log.confidence}%)
                      </span>
                    )}
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

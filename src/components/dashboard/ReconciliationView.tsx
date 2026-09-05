import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Download,
  CheckCircle,
  AlertTriangle,
  FileSpreadsheet,
  ExternalLink,
  Layers
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { StatusBadge } from '../common/Badge';
import { Transaction, TransactionStatus } from '../../types/finance';

export const ReconciliationView: React.FC = () => {
  const {
    transactions,
    metrics,
    selectedTransaction,
    setSelectedTransaction,
    setInvestigatingTransaction,
    filterStatus,
    setFilterStatus,
    searchQuery,
    setSearchQuery,
  } = useFinance();

  const [sortField, setSortField] = useState<'date' | 'amount' | 'confidence'>('date');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 20;

  // Filter & Search
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      // Search check
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        t.id.toLowerCase().includes(q) ||
        t.customerName.toLowerCase().includes(q) ||
        (t.invoiceId && t.invoiceId.toLowerCase().includes(q)) ||
        t.source.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      // Status filter
      if (filterStatus === 'ALL') return true;
      if (filterStatus === 'EXCEPTIONS') return t.status !== 'MATCHED' && t.resolution !== 'HUMAN_APPROVED';
      if (filterStatus === 'MATCHED') return t.status === 'MATCHED' || t.resolution === 'HUMAN_APPROVED';
      return t.status === filterStatus;
    }).sort((a, b) => {
      if (sortField === 'amount') {
        return sortAsc ? a.amount - b.amount : b.amount - a.amount;
      }
      if (sortField === 'confidence') {
        return sortAsc ? a.confidence - b.confidence : b.confidence - a.confidence;
      }
      return sortAsc ? (a.date + a.time).localeCompare(b.date + b.time) : (b.date + b.time).localeCompare(a.date + a.time);
    });
  }, [transactions, searchQuery, filterStatus, sortField, sortAsc]);

  const totalPages = Math.ceil(filteredTransactions.length / pageSize) || 1;
  const paginatedTransactions = filteredTransactions.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const exportCSV = () => {
    const headers = ['Transaction ID', 'Date', 'Time', 'Source', 'Invoice ID', 'Customer', 'Amount', 'Confidence', 'Status', 'AI Explanation'];
    const rows = filteredTransactions.map(t => [
      t.id,
      t.date,
      t.time,
      t.source,
      t.invoiceId || 'N/A',
      `"${t.customerName}"`,
      t.amount,
      `${t.confidence}%`,
      t.status,
      `"${t.aiExplanation.replace(/"/g, '""')}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `FinPilot_Reconciliation_${Date.now()}.csv`);
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
              {metrics.recordsProcessed} records analyzed
            </span>
            <span className="text-xs text-slate-500 font-mono">• 4-way correlation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            AI Reconciliation Center
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Automated correlation engine matching bank transactions, invoices, and gateway payouts.
          </p>
        </div>

        {/* Quick KPI pills */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="px-4 py-2 rounded-xl bg-[#0D1117] border border-white/[0.08]">
            <span className="text-[10px] font-mono text-slate-400">Match Rate</span>
            <p className="text-lg font-mono font-bold text-[#00F59B]">{metrics.matchRate}%</p>
          </div>
          <div className="px-4 py-2 rounded-xl bg-[#0D1117] border border-white/[0.08]">
            <span className="text-[10px] font-mono text-slate-400">Auto-resolved</span>
            <p className="text-lg font-mono font-bold text-white">{metrics.matchedCount}</p>
          </div>
          <div className="px-4 py-2 rounded-xl bg-[#0D1117] border border-amber-500/30">
            <span className="text-[10px] font-mono text-slate-400">Needs Review</span>
            <p className="text-lg font-mono font-bold text-amber-400">{metrics.exceptionsCount}</p>
          </div>
        </div>
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID, customer name, invoice or source..."
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 bg-[#0D1117] border border-white/[0.08] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00F59B]/50 transition-colors"
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={exportCSV}
            className="px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] flex items-center gap-1.5 whitespace-nowrap transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => {
              setSortField('confidence');
              setSortAsc(!sortAsc);
            }}
            className="px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] flex items-center gap-1.5 whitespace-nowrap transition-all"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span>Sort by Confidence</span>
          </button>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-white/[0.06] text-xs">
        {[
          { id: 'ALL', label: 'All Records', count: transactions.length },
          { id: 'MATCHED', label: 'Matched', count: metrics.matchedCount },
          { id: 'EXCEPTIONS', label: 'All Exceptions', count: metrics.exceptionsCount },
          { id: 'PARTIAL MATCH', label: 'Partial Match' },
          { id: 'DUPLICATE', label: 'Duplicates' },
          { id: 'MISSING', label: 'Missing' },
          { id: 'AMOUNT MISMATCH', label: 'Amount Mismatch' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setFilterStatus(tab.id);
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
              filterStatus === tab.id
                ? 'bg-[#111722] text-[#00F59B] border border-[#00F59B]/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/[0.06] text-slate-300">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Main Records Table */}
      <div className="rounded-2xl bg-[#0D1117] border border-white/[0.08] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#111722]/70 border-b border-white/[0.06] text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold">Transaction</th>
                <th className="py-3 px-4 font-semibold">Source</th>
                <th className="py-3 px-4 font-semibold">Invoice / Reference</th>
                <th className="py-3 px-4 font-semibold">Customer</th>
                <th className="py-3 px-4 font-semibold text-right">Amount</th>
                <th className="py-3 px-4 font-semibold text-center">Confidence</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">AI Explanation</th>
                <th className="py-3 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {paginatedTransactions.map(t => (
                <tr
                  key={t.id}
                  onClick={() => setSelectedTransaction(t)}
                  className={`hover:bg-white/[0.03] transition-colors cursor-pointer group ${
                    selectedTransaction?.id === t.id ? 'bg-[#111722]/90 border-l-2 border-[#00F59B]' : ''
                  }`}
                >
                  <td className="py-3 px-4 font-mono font-semibold text-slate-200 group-hover:text-[#00F59B]">
                    {t.id}
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] font-mono text-[11px]">
                      {t.source}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-300">
                    {t.invoiceId || <span className="text-slate-600 font-sans italic">None</span>}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-200">
                    {t.customerName}
                  </td>
                  <td className="py-3 px-4 font-mono font-medium text-slate-100 text-right">
                    ₹{t.amount.toLocaleString('en-IN')}
                    {t.discrepancyAmount && t.discrepancyAmount > 0 ? (
                      <div className="text-[10px] text-rose-400 font-mono">
                        Δ ₹{t.discrepancyAmount.toLocaleString('en-IN')}
                      </div>
                    ) : null}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`font-mono text-xs font-bold ${
                        t.confidence >= 95
                          ? 'text-[#00F59B]'
                          : t.confidence >= 80
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {t.confidence}%
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={t.status} />
                  </td>
                  <td className="py-3 px-4 text-slate-400 max-w-xs truncate text-[11px]">
                    {t.aiExplanation}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {t.status !== 'MATCHED' && t.resolution !== 'HUMAN_APPROVED' && (
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            setInvestigatingTransaction(t);
                          }}
                          className="px-2 py-1 rounded bg-[#00F59B]/10 hover:bg-[#00F59B]/20 text-[#00F59B] text-[11px] font-semibold transition-colors"
                        >
                          Investigate
                        </button>
                      )}
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedTransaction(t);
                        }}
                        className="px-2 py-1 rounded text-slate-400 hover:text-white hover:bg-white/[0.05] text-[11px] font-medium transition-colors"
                      >
                        Inspect
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-4 py-3 bg-[#07090D] border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
          <div>
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, filteredTransactions.length)} of {filteredTransactions.length} records
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="px-2.5 py-1 rounded bg-[#111722] border border-white/[0.08] disabled:opacity-40 hover:text-white"
            >
              Previous
            </button>
            <span className="font-mono text-slate-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="px-2.5 py-1 rounded bg-[#111722] border border-white/[0.08] disabled:opacity-40 hover:text-white"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

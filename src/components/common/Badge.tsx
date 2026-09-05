import React from 'react';
import { TransactionStatus, SeverityLevel } from '../../types/finance';

export const StatusBadge: React.FC<{ status: TransactionStatus; className?: string }> = ({ status, className = '' }) => {
  const getStyles = () => {
    switch (status) {
      case 'MATCHED':
        return 'bg-[#00F59B]/10 text-[#00F59B] border-[#00F59B]/30';
      case 'PARTIAL MATCH':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'DUPLICATE':
        return 'bg-purple-500/10 text-purple-300 border-purple-500/30';
      case 'MISSING':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'AMOUNT MISMATCH':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      case 'REVIEW REQUIRED':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono tracking-wider font-semibold border ${getStyles()} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80" />
      {status}
    </span>
  );
};

export const SeverityBadge: React.FC<{ severity?: SeverityLevel }> = ({ severity }) => {
  if (!severity) return null;

  const getStyles = () => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/40';
      case 'HIGH':
        return 'bg-orange-500/15 text-orange-400 border-orange-500/40';
      case 'MEDIUM':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/40';
      case 'LOW':
        return 'bg-slate-700/30 text-slate-300 border-slate-600/40';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium tracking-wide uppercase border ${getStyles()}`}
    >
      {severity}
    </span>
  );
};

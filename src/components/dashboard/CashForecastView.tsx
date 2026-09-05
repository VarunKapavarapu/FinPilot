import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Info,
  DollarSign,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { ProjectLogo } from '../common/Logo';
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { CASH_FORECAST_DATA } from '../../data/mockFinancialData';
import { formatINR } from '../../utils/formatters';

export const CashForecastView: React.FC = () => {
  const [horizon, setHorizon] = useState<'7d' | '30d' | '90d'>('30d');
  const [showInflows, setShowInflows] = useState<boolean>(true);
  const [showOutflows, setShowOutflows] = useState<boolean>(true);

  // Filter data according to horizon
  const chartData = useMemo(() => {
    if (horizon === '7d') {
      return CASH_FORECAST_DATA.slice(0, 3);
    }
    if (horizon === '30d') {
      return CASH_FORECAST_DATA.slice(0, 9);
    }
    return CASH_FORECAST_DATA;
  }, [horizon]);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-[#38BDF8] px-2 py-0.5 rounded bg-[#38BDF8]/10 border border-[#38BDF8]/20">
              Predictive Liquidity Engine
            </span>
            <span className="text-xs text-slate-500 font-mono">• Monte Carlo & Invoice Model</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Cash Position Forecast
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Reconciled bank positions blended with scheduled customer receivables and vendor payables.
          </p>
        </div>

        {/* Horizon Tabs */}
        <div className="flex items-center gap-1 bg-[#0D1117] p-1 rounded-xl border border-white/[0.08]">
          {[
            { id: '7d', label: '7-Day Runway' },
            { id: '30d', label: '30-Day Model' },
            { id: '90d', label: '90-Day Quarter' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setHorizon(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                horizon === tab.id
                  ? 'bg-[#111722] text-white shadow-sm border border-white/[0.1]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Forecast Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Current Cash */}
        <div className="p-5 rounded-2xl bg-[#0D1117] border border-white/[0.08]">
          <span className="text-xs font-medium text-slate-400">Current Cash Position</span>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-white mt-1">
            ₹18.4L
          </div>
          <div className="flex items-center gap-1 text-[11px] font-mono text-[#00F59B] mt-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>100% Reconciled Bank Balance</span>
          </div>
        </div>

        {/* 2. 7-Day Forecast */}
        <div className="p-5 rounded-2xl bg-[#0D1117] border border-white/[0.08]">
          <span className="text-xs font-medium text-slate-400">7-Day Forecast</span>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-[#00F59B] mt-1">
            ₹21.7L
          </div>
          <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 mt-2">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+₹3.3L Net Expansion</span>
          </div>
        </div>

        {/* 3. 30-Day Forecast */}
        <div className="p-5 rounded-2xl bg-[#0D1117] border border-[#38BDF8]/30 bg-gradient-to-b from-[#111722] to-[#0D1117]">
          <span className="text-xs font-medium text-slate-400">30-Day Forecast</span>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-[#38BDF8] mt-1">
            ₹26.3L
          </div>
          <div className="flex items-center gap-1 text-[11px] font-mono text-sky-400 mt-2">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+₹7.9L (95% Confidence)</span>
          </div>
        </div>

        {/* 4. 90-Day Forecast */}
        <div className="p-5 rounded-2xl bg-[#0D1117] border border-white/[0.08]">
          <span className="text-xs font-medium text-slate-400">90-Day Forecast</span>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-white mt-1">
            ₹31.8L
          </div>
          <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400 mt-2">
            <span>Quarter-End Target</span>
          </div>
        </div>
      </div>

      {/* Interactive Main Forecasting Chart */}
      <div className="p-6 rounded-2xl bg-[#0D1117] border border-white/[0.08] shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Liquidity Trajectory & Inflow/Outflow Breakdown
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Confidence cone (±5%) based on historical payment velocity from enterprise accounts.
            </p>
          </div>

          {/* Series Toggle Checkboxes */}
          <div className="flex items-center gap-4 text-xs font-medium text-slate-300">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showInflows}
                onChange={e => setShowInflows(e.target.checked)}
                className="rounded bg-[#111722] border-white/20 text-[#00F59B] focus:ring-0"
              />
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00F59B]" /> Expected Inflows
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showOutflows}
                onChange={e => setShowOutflows(e.target.checked)}
                className="rounded bg-[#111722] border-white/20 text-rose-500 focus:ring-0"
              />
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" /> Payables Outflow
              </span>
            </label>
          </div>
        </div>

        {/* Recharts Composed Chart */}
        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="projGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="dayLabel" stroke="#64748B" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                tickFormatter={val => `₹${(val / 100000).toFixed(1)}L`}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#111722', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '11px' }}
                formatter={(val: any, name: any) => [`₹${Number(val || 0).toLocaleString('en-IN')}`, String(name || '')]}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />

              {/* Confidence Band Area */}
              <Area
                type="monotone"
                dataKey="confidenceUpper"
                name="Confidence Range"
                stroke="transparent"
                fill="#38BDF8"
                fillOpacity={0.08}
              />

              {/* Inflow Bar */}
              {showInflows && (
                <Bar dataKey="expectedInflow" name="Scheduled Inflow" fill="#00F59B" radius={[4, 4, 0, 0]} maxBarSize={30} />
              )}

              {/* Outflow Bar */}
              {showOutflows && (
                <Bar dataKey="expectedOutflow" name="Scheduled Outflow" fill="#EF4444" radius={[4, 4, 0, 0]} maxBarSize={30} />
              )}

              {/* Projected Trajectory Line */}
              <Line
                type="monotone"
                dataKey="projectedCash"
                name="Projected Balance"
                stroke="#38BDF8"
                strokeWidth={3}
                dot={{ r: 4, fill: '#38BDF8' }}
              />

              {/* Actual Cash Line if present */}
              <Line
                type="monotone"
                dataKey="actualCash"
                name="Actual Balance"
                stroke="#FFFFFF"
                strokeWidth={2}
                dot={{ r: 5, fill: '#00F59B' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* AI Explanation Box */}
        <div className="p-4 rounded-xl bg-[#111722] border border-white/[0.06] flex items-start gap-3">
          <ProjectLogo size={18} className="flex-shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 leading-relaxed">
            <span className="font-semibold text-white">AI Controller Scenario Analysis: </span>
            “Cash is expected to increase over the next 30 days primarily due to ₹8.4L in scheduled customer settlements. 
            Key contributors include Tata Digital (₹3.2L due Sep 11) and Reliance Retail Digital (₹2.8L due Sep 19). 
            Cash reserve remains healthy above the ₹12.0L operational threshold.”
          </div>
        </div>
      </div>
    </div>
  );
};

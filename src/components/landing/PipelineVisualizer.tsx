import React, { useEffect, useRef } from 'react';
import { Landmark, FileText, CreditCard, Cpu, CheckCircle2, AlertTriangle, ArrowDown } from 'lucide-react';
import gsap from 'gsap';

export const PipelineVisualizer: React.FC<{ onLaunch: () => void }> = ({ onLaunch }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const particle1Ref = useRef<HTMLDivElement>(null);
  const particle2Ref = useRef<HTMLDivElement>(null);
  const particle3Ref = useRef<HTMLDivElement>(null);
  const pulseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate flowing energy particles through the pipeline
      const particles = [particle1Ref.current, particle2Ref.current, particle3Ref.current];
      particles.forEach((p, idx) => {
        if (!p) return;
        gsap.to(p, {
          y: 110,
          opacity: 0.9,
          duration: 2.2,
          repeat: -1,
          delay: idx * 0.7,
          ease: 'power1.inOut',
          yoyo: false,
        });
      });

      // Pulse the central AI controller engine
      if (pulseRef.current) {
        gsap.to(pulseRef.current, {
          scale: 1.08,
          opacity: 0.85,
          duration: 1.6,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div id="pipeline" ref={containerRef} className="relative w-full max-w-5xl mx-auto py-12 px-4 select-none">
      {/* Glow aura behind pipeline */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-gradient-to-r from-[#00F59B]/10 via-[#38BDF8]/10 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="p-6 md:p-8 rounded-2xl bg-[#0D1117]/90 border border-white/[0.08] backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col md:flex-row items-center justify-between pb-6 mb-8 border-b border-white/[0.06] gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-block w-2 h-2 rounded-full bg-[#00F59B] animate-ping" />
              <span className="text-[11px] font-mono font-semibold tracking-wider text-[#00F59B] uppercase">
                Autonomous Finance Flow Loop
              </span>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Import → Understand → Reconcile → Verify → Resolve → Forecast
            </h3>
          </div>
          <button
            onClick={onLaunch}
            className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] transition-all"
          >
            Inspect Live Data
          </button>
        </div>

        {/* The Visual Pipeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center relative">
          {/* Source 1: Bank Transactions */}
          <div className="p-4 rounded-xl bg-[#111722]/80 border border-white/[0.08] relative group hover:border-emerald-500/40 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono text-slate-400">INPUT 01</span>
              <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400">
                <Landmark className="w-4 h-4" />
              </div>
            </div>
            <h4 className="text-sm font-semibold text-white">Bank Feed</h4>
            <p className="text-[11px] text-slate-400 mt-1">HDFC, ICICI, Wires</p>
            <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-emerald-400/90 pt-2 border-t border-white/[0.04]">
              <span>Real-time SFTP</span>
              <span>100+ Txns</span>
            </div>
          </div>

          {/* Source 2: Invoices */}
          <div className="p-4 rounded-xl bg-[#111722]/80 border border-white/[0.08] relative group hover:border-blue-500/40 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono text-slate-400">INPUT 02</span>
              <div className="p-1.5 rounded-lg bg-blue-500/15 text-blue-400">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <h4 className="text-sm font-semibold text-white">ERP & Invoices</h4>
            <p className="text-[11px] text-slate-400 mt-1">Zoho, Tally, NetSuite</p>
            <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-blue-400/90 pt-2 border-t border-white/[0.04]">
              <span>200 Invoices</span>
              <span>REST API</span>
            </div>
          </div>

          {/* Source 3: Gateways */}
          <div className="p-4 rounded-xl bg-[#111722]/80 border border-white/[0.08] relative group hover:border-violet-500/40 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono text-slate-400">INPUT 03</span>
              <div className="p-1.5 rounded-lg bg-violet-500/15 text-violet-400">
                <CreditCard className="w-4 h-4" />
              </div>
            </div>
            <h4 className="text-sm font-semibold text-white">Gateways</h4>
            <p className="text-[11px] text-slate-400 mt-1">Stripe, Razorpay</p>
            <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-violet-400/90 pt-2 border-t border-white/[0.04]">
              <span>150 Settlements</span>
              <span>Webhooks</span>
            </div>
          </div>

          {/* Pipeline Central AI Engine */}
          <div
            ref={pulseRef}
            className="md:col-span-1 p-5 rounded-xl bg-gradient-to-b from-[#111722] to-[#07090D] border-2 border-[#00F59B]/50 shadow-xl shadow-[#00F59B]/10 relative text-center"
          >
            <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-[#00F59B]/15 border border-[#00F59B]/30 flex items-center justify-center text-[#00F59B]">
              <Cpu className="w-5 h-5 animate-pulse" />
            </div>
            <h4 className="text-xs font-bold text-white tracking-wide uppercase">AI Controller</h4>
            <p className="text-[10px] text-slate-400 mt-1">4-Way Correlation Engine</p>
            <div className="mt-3 py-1 px-2 rounded bg-[#00F59B]/10 border border-[#00F59B]/20 text-[10px] font-mono font-bold text-[#00F59B]">
              92.8% Match Rate
            </div>
          </div>

          {/* Verified Output & Exception Queue */}
          <div className="flex flex-col gap-3">
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00F59B]" />
                <span className="text-xs font-semibold text-white">232 Verified</span>
              </div>
              <span className="text-[10px] font-mono text-[#00F59B]">AUTO-POSTED</span>
            </div>

            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-semibold text-white">18 Exceptions</span>
              </div>
              <span className="text-[10px] font-mono text-amber-400">HUMAN REVIEW</span>
            </div>
          </div>
        </div>

        {/* Explanatory footer pill */}
        <div className="mt-6 pt-4 border-t border-white/[0.04] flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00F59B]" />
            <span>Deterministic arithmetic & matching rules</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
            <span>AI forensic investigation on exceptions</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>95% Confidence threshold guardrails</span>
          </div>
        </div>
      </div>
    </div>
  );
};

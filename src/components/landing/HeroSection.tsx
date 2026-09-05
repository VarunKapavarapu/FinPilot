import React, { useEffect, useRef } from 'react';
import { ArrowRight, Play, ChevronRight, Zap } from 'lucide-react';
import gsap from 'gsap';
import { PipelineVisualizer } from './PipelineVisualizer';
import { useFinance } from '../../context/FinanceContext';
import { formatINR } from '../../utils/formatters';
import { MagneticButton, ParticleCanvas, AnimatedCounter } from '../common/EliteEffects';
import { ProjectLogo } from '../common/Logo';

interface HeroSectionProps {
  onLaunch: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onLaunch }) => {
  const { metrics, executeRunTheBooksLoop } = useFinance();
  const heroRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from(badgeRef.current, {
        y: -20,
        opacity: 0,
        duration: 0.7,
      })
      .from(headlineRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.85,
      }, '-=0.35')
      .from(subtextRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.7,
      }, '-=0.4')
      .from(ctaRef.current, {
        y: 15,
        opacity: 0,
        scale: 0.96,
        duration: 0.6,
      }, '-=0.3');
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative pt-36 sm:pt-40 pb-20 overflow-hidden fintech-grid min-h-[95vh] flex flex-col justify-between">
      {/* Interactive Constellation Particle Canvas */}
      <ParticleCanvas className="opacity-60" />

      {/* Atmospheric Lighting Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[750px] h-[380px] bg-gradient-to-b from-[#00F59B]/15 via-[#38BDF8]/10 to-transparent blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Live Badge */}
        <div
          ref={badgeRef}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#111722]/90 border border-white/[0.12] text-xs font-medium text-slate-300 mb-8 shadow-lg shadow-black/40 backdrop-blur-md"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F59B] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00F59B]"></span>
          </span>
          <span className="tracking-wide font-mono text-[11px] text-slate-200">
            RAZORPAY BUILDATHON 2026 • AI FINANCE CONTROLLER
          </span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline font-mono text-[11px] text-[#38BDF8]">
            Verification Rigor Engine
          </span>
        </div>

        {/* Main Headline */}
        <h1
          ref={headlineRef}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.08] max-w-4xl mx-auto"
        >
          Close your books.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
            Know your cash.
          </span>{' '}
          <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F59B] via-[#2CEAA0] to-[#38BDF8]">
            Let AI handle the exceptions.
          </span>
        </h1>

        {/* Supporting text */}
        <p
          ref={subtextRef}
          className="mt-6 text-sm sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal"
        >
          <span className="text-white font-semibold">The 2026 Builder Consensus: </span>
          Verification capacity, not generation speed, is the bottleneck. FinPilot automatically reconciles financial records across Razorpay PG, bank feeds, invoices, and tax withholdings — reporting measured accuracy and an honest exception list.
        </p>

        {/* Elite Magnetic CTA buttons */}
        <div
          ref={ctaRef}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <MagneticButton
            onClick={executeRunTheBooksLoop}
            className="group relative px-7 py-3.5 rounded-xl text-sm font-bold text-black bg-gradient-to-r from-[#00F59B] to-[#2CEAA0] hover:from-[#05DF72] hover:to-[#00F59B] shadow-xl shadow-[#00F59B]/25 hover:shadow-2xl hover:shadow-[#00F59B]/40"
          >
            <div className="flex items-center gap-2.5">
              <ProjectLogo size={18} />
              <span>Run the Books & Cash Position</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </MagneticButton>

          <MagneticButton
            onClick={onLaunch}
            className="px-6 py-3.5 rounded-xl text-sm font-medium text-slate-200 hover:text-white bg-[#111722]/90 hover:bg-[#151E2E] border border-white/[0.1] hover:border-white/[0.2] shadow-lg shadow-black/40"
          >
            <div className="flex items-center gap-2">
              <Play className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Launch Controller Workspace</span>
            </div>
          </MagneticButton>
        </div>

        {/* 4 Directions Pills */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
          <span className="text-[11px] font-mono px-3 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-slate-300 hover:border-[#00F59B]/30 transition-colors">
            ✓ Multi-source reconciliation
          </span>
          <span className="text-[11px] font-mono px-3 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-slate-300 hover:border-[#38BDF8]/30 transition-colors">
            ✓ Settlement Q&A agent
          </span>
          <span className="text-[11px] font-mono px-3 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-slate-300 hover:border-[#00F59B]/30 transition-colors">
            ✓ Forward cash forecaster
          </span>
          <span className="text-[11px] font-mono px-3 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-slate-300 hover:border-amber-500/30 transition-colors">
            ✓ Tax-line matcher (TDS 194J/194C)
          </span>
        </div>

        {/* Quick stat badges with Animated Counters */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <AnimatedCounter value={metrics.recordsProcessed} className="text-white font-bold text-sm" />
            <span>Batch Records</span>
          </div>
          <div className="flex items-center gap-2">
            <AnimatedCounter value={metrics.matchRate} decimals={1} suffix="%" className="text-[#00F59B] font-bold text-sm" />
            <span>Match Rate</span>
          </div>
          <div className="flex items-center gap-2">
            <AnimatedCounter value={metrics.exceptionsCount} className="text-amber-400 font-bold text-sm" />
            <span>Honest Exceptions</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white font-bold text-sm">{formatINR(metrics.cashPosition, true)}</span>
            <span>Cash Position</span>
          </div>
        </div>
      </div>

      {/* Behind/under the hero: Animated Finance-Operation Pipeline */}
      <PipelineVisualizer onLaunch={onLaunch} />
    </section>
  );
};

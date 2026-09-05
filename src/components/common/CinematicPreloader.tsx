import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ProjectLogo } from './Logo';

interface CinematicPreloaderProps {
  onComplete: () => void;
}

const PHASES = [
  'Initializing FinPilot AI Autonomous Engine...',
  'Connecting Razorpay PG, RazorpayX & Bank Feeds...',
  'Ingesting 250 multi-source financial records...',
  'Calibrating 4-way correlation & Section 194J tax-matcher...',
  'Verification capacity verified. Opening ledger...',
];

export const CinematicPreloader: React.FC<CinematicPreloaderProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoWrapperRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const curtainTopRef = useRef<HTMLDivElement>(null);
  const curtainBottomRef = useRef<HTMLDivElement>(null);

  const [phaseText, setPhaseText] = useState(PHASES[0]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          // Slide open the curtains dramatically
          gsap.to(curtainTopRef.current, {
            yPercent: -100,
            duration: 0.9,
            ease: 'power4.inOut',
          });
          gsap.to(curtainBottomRef.current, {
            yPercent: 100,
            duration: 0.9,
            ease: 'power4.inOut',
            onComplete,
          });
        },
      });

      // Pulse and scale logo
      tl.fromTo(
        logoWrapperRef.current,
        { scale: 0.8, opacity: 0, filter: 'blur(10px)' },
        { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 1.2, ease: 'power3.out' }
      );

      // Animate percentage 0 -> 100
      const counterObj = { val: 0 };
      tl.to(
        counterObj,
        {
          val: 100,
          duration: 3.2,
          ease: 'power2.inOut',
          onUpdate: () => {
            if (percentRef.current) {
              const current = Math.floor(counterObj.val);
              percentRef.current.innerText = `${current}%`;
              if (progressLineRef.current) {
                progressLineRef.current.style.width = `${current}%`;
              }
              // Update status text progressively
              if (current < 25) setPhaseText(PHASES[0]);
              else if (current < 50) setPhaseText(PHASES[1]);
              else if (current < 75) setPhaseText(PHASES[2]);
              else if (current < 95) setPhaseText(PHASES[3]);
              else setPhaseText(PHASES[4]);
            }
          },
        },
        '-=0.6'
      );

      // Fade out inner elements before curtains open
      tl.to([logoWrapperRef.current, percentRef.current, textRef.current, progressLineRef.current?.parentElement], {
        opacity: 0,
        y: -15,
        duration: 0.5,
        ease: 'power2.in',
      });
    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  const handleSkip = () => {
    gsap.killTweensOf([logoWrapperRef.current, percentRef.current, textRef.current, progressLineRef.current]);
    gsap.to(curtainTopRef.current, { yPercent: -100, duration: 0.45, ease: 'power3.inOut' });
    gsap.to(curtainBottomRef.current, {
      yPercent: 100,
      duration: 0.45,
      ease: 'power3.inOut',
      onComplete,
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[100] overflow-hidden select-none pointer-events-auto bg-[#07090D]">
      {/* Top Split Curtain */}
      <div
        ref={curtainTopRef}
        className="absolute top-0 left-0 right-0 h-1/2 bg-[#07090D] border-b border-white/[0.06] z-10"
      />
      {/* Bottom Split Curtain */}
      <div
        ref={curtainBottomRef}
        className="absolute bottom-0 left-0 right-0 h-1/2 bg-[#07090D] border-t border-white/[0.06] z-10"
      />

      {/* Center Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-6 text-center">
        {/* Glow Aura */}
        <div className="absolute w-72 h-72 rounded-full bg-[#00F59B]/10 blur-3xl pointer-events-none animate-pulse" />

        <div ref={logoWrapperRef} className="mb-6 relative">
          <ProjectLogo size={64} className="shadow-2xl shadow-[#00F59B]/30" />
          <div className="absolute -bottom-2 -right-2 w-3.5 h-3.5 rounded-full bg-[#00F59B] animate-ping" />
        </div>

        <div className="flex items-center gap-2 mb-2">
          <span className="font-mono text-[11px] tracking-widest uppercase text-slate-400">
            FinPilot AI • Verification Capacity Engine
          </span>
        </div>

        <div className="text-4xl font-extrabold font-mono text-white mb-4">
          <span ref={percentRef}>0%</span>
        </div>

        {/* Loading Bar */}
        <div className="w-64 sm:w-80 bg-white/[0.08] h-1.5 rounded-full overflow-hidden mb-4">
          <div
            ref={progressLineRef}
            className="h-full bg-gradient-to-r from-[#00F59B] via-[#2CEAA0] to-[#38BDF8] rounded-full w-0"
          />
        </div>

        <p ref={textRef} className="text-xs font-mono text-slate-400 h-4">
          {phaseText}
        </p>

        {/* Skip button with ESC badge */}
        <button
          onClick={handleSkip}
          className="group mt-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.12] border border-white/[0.1] hover:border-white/[0.22] text-xs font-mono text-slate-300 hover:text-white transition-all duration-200 shadow-md hover:scale-105 active:scale-95"
          title="Press ESC to skip"
        >
          <span>Skip intro</span>
          <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.08] text-slate-400 border border-white/10 group-hover:text-slate-200">
            ESC
          </kbd>
        </button>
      </div>
    </div>
  );
};

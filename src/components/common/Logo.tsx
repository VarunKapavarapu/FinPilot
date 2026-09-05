import React from 'react';

/**
 * Exact FinPilot Project Logo matching user's official identity:
 * Green top financial flow loop with center node arch + Blue dashed lower settlement track.
 */
export const ProjectLogo: React.FC<{ size?: number; className?: string }> = ({
  size = 32,
  className = '',
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-2xl bg-[#0B0F17] border border-white/[0.12] shadow-lg shadow-black/60 overflow-hidden group select-none hover:border-[#00F59B]/50 transition-all duration-300 ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Subtle radial aura */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#00F59B]/15 via-transparent to-[#38BDF8]/15 opacity-50 group-hover:opacity-100 transition-opacity" />

      <svg
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[82%] h-[82%] transform group-hover:scale-105 transition-transform duration-300"
      >
        {/* Blue dashed lower returning stadium track */}
        <path
          d="M13 14.5 C9 14.5 7 17.5 7 21.5 C7 25.5 10 28 14.5 28 H21 C24.5 28 27.5 25.5 27.5 22.5"
          stroke="#38BDF8"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="1.5 3.8"
        />

        {/* Top green flow loop + center arch */}
        <path
          d="M8.5 11.5 C8.5 9 10.5 7.5 13.5 7.5 H21 C25 7.5 27.5 10.5 27.5 14.5 C27.5 18.5 24.5 19.5 21 19.5 H16.5 C16.5 16 19 16 19 17.5"
          stroke="#00F59B"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Lower green base bar */}
        <path
          d="M10.5 19.5 H21 C24 19.5 26.5 17.5 26.5 14.5"
          stroke="#00F59B"
          strokeWidth="3.2"
          strokeLinecap="round"
        />

        {/* Center Verification Node Dot */}
        <circle cx="17.5" cy="16.5" r="1.8" fill="#00F59B" />
      </svg>
    </div>
  );
};

export const Logo: React.FC<{
  size?: number;
  className?: string;
  showText?: boolean;
  compact?: boolean;
}> = ({
  size = 32,
  className = '',
  showText = true,
  compact = false,
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 select-none group ${className}`}>
      <ProjectLogo size={size} />

      {showText && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-[15px] tracking-tight text-white font-sans group-hover:text-slate-100 transition-colors">
              FinPilot
            </span>
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-[#00F59B]/15 text-[#00F59B] border border-[#00F59B]/30 leading-none">
              AI
            </span>
          </div>
          {!compact && (
            <span className="text-[8px] font-mono tracking-wider text-slate-400 uppercase -mt-0.5">
              Finance Controller
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// Aliased exports for backward compatibility across the codebase
export const BrandIcon = ProjectLogo;

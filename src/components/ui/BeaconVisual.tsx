import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface BeaconVisualProps {
  isPaused?: boolean;
}

export const BeaconVisual: React.FC<BeaconVisualProps> = ({ isPaused = false }) => {
  return (
    <div className="relative w-[76px] h-[76px] flex items-center justify-center select-none">
      {/* Desktop hover tooltip */}
      <div
        role="tooltip"
        className="hidden lg:block absolute bottom-full mb-2.5 right-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap px-3 py-1 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[11px] font-semibold text-[var(--text-heading)] shadow-md z-30"
      >
        Start a project
      </div>

      {/* Rotating SVG circular text path */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full pointer-events-none"
        style={{
          animation: isPaused ? 'none' : 'beaconSpin 18s linear infinite',
          willChange: 'transform',
        }}
        aria-hidden="true"
      >
        <defs>
          <path
            id="beacon-text-path"
            d="M 50,50 m -34.5,0 a 34.5,34.5 0 1,1 69,0 a 34.5,34.5 0 1,1 -69,0"
          />
        </defs>
        <text
          fill="#1F7A8C"
          className="font-display font-bold uppercase"
          style={{ fontSize: '7.8px', letterSpacing: '1.6px' }}
        >
          <textPath href="#beacon-text-path" startOffset="0%">
            • START A PROJECT • DIGIHUST SPECIALISTS&#160;
          </textPath>
        </text>
      </svg>

      {/* Static center icon (mint/teal) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="w-8 h-8 rounded-full bg-[#1F7A8C]/10 flex items-center justify-center text-[#1F7A8C] transition-transform duration-200 group-hover:scale-110">
          <ArrowUpRight className="w-4 h-4 stroke-[2.5] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';

/**
 * 3D Isometric Boxes Loader
 * From Uiverse.io by Nawsome (MIT License)
 */

export interface BoxesLoaderProps {
  className?: string;
  delayMs?: number;
  size?: number;
  showBrandText?: boolean;
  showProgress?: boolean;
  subtitle?: string;
}

export const BoxesLoader: React.FC<BoxesLoaderProps> = ({
  className = '',
  delayMs = 0,
  size = 48,
  showBrandText = false,
  showProgress = false,
  subtitle = 'Loading Experience',
}) => {
  const [shouldShow, setShouldShow] = useState(delayMs === 0);

  useEffect(() => {
    if (delayMs <= 0) return;
    const timer = setTimeout(() => setShouldShow(true), delayMs);
    return () => clearTimeout(timer);
  }, [delayMs]);

  if (!shouldShow) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`boxes-loader-wrapper relative flex flex-col items-center justify-center ${className}`}
      style={{ '--size': `${size}px` } as React.CSSProperties}
    >
      {/* Ambient Lighting Stage */}
      <div className="boxes-ambient-stage" aria-hidden="true" />

      {/* 3D Isometric Boxes Animation from Uiverse.io by Nawsome */}
      <div className="boxes relative z-10">
        <div className="box">
          <div />
          <div />
          <div />
          <div />
        </div>
        <div className="box">
          <div />
          <div />
          <div />
          <div />
        </div>
        <div className="box">
          <div />
          <div />
          <div />
          <div />
        </div>
        <div className="box">
          <div />
          <div />
          <div />
          <div />
        </div>
      </div>

      {/* Brand Title & Progress Status */}
      {showBrandText && (
        <div className="mt-12 flex flex-col items-center text-center relative z-10">
          <span className="font-display font-extrabold text-xl sm:text-2xl text-[#022B3A] dark:text-white tracking-tight">
            Digi<span className="text-[#1F7A8C] dark:text-cyan-400">Hust</span>
          </span>
          <p className="font-sans text-[11px] font-bold text-[#1F7A8C] dark:text-cyan-300 tracking-[0.25em] uppercase flex items-center gap-1.5 mt-1">
            <span>{subtitle}</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#1F7A8C] dark:bg-cyan-400 animate-ping" />
          </p>
        </div>
      )}

      {/* Animated Minimalist Progress Track */}
      {showProgress && (
        <div className="loader-progress-track relative z-10" aria-hidden="true">
          <div className="loader-progress-bar" />
        </div>
      )}

      <span className="sr-only">Loading DigiHust...</span>
    </div>
  );
};

// Aliases for backward compatibility
export const CubeLoader = BoxesLoader;
export type CubeLoaderProps = BoxesLoaderProps;


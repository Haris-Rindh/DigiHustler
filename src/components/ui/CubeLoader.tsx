import React, { useState, useEffect } from 'react';

/**
 * 3D Isometric Boxes Loader
 * From Uiverse.io by Nawsome (MIT License)
 */

export interface BoxesLoaderProps {
  className?: string;
  delayMs?: number;
  size?: number;
}

export const BoxesLoader: React.FC<BoxesLoaderProps> = ({
  className = '',
  delayMs = 0,
  size = 32,
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
      className={`boxes-loader-wrapper flex items-center justify-center p-6 ${className}`}
      style={{ '--size': `${size}px` } as React.CSSProperties}
    >
      {/* From Uiverse.io by Nawsome */}
      <div className="boxes">
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
      <span className="sr-only">Loading...</span>
    </div>
  );
};

// Aliases for backward compatibility
export const CubeLoader = BoxesLoader;
export type CubeLoaderProps = BoxesLoaderProps;


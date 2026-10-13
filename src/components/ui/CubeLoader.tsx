import React, { useState, useEffect } from 'react';

/* 
 * 3D Spinning Cube Loader
 * Based on https://uiverse.io/Nawsome/cold-liger-90 (MIT License)
 * Designed with flat brand teal tone faces and soft neutral floor shadow
 */

interface CubeLoaderProps {
  className?: string;
  delayMs?: number;
  size?: number;
}

export const CubeLoader: React.FC<CubeLoaderProps> = ({
  className = '',
  delayMs = 0,
  size = 42,
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
      className={`flex flex-col items-center justify-center p-6 ${className}`}
      style={{ '--cube-size': `${size}px` } as React.CSSProperties}
    >
      <div className="cube-loader-wrapper">
        <div className="cube-loader">
          <div className="cube-side cube-front" />
          <div className="cube-side cube-back" />
          <div className="cube-side cube-right" />
          <div className="cube-side cube-left" />
          <div className="cube-side cube-top" />
          <div className="cube-side cube-bottom" />
        </div>
        <div className="cube-shadow" />
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

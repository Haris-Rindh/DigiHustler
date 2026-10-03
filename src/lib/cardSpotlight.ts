import React from 'react';

/**
 * High-performance mouse spotlight tracker for buttery card illumination.
 * Throttles coordinate updates to animation frames and respects coarse touch devices.
 */
export const handleCardSpotlightMove = (e: React.PointerEvent<HTMLElement>) => {
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return;
  const target = e.currentTarget;
  requestAnimationFrame(() => {
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    target.style.setProperty('--mouse-x', `${x}px`);
    target.style.setProperty('--mouse-y', `${y}px`);
  });
};

export const handleCardSpotlightLeave = (e: React.PointerEvent<HTMLElement>) => {
  const target = e.currentTarget;
  target.style.setProperty('--mouse-x', '-999px');
  target.style.setProperty('--mouse-y', '-999px');
};

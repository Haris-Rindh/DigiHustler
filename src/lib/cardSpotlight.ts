import React from 'react';

export const handleCardSpotlightMove = (e: React.PointerEvent<HTMLElement>) => {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const currentTarget = e.currentTarget;
  requestAnimationFrame(() => {
    if (!currentTarget) return;
    const rect = currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    currentTarget.style.setProperty('--mx', `${x}px`);
    currentTarget.style.setProperty('--my', `${y}px`);
  });
};

export const handleCardSpotlightLeave = (e: React.PointerEvent<HTMLElement>) => {
  const currentTarget = e.currentTarget;
  if (currentTarget) {
    currentTarget.style.setProperty('--mx', '-999px');
    currentTarget.style.setProperty('--my', '-999px');
  }
};



import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const [cursorVariant, setCursorVariant] = useState<'default' | 'hover' | 'card' | 'orbit'>('default');
  const [isPointerDevice, setIsPointerDevice] = useState(false);

  // Raw mouse coordinates
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth spring physics for outer trailing ring
  const springConfig = { damping: 28, stiffness: 350, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Only enable on desktop pointer devices with fine hover capability
    const pointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (!pointerQuery.matches || motionQuery.matches) {
      setIsPointerDevice(false);
      return;
    }

    setIsPointerDevice(true);

    const onMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      // Contextual inspection of hovered element
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cursorTarget = target.closest('[data-cursor]') as HTMLElement | null;
      const interactiveTarget = target.closest('a, button, input, select, textarea, [role="button"]');

      if (cursorTarget) {
        const customType = cursorTarget.getAttribute('data-cursor');
        if (customType === 'view') {
          setCursorVariant('card');
          setCursorText('VIEW');
        } else if (customType === 'orbit') {
          setCursorVariant('orbit');
          setCursorText('EXPLORE');
        } else {
          setCursorVariant('hover');
          setCursorText('');
        }
      } else if (interactiveTarget) {
        setCursorVariant('hover');
        setCursorText('');
      } else {
        setCursorVariant('default');
        setCursorText('');
      }
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [mouseX, mouseY, isVisible]);

  if (!isPointerDevice || !isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {/* Outer Spring Follower Ring */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: cursorVariant === 'card' || cursorVariant === 'orbit' ? 68 : cursorVariant === 'hover' ? 44 : 28,
          height: cursorVariant === 'card' || cursorVariant === 'orbit' ? 68 : cursorVariant === 'hover' ? 44 : 28,
          backgroundColor:
            cursorVariant === 'card'
              ? 'var(--accent-teal)'
              : cursorVariant === 'orbit'
              ? 'rgba(14, 165, 233, 0.92)'
              : cursorVariant === 'hover'
              ? 'var(--accent-glow)'
              : 'transparent',
          borderColor: cursorVariant === 'default' ? 'var(--accent-teal)' : 'var(--accent-sky)',
        }}
        transition={{ type: 'spring', stiffness: 450, damping: 28 }}
        className="rounded-full border flex items-center justify-center backdrop-blur-[1px] shadow-sm"
      >
        {cursorText && (
          <span className="text-[9px] font-black tracking-widest text-[var(--text-heading)] uppercase select-none drop-shadow-sm">
            {cursorText}
          </span>
        )}
      </motion.div>

      {/* Center Pinpoint Dot */}
      <motion.div
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: cursorVariant === 'card' || cursorVariant === 'orbit' ? 0 : cursorVariant === 'hover' ? 1.5 : 1,
          backgroundColor: cursorVariant === 'hover' ? 'var(--accent-sky)' : 'var(--accent-teal)',
        }}
        className="w-1.5 h-1.5 rounded-full shadow-sm"
      />
    </div>
  );
};

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

  // Ultra-responsive, buttery-smooth spring physics for outer trailing ring (near-zero lag)
  const springConfig = { damping: 38, stiffness: 1200, mass: 0.06 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const isVisibleRef = React.useRef(false);
  const rafRef = React.useRef<number | null>(null);

  useEffect(() => {
    // Only enable on desktop pointer devices with fine hover capability
    const pointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (!pointerQuery.matches || motionQuery.matches) {
      setIsPointerDevice(false);
      return;
    }

    setIsPointerDevice(true);

    const inspectTarget = (target: HTMLElement | null, clientX: number, clientY: number) => {
      if (!target) return;

      const navTarget = target.closest('nav, footer, header');
      if (navTarget) {
        if (isVisibleRef.current) {
          isVisibleRef.current = false;
          setIsVisible(false);
        }
        return;
      } else {
        if (!isVisibleRef.current && clientX > 0 && clientY > 0) {
          isVisibleRef.current = true;
          setIsVisible(true);
        }
      }

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

    const onMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        setIsVisible(true);
      }

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(() => {
        inspectTarget(e.target as HTMLElement | null, e.clientX, e.clientY);
      });
    };

    const onMouseLeave = () => {
      isVisibleRef.current = false;
      setIsVisible(false);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [mouseX, mouseY]);

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
              ? 'var(--brand-teal)'
              : cursorVariant === 'orbit'
              ? 'rgba(31, 122, 140, 0.85)'
              : cursorVariant === 'hover'
              ? 'var(--brand-teal-subtle)'
              : 'transparent',
          borderColor: cursorVariant === 'default' ? 'var(--brand-teal)' : 'var(--brand-teal)',
        }}
        transition={{ type: 'spring', stiffness: 850, damping: 35 }}
        className="rounded-full border flex items-center justify-center backdrop-blur-[1px] shadow-sm"
      >
        {cursorText && (
          <span className="text-[9px] font-black tracking-widest text-white uppercase select-none drop-shadow-sm">
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
          backgroundColor: 'var(--brand-teal)',
        }}
        transition={{ duration: 0.12, ease: [0.16, 1, 0.3, 1] }}
        className="w-1.5 h-1.5 rounded-full shadow-sm"
      />
    </div>
  );
};

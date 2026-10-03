import React, { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

export const CustomCursor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [cursorMode, setCursorMode] = useState<'default' | 'hover' | 'view' | 'text'>('default');
  const [isClicking, setIsClicking] = useState(false);
  const [isPointerDevice, setIsPointerDevice] = useState(false);
  const [velocityAngle, setVelocityAngle] = useState(0);
  const [velocityStretch, setVelocityStretch] = useState(0);

  // Raw instant mouse coordinates (Zero latency core)
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Critically damped spring physics for outer kinetic reticle
  const springConfig = { damping: 24, stiffness: 360, mass: 0.35 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const lastPosRef = useRef({ x: -100, y: -100, time: Date.now() });
  const stopTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Only activate on devices with fine hover capability (desktop mice / trackpads)
    const pointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (!pointerQuery.matches || motionQuery.matches) {
      setIsPointerDevice(false);
      return;
    }

    setIsPointerDevice(true);
    document.body.classList.add('has-custom-cursor');

    const onMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      const currentX = e.clientX;
      const currentY = e.clientY;

      mouseX.set(currentX);
      mouseY.set(currentY);

      if (!isVisible && currentX > 0 && currentY > 0) {
        setIsVisible(true);
      }

      // Calculate kinetic velocity vector for organic stretching
      const prev = lastPosRef.current;
      const dx = currentX - prev.x;
      const dy = currentY - prev.y;
      const dt = Math.max(now - prev.time, 1);
      const speed = Math.hypot(dx, dy) / dt;

      if (speed > 0.15) {
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        const stretch = Math.min(speed * 0.12, 0.4);
        setVelocityAngle(angle);
        setVelocityStretch(stretch);

        if (stopTimeoutRef.current) clearTimeout(stopTimeoutRef.current);
        stopTimeoutRef.current = setTimeout(() => {
          setVelocityStretch(0);
        }, 60);
      }

      lastPosRef.current = { x: currentX, y: currentY, time: now };

      // Contextual inspection of hovered element
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // 1. Explicit data-cursor targets (Case studies, project cards, galleries)
      const cursorTarget = target.closest('[data-cursor]') as HTMLElement | null;
      if (cursorTarget) {
        const customType = cursorTarget.getAttribute('data-cursor');
        if (customType === 'view') {
          setCursorMode('view');
          return;
        }
      }

      // 2. Interactive clickable targets (Buttons, links, controls)
      const interactiveTarget = target.closest(
        'a, button, [role="button"], select, .cursor-pointer, input[type="submit"], input[type="button"]'
      );
      if (interactiveTarget) {
        setCursorMode('hover');
        return;
      }

      // 3. Text inputs or text-heavy reading zones
      const textInputTarget = target.closest('input[type="text"], input[type="email"], input[type="password"], textarea');
      if (textInputTarget) {
        setCursorMode('text');
        return;
      }

      // Default state
      setCursorMode('default');
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      document.body.classList.remove('has-custom-cursor');
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      if (stopTimeoutRef.current) clearTimeout(stopTimeoutRef.current);
    };
  }, [mouseX, mouseY, isVisible]);

  if (!isPointerDevice || !isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden select-none">
      {/* ── KINETIC GEOMETRIC HUD RETICLE (100% CIRCLE-FREE) ── */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
          rotate: cursorMode === 'default' ? velocityAngle : 0,
          scaleX: cursorMode === 'default' ? 1 + velocityStretch : 1,
          scaleY: cursorMode === 'default' ? 1 - velocityStretch * 0.4 : 1,
        }}
        animate={{
          scale: isClicking ? 0.72 : 1,
          width:
            cursorMode === 'view'
              ? 96
              : cursorMode === 'hover'
              ? 48
              : cursorMode === 'text'
              ? 16
              : 30,
          height:
            cursorMode === 'view'
              ? 32
              : cursorMode === 'hover'
              ? 48
              : cursorMode === 'text'
              ? 26
              : 30,
        }}
        transition={{
          type: 'spring',
          stiffness: 440,
          damping: 26,
          mass: 0.32,
        }}
        className="relative flex items-center justify-center will-change-transform"
      >
        {/* ── MODE 1 & 2: DEFAULT & HOVER 4-CORNER GEOMETRIC BRACKETS ── */}
        {(cursorMode === 'default' || cursorMode === 'hover') && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Top-Left Corner Bracket */}
            <span
              className="absolute top-0 left-0 border-t-[1.5px] border-l-[1.5px] transition-all duration-200"
              style={{
                width: cursorMode === 'hover' ? 10 : 7,
                height: cursorMode === 'hover' ? 10 : 7,
                borderColor: cursorMode === 'hover' ? '#34D399' : 'rgba(31, 122, 140, 0.85)',
                filter: cursorMode === 'hover' ? 'drop-shadow(0 0 4px #34D399)' : 'none',
              }}
            />
            {/* Top-Right Corner Bracket */}
            <span
              className="absolute top-0 right-0 border-t-[1.5px] border-r-[1.5px] transition-all duration-200"
              style={{
                width: cursorMode === 'hover' ? 10 : 7,
                height: cursorMode === 'hover' ? 10 : 7,
                borderColor: cursorMode === 'hover' ? '#34D399' : 'rgba(31, 122, 140, 0.85)',
                filter: cursorMode === 'hover' ? 'drop-shadow(0 0 4px #34D399)' : 'none',
              }}
            />
            {/* Bottom-Left Corner Bracket */}
            <span
              className="absolute bottom-0 left-0 border-b-[1.5px] border-l-[1.5px] transition-all duration-200"
              style={{
                width: cursorMode === 'hover' ? 10 : 7,
                height: cursorMode === 'hover' ? 10 : 7,
                borderColor: cursorMode === 'hover' ? '#34D399' : 'rgba(31, 122, 140, 0.85)',
                filter: cursorMode === 'hover' ? 'drop-shadow(0 0 4px #34D399)' : 'none',
              }}
            />
            {/* Bottom-Right Corner Bracket */}
            <span
              className="absolute bottom-0 right-0 border-b-[1.5px] border-r-[1.5px] transition-all duration-200"
              style={{
                width: cursorMode === 'hover' ? 10 : 7,
                height: cursorMode === 'hover' ? 10 : 7,
                borderColor: cursorMode === 'hover' ? '#34D399' : 'rgba(31, 122, 140, 0.85)',
                filter: cursorMode === 'hover' ? 'drop-shadow(0 0 4px #34D399)' : 'none',
              }}
            />

            {/* Hover Crosshair Ticks (Extends outside on hover) */}
            {cursorMode === 'hover' && (
              <>
                <span className="absolute top-1/2 -left-1.5 w-1 h-[1.5px] -translate-y-1/2 bg-emerald-400" />
                <span className="absolute top-1/2 -right-1.5 w-1 h-[1.5px] -translate-y-1/2 bg-emerald-400" />
                <span className="absolute -top-1.5 left-1/2 w-[1.5px] h-1 -translate-x-1/2 bg-emerald-400" />
                <span className="absolute -bottom-1.5 left-1/2 w-[1.5px] h-1 -translate-x-1/2 bg-emerald-400" />
              </>
            )}
          </div>
        )}

        {/* ── MODE 3: VIEW CHAMFERED GEOMETRIC HUD BADGE (NO CIRCLE) ── */}
        {cursorMode === 'view' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.15 }}
            style={{
              clipPath:
                'polygon(6px 0%, calc(100% - 6px) 0%, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0% calc(100% - 6px), 0% 6px)',
            }}
            className="w-full h-full bg-[#022B3A]/95 border border-[var(--brand-teal)] shadow-[0_8px_20px_rgba(2,43,58,0.7),0_0_12px_rgba(31,122,140,0.5)] flex items-center justify-center space-x-1.5 px-3 backdrop-blur-md"
          >
            <span className="text-[10px] font-mono font-black tracking-widest text-white uppercase">
              VIEW
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400 stroke-[2.5]" />
          </motion.div>
        )}

        {/* ── MODE 4: TEXT GEOMETRIC I-BEAM (NO CIRCLE) ── */}
        {cursorMode === 'text' && (
          <div className="w-full h-full flex flex-col items-center justify-between pointer-events-none">
            <div className="w-3 h-[2px] bg-[var(--brand-teal)] shadow-sm" />
            <div className="w-[2px] flex-1 bg-[var(--brand-teal)] shadow-sm" />
            <div className="w-3 h-[2px] bg-[var(--brand-teal)] shadow-sm" />
          </div>
        )}
      </motion.div>

      {/* ── ZERO-LATENCY PRECISION DIAMOND CROSSHAIR CORE (NO CIRCLE) ── */}
      <motion.div
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale:
            cursorMode === 'view' || cursorMode === 'text'
              ? 0
              : isClicking
              ? 0.7
              : cursorMode === 'hover'
              ? 1.3
              : 1,
          rotate: cursorMode === 'hover' ? 90 : 45,
          backgroundColor:
            cursorMode === 'hover' ? '#34D399' : 'var(--brand-teal)',
          boxShadow:
            cursorMode === 'hover'
              ? '0 0 10px 2px rgba(52, 211, 153, 0.9)'
              : '0 0 6px 1px rgba(31, 122, 140, 0.75)',
        }}
        transition={{ duration: 0.12 }}
        className="w-2 h-2 pointer-events-none will-change-transform flex items-center justify-center"
      >
        {/* Crisp Square Micro-Aperture */}
        <div className="w-0.5 h-0.5 bg-black" />
      </motion.div>
    </div>
  );
};

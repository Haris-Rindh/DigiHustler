import React, { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

export const CustomCursor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [cursorMode, setCursorMode] = useState<'default' | 'hover' | 'view' | 'text'>('default');
  const [isClicking, setIsClicking] = useState(false);
  const [isPointerDevice, setIsPointerDevice] = useState(false);
  const [tiltAngle, setTiltAngle] = useState(0);

  // Raw instant mouse coordinates (Zero latency core)
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Critically damped spring physics for buttery trailing follower
  const springConfig = { damping: 26, stiffness: 380, mass: 0.28 };
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

      // Calculate subtle banking tilt angle based on horizontal movement
      const prev = lastPosRef.current;
      const dx = currentX - prev.x;
      const dt = Math.max(now - prev.time, 1);
      const velocityX = dx / dt;

      if (Math.abs(velocityX) > 0.05) {
        // Smooth banking tilt capped between -14deg and +14deg
        const targetTilt = Math.max(-14, Math.min(14, velocityX * 12));
        setTiltAngle(targetTilt);

        if (stopTimeoutRef.current) clearTimeout(stopTimeoutRef.current);
        stopTimeoutRef.current = setTimeout(() => {
          setTiltAngle(0);
        }, 70);
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
      {/* ── 1. BUTTERY SPRING RETICLE FOLLOWER (100% CIRCLE-FREE) ── */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isClicking ? 0.75 : 1,
          width: cursorMode === 'hover' ? 42 : cursorMode === 'view' ? 48 : 24,
          height: cursorMode === 'hover' ? 42 : cursorMode === 'view' ? 48 : 24,
          opacity: cursorMode === 'hover' ? 1 : cursorMode === 'view' ? 0.9 : 0.45,
        }}
        transition={{
          type: 'spring',
          stiffness: 440,
          damping: 24,
          mass: 0.25,
        }}
        className="relative flex items-center justify-center will-change-transform pointer-events-none"
      >
        {/* MODE: DEFAULT TRAILING SHARD */}
        {cursorMode === 'default' && (
          <div className="absolute inset-0 pointer-events-none">
            <span
              className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-[1.5px] border-r-[1.5px] border-[var(--brand-teal)]"
              style={{ filter: 'drop-shadow(0 0 4px var(--brand-teal))' }}
            />
            <span
              className="absolute top-0.5 left-0.5 w-1.5 h-1.5 border-t-[1.5px] border-l-[1.5px] border-cyan-400"
              style={{ filter: 'drop-shadow(0 0 3px #22D3EE)' }}
            />
          </div>
        )}

        {/* MODE: HOVER CYBERNETIC TARGET LOCK BRACKETS */}
        {(cursorMode === 'hover' || cursorMode === 'view') && (
          <div className="absolute inset-0 pointer-events-none">
            {/* 4 Corner Locking Brackets */}
            <span
              className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 transition-all duration-150"
              style={{
                borderColor: cursorMode === 'hover' ? '#34D399' : '#22D3EE',
                filter: `drop-shadow(0 0 6px ${cursorMode === 'hover' ? '#34D399' : '#22D3EE'})`,
              }}
            />
            <span
              className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 transition-all duration-150"
              style={{
                borderColor: cursorMode === 'hover' ? '#34D399' : '#22D3EE',
                filter: `drop-shadow(0 0 6px ${cursorMode === 'hover' ? '#34D399' : '#22D3EE'})`,
              }}
            />
            <span
              className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 transition-all duration-150"
              style={{
                borderColor: cursorMode === 'hover' ? '#34D399' : '#22D3EE',
                filter: `drop-shadow(0 0 6px ${cursorMode === 'hover' ? '#34D399' : '#22D3EE'})`,
              }}
            />
            <span
              className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 transition-all duration-150"
              style={{
                borderColor: cursorMode === 'hover' ? '#34D399' : '#22D3EE',
                filter: `drop-shadow(0 0 6px ${cursorMode === 'hover' ? '#34D399' : '#22D3EE'})`,
              }}
            />

            {/* Target Reticle Crosshair Ticks */}
            <span
              className="absolute top-1/2 -left-1.5 w-1.5 h-[1.5px] -translate-y-1/2 transition-colors duration-150"
              style={{ backgroundColor: cursorMode === 'hover' ? '#34D399' : '#22D3EE' }}
            />
            <span
              className="absolute top-1/2 -right-1.5 w-1.5 h-[1.5px] -translate-y-1/2 transition-colors duration-150"
              style={{ backgroundColor: cursorMode === 'hover' ? '#34D399' : '#22D3EE' }}
            />
            <span
              className="absolute -top-1.5 left-1/2 w-[1.5px] h-1.5 -translate-x-1/2 transition-colors duration-150"
              style={{ backgroundColor: cursorMode === 'hover' ? '#34D399' : '#22D3EE' }}
            />
            <span
              className="absolute -bottom-1.5 left-1/2 w-[1.5px] h-1.5 -translate-x-1/2 transition-colors duration-150"
              style={{ backgroundColor: cursorMode === 'hover' ? '#34D399' : '#22D3EE' }}
            />
          </div>
        )}
      </motion.div>

      {/* ── 2. PERMANENT ZERO-LATENCY CYBER DART POINTER (Visible Everywhere!) ── */}
      <motion.div
        style={{
          x: mouseX,
          y: mouseY,
          rotate: tiltAngle,
        }}
        animate={{
          scale: isClicking ? 0.78 : cursorMode === 'hover' ? 1.15 : 1,
        }}
        transition={{ duration: 0.1, ease: 'easeOut' }}
        className="absolute top-0 left-0 pointer-events-none will-change-transform origin-top-left"
      >
        {/* Razor Laser Dart Vector (Tip anchored at exact 0,0) */}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          className="overflow-visible"
          style={{
            filter:
              cursorMode === 'hover'
                ? 'drop-shadow(0 0 10px rgba(52, 211, 153, 0.85)) drop-shadow(0 2px 8px rgba(31, 122, 140, 0.6))'
                : 'drop-shadow(0 2px 8px rgba(31, 122, 140, 0.55))',
          }}
        >
          {/* Outer stealth polygon */}
          <polygon
            points="0,0 18,7.5 10,10 7.5,18"
            fill="url(#cyberDartGradientPermanent)"
            stroke={cursorMode === 'hover' ? '#34D399' : 'var(--brand-teal)'}
            strokeWidth="1.2"
            strokeLinejoin="miter"
          />
          {/* Inner energetic luminescent core */}
          <polygon
            points="1.5,1.5 8.5,5 5.5,5.5 5,8.5"
            fill={cursorMode === 'hover' ? '#E6FFFA' : '#FFFFFF'}
            opacity="0.95"
          />
          <defs>
            <linearGradient
              id="cyberDartGradientPermanent"
              x1="0"
              y1="0"
              x2="18"
              y2="18"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor={cursorMode === 'hover' ? '#34D399' : '#38BDF8'} />
              <stop offset="60%" stopColor="var(--brand-teal)" />
              <stop offset="100%" stopColor="#022B3A" />
            </linearGradient>
          </defs>
        </svg>

        {/* ── 3. FLOATING HUD ACTION BADGE (Accompanies dart on view targets) ── */}
        {cursorMode === 'view' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 10, y: 10 }}
            animate={{ opacity: 1, scale: 1, x: 18, y: 18 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            style={{
              clipPath:
                'polygon(4px 0%, calc(100% - 4px) 0%, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0% calc(100% - 4px), 0% 4px)',
            }}
            className="absolute top-0 left-0 bg-[#022B3A]/95 border border-[var(--brand-teal)] shadow-[0_8px_20px_rgba(2,43,58,0.7),0_0_12px_rgba(31,122,140,0.5)] flex items-center space-x-1 px-2.5 py-1 backdrop-blur-md whitespace-nowrap"
          >
            <span className="text-[9px] font-mono font-black tracking-widest text-white uppercase">
              VIEW
            </span>
            <ArrowUpRight className="w-3 h-3 text-emerald-400 stroke-[2.5]" />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

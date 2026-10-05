import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isPointerDevice, setIsPointerDevice] = useState(false);
  const [isTextInput, setIsTextInput] = useState(false);
  const [tiltAngle, setTiltAngle] = useState(0);

  // Raw instant mouse coordinates (Zero latency core)
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

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
        const targetTilt = Math.max(-12, Math.min(12, velocityX * 10));
        setTiltAngle(targetTilt);

        if (stopTimeoutRef.current) clearTimeout(stopTimeoutRef.current);
        stopTimeoutRef.current = setTimeout(() => {
          setTiltAngle(0);
        }, 70);
      }

      lastPosRef.current = { x: currentX, y: currentY, time: now };

      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Text input detection
      const textInputTarget = target.closest('input[type="text"], input[type="email"], input[type="password"], textarea, [contenteditable="true"]');
      setIsTextInput(!!textInputTarget);

      // Interactive hover detection (subtle glow only, NO box, NO shape change)
      const interactiveTarget = target.closest('a, button, [role="button"], select, .cursor-pointer, input[type="submit"], input[type="button"]');
      setIsHovered(!!interactiveTarget);
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

  if (!isPointerDevice || !isVisible || isTextInput) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden select-none">
      {/* ── SIMPLE UNIFIED CYBER POINTER (Same everywhere, zero box on hover) ── */}
      <motion.div
        style={{
          x: mouseX,
          y: mouseY,
          rotate: tiltAngle,
        }}
        animate={{
          scale: isClicking ? 0.82 : isHovered ? 1.08 : 1,
        }}
        transition={{ duration: 0.1, ease: 'easeOut' }}
        className="absolute top-0 left-0 pointer-events-none will-change-transform origin-top-left"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          className="overflow-visible"
          style={{
            filter: isHovered
              ? 'drop-shadow(0 0 8px rgba(34, 160, 180, 0.9)) drop-shadow(0 2px 6px rgba(2, 43, 58, 0.5))'
              : 'drop-shadow(0 2px 6px rgba(31, 122, 140, 0.5))',
          }}
        >
          {/* Main stealth arrow polygon */}
          <polygon
            points="0,0 18,7.5 10,10 7.5,18"
            fill="url(#cyberDartSimpleGradient)"
            stroke={isHovered ? '#22D3EE' : 'var(--brand-teal)'}
            strokeWidth="1.2"
            strokeLinejoin="miter"
          />
          {/* Inner accent core */}
          <polygon
            points="1.5,1.5 8.5,5 5.5,5.5 5,8.5"
            fill="#FFFFFF"
            opacity={isHovered ? '1' : '0.85'}
          />
          <defs>
            <linearGradient
              id="cyberDartSimpleGradient"
              x1="0"
              y1="0"
              x2="18"
              y2="18"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor={isHovered ? '#22D3EE' : '#38BDF8'} />
              <stop offset="60%" stopColor="var(--brand-teal)" />
              <stop offset="100%" stopColor="#022B3A" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
    </div>
  );
};

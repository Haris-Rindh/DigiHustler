import React, { useEffect, useRef } from 'react';

interface InteractiveCanvasProps {
  className?: string;
  particleCount?: number;
  interactive?: boolean;
}

export const InteractiveCanvas: React.FC<InteractiveCanvasProps> = ({
  className = 'absolute inset-0 pointer-events-none',
  particleCount = 55,
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return;
    }

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    // Mouse tracking
    const mouse = {
      x: -1000,
      y: -1000,
      radius: 150,
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseleave', handleMouseLeave);
    }

    // Adaptive resize with density recalculation
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    // 3D-depth Particle class
    interface Particle {
      x: number;
      y: number;
      z: number; // 3D depth plane (0.5 = far, 1.5 = near)
      vx: number;
      vy: number;
      baseSize: number;
      alpha: number;
      baseAlpha: number;
      colorType: 'cyan' | 'teal' | 'light';
    }

    // Adjust particle count for screen width
    const targetCount = width < 640 ? Math.round(particleCount * 0.55) : particleCount;
    const particles: Particle[] = [];
    const colorTypes: ('cyan' | 'teal' | 'light')[] = ['cyan', 'teal', 'light', 'cyan', 'teal'];

    for (let i = 0; i < targetCount; i++) {
      const z = Math.random() * 1.0 + 0.5; // depth between 0.5 and 1.5
      const baseAlpha = Math.random() * 0.35 + 0.45; // High visibility base alpha (0.45 - 0.80)
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z,
        vx: (Math.random() - 0.5) * 0.7 * z,
        vy: (Math.random() - 0.5) * 0.7 * z,
        baseSize: (Math.random() * 2.2 + 1.2) * z,
        alpha: baseAlpha,
        baseAlpha,
        colorType: colorTypes[i % colorTypes.length],
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Check current theme
      const isLight =
        document.documentElement.getAttribute('data-theme') === 'light' ||
        document.documentElement.classList.contains('light');

      // 1. Connect near particles with high-clarity constellation lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            const lineAlpha = (1 - dist / 140) * (isLight ? 0.32 : 0.28);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = isLight
              ? `rgba(14, 116, 144, ${lineAlpha})`
              : `rgba(103, 232, 249, ${lineAlpha})`;
            ctx.lineWidth = isLight ? 0.85 : 0.95;
            ctx.stroke();
          }
        }
      }

      // 2. Update & Draw 3D Luminous Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Wrap edges
        if (p.x < -20) p.x = width + 20;
        else if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        else if (p.y > height + 20) p.y = -20;

        // Mouse repulsion interaction
        if (interactive) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (1 - dist / mouse.radius) * 2.2;
            p.x -= (dx / dist) * force;
            p.y -= (dy / dist) * force;
            p.alpha = Math.min(1, p.baseAlpha + 0.35);
          } else {
            p.alpha = p.baseAlpha;
          }
        }

        const currentSize = p.baseSize;

        // Outer Luminous Halo (Gives 3D Glowing Orb feel in dark mode)
        if (!isLight && p.z > 0.8) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, currentSize * 2.6, 0, Math.PI * 2);
          ctx.fillStyle =
            p.colorType === 'cyan'
              ? `rgba(56, 189, 248, ${p.alpha * 0.18})`
              : p.colorType === 'light'
              ? `rgba(224, 242, 254, ${p.alpha * 0.16})`
              : `rgba(45, 212, 191, ${p.alpha * 0.18})`;
          ctx.fill();
        }

        // Main Particle Body
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
        if (isLight) {
          ctx.fillStyle =
            p.colorType === 'cyan'
              ? `rgba(14, 116, 144, ${p.alpha * 0.95})`
              : p.colorType === 'light'
              ? `rgba(31, 122, 140, ${p.alpha * 0.9})`
              : `rgba(15, 118, 110, ${p.alpha * 0.95})`;
        } else {
          ctx.fillStyle =
            p.colorType === 'cyan'
              ? `rgba(103, 232, 249, ${p.alpha * 0.95})`
              : p.colorType === 'light'
              ? `rgba(240, 249, 255, ${p.alpha})`
              : `rgba(45, 212, 191, ${p.alpha * 0.95})`;
        }
        ctx.fill();

        // High-Contrast Core Specular Center
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentSize * 0.45, 0, Math.PI * 2);
        ctx.fillStyle = isLight
          ? `rgba(2, 43, 58, ${p.alpha * 0.95})`
          : `rgba(255, 255, 255, ${p.alpha * 0.98})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [particleCount, interactive]);

  return <canvas ref={canvasRef} className={className} />;
};

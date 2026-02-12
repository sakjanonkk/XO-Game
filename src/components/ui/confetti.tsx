'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
}

const COLORS = [
  '#6366f1', // indigo
  '#818cf8', // indigo light
  '#f59e0b', // amber
  '#fbbf24', // amber light
  '#10b981', // emerald
  '#ec4899', // pink
  '#8b5cf6', // violet
  '#06b6d4', // cyan
];

const PARTICLE_COUNT = 80;
const DURATION = 2500; // ms

interface ConfettiProps {
  active: boolean;
}

export function Confetti({ active }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas to window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create particles
    const particles: Particle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * 100,
        vx: (Math.random() - 0.5) * 6,
        vy: Math.random() * 3 + 2,
        width: Math.random() * 8 + 4,
        height: Math.random() * 4 + 2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        opacity: 1,
      });
    }

    const startTime = performance.now();

    function animate(now: number) {
      const elapsed = now - startTime;

      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      // Fade out in last 500ms
      const fadeStart = DURATION - 500;
      const globalAlpha = elapsed > fadeStart ? 1 - (elapsed - fadeStart) / 500 : 1;

      for (const p of particles) {
        p.x += p.vx;
        p.vy += 0.08; // gravity
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.vx *= 0.99; // air resistance

        ctx!.save();
        ctx!.translate(p.x, p.y);
        ctx!.rotate((p.rotation * Math.PI) / 180);
        ctx!.globalAlpha = globalAlpha * p.opacity;
        ctx!.fillStyle = p.color;
        ctx!.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
        ctx!.restore();
      }

      if (elapsed < DURATION) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      }
    }

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[100]"
      aria-hidden="true"
    />
  );
}

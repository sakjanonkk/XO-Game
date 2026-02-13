'use client';

import { useCallback, useEffect, useRef } from 'react';

interface ParallaxLayer {
  element: HTMLElement;
  speed: number;
}

export function useParallax(): {
  containerRef: React.RefObject<HTMLDivElement | null>;
  registerLayer: (element: HTMLElement | null, speed: number) => void;
} {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const layersRef = useRef<ParallaxLayer[]>([]);
  const rafRef = useRef<number>(0);
  const isEnabledRef = useRef(true);

  const registerLayer = useCallback(
    (element: HTMLElement | null, speed: number) => {
      if (!element) return;
      // Avoid duplicate registrations
      const exists = layersRef.current.some((l) => l.element === element);
      if (!exists) {
        layersRef.current.push({ element, speed });
      }
    },
    [],
  );

  useEffect(() => {
    // Disable parallax on mobile or when reduced motion is preferred
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobileQuery = window.matchMedia('(max-width: 768px)');

    function checkEnabled(): void {
      isEnabledRef.current = !motionQuery.matches && !mobileQuery.matches;
      if (!isEnabledRef.current) {
        // Reset transforms when disabled
        for (const layer of layersRef.current) {
          layer.element.style.transform = 'translate3d(0, 0, 0)';
        }
      }
    }

    checkEnabled();
    motionQuery.addEventListener('change', checkEnabled);
    mobileQuery.addEventListener('change', checkEnabled);

    function onScroll(): void {
      if (!isEnabledRef.current) return;

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        for (const layer of layersRef.current) {
          const yOffset = scrollY * layer.speed;
          layer.element.style.transform = `translate3d(0, ${yOffset}px, 0)`;
        }
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      motionQuery.removeEventListener('change', checkEnabled);
      mobileQuery.removeEventListener('change', checkEnabled);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return { containerRef, registerLayer };
}

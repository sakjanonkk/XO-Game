'use client';

import { useCallback, useRef, useState } from 'react';

const STORAGE_KEY = 'xo-sound';

type SoundType = 'move' | 'win' | 'draw';

function getInitialEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  return localStorage.getItem(STORAGE_KEY) !== 'off';
}

/**
 * Generates short synthesized sounds using Web Audio API.
 * No external audio files needed.
 */
export function useSound() {
  const ctxRef = useRef<AudioContext | null>(null);
  const [enabled, setEnabled] = useState(getInitialEnabled);

  const getContext = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  const play = useCallback(
    (type: SoundType) => {
      if (!enabled) return;

      try {
        const ctx = getContext();
        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();
        oscillator.connect(gain);
        gain.connect(ctx.destination);

        const now = ctx.currentTime;

        switch (type) {
          case 'move': {
            // Short click/tap sound
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(600, now);
            oscillator.frequency.exponentialRampToValueAtTime(400, now + 0.08);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
            oscillator.start(now);
            oscillator.stop(now + 0.1);
            break;
          }
          case 'win': {
            // Ascending celebratory notes
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(523, now);        // C5
            oscillator.frequency.setValueAtTime(659, now + 0.1);  // E5
            oscillator.frequency.setValueAtTime(784, now + 0.2);  // G5
            oscillator.frequency.setValueAtTime(1047, now + 0.3); // C6
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.setValueAtTime(0.2, now + 0.3);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
            oscillator.start(now);
            oscillator.stop(now + 0.5);
            break;
          }
          case 'draw': {
            // Flat, neutral tone
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(440, now);
            oscillator.frequency.setValueAtTime(350, now + 0.15);
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
            oscillator.start(now);
            oscillator.stop(now + 0.3);
            break;
          }
        }
      } catch {
        // Web Audio not available — silently skip
      }
    },
    [enabled, getContext],
  );

  const toggleSound = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, next ? 'on' : 'off');
      return next;
    });
  }, []);

  return { enabled, play, toggleSound };
}

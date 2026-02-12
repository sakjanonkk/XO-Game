'use client';

import { useEffect, useRef, useState } from 'react';

interface MoveTimerProps {
  /** Total time per move in seconds */
  duration: number;
  /** Called when the timer runs out */
  onTimeout: () => void;
}

/**
 * Circular countdown timer. To reset, remount via a `key` prop.
 */
export function MoveTimer({ duration, onTimeout }: MoveTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const onTimeoutRef = useRef(onTimeout);

  // Keep callback ref in sync
  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  }, [onTimeout]);

  // Countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimeout(() => onTimeoutRef.current(), 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const progress = timeLeft / duration;
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);
  const isLow = timeLeft <= 5;

  return (
    <div className="flex items-center justify-center gap-2">
      <div className="relative h-12 w-12">
        <svg className="h-12 w-12 -rotate-90" viewBox="0 0 48 48">
          <circle
            cx="24"
            cy="24"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-slate-200"
          />
          <circle
            cx="24"
            cy="24"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={
              isLow
                ? 'text-red-500 transition-all duration-1000'
                : 'text-indigo-500 transition-all duration-1000'
            }
          />
        </svg>

        <span
          className={`absolute inset-0 flex items-center justify-center text-sm font-bold ${
            isLow ? 'text-red-500' : 'text-slate-700'
          }`}
        >
          {timeLeft}
        </span>
      </div>

      <span className="text-xs text-slate-400">
        {isLow ? 'Hurry up!' : 'Your turn'}
      </span>
    </div>
  );
}

'use client';

import { memo } from 'react';
import { cn } from '@/lib/utils';
import type { CellValue } from '@/types/game';

interface CellProps {
  value: CellValue;
  position: number;
  isWinningCell: boolean;
  isDisabled: boolean;
  onClick: (position: number) => void;
}

function XMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn('h-10 w-10 sm:h-12 sm:w-12', className)}
      aria-hidden="true"
    >
      <line
        x1="20" y1="20" x2="80" y2="80"
        stroke="currentColor"
        strokeWidth="12"
        strokeLinecap="round"
        className="animate-draw-line"
        style={{ strokeDasharray: 85, strokeDashoffset: 85 }}
      />
      <line
        x1="80" y1="20" x2="20" y2="80"
        stroke="currentColor"
        strokeWidth="12"
        strokeLinecap="round"
        className="animate-draw-line-delayed"
        style={{ strokeDasharray: 85, strokeDashoffset: 85 }}
      />
    </svg>
  );
}

function OMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn('h-10 w-10 sm:h-12 sm:w-12', className)}
      aria-hidden="true"
    >
      <circle
        cx="50" cy="50" r="32"
        fill="none"
        stroke="currentColor"
        strokeWidth="12"
        strokeLinecap="round"
        className="animate-draw-circle"
        style={{ strokeDasharray: 201, strokeDashoffset: 201 }}
      />
    </svg>
  );
}

const Cell = memo(function Cell({
  value,
  position,
  isWinningCell,
  isDisabled,
  onClick,
}: CellProps) {
  return (
    <button
      className={cn(
        'relative flex items-center justify-center',
        'aspect-square w-full rounded-xl',
        'transition-all duration-200 ease-out',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500',
        // Base state
        !value && !isDisabled && [
          'bg-white hover:bg-amber-50 hover:scale-[1.03]',
          'cursor-pointer active:scale-95',
          'shadow-sm hover:shadow-md',
          'border border-slate-200 hover:border-amber-300',
        ],
        // Filled state
        value && 'bg-white shadow-sm border border-slate-200',
        // Disabled empty cell
        !value && isDisabled && 'bg-slate-50 cursor-not-allowed border border-slate-100',
        // Winning cell highlight
        isWinningCell && 'bg-amber-50 border-amber-400 shadow-md shadow-amber-200/50 scale-[1.05]',
      )}
      onClick={() => onClick(position)}
      disabled={isDisabled || !!value}
      aria-label={
        value ? `Cell ${position + 1}: ${value}` : `Cell ${position + 1}: empty`
      }
    >
      {value === 'X' && (
        <XMark
          className={cn(
            'text-amber-600',
            isWinningCell && 'text-amber-700',
          )}
        />
      )}
      {value === 'O' && (
        <OMark
          className={cn(
            'text-indigo-500',
            isWinningCell && 'text-indigo-600',
          )}
        />
      )}
    </button>
  );
});

export { Cell };

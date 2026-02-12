'use client';

import { cn } from '@/lib/utils';
import type { GameScore } from '@/types/game';

interface ScoreBoardProps {
  score: GameScore;
  className?: string;
}

export function ScoreBoard({ score, className }: ScoreBoardProps) {
  return (
    <div className={cn('flex items-center gap-3 sm:gap-5', className)}>
      <ScoreCard label="X Wins" value={score.x} colorClass="text-indigo-600" />
      <ScoreCard label="Draws" value={score.draws} colorClass="text-slate-500" />
      <ScoreCard label="O Wins" value={score.o} colorClass="text-amber-500" />
    </div>
  );
}

function ScoreCard({
  label,
  value,
  colorClass,
}: {
  label: string;
  value: number;
  colorClass: string;
}) {
  return (
    <div className="flex flex-col items-center rounded-xl bg-white px-4 py-2.5 shadow-sm border border-slate-100 min-w-[72px]">
      <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
        {label}
      </span>
      <span className={cn('text-2xl font-bold tabular-nums', colorClass)}>
        {value}
      </span>
    </div>
  );
}

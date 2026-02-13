'use client';

import { cn } from '@/lib/utils';
import type { Game } from '@/types/game';

interface GameStatusProps {
  game: Game;
  className?: string;
}

export function GameStatus({ game, className }: GameStatusProps) {
  const getMessage = (): { text: string; highlight: boolean } => {
    if (game.status === 'won') {
      const winnerLabel = game.mode === 'ai'
        ? game.winner === 'X' ? 'You win!' : 'Bot wins!'
        : `Player ${game.winner} wins!`;
      return { text: winnerLabel, highlight: true };
    }

    if (game.status === 'draw') {
      return { text: "It's a draw!", highlight: true };
    }

    if (game.mode === 'ai') {
      return {
        text: game.currentPlayer === 'X' ? 'Your turn' : 'Bot is thinking...',
        highlight: false,
      };
    }

    return {
      text: `Player ${game.currentPlayer}'s turn`,
      highlight: false,
    };
  };

  const { text, highlight } = getMessage();

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-xl px-6 py-3',
        'transition-all duration-300 ease-out',
        highlight
          ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20 animate-bounce-subtle'
          : 'bg-white text-slate-700 border border-slate-200 shadow-sm',
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <span className={cn('text-sm font-semibold sm:text-base', highlight && 'text-base sm:text-lg')}>
        {text}
      </span>
    </div>
  );
}

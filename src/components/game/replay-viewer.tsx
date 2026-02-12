'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from 'lucide-react';
import { Board } from './board';
import type { Board as BoardType, Game, Move } from '@/types/game';
import { checkWinner, getWinningLine } from '@/lib/game-engine';

interface ReplayViewerProps {
  game: Game;
  onClose: () => void;
}

function buildBoardAtStep(moves: Move[], step: number): BoardType {
  const board: BoardType = Array(9).fill(null);
  for (let i = 0; i < step; i++) {
    board[moves[i].position] = moves[i].player;
  }
  return board;
}

export function ReplayViewer({ game, onClose }: ReplayViewerProps) {
  const totalSteps = game.moves.length;
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const board = buildBoardAtStep(game.moves, step);
  const winner = checkWinner(board);
  const winningLine = winner ? getWinningLine(board) : null;

  const goForward = useCallback(() => {
    setStep((prev) => Math.min(prev + 1, totalSteps));
  }, [totalSteps]);

  const goBack = useCallback(() => {
    setStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const reset = useCallback(() => {
    setStep(0);
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => {
      if (!prev && step >= totalSteps) {
        // If at the end, restart when pressing play
        setStep(0);
      }
      return !prev;
    });
  }, [step, totalSteps]);

  // Auto-play
  useEffect(() => {
    if (!isPlaying) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setStep((prev) => {
        if (prev >= totalSteps) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 800);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, totalSteps]);

  const currentMove = step > 0 ? game.moves[step - 1] : null;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700">Replay</h3>
        <button
          onClick={onClose}
          className="text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors"
        >
          Close
        </button>
      </div>

      {/* Board */}
      <div className="mx-auto w-full max-w-xs rounded-2xl bg-slate-100/60 p-3 sm:max-w-sm sm:p-4">
        <Board
          board={board}
          winningLine={winningLine}
          isDisabled={true}
          onCellClick={() => {}}
        />
      </div>

      {/* Step info */}
      <div className="text-center text-sm text-slate-500">
        {step === 0 && 'Start'}
        {step > 0 && step < totalSteps && (
          <>
            Move {step}: <span className="font-semibold">{currentMove?.player}</span> → position {(currentMove?.position ?? 0) + 1}
          </>
        )}
        {step === totalSteps && (
          <span className="font-semibold">
            {game.winner ? `${game.winner} wins!` : 'Draw!'}
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="mx-auto flex max-w-xs items-center gap-2">
        <span className="text-xs text-slate-400 w-6 text-right">{step}</span>
        <div className="relative h-1.5 flex-1 rounded-full bg-slate-200">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-indigo-500 transition-all duration-300"
            style={{ width: `${totalSteps > 0 ? (step / totalSteps) * 100 : 0}%` }}
          />
        </div>
        <span className="text-xs text-slate-400 w-6">{totalSteps}</span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2">
        <ControlButton onClick={reset} aria-label="Reset replay">
          <RotateCcw className="h-4 w-4" />
        </ControlButton>
        <ControlButton onClick={goBack} disabled={step === 0} aria-label="Previous move">
          <ChevronLeft className="h-4 w-4" />
        </ControlButton>
        <button
          onClick={togglePlay}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
        </button>
        <ControlButton onClick={goForward} disabled={step >= totalSteps} aria-label="Next move">
          <ChevronRight className="h-4 w-4" />
        </ControlButton>
      </div>
    </div>
  );
}

function ControlButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
      {...props}
    >
      {children}
    </button>
  );
}

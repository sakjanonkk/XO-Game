'use client';

import { useEffect, useRef, useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Film, Loader2 } from 'lucide-react';
import { Board } from '@/components/game/board';
import { MoveTimer } from '@/components/game/move-timer';
import { ReplayViewer } from '@/components/game/replay-viewer';
import { ScoreBoard } from '@/components/game/score-board';
import { GameStatus } from '@/components/game/game-status';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { SoundToggle } from '@/components/ui/sound-toggle';
import { Confetti } from '@/components/ui/confetti';
import { useGame } from '@/hooks/useGame';
import { useSound } from '@/hooks/useSound';

export default function SharedGamePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const myRole = 'O' as const;

  const { game, score, isLoading, error, loadGame, makeMove } = useGame({
    playerRole: myRole,
  });

  const [showReplay, setShowReplay] = useState(false);
  const { enabled: soundEnabled, play: playSound, toggleSound } = useSound();
  const prevStatusRef = useRef(game?.status);

  useEffect(() => {
    loadGame(id);
  }, [id, loadGame]);

  // Play sound effects when game state changes
  useEffect(() => {
    const prevStatus = prevStatusRef.current;
    const currentStatus = game?.status;
    prevStatusRef.current = currentStatus;

    if (!prevStatus || prevStatus === currentStatus) return;

    if (currentStatus === 'won') playSound('win');
    else if (currentStatus === 'draw') playSound('draw');
  }, [game?.status, playSound]);

  const handleMakeMove = async (position: number) => {
    playSound('move');
    await makeMove(position);
  };

  const handleTimeout = () => {
    if (!game || game.status !== 'playing') return;
    const emptyCells = game.board
      .map((cell, i) => (cell === null ? i : -1))
      .filter((i) => i !== -1);
    if (emptyCells.length > 0) {
      const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      handleMakeMove(randomCell);
    }
  };

  // ── Loading state ──
  if (!game && isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--color-bg)]">
        <div className="space-y-4 text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-sm text-slate-500">Joining game...</p>
        </div>
      </main>
    );
  }

  // ── Error state ──
  if (error || (!game && !isLoading)) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-4">
        <div className="max-w-sm space-y-4 text-center">
          <h2
            className="text-xl font-bold text-slate-900"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Game not found
          </h2>
          <p className="text-sm text-slate-500">
            {error || 'This game link is invalid or has expired.'}
          </p>
          <Link href="/game">
            <Button>Start New Game</Button>
          </Link>
        </div>
      </main>
    );
  }

  if (!game) return null;

  const isMyTurn = game.currentPlayer === myRole && game.status === 'playing';
  const isGameFinished = game.status === 'won' || game.status === 'draw';
  const waitingForOpponent = !isMyTurn && game.status === 'playing';

  return (
    <main className="relative min-h-screen bg-[var(--color-bg)]">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>

          <h1
            className="text-lg font-bold tracking-tight text-slate-900"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            XO Game
          </h1>

          <div className="flex items-center gap-2">
            <SoundToggle enabled={soundEnabled} onToggle={toggleSound} />
            <ThemeToggle />
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
              You are O
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-md px-4 py-8 sm:py-12">
        <div className="space-y-6 animate-scale-in">
          {/* Score */}
          <ScoreBoard score={score} className="justify-center" />

          {/* Status */}
          {waitingForOpponent ? (
            <div className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 shadow-sm">
              <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
              <span className="text-sm font-medium text-slate-600">
                Waiting for X to play...
              </span>
            </div>
          ) : (
            <GameStatus game={game} />
          )}

          {/* Move Timer — key changes each move to reset the countdown */}
          {game.status === 'playing' && !waitingForOpponent && (
            <MoveTimer
              key={game.moves.length}
              duration={15}
              onTimeout={handleTimeout}
            />
          )}

          {/* Board */}
          <div
            className="mx-auto w-full max-w-xs rounded-2xl bg-slate-100/60 p-3 sm:max-w-sm sm:p-4"
            style={{ boxShadow: 'var(--shadow-game)' }}
          >
            <Board
              board={game.board}
              winningLine={game.winningLine}
              isDisabled={!isMyTurn || isLoading}
              onCellClick={handleMakeMove}
            />
          </div>

          {/* Game info */}
          <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
            <span className="rounded-full bg-slate-100 px-2.5 py-1">
              Online PvP
            </span>
            <span className="rounded-full bg-slate-100 px-2.5 py-1">
              Move {game.moves.length}
            </span>
          </div>

          {/* Replay viewer */}
          {isGameFinished && showReplay && (
            <ReplayViewer game={game} onClose={() => setShowReplay(false)} />
          )}

          {/* Play again */}
          {isGameFinished && (
            <div className="flex items-center justify-center gap-3">
              <Link href="/game">
                <Button>New Game</Button>
              </Link>
              {!showReplay && (
                <Button variant="ghost" onClick={() => setShowReplay(true)}>
                  <Film className="h-4 w-4" />
                  Replay
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Win celebration */}
      <Confetti active={game?.status === 'won'} />
    </main>
  );
}

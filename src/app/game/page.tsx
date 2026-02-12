'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Clock,
  Loader2,
  Film,
  RotateCcw,
  Sparkles,
  Users,
  Bot,
  ChevronDown,
} from 'lucide-react';
import { Board } from '@/components/game/board';
import { MoveTimer } from '@/components/game/move-timer';
import { ReplayViewer } from '@/components/game/replay-viewer';
import { ScoreBoard } from '@/components/game/score-board';
import { GameStatus } from '@/components/game/game-status';
import { HistoryPanel } from '@/components/game/history-panel';
import { ShareLink } from '@/components/game/share-link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { SoundToggle } from '@/components/ui/sound-toggle';
import { Confetti } from '@/components/ui/confetti';
import { useGame } from '@/hooks/useGame';
import { useSound } from '@/hooks/useSound';
import { cn } from '@/lib/utils';
import type { AIDifficulty, GameMode, Player } from '@/types/game';

export default function GamePage() {
  const [playerRole, setPlayerRole] = useState<Player | null>(null);

  const { game, score, isLoading, startGame, makeMove, resetGame, resetScore } =
    useGame({ playerRole });

  const { enabled: soundEnabled, play: playSound, toggleSound } = useSound();
  const prevStatusRef = useRef(game?.status);

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

  const [historyOpen, setHistoryOpen] = useState(false);
  const [showReplay, setShowReplay] = useState(false);
  const [selectedMode, setSelectedMode] = useState<GameMode>('ai');
  const [selectedDifficulty, setSelectedDifficulty] = useState<AIDifficulty>('hard');

  const isPvpOnline = game?.mode === 'pvp' && playerRole === 'X';
  const isMyTurn =
    game?.status === 'playing' &&
    (isPvpOnline ? game.currentPlayer === 'X' : true);
  const isGameFinished = game?.status === 'won' || game?.status === 'draw';
  const waitingForOpponent = isPvpOnline && game?.status === 'playing' && game.currentPlayer !== 'X';

  const handleStartGame = async (mode: GameMode, difficulty: AIDifficulty) => {
    if (mode === 'pvp') {
      setPlayerRole('X'); // Creator is always X
    } else {
      setPlayerRole(null); // AI mode, no polling needed
    }
    await startGame(mode, difficulty);
  };

  const handleNewSetup = () => {
    setPlayerRole(null);
    resetScore();
    window.location.reload();
  };

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

          <div className="flex items-center gap-1">
            <SoundToggle enabled={soundEnabled} onToggle={toggleSound} />
            <ThemeToggle />
            <button
              onClick={() => setHistoryOpen(true)}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Open match history"
            >
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">History</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-md px-4 py-8 sm:py-12">
        {/* Game setup — shown when no active game */}
        {!game && (
          <div className="animate-slide-up space-y-8">
            <div className="text-center">
              <h2
                className="text-2xl font-bold text-slate-900 sm:text-3xl"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Start a Game
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Choose your game mode and challenge yourself
              </p>
            </div>

            {/* Mode selector */}
            <div className="space-y-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Game Mode
              </label>
              <div className="grid grid-cols-2 gap-3">
                <ModeButton
                  icon={<Bot className="h-5 w-5" />}
                  label="vs AI"
                  description="Challenge the computer"
                  isSelected={selectedMode === 'ai'}
                  onClick={() => setSelectedMode('ai')}
                />
                <ModeButton
                  icon={<Users className="h-5 w-5" />}
                  label="Online PvP"
                  description="Share link with a friend"
                  isSelected={selectedMode === 'pvp'}
                  onClick={() => setSelectedMode('pvp')}
                />
              </div>
            </div>

            {/* Difficulty selector (AI mode only) */}
            {selectedMode === 'ai' && (
              <div className="space-y-3 animate-fade-in">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  AI Difficulty
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <DifficultyButton
                    label="Easy"
                    description="Random moves"
                    isSelected={selectedDifficulty === 'easy'}
                    onClick={() => setSelectedDifficulty('easy')}
                  />
                  <DifficultyButton
                    label="Hard"
                    description="Unbeatable AI"
                    isSelected={selectedDifficulty === 'hard'}
                    onClick={() => setSelectedDifficulty('hard')}
                  />
                </div>
              </div>
            )}

            {/* Start button */}
            <Button
              size="lg"
              className="w-full animate-pulse-glow"
              onClick={() => handleStartGame(selectedMode, selectedDifficulty)}
              disabled={isLoading}
            >
              <Sparkles className="h-4 w-4" />
              Start Game
            </Button>
          </div>
        )}

        {/* Active game */}
        {game && (
          <div className="space-y-6 animate-scale-in">
            {/* Share link for PvP */}
            {isPvpOnline && <ShareLink gameId={game.id} />}

            {/* Role badge for PvP */}
            {isPvpOnline && (
              <div className="flex justify-center">
                <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                  You are X
                </span>
              </div>
            )}

            {/* Score */}
            <ScoreBoard score={score} className="justify-center" />

            {/* Status */}
            {waitingForOpponent ? (
              <div className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 shadow-sm">
                <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
                <span className="text-sm font-medium text-slate-600">
                  Waiting for O to play...
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
                {game.mode === 'ai'
                  ? `AI (${game.aiDifficulty})`
                  : isPvpOnline
                    ? 'Online PvP'
                    : 'Player vs Player'}
              </span>
              <span className="rounded-full bg-slate-100 px-2.5 py-1">
                Move {game.moves.length}
              </span>
            </div>

            {/* Replay viewer */}
            {isGameFinished && showReplay && (
              <ReplayViewer game={game} onClose={() => setShowReplay(false)} />
            )}

            {/* Actions */}
            <div className="flex items-center justify-center gap-3">
              {isGameFinished && (
                <>
                  <Button onClick={resetGame} disabled={isLoading}>
                    <RotateCcw className="h-4 w-4" />
                    Play Again
                  </Button>
                  {!showReplay && (
                    <Button variant="ghost" onClick={() => setShowReplay(true)}>
                      <Film className="h-4 w-4" />
                      Replay
                    </Button>
                  )}
                </>
              )}

              <Button variant="secondary" onClick={handleNewSetup}>
                <ChevronDown className="h-4 w-4" />
                New Setup
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* History sidebar */}
      <HistoryPanel isOpen={historyOpen} onClose={() => setHistoryOpen(false)} />

      {/* Win celebration */}
      <Confetti active={game?.status === 'won'} />
    </main>
  );
}

/* ─── Sub-components ─── */

function ModeButton({
  icon,
  label,
  description,
  isSelected,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-2 rounded-xl px-4 py-5 text-center transition-all duration-200',
        'border-2',
        isSelected
          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm'
          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50',
      )}
    >
      {icon}
      <span className="text-sm font-semibold">{label}</span>
      <span className="text-xs text-current opacity-60">{description}</span>
    </button>
  );
}

function DifficultyButton({
  label,
  description,
  isSelected,
  onClick,
}: {
  label: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-xl px-4 py-3 text-center transition-all duration-200',
        'border-2',
        isSelected
          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm'
          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300',
      )}
    >
      <span className="text-sm font-semibold">{label}</span>
      <p className="mt-0.5 text-xs text-current opacity-60">{description}</p>
    </button>
  );
}

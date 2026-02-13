'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import * as api from '@/lib/api-client';
import type {
  AIDifficulty,
  Game,
  GameMode,
  GameScore,
  Player,
} from '@/types/game';

interface UseGameReturn {
  game: Game | null;
  score: GameScore;
  isLoading: boolean;
  error: string | null;
  startGame: (mode: GameMode, difficulty: AIDifficulty) => Promise<void>;
  loadGame: (id: string) => Promise<void>;
  makeMove: (position: number) => Promise<void>;
  resetGame: () => void;
  resetScore: () => void;
}

interface UseGameOptions {
  playerRole?: Player | null;
  pollInterval?: number;
}

export function useGame(options: UseGameOptions = {}): UseGameReturn {
  const { playerRole = null, pollInterval = 1500 } = options;

  const [game, setGame] = useState<Game | null>(null);
  const [score, setScore] = useState<GameScore>({ x: 0, o: 0, draws: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastModeRef = useRef<GameMode>('pvp');
  const lastDifficultyRef = useRef<AIDifficulty>('hard');

  // Ref to avoid stale closures in polling
  const gameRef = useRef<Game | null>(null);
  useEffect(() => {
    gameRef.current = game;
  }, [game]);

  const startGame = useCallback(
    async (mode: GameMode, difficulty: AIDifficulty) => {
      setIsLoading(true);
      setError(null);
      lastModeRef.current = mode;
      lastDifficultyRef.current = difficulty;

      try {
        const newGame = await api.createGame({
          mode,
          aiDifficulty: difficulty,
        });
        setGame(newGame);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create game');
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  /** Load an existing game by ID (for joining shared games) */
  const loadGame = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const existingGame = await api.getGame(id);
      setGame(existingGame);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Game not found');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const makeMove = useCallback(
    async (position: number) => {
      if (!game || game.status !== 'playing') return;

      setIsLoading(true);
      setError(null);

      try {
        const updatedGame = await api.makeMove(game.id, { position });
        setGame(updatedGame);

        // Update score when game ends
        if (updatedGame.status === 'won') {
          setScore((prev) => ({
            ...prev,
            x: updatedGame.winner === 'X' ? prev.x + 1 : prev.x,
            o: updatedGame.winner === 'O' ? prev.o + 1 : prev.o,
          }));
        } else if (updatedGame.status === 'draw') {
          setScore((prev) => ({ ...prev, draws: prev.draws + 1 }));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to make move');
      } finally {
        setIsLoading(false);
      }
    },
    [game],
  );

  const resetGame = useCallback(() => {
    startGame(lastModeRef.current, lastDifficultyRef.current);
  }, [startGame]);

  const resetScore = useCallback(() => {
    setScore({ x: 0, o: 0, draws: 0 });
  }, []);

  useEffect(() => {
    if (!playerRole) return;

    const current = gameRef.current;
    if (!current || current.status !== 'playing') return;

    const interval = setInterval(async () => {
      const prev = gameRef.current;
      if (!prev || prev.status !== 'playing') return;

      try {
        const updated = await api.getGame(prev.id);

        if (JSON.stringify(updated.board) !== JSON.stringify(prev.board) || updated.status !== prev.status) {
          if (updated.status === 'won' && prev.status === 'playing') {
            setScore((s) => ({
              ...s,
              x: updated.winner === 'X' ? s.x + 1 : s.x,
              o: updated.winner === 'O' ? s.o + 1 : s.o,
            }));
          } else if (updated.status === 'draw' && prev.status === 'playing') {
            setScore((s) => ({ ...s, draws: s.draws + 1 }));
          }

          setGame(updated);
        }
      } catch {
        // Ignore polling errors
      }
    }, pollInterval);

    return () => clearInterval(interval);
  }, [playerRole, game?.status, pollInterval]);

  return {
    game,
    score,
    isLoading,
    error,
    startGame,
    loadGame,
    makeMove,
    resetGame,
    resetScore,
  };
}

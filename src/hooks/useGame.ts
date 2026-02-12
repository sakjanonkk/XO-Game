'use client';

import { useCallback, useRef, useState } from 'react';
import * as api from '@/lib/api-client';
import type {
  AIDifficulty,
  Game,
  GameMode,
  GameScore,
} from '@/types/game';

interface UseGameReturn {
  game: Game | null;
  score: GameScore;
  isLoading: boolean;
  error: string | null;
  startGame: (mode: GameMode, difficulty: AIDifficulty) => Promise<void>;
  makeMove: (position: number) => Promise<void>;
  resetGame: () => void;
  resetScore: () => void;
}

export function useGame(): UseGameReturn {
  const [game, setGame] = useState<Game | null>(null);
  const [score, setScore] = useState<GameScore>({ x: 0, o: 0, draws: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastModeRef = useRef<GameMode>('pvp');
  const lastDifficultyRef = useRef<AIDifficulty>('hard');

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

  return {
    game,
    score,
    isLoading,
    error,
    startGame,
    makeMove,
    resetGame,
    resetScore,
  };
}

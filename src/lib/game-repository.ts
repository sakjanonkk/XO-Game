import type { Game, GameHistoryEntry } from '@/types/game';

export interface GameRepository {
  create(game: Game): Game;
  findById(id: string): Game | undefined;
  update(game: Game): Game;
  getCompletedGames(): GameHistoryEntry[];
}

const games = new Map<string, Game>();

export const inMemoryGameRepository: GameRepository = {
  create(game: Game): Game {
    games.set(game.id, game);
    return game;
  },

  findById(id: string): Game | undefined {
    return games.get(id);
  },

  update(game: Game): Game {
    games.set(game.id, game);
    return game;
  },

  getCompletedGames(): GameHistoryEntry[] {
    const completed: GameHistoryEntry[] = [];

    for (const game of games.values()) {
      if (game.status === 'won' || game.status === 'draw') {
        completed.push({
          id: game.id,
          winner: game.winner,
          mode: game.mode,
          aiDifficulty: game.aiDifficulty,
          moveCount: game.moves.length,
          completedAt: game.completedAt!,
        });
      }
    }

    return completed.sort((a, b) => b.completedAt - a.completedAt);
  },
};

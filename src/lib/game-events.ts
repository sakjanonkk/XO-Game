import type { Game } from '@/types/game';

type Listener = (game: Game) => void;

/**
 * Simple pub/sub for game update events.
 * Each game ID can have multiple listeners (SSE connections).
 */
class GameEventEmitter {
  private listeners = new Map<string, Set<Listener>>();

  subscribe(gameId: string, listener: Listener): () => void {
    if (!this.listeners.has(gameId)) {
      this.listeners.set(gameId, new Set());
    }
    this.listeners.get(gameId)!.add(listener);

    // Return unsubscribe function
    return () => {
      const set = this.listeners.get(gameId);
      if (set) {
        set.delete(listener);
        if (set.size === 0) {
          this.listeners.delete(gameId);
        }
      }
    };
  }

  emit(gameId: string, game: Game): void {
    const set = this.listeners.get(gameId);
    if (set) {
      for (const listener of set) {
        listener(game);
      }
    }
  }
}

export const gameEvents = new GameEventEmitter();

import type {
  ApiResponse,
  CreateGameRequest,
  Game,
  GameHistoryEntry,
  MakeMoveRequest,
} from '@/types/game';

const BASE_URL = '/api/game';

async function request<T>(
  url: string,
  options?: RequestInit,
): Promise<ApiResponse<T>> {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const result: ApiResponse<T> = await response.json();

  if (!response.ok) {
    throw new Error(result.error ?? `Request failed with status ${response.status}`);
  }

  return result;
}

export async function createGame(
  payload: CreateGameRequest,
): Promise<Game> {
  const result = await request<Game>(BASE_URL, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return result.data!;
}

export async function getGame(id: string): Promise<Game> {
  const result = await request<Game>(`${BASE_URL}/${id}`);
  return result.data!;
}

export async function makeMove(
  id: string,
  payload: MakeMoveRequest,
): Promise<Game> {
  const result = await request<Game>(`${BASE_URL}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return result.data!;
}

export async function getHistory(): Promise<GameHistoryEntry[]> {
  const result = await request<GameHistoryEntry[]>(`${BASE_URL}/history`);
  return result.data!;
}

/**
 * Subscribe to real-time game updates via SSE.
 * Returns an unsubscribe function.
 */
export function subscribeToGame(
  id: string,
  onUpdate: (game: Game) => void,
): () => void {
  const eventSource = new EventSource(`${BASE_URL}/${id}/stream`);

  eventSource.onmessage = (event) => {
    try {
      const game: Game = JSON.parse(event.data);
      onUpdate(game);
    } catch {
      // Ignore parse errors
    }
  };

  eventSource.onerror = () => {
    // EventSource will auto-reconnect
  };

  return () => {
    eventSource.close();
  };
}

export type Player = 'X' | 'O';

export type CellValue = Player | null;

export type Board = CellValue[];

export type GameMode = 'pvp' | 'ai';

export type AIDifficulty = 'easy' | 'hard';

export type GameStatus = 'waiting' | 'playing' | 'won' | 'draw';

export interface Move {
  position: number;
  player: Player;
  timestamp: number;
}

export interface Game {
  id: string;
  board: Board;
  currentPlayer: Player;
  status: GameStatus;
  winner: Player | null;
  winningLine: number[] | null;
  mode: GameMode;
  aiDifficulty: AIDifficulty;
  moves: Move[];
  createdAt: number;
  completedAt: number | null;
}

export interface GameScore {
  x: number;
  o: number;
  draws: number;
}

export interface CreateGameRequest {
  mode: GameMode;
  aiDifficulty?: AIDifficulty;
}

export interface MakeMoveRequest {
  position: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface GameHistoryEntry {
  id: string;
  winner: Player | null;
  mode: GameMode;
  aiDifficulty: AIDifficulty;
  moveCount: number;
  completedAt: number;
}

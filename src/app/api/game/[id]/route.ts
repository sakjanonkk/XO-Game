import { NextResponse } from 'next/server';
import {
  checkDraw,
  checkWinner,
  getBestMove,
  getRandomMove,
  getWinningLine,
  isValidMove,
} from '@/lib/game-engine';
import { gameEvents } from '@/lib/game-events';
import { inMemoryGameRepository } from '@/lib/game-repository';
import type { ApiResponse, Game, MakeMoveRequest, Player } from '@/types/game';

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(
  _request: Request,
  { params }: RouteParams,
): Promise<NextResponse<ApiResponse<Game>>> {
  const { id } = await params;
  const game = inMemoryGameRepository.findById(id);

  if (!game) {
    return NextResponse.json(
      { error: 'Game not found.' },
      { status: 404 },
    );
  }

  return NextResponse.json({ data: game });
}

export async function PUT(
  request: Request,
  { params }: RouteParams,
): Promise<NextResponse<ApiResponse<Game>>> {
  const { id } = await params;
  const game = inMemoryGameRepository.findById(id);

  if (!game) {
    return NextResponse.json(
      { error: 'Game not found.' },
      { status: 404 },
    );
  }

  if (game.status !== 'playing') {
    return NextResponse.json(
      { error: 'Game is already finished.' },
      { status: 400 },
    );
  }

  let body: MakeMoveRequest;
  try {
    body = (await request.json()) as MakeMoveRequest;
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body.' },
      { status: 400 },
    );
  }

  if (typeof body.position !== 'number' || !isValidMove(game.board, body.position)) {
    return NextResponse.json(
      { error: 'Invalid move. Position must be 0-8 and cell must be empty.' },
      { status: 400 },
    );
  }

  // Apply the player's move
  applyMove(game, body.position, game.currentPlayer);

  // Check for game end after player's move
  if (game.status !== 'playing') {
    inMemoryGameRepository.update(game);
    gameEvents.emit(id, game);
    return NextResponse.json({ data: game });
  }

  // If AI mode, make the AI's move
  if (game.mode === 'ai' && game.status === 'playing') {
    const aiPlayer: Player = 'O';
    const aiMove =
      game.aiDifficulty === 'hard'
        ? getBestMove([...game.board], aiPlayer)
        : getRandomMove(game.board);

    applyMove(game, aiMove, aiPlayer);
  }

  inMemoryGameRepository.update(game);
  gameEvents.emit(id, game);
  return NextResponse.json({ data: game });
}

function applyMove(game: Game, position: number, player: Player): void {
  game.board[position] = player;
  game.moves.push({ position, player, timestamp: Date.now() });

  const winner = checkWinner(game.board);
  if (winner) {
    game.status = 'won';
    game.winner = winner;
    game.winningLine = getWinningLine(game.board);
    game.completedAt = Date.now();
  } else if (checkDraw(game.board)) {
    game.status = 'draw';
    game.completedAt = Date.now();
  } else {
    game.currentPlayer = player === 'X' ? 'O' : 'X';
  }
}

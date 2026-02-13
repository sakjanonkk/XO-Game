import { NextResponse } from "next/server";
import { createEmptyBoard } from "@/lib/game-engine";
import { inMemoryGameRepository } from "@/lib/game-repository";
import { generateId } from "@/lib/utils";
import type { ApiResponse, CreateGameRequest, Game } from "@/types/game";

export async function POST(
  request: Request,
): Promise<NextResponse<ApiResponse<Game>>> {
  try {
    const body = (await request.json()) as Partial<CreateGameRequest>;

    if (!body.mode || !["pvp", "ai"].includes(body.mode)) {
      return NextResponse.json(
        { error: 'Invalid game mode. Must be "pvp" or "ai".' },
        { status: 400 },
      );
    }

    if (
      body.mode === "ai" &&
      body.aiDifficulty &&
      !["easy", "hard"].includes(body.aiDifficulty)
    ) {
      return NextResponse.json(
        { error: 'Invalid AI difficulty. Must be "easy" or "hard".' },
        { status: 400 },
      );
    }

    const game: Game = {
      id: generateId(),
      board: createEmptyBoard(),
      currentPlayer: "X",
      status: "playing",
      winner: null,
      winningLine: null,
      mode: body.mode,
      aiDifficulty: body.aiDifficulty ?? "hard",
      moves: [],
      createdAt: Date.now(),
      completedAt: null,
    };

    inMemoryGameRepository.create(game);

    return NextResponse.json({ data: game }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }
}

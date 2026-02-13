import { NextResponse } from "next/server";
import { inMemoryGameRepository } from "@/lib/game-repository";
import type { ApiResponse, GameHistoryEntry } from "@/types/game";

export async function GET(): Promise<
  NextResponse<ApiResponse<GameHistoryEntry[]>>
> {
  const history = inMemoryGameRepository.getCompletedGames();
  return NextResponse.json({ data: history });
}

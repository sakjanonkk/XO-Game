import type { Board, CellValue, Player } from "@/types/game";

const WINNING_LINES: readonly number[][] = [
  //WINNING_LINES = แถวที่ชนะได้
  [0, 1, 2], // top row
  [3, 4, 5], // middle row
  [6, 7, 8], // bottom row
  [0, 3, 6], // left column
  [1, 4, 7], // middle column
  [2, 5, 8], // right column
  [0, 4, 8], // diagonal top-left to bottom-right
  [2, 4, 6], // diagonal top-right to bottom-left
];

export function createEmptyBoard(): Board {
  return Array.from<CellValue>({ length: 9 }).fill(null);
}

export function checkWinner(board: Board): Player | null {
  // winner func
  for (const [a, b, c] of WINNING_LINES) {
    // loop 8 line until find winner
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

export function getWinningLine(board: Board): number[] | null {
  // check which line is winning for ui show
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return line;
    }
  }
  return null;
}

export function checkDraw(board: Board): boolean {
  return !checkWinner(board) && board.every((cell) => cell !== null); //check not winner and not empty cell
}

export function getAvailableMoves(board: Board): number[] {
  return board.reduce<number[]>((moves, cell, index) => {
    if (cell === null) moves.push(index);
    return moves;
  }, []);
}

export function isValidMove(board: Board, position: number): boolean {
  return position >= 0 && position < 9 && board[position] === null;
}

//best move for bot use minimax algorithm function
function minimax(
  board: Board,
  depth: number,
  isMaximizing: boolean,
  aiPlayer: Player,
  alpha: number,
  beta: number,
): number {
  const opponent: Player = aiPlayer === "X" ? "O" : "X";
  const winner = checkWinner(board);

  //Bot ชนะ  = +10 - depth   (ชนะเร็ว = คะแนนมากกว่า)
  // Bot แพ้  = depth - 10     (แพ้ช้า = เสียน้อยกว่า)
  // เสมอ     = 0
  if (winner === aiPlayer) return 10 - depth;
  if (winner === opponent) return depth - 10;
  if (checkDraw(board)) return 0;

  const availableMoves = getAvailableMoves(board);

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (const move of availableMoves) {
      board[move] = aiPlayer;
      const score = minimax(board, depth + 1, false, aiPlayer, alpha, beta);
      board[move] = null;
      bestScore = Math.max(score, bestScore);
      alpha = Math.max(alpha, score);
      if (beta <= alpha) break;
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (const move of availableMoves) {
      board[move] = opponent;
      const score = minimax(board, depth + 1, true, aiPlayer, alpha, beta);
      board[move] = null;
      bestScore = Math.min(score, bestScore);
      beta = Math.min(beta, score);
      if (beta <= alpha) break;
    }
    return bestScore;
  }
}

export function getBestMove(board: Board, aiPlayer: Player): number {
  const availableMoves = getAvailableMoves(board);
  let bestScore = -Infinity;
  let bestMove = availableMoves[0];

  for (const move of availableMoves) {
    board[move] = aiPlayer;
    const score = minimax(board, 0, false, aiPlayer, -Infinity, Infinity);
    board[move] = null;

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}

export function getRandomMove(board: Board): number {
  const moves = getAvailableMoves(board);
  return moves[Math.floor(Math.random() * moves.length)];
}

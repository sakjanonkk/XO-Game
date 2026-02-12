'use client';

import { memo } from 'react';
import { Cell } from './cell';
import type { Board as BoardType } from '@/types/game';

interface BoardProps {
  board: BoardType;
  winningLine: number[] | null;
  isDisabled: boolean;
  onCellClick: (position: number) => void;
}

const Board = memo(function Board({
  board,
  winningLine,
  isDisabled,
  onCellClick,
}: BoardProps) {
  return (
    <div
      className="grid grid-cols-3 gap-2.5 sm:gap-3"
      role="grid"
      aria-label="Tic-tac-toe game board"
    >
      {board.map((cell, index) => (
        <Cell
          key={index}
          value={cell}
          position={index}
          isWinningCell={winningLine?.includes(index) ?? false}
          isDisabled={isDisabled}
          onClick={onCellClick}
        />
      ))}
    </div>
  );
});

export { Board };

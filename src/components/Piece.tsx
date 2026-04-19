'use client';

import { PieceData } from '@/types/chess';

interface PieceProps {
  piece: PieceData;
  isSelected?: boolean;
}

// Unicode chess symbols mapped to piece type + color
const PIECE_SYMBOLS: Record<string, Record<string, string>> = {
  white: {
    King:   '♔',
    Queen:  '♕',
    Rook:   '♖',
    Bishop: '♗',
    Knight: '♘',
    Pawn:   '♙',
  },
  black: {
    King:   '♚',
    Queen:  '♛',
    Rook:   '♜',
    Bishop: '♝',
    Knight: '♞',
    Pawn:   '♟',
  },
};

export default function Piece({ piece, isSelected }: PieceProps) {
  const symbol = PIECE_SYMBOLS[piece.color]?.[piece.type] ?? '?';

  return (
    <span
      className={`chess-piece chess-piece--${piece.color} ${isSelected ? 'chess-piece--selected' : ''}`}
      role="img"
      aria-label={`${piece.color} ${piece.type}`}
    >
      {symbol}
    </span>
  );
}

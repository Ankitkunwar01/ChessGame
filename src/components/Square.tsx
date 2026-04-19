'use client';

import { PieceData, ValidMove } from '@/types/chess';
import Piece from './Piece';

interface SquareProps {
  row: number;
  col: number;
  piece: PieceData | null;
  isSelected: boolean;
  isValidMove: boolean;
  isLastMoveFrom: boolean;
  isLastMoveTo: boolean;
  isLight: boolean;
  onClick: (row: number, col: number) => void;
}

export default function Square({
  row,
  col,
  piece,
  isSelected,
  isValidMove,
  isLastMoveFrom,
  isLastMoveTo,
  isLight,
  onClick,
}: SquareProps) {
  const fileLabel = col === 0 ? String(8 - row) : null;
  const rankLabel = row === 7 ? String.fromCharCode(97 + col) : null;

  const squareClass = [
    'square',
    isLight ? 'square--light' : 'square--dark',
    isSelected ? 'square--selected' : '',
    isLastMoveFrom || isLastMoveTo ? 'square--last-move' : '',
    isValidMove && !piece ? 'square--valid-empty' : '',
    isValidMove && piece ? 'square--valid-capture' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      id={`sq-${row}-${col}`}
      className={squareClass}
      onClick={() => onClick(row, col)}
      role="button"
      aria-label={`${String.fromCharCode(97 + col)}${8 - row}${piece ? ` ${piece.color} ${piece.type}` : ''}`}
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(row, col)}
    >
      {/* Rank label (left edge) */}
      {fileLabel && <span className="square__label square__label--rank">{fileLabel}</span>}
      {/* File label (bottom edge) */}
      {rankLabel && <span className="square__label square__label--file">{rankLabel}</span>}

      {/* Valid move dot or capture ring */}
      {isValidMove && !piece && <span className="valid-dot" />}
      {isValidMove && piece && <span className="capture-ring" />}

      {/* The piece */}
      {piece && <Piece piece={piece} isSelected={isSelected} />}
    </div>
  );
}

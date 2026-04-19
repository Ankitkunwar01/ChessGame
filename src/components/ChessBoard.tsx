'use client';

import { useGameStore } from '@/store/gameStore';
import Square from './Square';
import { PieceData } from '@/types/chess';
import { useMemo, useCallback } from 'react';

export default function ChessBoard() {
  const {
    pieces,
    selectedSquare,
    validMoves,
    lastMove,
    currentTurn,
    status,
    isLoading,
    isAiThinking,
    selectSquare,
    playerColor,
    gameMode,
  } = useGameStore();

  // Build a fast lookup map: "row-col" -> PieceData
  const pieceMap = useMemo(() => {
    const map = new Map<string, PieceData>();
    pieces.forEach((p) => map.set(`${p.row}-${p.col}`, p));
    return map;
  }, [pieces]);

  // Valid move destination set
  const validMoveSet = useMemo(
    () => new Set(validMoves.map((m) => `${m.to_row}-${m.to_col}`)),
    [validMoves]
  );

  const handleSquareClick = useCallback(
    (row: number, col: number) => {
      // Block interaction while AI is thinking or loading
      if (isLoading || isAiThinking) return;
      // In 1-player mode, only allow clicks on player's turn
      if (gameMode === '1player' && currentTurn !== playerColor) return;
      selectSquare(row, col);
    },
    [isLoading, isAiThinking, gameMode, currentTurn, playerColor, selectSquare]
  );

  // Flip board for black player in 1-player mode
  const shouldFlip = gameMode === '1player' && playerColor === 'black';
  const rows = shouldFlip ? [0,1,2,3,4,5,6,7].reverse() : [0,1,2,3,4,5,6,7];
  const cols = shouldFlip ? [0,1,2,3,4,5,6,7].reverse() : [0,1,2,3,4,5,6,7];

  const isGameOver = status === 'checkmate' || status === 'stalemate';

  return (
    <div className="board-wrapper">
      {/* AI thinking overlay */}
      {isAiThinking && (
        <div className="board-overlay">
          <div className="thinking-indicator">
            <span className="thinking-dot" />
            <span className="thinking-dot" />
            <span className="thinking-dot" />
            <span className="thinking-label">Computer is thinking…</span>
          </div>
        </div>
      )}

      {/* Game over overlay */}
      {isGameOver && (
        <div className="board-overlay board-overlay--gameover">
          <div className="gameover-badge">
            {status === 'checkmate'
              ? `♛ ${currentTurn === 'white' ? 'Black' : 'White'} wins!`
              : '½ Stalemate — Draw'}
          </div>
        </div>
      )}

      <div className={`chess-board ${isGameOver ? 'chess-board--dimmed' : ''}`}>
        {rows.map((row) =>
          cols.map((col) => {
            const key = `${row}-${col}`;
            const piece = pieceMap.get(key) ?? null;
            const isLight = (row + col) % 2 === 0;
            const isSelected =
              selectedSquare ? selectedSquare[0] === row && selectedSquare[1] === col : false;
            const isValidMove = validMoveSet.has(key);
            const isLastMoveFrom =
              lastMove ? lastMove.from[0] === row && lastMove.from[1] === col : false;
            const isLastMoveTo =
              lastMove ? lastMove.to[0] === row && lastMove.to[1] === col : false;

            return (
              <Square
                key={key}
                row={row}
                col={col}
                piece={piece}
                isLight={isLight}
                isSelected={isSelected}
                isValidMove={isValidMove}
                isLastMoveFrom={isLastMoveFrom}
                isLastMoveTo={isLastMoveTo}
                onClick={handleSquareClick}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

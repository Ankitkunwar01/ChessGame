'use client';

import { useGameStore } from '@/store/gameStore';

const STATUS_CONFIG = {
  active:    { label: null,             className: '',                   emoji: '' },
  check:     { label: 'Check!',         className: 'status--check',      emoji: '⚠️' },
  checkmate: { label: 'Checkmate!',     className: 'status--checkmate',  emoji: '♛' },
  stalemate: { label: 'Stalemate',      className: 'status--stalemate',  emoji: '½' },
  draw:      { label: 'Draw',           className: 'status--draw',       emoji: '½' },
} as const;

export default function GameStatus() {
  const {
    status,
    currentTurn,
    gameMode,
    playerColor,
    isAiThinking,
    gameId,
  } = useGameStore();

  if (!gameId) return null;

  const config = STATUS_CONFIG[status];
  const isPlayerTurn = gameMode === '2player' || currentTurn === playerColor;
  const turnLabel = gameMode === '1player'
    ? isPlayerTurn ? 'Your turn' : "Computer's turn"
    : `${currentTurn.charAt(0).toUpperCase() + currentTurn.slice(1)}'s turn`;

  return (
    <div className="game-status">
      {/* Turn indicator */}
      {(status === 'active' || status === 'check') && (
        <div className="turn-indicator">
          <span className={`turn-dot turn-dot--${currentTurn}`} />
          <span className="turn-label">
            {isAiThinking ? '🤖 Computer thinking…' : turnLabel}
          </span>
        </div>
      )}

      {/* Status banner */}
      {config.label && (
        <div className={`status-banner ${config.className}`}>
          <span className="status-emoji">{config.emoji}</span>
          <span className="status-text">{config.label}</span>
          {status === 'checkmate' && (
            <span className="status-winner">
              {currentTurn === 'white' ? 'Black' : 'White'} wins
            </span>
          )}
        </div>
      )}
    </div>
  );
}

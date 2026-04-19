'use client';

import ChessBoard from '@/components/ChessBoard';
import GameControls from '@/components/GameControls';
import GameStatus from '@/components/GameStatus';
import { useGameStore } from '@/store/gameStore';

export default function GamePage() {
  const { errorMessage, clearError, gameId } = useGameStore();

  return (
    <main className="game-page">
      {/* Background effects */}
      <div className="bg-orb bg-orb--1" />
      <div className="bg-orb bg-orb--2" />
      <div className="bg-orb bg-orb--3" />

      {/* Error toast */}
      {errorMessage && (
        <div className="error-toast" role="alert">
          <span>{errorMessage}</span>
          <button onClick={clearError} aria-label="Dismiss" className="error-toast__close">✕</button>
        </div>
      )}

      <div className="game-layout">
        {/* Left panel — controls */}
        <aside className="game-sidebar">
          <GameControls />
          <GameStatus />
        </aside>

        {/* Centre — chess board */}
        <section className="game-centre">
          {!gameId ? (
            <div className="board-placeholder">
              <div className="placeholder-icon">♟</div>
              <p className="placeholder-text">Select a mode and start a game</p>
            </div>
          ) : (
            <ChessBoard />
          )}
        </section>
      </div>
    </main>
  );
}

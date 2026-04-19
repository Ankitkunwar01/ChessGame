'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { GameMode } from '@/types/chess';

export default function GameControls() {
  const { startGame, resetGame, gameId, isLoading, gameMode } = useGameStore();
  const [selectedMode, setSelectedMode] = useState<GameMode>('2player');
  const [selectedColor, setSelectedColor] = useState<'white' | 'black'>('white');

  const handleStart = async () => {
    await startGame(selectedMode, selectedColor);
  };

  const handleReset = async () => {
    if (gameId) {
      await resetGame();
    } else {
      await handleStart();
    }
  };

  return (
    <div className="game-controls">
      <h1 className="game-controls__title">
        <span className="title-icon">♟</span>
        Chess
      </h1>

      {/* Mode selection */}
      <div className="control-group">
        <label className="control-label">Game Mode</label>
        <div className="mode-buttons">
          <button
            id="mode-2player"
            className={`mode-btn ${selectedMode === '2player' ? 'mode-btn--active' : ''}`}
            onClick={() => setSelectedMode('2player')}
            disabled={isLoading}
          >
            <span className="mode-icon">👥</span>
            <span>2 Players</span>
          </button>
          <button
            id="mode-1player"
            className={`mode-btn ${selectedMode === '1player' ? 'mode-btn--active' : ''}`}
            onClick={() => setSelectedMode('1player')}
            disabled={isLoading}
          >
            <span className="mode-icon">🤖</span>
            <span>vs Computer</span>
          </button>
        </div>
      </div>

      {/* Color selection (1-player only) */}
      {selectedMode === '1player' && (
        <div className="control-group">
          <label className="control-label">Play as</label>
          <div className="color-buttons">
            <button
              id="color-white"
              className={`color-btn ${selectedColor === 'white' ? 'color-btn--active' : ''}`}
              onClick={() => setSelectedColor('white')}
              disabled={isLoading}
            >
              ♔ White
            </button>
            <button
              id="color-black"
              className={`color-btn ${selectedColor === 'black' ? 'color-btn--active' : ''}`}
              onClick={() => setSelectedColor('black')}
              disabled={isLoading}
            >
              ♚ Black
            </button>
          </div>
        </div>
      )}

      {/* Start / Reset buttons */}
      <div className="control-actions">
        {!gameId ? (
          <button
            id="btn-start"
            className="action-btn action-btn--primary"
            onClick={handleStart}
            disabled={isLoading}
          >
            {isLoading ? 'Starting…' : '▶ Start Game'}
          </button>
        ) : (
          <button
            id="btn-reset"
            className="action-btn action-btn--secondary"
            onClick={handleReset}
            disabled={isLoading}
          >
            {isLoading ? 'Resetting…' : '↺ New Game'}
          </button>
        )}
      </div>

      {/* Legend */}
      {gameId && (
        <div className="legend">
          <div className="legend-item">
            <span className="legend-dot legend-dot--green" />
            <span>Valid move</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot legend-dot--yellow" />
            <span>Last move</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot legend-dot--blue" />
            <span>Selected</span>
          </div>
        </div>
      )}
    </div>
  );
}

// API client for communicating with the Django backend
import {
  GameState,
  MoveResult,
  StartGameResponse,
  ValidMovesResponse,
  GameMode,
  PromotionPiece,
} from '@/types/chess';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/game';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export const chessApi = {
  /** POST /api/game/start/ — create new game session */
  startGame: (mode: GameMode): Promise<StartGameResponse> =>
    request(`${BASE_URL}/start/`, {
      method: 'POST',
      body: JSON.stringify({ mode }),
    }),

  /** GET /api/game/state/?game_id=... — fetch current board state */
  getState: (gameId: string): Promise<GameState> =>
    request(`${BASE_URL}/state/?game_id=${gameId}`),

  /** POST /api/game/move/ — execute a player move */
  makeMove: (
    gameId: string,
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number,
    promotionPiece?: PromotionPiece
  ): Promise<MoveResult> =>
    request(`${BASE_URL}/move/`, {
      method: 'POST',
      body: JSON.stringify({
        game_id: gameId,
        from_row: fromRow,
        from_col: fromCol,
        to_row: toRow,
        to_col: toCol,
        promotion_piece: promotionPiece ?? null,
      }),
    }),

  /** POST /api/game/ai-move/ — trigger the computer to move */
  aiMove: (gameId: string): Promise<MoveResult> =>
    request(`${BASE_URL}/ai-move/`, {
      method: 'POST',
      body: JSON.stringify({ game_id: gameId }),
    }),

  /** POST /api/game/reset/ — reset session to starting position */
  resetGame: (gameId: string): Promise<MoveResult> =>
    request(`${BASE_URL}/reset/`, {
      method: 'POST',
      body: JSON.stringify({ game_id: gameId }),
    }),

  /** GET /api/game/valid-moves/?game_id=...&row=...&col=... */
  getValidMoves: (gameId: string, row: number, col: number): Promise<ValidMovesResponse> =>
    request(`${BASE_URL}/valid-moves/?game_id=${gameId}&row=${row}&col=${col}`),
};

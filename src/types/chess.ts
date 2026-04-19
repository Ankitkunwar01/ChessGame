// TypeScript type definitions for the Chess application

export type Color = 'white' | 'black';
export type GameMode = '1player' | '2player';
export type GameStatus = 'active' | 'check' | 'checkmate' | 'stalemate' | 'draw';
export type PieceType = 'Pawn' | 'Rook' | 'Knight' | 'Bishop' | 'Queen' | 'King';
export type PromotionPiece = 'Queen' | 'Rook' | 'Bishop' | 'Knight';

export interface PieceData {
  type: PieceType;
  color: Color;
  row: number;
  col: number;
  has_moved: boolean;
}

export interface ValidMove {
  to_row: number;
  to_col: number;
}

export interface GameState {
  game_id: string;
  mode: GameMode;
  pieces: PieceData[];
  current_turn: Color;
  status: GameStatus;
  move_count: number;
}

export interface MoveResult {
  success: boolean;
  error?: string;
  status: GameStatus;
  game_id: string;
  pieces: PieceData[];
  current_turn: Color;
  move_count: number;
  move?: {
    from_row: number;
    from_col: number;
    to_row: number;
    to_col: number;
    is_castling: boolean;
    is_en_passant: boolean;
    promotion_piece: string | null;
  };
}

export interface StartGameResponse extends GameState {}
export interface ValidMovesResponse {
  success: boolean;
  moves: ValidMove[];
  error?: string;
}

// Board grid helper: 8x8 array of PieceData | null
export type BoardGrid = (PieceData | null)[][];

// For square selection
export type SquareCoord = [number, number]; // [row, col]

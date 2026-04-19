import { create } from 'zustand';
import { chessApi } from '@/services/api';
import {
  GameMode,
  GameStatus,
  PieceData,
  ValidMove,
  SquareCoord,
  PromotionPiece,
} from '@/types/chess';

interface GameStore {

  gameId: string | null;
  pieces: PieceData[];
  currentTurn: 'white' | 'black';
  gameMode: GameMode;
  playerColor: 'white' | 'black';
  status: GameStatus;
  selectedSquare: SquareCoord | null;
  validMoves: ValidMove[];
  isLoading: boolean;
  isAiThinking: boolean;
  errorMessage: string | null;
  lastMove: { from: SquareCoord; to: SquareCoord } | null;

  startGame: (mode: GameMode, playerColor?: 'white' | 'black') => Promise<void>;
  selectSquare: (row: number, col: number) => Promise<void>;
  makeMove: (toRow: number, toCol: number, promotion?: PromotionPiece) => Promise<void>;
  triggerAiMove: () => Promise<void>;
  resetGame: () => Promise<void>;
  clearSelection: () => void;
  clearError: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({

  gameId: null,
  pieces: [],
  currentTurn: 'white',
  gameMode: '2player',
  playerColor: 'white',
  status: 'active',
  selectedSquare: null,
  validMoves: [],
  isLoading: false,
  isAiThinking: false,
  errorMessage: null,
  lastMove: null,

  startGame: async (mode, playerColor = 'white') => {
    set({ isLoading: true, errorMessage: null });
    try {
      const res = await chessApi.startGame(mode);
      set({
        gameId: res.game_id,
        pieces: res.pieces,
        currentTurn: res.current_turn,
        gameMode: mode,
        playerColor,
        status: res.status,
        selectedSquare: null,
        validMoves: [],
        lastMove: null,
        isLoading: false,
      });

      if (mode === '1player' && playerColor === 'black') {
        setTimeout(() => get().triggerAiMove(), 500);
      }
    } catch (err: unknown) {
      set({ isLoading: false, errorMessage: (err as Error).message });
    }
  },

  selectSquare: async (row, col) => {
    const { gameId, selectedSquare, validMoves, pieces, currentTurn, status } = get();

    if (!gameId || status === 'checkmate' || status === 'stalemate') return;

    if (selectedSquare) {
      const isValidDest = validMoves.some(m => m.to_row === row && m.to_col === col);
      if (isValidDest) {
        await get().makeMove(row, col);
        return;
      }
    }

    const piece = pieces.find(p => p.row === row && p.col === col);
    if (!piece || piece.color !== currentTurn) {
      set({ selectedSquare: null, validMoves: [] });
      return;
    }

    try {
      const res = await chessApi.getValidMoves(gameId, row, col);
      set({
        selectedSquare: [row, col],
        validMoves: res.success ? res.moves : [],
      });
    } catch {
      set({ selectedSquare: [row, col], validMoves: [] });
    }
  },

  makeMove: async (toRow, toCol, promotion) => {
    const { gameId, selectedSquare, gameMode, playerColor, currentTurn } = get();
    if (!gameId || !selectedSquare) return;

    const [fromRow, fromCol] = selectedSquare;
    set({ isLoading: true, errorMessage: null, selectedSquare: null, validMoves: [] });

    try {
      const res = await chessApi.makeMove(gameId, fromRow, fromCol, toRow, toCol, promotion);

      if (!res.success) {
        set({ isLoading: false, errorMessage: res.error ?? 'Invalid move' });
        return;
      }

      set({
        pieces: res.pieces,
        currentTurn: res.current_turn,
        status: res.status,
        lastMove: { from: [fromRow, fromCol], to: [toRow, toCol] },
        isLoading: false,
      });

      if (gameMode === '1player' && res.current_turn !== playerColor
          && res.status === 'active' || res.status === 'check') {
        setTimeout(() => get().triggerAiMove(), 600);
      }
    } catch (err: unknown) {
      set({ isLoading: false, errorMessage: (err as Error).message });
    }
  },

  triggerAiMove: async () => {
    const { gameId, status } = get();
    if (!gameId || status === 'checkmate' || status === 'stalemate') return;

    set({ isAiThinking: true });
    try {
      const res = await chessApi.aiMove(gameId);
      if (res.success) {
        const move = res.move;
        set({
          pieces: res.pieces,
          currentTurn: res.current_turn,
          status: res.status,
          isAiThinking: false,
          lastMove: move
            ? { from: [move.from_row, move.from_col], to: [move.to_row, move.to_col] }
            : get().lastMove,
        });
      } else {
        set({ isAiThinking: false, errorMessage: res.error });
      }
    } catch (err: unknown) {
      set({ isAiThinking: false, errorMessage: (err as Error).message });
    }
  },

  resetGame: async () => {
    const { gameId, gameMode, playerColor } = get();
    if (!gameId) return;

    set({ isLoading: true });
    try {
      const res = await chessApi.resetGame(gameId);
      set({
        pieces: res.pieces,
        currentTurn: res.current_turn,
        status: res.status,
        selectedSquare: null,
        validMoves: [],
        lastMove: null,
        isLoading: false,
        errorMessage: null,
      });

      if (gameMode === '1player' && playerColor === 'black') {
        setTimeout(() => get().triggerAiMove(), 500);
      }
    } catch (err: unknown) {
      set({ isLoading: false, errorMessage: (err as Error).message });
    }
  },

  clearSelection: () => set({ selectedSquare: null, validMoves: [] }),
  clearError: () => set({ errorMessage: null }),
}));
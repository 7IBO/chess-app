/**
 * Constants for the chess application
 */

import type { PieceColor, PieceName } from "../types/chess.types";

export const BOARD_SIZE = 8;
export const SQUARE_SIZE = 96; // 24 * 4 = 96px (w-24 h-24)

// Board positions
export const MIN_POSITION = 0;
export const MAX_POSITION = 7;

// Special ranks
export const WHITE_PROMOTION_RANK = 0;
export const BLACK_PROMOTION_RANK = 7;
export const WHITE_PAWN_START_RANK = 6;
export const BLACK_PAWN_START_RANK = 1;

// Special moves
export const CASTLING_KING_MOVE_DISTANCE = 2;
export const EN_PASSANT_PAWN_MOVE_DISTANCE = 2;
export const PAWN_DOUBLE_MOVE_DISTANCE = 2;

export const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;
export const RANKS = [8, 7, 6, 5, 4, 3, 2, 1] as const;

export const PIECE_NAMES: Record<PieceName, string> = {
  pawn: "Pawn",
  rook: "Rook",
  knight: "Knight",
  bishop: "Bishop",
  queen: "Queen",
  king: "King",
};

export const PLAYER_NAMES: Record<PieceColor, string> = {
  white: "White",
  black: "Black",
};

export const PLAYER_ICONS: Record<PieceColor, string> = {
  white: "⚪",
  black: "⚫",
};

export const STATUS_MESSAGES = {
  check: "Check!",
  checkmate: "Checkmate!",
  stalemate: "Stalemate! Draw.",
} as const;

export const PROMOTION_PIECES = [
  "queen",
  "rook",
  "bishop",
  "knight",
] as const satisfies PieceName[];

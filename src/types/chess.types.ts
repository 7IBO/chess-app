/**
 * Types pour l'application d'échecs
 */

export type PieceColor = "white" | "black";

export type PieceName = "pawn" | "rook" | "knight" | "bishop" | "queen" | "king";

export type GameStatus = "playing" | "check" | "checkmate" | "stalemate";

export interface Position {
  x: number;
  y: number;
}

export interface Move {
  piece: PieceName;
  color: PieceColor;
  from: Position;
  to: Position;
  captured?: boolean;
  castling?: boolean;
  enPassant?: boolean;
  promotion?: PieceName;
}

export interface CapturedPieces {
  white: PieceName[];
  black: PieceName[];
}

export interface PendingPromotion {
  pawn: import("../models/Piece").Piece;
  x: number;
  y: number;
}

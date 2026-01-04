/**
 * Types for chess application
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

export interface CapturedPiece {
  piece: PieceName;
  id: string;
}

export interface CapturedPieces {
  white: CapturedPiece[];
  black: CapturedPiece[];
}

export interface PendingPromotion {
  pawn: import("../models/Piece").Piece;
  x: number;
  y: number;
}

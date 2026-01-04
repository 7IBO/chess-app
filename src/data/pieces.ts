import { Bishop, King, Knight, Pawn, Pieces, Queen, Rook } from "@/models";

/**
 * Creates a new set of pieces in their initial position
 */
export function createInitialPieces(): Pieces {
  return new Pieces([
    new Rook(0, 0, "black"),
    new Knight(1, 0, "black"),
    new Bishop(2, 0, "black"),
    new Queen(3, 0, "black"),
    new King(4, 0, "black"),
    new Bishop(5, 0, "black"),
    new Knight(6, 0, "black"),
    new Rook(7, 0, "black"),
    new Pawn(0, 1, "black"),
    new Pawn(1, 1, "black"),
    new Pawn(2, 1, "black"),
    new Pawn(3, 1, "black"),
    new Pawn(4, 1, "black"),
    new Pawn(5, 1, "black"),
    new Pawn(6, 1, "black"),
    new Pawn(7, 1, "black"),

    new Rook(0, 7, "white"),
    new Knight(1, 7, "white"),
    new Bishop(2, 7, "white"),
    new Queen(3, 7, "white"),
    new King(4, 7, "white"),
    new Bishop(5, 7, "white"),
    new Knight(6, 7, "white"),
    new Rook(7, 7, "white"),
    new Pawn(0, 6, "white"),
    new Pawn(1, 6, "white"),
    new Pawn(2, 6, "white"),
    new Pawn(3, 6, "white"),
    new Pawn(4, 6, "white"),
    new Pawn(5, 6, "white"),
    new Pawn(6, 6, "white"),
    new Pawn(7, 6, "white"),
  ]);
}

// Compatibility: export a default instance for existing code
export const pieces = createInitialPieces();

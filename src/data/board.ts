import { Board } from "@/models";
import { pieces } from "./pieces";

// Global instance of the game board
export const board = new Board(pieces);

// Initialize moves for all pieces
for (const piece of board.getAllPieces()) {
  piece.calculateMoves();
}

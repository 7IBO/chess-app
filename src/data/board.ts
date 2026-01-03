import { Board } from "@/models";
import { pieces } from "./pieces";

// Instance globale du plateau de jeu
export const board = new Board(pieces);

// Initialiser les mouvements de toutes les pièces
board.getAllPieces().forEach((piece) => {
  piece.calculateMoves(board);
});

import type { Board } from "./Board";
import { Piece } from "./Piece";

export class Knight extends Piece {
  constructor(x: number, y: number, color: "black" | "white") {
    super("knight", x, y, color);
  }

  public calculateMoves(board?: Board): void {
    // Réinitialiser les mouvements possibles
    this.movesPossible = [];

    // Tous les mouvements possibles du cavalier (en L)
    const knightMoves = [
      // TOP LEFT
      { x: this.position.x - 2, y: this.position.y - 1 },
      { x: this.position.x - 1, y: this.position.y - 2 },
      // TOP RIGHT
      { x: this.position.x + 2, y: this.position.y - 1 },
      { x: this.position.x + 1, y: this.position.y - 2 },
      // BOTTOM LEFT
      { x: this.position.x - 2, y: this.position.y + 1 },
      { x: this.position.x - 1, y: this.position.y + 2 },
      // BOTTOM RIGHT
      { x: this.position.x + 2, y: this.position.y + 1 },
      { x: this.position.x + 1, y: this.position.y + 2 },
    ];

    // Ajouter les mouvements valides
    // Le cavalier peut sauter par-dessus les pièces
    // Mais ne peut pas atterrir sur une pièce alliée
    for (const move of knightMoves) {
      if (board) {
        // Ne pas ajouter si la case est occupée par une pièce alliée
        if (!board.isSquareOccupiedByAlly(move.x, move.y, this.color)) {
          this.addMovePossible(move);
        }
      } else {
        // Si pas de board, ajouter tous les mouvements (comportement par défaut)
        this.addMovePossible(move);
      }
    }
  }
}

import type { Board } from "./Board";
import { Piece } from "./Piece";

export class Pawn extends Piece {
  constructor(x: number, y: number, color: "black" | "white") {
    super("pawn", x, y, color);
  }

  public calculateMoves(board?: Board): void {
    // Réinitialiser les mouvements possibles
    this.movesPossible = [];

    const direction = this.color === "black" ? 1 : -1;
    const startRow = this.color === "black" ? 1 : 6;

    // Mouvement d'une case vers l'avant
    const oneForward = {
      x: this.position.x,
      y: this.position.y + direction,
    };

    // Vérifier que la case devant est libre
    if (board && !board.isSquareOccupied(oneForward.x, oneForward.y)) {
      this.addMovePossible(oneForward);

      // Mouvement de deux cases au premier coup
      if (this.position.y === startRow && !this.hasMoved) {
        const twoForward = {
          x: this.position.x,
          y: this.position.y + direction * 2,
        };

        // Vérifier que les deux cases sont libres
        if (!board.isSquareOccupied(twoForward.x, twoForward.y)) {
          this.addMovePossible(twoForward);
        }
      }
    }

    // Captures diagonales
    const diagonalLeft = {
      x: this.position.x - 1,
      y: this.position.y + direction,
    };
    const diagonalRight = {
      x: this.position.x + 1,
      y: this.position.y + direction,
    };

    // Peut capturer en diagonale s'il y a une pièce adverse
    if (
      board &&
      diagonalLeft.x >= 0 &&
      diagonalLeft.x <= 7 &&
      diagonalLeft.y >= 0 &&
      diagonalLeft.y <= 7 &&
      board.isSquareOccupiedByOpponent(diagonalLeft.x, diagonalLeft.y, this.color)
    ) {
      this.addMovePossible(diagonalLeft);
    }

    if (
      board &&
      diagonalRight.x >= 0 &&
      diagonalRight.x <= 7 &&
      diagonalRight.y >= 0 &&
      diagonalRight.y <= 7 &&
      board.isSquareOccupiedByOpponent(diagonalRight.x, diagonalRight.y, this.color)
    ) {
      this.addMovePossible(diagonalRight);
    }

    // Prise en passant
    if (board) {
      this.checkEnPassant(board, diagonalLeft, direction);
      this.checkEnPassant(board, diagonalRight, direction);
    }
  }

  /**
   * Vérifie si la prise en passant est possible
   */
  private checkEnPassant(
    board: Board,
    targetSquare: { x: number; y: number },
    direction: number
  ): void {
    const lastMove = board.getLastMove();
    if (!lastMove) return;

    const { piece: lastPiece, from: lastFrom, to: lastTo } = lastMove;

    // Le dernier mouvement doit être un pion qui a avancé de 2 cases
    if (lastPiece.name !== "pawn" || Math.abs(lastTo.y - lastFrom.y) !== 2) {
      return;
    }

    // Le pion adverse doit être à côté du pion actuel
    if (lastTo.y !== this.position.y || Math.abs(lastTo.x - this.position.x) !== 1) {
      return;
    }

    // Vérifier que la case cible correspond à la prise en passant
    if (targetSquare.x === lastTo.x && targetSquare.y === lastTo.y + direction) {
      this.addMovePossible(targetSquare);
    }
  }
}

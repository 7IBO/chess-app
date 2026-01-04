import { Piece } from "./Piece";

export class Pawn extends Piece {
  constructor(x: number, y: number, color: "black" | "white") {
    super("pawn", x, y, color);
  }

  public calculateMoves(): void {
    // Reset possible moves
    this.movesPossible = [];

    const direction = this.color === "black" ? 1 : -1;
    const startRow = this.color === "black" ? 1 : 6;

    // Move one square forward
    const oneForward = {
      x: this.position.x,
      y: this.position.y + direction,
    };

    // Check that the square in front is clear
    if (this.board && !this.board.isSquareOccupied(oneForward.x, oneForward.y)) {
      this.addMovePossible(oneForward);

      // Move two squares on first move
      if (this.position.y === startRow && !this.hasMoved) {
        const twoForward = {
          x: this.position.x,
          y: this.position.y + direction * 2,
        };

        // Check that both squares are clear
        if (!this.board.isSquareOccupied(twoForward.x, twoForward.y)) {
          this.addMovePossible(twoForward);
        }
      }
    }

    // Diagonal captures
    const diagonalLeft = {
      x: this.position.x - 1,
      y: this.position.y + direction,
    };
    const diagonalRight = {
      x: this.position.x + 1,
      y: this.position.y + direction,
    };

    // Can capture diagonally if there's an opponent piece
    if (
      this.board &&
      diagonalLeft.x >= 0 &&
      diagonalLeft.x <= 7 &&
      diagonalLeft.y >= 0 &&
      diagonalLeft.y <= 7 &&
      this.board.isSquareOccupiedByOpponent(diagonalLeft.x, diagonalLeft.y, this.color)
    ) {
      this.addMovePossible(diagonalLeft);
    }

    if (
      this.board &&
      diagonalRight.x >= 0 &&
      diagonalRight.x <= 7 &&
      diagonalRight.y >= 0 &&
      diagonalRight.y <= 7 &&
      this.board.isSquareOccupiedByOpponent(diagonalRight.x, diagonalRight.y, this.color)
    ) {
      this.addMovePossible(diagonalRight);
    }

    // En passant
    if (this.board) {
      this.checkEnPassant(diagonalLeft, direction);
      this.checkEnPassant(diagonalRight, direction);
    }
  }

  /**
   * Checks if en passant is possible
   */
  private checkEnPassant(targetSquare: { x: number; y: number }, direction: number): void {
    if (!this.board) return;

    const lastMove = this.board.getLastMove();
    if (!lastMove) return;

    const { piece: lastPiece, from: lastFrom, to: lastTo } = lastMove;

    // The last move must be a pawn that advanced 2 squares
    if (lastPiece.name !== "pawn" || Math.abs(lastTo.y - lastFrom.y) !== 2) {
      return;
    }

    // The opponent pawn must be next to the current pawn
    if (lastTo.y !== this.position.y || Math.abs(lastTo.x - this.position.x) !== 1) {
      return;
    }

    // Check that target square matches en passant
    if (targetSquare.x === lastTo.x && targetSquare.y === lastTo.y + direction) {
      this.addMovePossible(targetSquare);
    }
  }
}

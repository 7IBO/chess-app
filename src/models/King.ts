import { Piece } from "./Piece";

export class King extends Piece {
  constructor(x: number, y: number, color: "black" | "white") {
    super("king", x, y, color);
  }

  public calculateMoves(): void {
    this.movesPossible = [];
    this.canMoveDiagonally(1);
    this.canMoveHorizontally(1);
    this.canMoveVertically(1);

    // Add castling moves if possible
    if (this.board) {
      this.addCastlingMoves();
    }
  }

  /**
   * Adds castling moves if conditions are met
   */
  private addCastlingMoves(): void {
    // Can't castle if the king has already moved or is in check
    if (this.hasMoved || this.board?.isKingInCheck(this.color)) {
      return;
    }

    const y = this.position.y;
    const x = this.position.x;

    // Kingside castling - to the right
    this.checkCastling(x, y, 7, 1);

    // Queenside castling - to the left
    this.checkCastling(x, y, 0, -1);
  }

  /**
   * Checks if castling is possible in a direction
   */
  private checkCastling(kingX: number, kingY: number, rookX: number, direction: number): void {
    if (!this.board) return;

    const rook = this.board.getPieceAt(rookX, kingY);

    // Check that the rook exists, hasn't moved, and is the same color
    if (!rook || rook.name !== "rook" || rook.hasMoved || rook.color !== this.color) {
      return;
    }

    // Check that the path is clear between the king and the rook
    const start = Math.min(kingX, rookX) + 1;
    const end = Math.max(kingX, rookX);

    for (let x = start; x < end; x++) {
      if (this.board.isSquareOccupied(x, kingY)) {
        return;
      }
    }

    // Check that the king does not pass through an attacked square
    const targetX = kingX + direction * 2;
    const passingX = kingX + direction;

    const opponentColor = this.color === "white" ? "black" : "white";

    if (
      this.board.isSquareAttacked(passingX, kingY, opponentColor) ||
      this.board.isSquareAttacked(targetX, kingY, opponentColor)
    ) {
      return;
    }

    // Castling is valid, add the move
    this.addMovePossible({ x: targetX, y: kingY });
  }
}

import { Piece } from "./Piece";

export class Knight extends Piece {
  constructor(x: number, y: number, color: "black" | "white") {
    super("knight", x, y, color);
  }

  public calculateMoves(): void {
    // Reset possible moves
    this.movesPossible = [];

    // All possible knight moves (L-shaped)
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

    // Add valid moves
    // The knight can jump over pieces
    // But can't land on an ally piece
    for (const move of knightMoves) {
      if (this.board) {
        // Don't add if the square is occupied by an ally piece
        if (!this.board.isSquareOccupiedByAlly(move.x, move.y, this.color)) {
          this.addMovePossible(move);
        }
      } else {
        // If no board, add all moves (default behavior)
        this.addMovePossible(move);
      }
    }
  }
}

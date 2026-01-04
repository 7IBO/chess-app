import { Piece } from "./Piece";

export class Rook extends Piece {
  constructor(x: number, y: number, color: "black" | "white") {
    super("rook", x, y, color);
  }

  public calculateMoves(): void {
    this.movesPossible = [];
    this.canMoveHorizontally(8);
    this.canMoveVertically(8);
  }
}

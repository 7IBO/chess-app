import type { Board } from "./Board";
import { Piece } from "./Piece";

export class Rook extends Piece {
  constructor(x: number, y: number, color: "black" | "white") {
    super("rook", x, y, color);
  }

  public calculateMoves(board?: Board): void {
    this.movesPossible = [];
    this.canMoveHorizontally(8, board);
    this.canMoveVertically(8, board);
  }
}

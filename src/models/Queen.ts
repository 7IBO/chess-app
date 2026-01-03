import type { Board } from "./Board";
import { Piece } from "./Piece";

export class Queen extends Piece {
  constructor(x: number, y: number, color: "black" | "white") {
    super("queen", x, y, color);
  }

  public calculateMoves(board?: Board): void {
    this.movesPossible = [];
    this.canMoveDiagonally(8, board);
    this.canMoveHorizontally(8, board);
    this.canMoveVertically(8, board);
  }
}

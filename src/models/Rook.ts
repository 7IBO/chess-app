import { Piece } from "./Piece";

export class Rook extends Piece {
  constructor(x: number, y: number, color: "black" | "white") {
    super("rook", x, y, color);

    this.canMoveHorizontally(1);
    this.canMoveVertically(1);
  }
}

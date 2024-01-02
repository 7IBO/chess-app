import { Piece } from "./Piece";

export class King extends Piece {
  constructor(x: number, y: number, color: "black" | "white") {
    super("king", x, y, color);

    this.canMoveDiagonally(1);
    this.canMoveHorizontally(1);
    this.canMoveVertically(1);
  }
}

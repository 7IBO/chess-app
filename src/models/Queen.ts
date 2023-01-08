import { Piece } from "./Piece";

export class Queen extends Piece {
  constructor(x: number, y: number, color: "black" | "white") {
    super("queen", x, y, color);
    this.canMoveDiagonally = true;
    this.canMoveHorizontally = true;
    this.canMoveVertically = true;
  }
}

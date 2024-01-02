import { Piece } from "./Piece";

export class Bishop extends Piece {
  constructor(x: number, y: number, color: "black" | "white") {
    super("bishop", x, y, color);

    this.canMoveDiagonally();
  }
}

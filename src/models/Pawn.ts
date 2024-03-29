import { Piece } from "./Piece";

export class Pawn extends Piece {
  constructor(x: number, y: number, color: "black" | "white") {
    super("pawn", x, y, color);

    if (!this.hasMoved) {
      this.addMovePossible({
        x: this.position.x,
        y: this.color === "black" ? this.position.y + 2 : this.position.y - 2,
      });
    }
    this.addMovePossible({
      x: this.position.x,
      y: this.color === "black" ? this.position.y + 1 : this.position.y - 1,
    });
  }
}

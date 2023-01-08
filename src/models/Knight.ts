import { Piece } from "./Piece";

export class Knight extends Piece {
  constructor(x: number, y: number, color: "black" | "white") {
    super("knight", x, y, color);
  }
}

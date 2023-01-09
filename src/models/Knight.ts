import { Piece } from "./Piece";

export class Knight extends Piece {
  constructor(x: number, y: number, color: "black" | "white") {
    super("knight", x, y, color);
  }

  public getMovesPossible() {
    this.movesPossible = [];

    // TOP LEFT
    this.addMovePossible(this.position.x - 2, this.position.y - 1);
    this.addMovePossible(this.position.x - 1, this.position.y - 2);

    // TOP RIGHT
    this.addMovePossible(this.position.x + 2, this.position.y - 1);
    this.addMovePossible(this.position.x + 1, this.position.y - 2);

    // BOTTOM LEFT
    this.addMovePossible(this.position.x - 2, this.position.y + 1);
    this.addMovePossible(this.position.x - 1, this.position.y + 2);

    // BOTTOM RIGHT
    this.addMovePossible(this.position.x + 2, this.position.y + 1);
    this.addMovePossible(this.position.x + 1, this.position.y + 2);
  }
}

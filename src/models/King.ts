import { Piece } from "./Piece";

export class King extends Piece {
  constructor(x: number, y: number, color: "black" | "white") {
    super("king", x, y, color);
  }

  public getMovesPossible() {
    this.movesPossible = [];

    this.addMovePossible(this.position.x, this.position.y + 1);
    this.addMovePossible(this.position.x + 1, this.position.y);
    this.addMovePossible(this.position.x - 1, this.position.y);
    this.addMovePossible(this.position.x, this.position.y - 1);
    this.addMovePossible(this.position.x + 1, this.position.y + 1);
    this.addMovePossible(this.position.x + 1, this.position.y - 1);
    this.addMovePossible(this.position.x - 1, this.position.y + 1);
    this.addMovePossible(this.position.x - 1, this.position.y - 1);
  }
}

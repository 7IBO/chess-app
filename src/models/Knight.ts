import { Piece } from "./Piece";

export class Knight extends Piece {
  constructor(x: number, y: number, color: "black" | "white") {
    super("knight", x, y, color);

    // TOP LEFT
    this.addMovePossible({ x: this.position.x - 2, y: this.position.y - 1 });
    this.addMovePossible({ x: this.position.x - 1, y: this.position.y - 2 });

    // TOP RIGHT
    this.addMovePossible({ x: this.position.x + 2, y: this.position.y - 1 });
    this.addMovePossible({ x: this.position.x + 1, y: this.position.y - 2 });

    // BOTTOM LEFT
    this.addMovePossible({ x: this.position.x - 2, y: this.position.y + 1 });
    this.addMovePossible({ x: this.position.x - 1, y: this.position.y + 2 });

    // BOTTOM RIGHT
    this.addMovePossible({ x: this.position.x + 2, y: this.position.y + 1 });
    this.addMovePossible({ x: this.position.x + 1, y: this.position.y + 2 });
  }
}

export class Piece {
  public name: string = "";

  private x: number;
  private y: number;

  public color: "black" | "white";

  protected canMoveHorizontally: boolean = false;
  protected canMoveVertically: boolean = false;
  protected canMoveDiagonally: boolean = false;

  protected hasMoved: boolean;

  public movesPossible: { x: number; y: number }[];

  constructor(name: string, x: number, y: number, color: "black" | "white") {
    this.name = name;
    this.x = x;
    this.y = y;
    this.color = color;
    this.hasMoved = false;
    this.movesPossible = [];

    this.getMovesPossible();
  }

  move(x: number, y: number) {
    if (this.hasMovePossible(x, y)) {
      this.x = x;
      this.y = y;

      this.getMovesPossible();
      this.hasMoved = true;
    }
  }

  get position() {
    return { x: this.x, y: this.y };
  }

  get image() {
    return `${this.name}-${this.color}.png`;
  }

  protected addMovePossible(x: number, y: number) {
    if (
      !(this.position.x === x && this.position.y === y) &&
      this.movesPossible.indexOf({ x, y }) === -1 &&
      x >= 0 &&
      x <= 7 &&
      y >= 0 &&
      y <= 7
    ) {
      this.movesPossible.push({ x, y });
    }
  }

  public getMovesPossible() {
    this.movesPossible = [];

    if (this.canMoveVertically) {
      [...Array(8).keys()]
        .map((index) => ({ x: index, y: this.y }))
        .map((item) => {
          this.addMovePossible(item.x, item.y);
        });
    }

    if (this.canMoveHorizontally) {
      [...Array(8).keys()]
        .map((index) => ({ x: this.x, y: index }))
        .map((item) => {
          this.addMovePossible(item.x, item.y);
        });
    }

    if (this.canMoveDiagonally) {
      // BOTTOM LEFT DIAGONAL
      [...Array(8).keys()]
        .map((index) => ({ x: this.x - index, y: this.y + index }))
        .map((item) => {
          this.addMovePossible(item.x, item.y);
        });

      // BOTTOM RIGHT DIAGONAL
      [...Array(8).keys()]
        .map((index) => ({ x: index + this.x, y: index + this.y }))
        .map((item) => {
          this.addMovePossible(item.x, item.y);
        });

      // TOP RIGHT DIAGONAL
      [...Array(8).keys()]
        .map((index) => ({ x: this.x - index, y: this.y - index }))
        .map((item) => {
          this.addMovePossible(item.x, item.y);
        });

      // TOP LEFT DIAGONAL
      [...Array(8).keys()]
        .map((index) => ({ x: index + this.x, y: this.y - index }))
        .map((item) => {
          this.addMovePossible(item.x, item.y);
        });
    }
  }

  public hasMovePossible(x: number, y: number) {
    return !!this.movesPossible.some((move) => move.x === x && move.y === y);
  }
}

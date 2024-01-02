export class Piece {
  public name: string = "";

  private x: number;
  private y: number;

  public color: "black" | "white";

  protected canMoveDiagonally = (depth = 8) => {
    // BOTTOM LEFT DIAGONAL
    [...Array(depth).keys()]
      .map((index) => ({ x: this.x - index, y: this.y + index }))
      .map((item) => {
        this.addMovePossible(item);
      });

    // BOTTOM RIGHT DIAGONAL
    [...Array(depth).keys()]
      .map((index) => ({ x: index + this.x, y: index + this.y }))
      .map((item) => {
        this.addMovePossible(item);
      });

    // TOP RIGHT DIAGONAL
    [...Array(depth).keys()]
      .map((index) => ({ x: this.x - index, y: this.y - index }))
      .map((item) => {
        this.addMovePossible(item);
      });

    // TOP LEFT DIAGONAL
    [...Array(depth).keys()]
      .map((index) => ({ x: index + this.x, y: this.y - index }))
      .map((item) => {
        this.addMovePossible(item);
      });
  };

  protected canMoveHorizontally = (depth = 4) => {
    [...Array(depth).keys()]
      .map((index) => ({ x: this.x, y: this.y - index }))
      .map((item) => {
        this.addMovePossible(item);
      });

    [...Array(depth).keys()]
      .map((index) => ({ x: this.x, y: this.y + index }))
      .map((item) => {
        this.addMovePossible(item);
      });
  };

  protected canMoveVertically = (depth = 4) => {
    [...Array(depth).keys()]
      .map((index) => ({ x: this.x - index, y: this.y }))
      .map((item) => {
        this.addMovePossible(item);
      });

    [...Array(depth).keys()]
      .map((index) => ({ x: this.x + index, y: this.y }))
      .map((item) => {
        this.addMovePossible(item);
      });
  };

  protected hasMoved: boolean;

  public movesPossible: { x: number; y: number }[];

  protected constructor(
    name: string,
    x: number,
    y: number,
    color: "black" | "white"
  ) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.color = color;
    this.hasMoved = false;
    this.movesPossible = [];
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

  protected addMovePossible({ x, y }: { x: number; y: number }) {
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
    return this.movesPossible;
  }

  public hasMovePossible(x: number, y: number) {
    return !!this.movesPossible.some((move) => move.x === x && move.y === y);
  }
}

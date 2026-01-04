import { MAX_POSITION, MIN_POSITION } from "@/constants/chess.constants";
import type { Board } from "./Board";

export class Piece {
  public name: string = "";

  private x: number;
  private y: number;

  public color: "black" | "white";

  protected board?: Board;

  /**
   * Sets the board reference for this piece
   */
  setBoard(board: Board): void {
    this.board = board;
  }

  protected canMoveDiagonally(depth = 8): void {
    const directions = [
      { dx: -1, dy: 1 }, // BOTTOM LEFT
      { dx: 1, dy: 1 }, // BOTTOM RIGHT
      { dx: -1, dy: -1 }, // TOP LEFT
      { dx: 1, dy: -1 }, // TOP RIGHT
    ];

    this.addMovesInDirections(directions, depth);
  }

  protected canMoveHorizontally(depth = 8): void {
    const directions = [
      { dx: 0, dy: -1 }, // LEFT
      { dx: 0, dy: 1 }, // RIGHT
    ];

    this.addMovesInDirections(directions, depth);
  }

  protected canMoveVertically(depth = 8): void {
    const directions = [
      { dx: -1, dy: 0 }, // UP
      { dx: 1, dy: 0 }, // DOWN
    ];

    this.addMovesInDirections(directions, depth);
  }

  /**
   * Adds moves in the specified directions
   * Stops if a piece blocks the path
   */
  protected addMovesInDirections(directions: { dx: number; dy: number }[], depth: number): void {
    for (const { dx, dy } of directions) {
      for (let i = 1; i <= depth; i++) {
        const newX = this.x + dx * i;
        const newY = this.y + dy * i;

        // Out of board
        if (
          newX < MIN_POSITION ||
          newX > MAX_POSITION ||
          newY < MIN_POSITION ||
          newY > MAX_POSITION
        )
          break;

        if (this.board) {
          const pieceAtPosition = this.board.getPieceAt(newX, newY);

          if (pieceAtPosition) {
            // If it's an opponent piece, we can capture it
            if (pieceAtPosition.color !== this.color) {
              this.addMovePossible({ x: newX, y: newY });
            }
            break; // We can't go further in this direction
          }
        }

        this.addMovePossible({ x: newX, y: newY });
      }
    }
  }

  private _hasMoved: boolean;

  public movesPossible: { x: number; y: number }[];

  protected constructor(name: string, x: number, y: number, color: "black" | "white") {
    this.name = name;
    this.x = x;
    this.y = y;
    this.color = color;
    this._hasMoved = false;
    this.movesPossible = [];
  }

  move(x: number, y: number): void {
    this.x = x;
    this.y = y;
    this._hasMoved = true;
  }

  /**
   * Restores hasMoved state (used to undo simulated moves)
   */
  setHasMoved(value: boolean): void {
    this._hasMoved = value;
  }

  get position(): { x: number; y: number } {
    return { x: this.x, y: this.y };
  }

  get image(): string {
    return `${this.name}-${this.color}.png`;
  }

  get hasMoved(): boolean {
    return this._hasMoved;
  }

  /**
   * Calculates basic moves for the king (without castling)
   * Used to avoid infinite recursion when checking for attacks
   */
  public calculateBasicKingMoves(): void {
    if (this.name === "king") {
      this.movesPossible = [];
      this.canMoveDiagonally(1);
      this.canMoveHorizontally(1);
      this.canMoveVertically(1);
    }
  }

  protected addMovePossible({ x, y }: { x: number; y: number }): void {
    if (
      !(this.position.x === x && this.position.y === y) &&
      !this.movesPossible.some((move) => move.x === x && move.y === y) &&
      x >= MIN_POSITION &&
      x <= MAX_POSITION &&
      y >= MIN_POSITION &&
      y <= MAX_POSITION
    ) {
      this.movesPossible.push({ x, y });
    }
  }

  /**
   * Calculates possible moves for this piece
   * To be overridden in subclasses
   */
  public calculateMoves(): void {
    // By default, does nothing
    // Child classes override this method
  }

  public getMovesPossible(): { x: number; y: number }[] {
    return this.movesPossible;
  }

  public hasMovePossible(x: number, y: number): boolean {
    return !!this.movesPossible.some((move) => move.x === x && move.y === y);
  }
}

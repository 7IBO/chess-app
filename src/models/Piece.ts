import { MAX_POSITION, MIN_POSITION } from "@/constants/chess.constants";
import type { Board } from "./Board";

export class Piece {
  public name: string = "";

  private x: number;
  private y: number;

  public color: "black" | "white";

  protected canMoveDiagonally(depth = 8, board?: Board): void {
    const directions = [
      { dx: -1, dy: 1 }, // BOTTOM LEFT
      { dx: 1, dy: 1 }, // BOTTOM RIGHT
      { dx: -1, dy: -1 }, // TOP LEFT
      { dx: 1, dy: -1 }, // TOP RIGHT
    ];

    this.addMovesInDirections(directions, depth, board);
  }

  protected canMoveHorizontally(depth = 8, board?: Board): void {
    const directions = [
      { dx: 0, dy: -1 }, // LEFT
      { dx: 0, dy: 1 }, // RIGHT
    ];

    this.addMovesInDirections(directions, depth, board);
  }

  protected canMoveVertically(depth = 8, board?: Board): void {
    const directions = [
      { dx: -1, dy: 0 }, // UP
      { dx: 1, dy: 0 }, // DOWN
    ];

    this.addMovesInDirections(directions, depth, board);
  }

  /**
   * Ajoute les mouvements dans les directions spécifiées
   * S'arrête si une pièce bloque le chemin
   */
  protected addMovesInDirections(
    directions: { dx: number; dy: number }[],
    depth: number,
    board?: Board
  ): void {
    for (const { dx, dy } of directions) {
      for (let i = 1; i <= depth; i++) {
        const newX = this.x + dx * i;
        const newY = this.y + dy * i;

        // Sortie du plateau
        if (
          newX < MIN_POSITION ||
          newX > MAX_POSITION ||
          newY < MIN_POSITION ||
          newY > MAX_POSITION
        )
          break;

        if (board) {
          const pieceAtPosition = board.getPieceAt(newX, newY);

          if (pieceAtPosition) {
            // Si c'est une pièce adverse, on peut la capturer
            if (pieceAtPosition.color !== this.color) {
              this.addMovePossible({ x: newX, y: newY });
            }
            break; // On ne peut pas aller plus loin dans cette direction
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
   * Restaure l'état hasMoved (utilisé pour annuler des mouvements simulés)
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
   * Calcule les mouvements de base pour le roi (sans roque)
   * Utilisé pour éviter la récursion infinie lors de la vérification d'attaque
   */
  public calculateBasicKingMoves(board?: Board): void {
    if (this.name === "king") {
      this.movesPossible = [];
      this.canMoveDiagonally(1, board);
      this.canMoveHorizontally(1, board);
      this.canMoveVertically(1, board);
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
   * Calcule les mouvements possibles pour cette pièce
   * À surcharger dans les classes filles
   */
  public calculateMoves(_board?: Board): void {
    // Par défaut, ne fait rien
    // Les classes filles surchargent cette méthode
  }

  public getMovesPossible(): { x: number; y: number }[] {
    return this.movesPossible;
  }

  public hasMovePossible(x: number, y: number): boolean {
    return !!this.movesPossible.some((move) => move.x === x && move.y === y);
  }
}

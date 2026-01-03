import type { Piece } from "./Piece";

export class Pieces {
  private pieces: Piece[];

  constructor(pieces: Piece[] = []) {
    this.pieces = pieces;
  }

  getAll(): Piece[] {
    return this.pieces;
  }

  get(x: number, y: number): Piece | undefined {
    return this.pieces.find((piece) => piece.position.x === x && piece.position.y === y);
  }

  add(piece: Piece): void {
    this.pieces.push(piece);
  }

  remove(piece: Piece): void {
    this.pieces = this.pieces.filter((p) => p !== piece);
  }

  removeAt(x: number, y: number): void {
    this.pieces = this.pieces.filter(
      (piece) => !(piece.position.x === x && piece.position.y === y)
    );
  }
}

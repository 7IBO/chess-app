import type { Board } from "./Board";
import { Piece } from "./Piece";

export class King extends Piece {
  constructor(x: number, y: number, color: "black" | "white") {
    super("king", x, y, color);
  }

  public calculateMoves(board?: Board): void {
    this.movesPossible = [];
    this.canMoveDiagonally(1, board);
    this.canMoveHorizontally(1, board);
    this.canMoveVertically(1, board);

    // Ajouter les mouvements de roque si possible
    if (board) {
      this.addCastlingMoves(board);
    }
  }

  /**
   * Ajoute les mouvements de roque (castling) si les conditions sont respectées
   */
  private addCastlingMoves(board: Board): void {
    // Ne peut pas roquer si le roi a déjà bougé ou est en échec
    if (this.hasMoved || board.isKingInCheck(this.color)) {
      return;
    }

    const y = this.position.y;
    const x = this.position.x;

    // Petit roque (kingside castling) - vers la droite
    this.checkCastling(board, x, y, 7, 1);

    // Grand roque (queenside castling) - vers la gauche
    this.checkCastling(board, x, y, 0, -1);
  }

  /**
   * Vérifie si le roque est possible dans une direction
   */
  private checkCastling(
    board: Board,
    kingX: number,
    kingY: number,
    rookX: number,
    direction: number
  ): void {
    const rook = board.getPieceAt(rookX, kingY);

    // Vérifier que la tour existe, n'a pas bougé et est de la même couleur
    if (!rook || rook.name !== "rook" || rook.hasMoved || rook.color !== this.color) {
      return;
    }

    // Vérifier que le chemin est libre entre le roi et la tour
    const start = Math.min(kingX, rookX) + 1;
    const end = Math.max(kingX, rookX);

    for (let x = start; x < end; x++) {
      if (board.isSquareOccupied(x, kingY)) {
        return;
      }
    }

    // Vérifier que le roi ne passe pas par une case attaquée
    const targetX = kingX + direction * 2;
    const passingX = kingX + direction;

    const opponentColor = this.color === "white" ? "black" : "white";

    if (
      board.isSquareAttacked(passingX, kingY, opponentColor) ||
      board.isSquareAttacked(targetX, kingY, opponentColor)
    ) {
      return;
    }

    // Le roque est valide, ajouter le mouvement
    this.addMovePossible({ x: targetX, y: kingY });
  }
}

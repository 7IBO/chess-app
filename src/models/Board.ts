import {
  BLACK_PROMOTION_RANK,
  CASTLING_KING_MOVE_DISTANCE,
  EN_PASSANT_PAWN_MOVE_DISTANCE,
  MAX_POSITION,
  MIN_POSITION,
  WHITE_PROMOTION_RANK,
} from "@/constants/chess.constants";
import { createInitialPieces } from "@/data/pieces";
import { Bishop } from "@/models/Bishop";
import { Knight } from "@/models/Knight";
import { Queen } from "@/models/Queen";
import { Rook } from "@/models/Rook";
import type { CapturedPieces, Move, PieceName } from "@/types/chess.types";
import type { Piece } from "./Piece";
import type { Pieces } from "./Pieces";

export class Board {
  private pieces: Pieces;
  private currentPlayer: "white" | "black";
  private lastMove: {
    piece: Piece;
    from: { x: number; y: number };
    to: { x: number; y: number };
  } | null = null;
  private pendingPromotion: { pawn: Piece; x: number; y: number } | null = null;
  private moveHistory: Move[] = [];
  private moveHistoryIndex: number = -1; // Index pour undo/redo
  private capturedPieces: CapturedPieces = {
    white: [],
    black: [],
  };

  constructor(pieces: Pieces) {
    this.pieces = pieces;
    this.currentPlayer = "white"; // Les blancs commencent
  }

  /**
   * Récupère le joueur actuel
   */
  getCurrentPlayer(): "white" | "black" {
    return this.currentPlayer;
  }

  /**
   * Récupère le dernier mouvement effectué
   */
  getLastMove() {
    return this.lastMove;
  }

  /**
   * Récupère la promotion en attente
   */
  getPendingPromotion() {
    return this.pendingPromotion;
  }

  /**
   * Récupère l'historique des mouvements
   */
  getMoveHistory(): Move[] {
    return this.moveHistory;
  }

  /**
   * Récupère les pièces capturées
   */
  getCapturedPieces(): CapturedPieces {
    return this.capturedPieces;
  }

  /**
   * Change de joueur
   */
  private switchPlayer(): void {
    this.currentPlayer = this.currentPlayer === "white" ? "black" : "white";
  }

  /**
   * Récupère toutes les pièces sur le plateau
   */
  getAllPieces(): Piece[] {
    return this.pieces.getAll();
  }

  /**
   * Récupère une pièce à une position donnée
   */
  getPieceAt(x: number, y: number): Piece | undefined {
    return this.pieces.get(x, y);
  }

  /**
   * Vérifie si une case est occupée
   */
  isSquareOccupied(x: number, y: number): boolean {
    return !!this.pieces.get(x, y);
  }

  /**
   * Vérifie si une case est occupée par une pièce adverse
   */
  isSquareOccupiedByOpponent(x: number, y: number, color: "black" | "white"): boolean {
    const piece = this.pieces.get(x, y);
    return !!piece && piece.color !== color;
  }

  /**
   * Vérifie si une case est occupée par une pièce alliée
   */
  isSquareOccupiedByAlly(x: number, y: number, color: "black" | "white"): boolean {
    const piece = this.pieces.get(x, y);
    return !!piece && piece.color === color;
  }

  /**
   * Calcule les mouvements valides pour une pièce donnée
   */
  getValidMoves(piece: Piece): { x: number; y: number }[] {
    // Chaque pièce définit ses mouvements possibles
    const possibleMoves = piece.getMovesPossible();

    // Le Board filtre selon les règles (collisions, captures, échec, etc.)
    return possibleMoves.filter(({ x, y }) => {
      // Vérifier que la case n'est pas occupée par une pièce alliée
      if (this.isSquareOccupiedByAlly(x, y, piece.color)) {
        return false;
      }

      // Vérifier que le mouvement ne met pas son propre roi en échec
      if (this.wouldMovePutKingInCheck(piece, x, y)) {
        return false;
      }

      return true;
    });
  }

  /**
   * Déplace une pièce vers une nouvelle position
   */
  movePiece(piece: Piece, x: number, y: number): boolean {
    // Vérifier que c'est le tour du joueur
    if (piece.color !== this.currentPlayer) {
      return false;
    }

    const validMoves = this.getValidMoves(piece);
    const isValidMove = validMoves.some((move) => move.x === x && move.y === y);

    if (!isValidMove) {
      return false;
    }

    // Sauvegarder la position de départ pour l'historique
    const fromX = piece.position.x;
    const fromY = piece.position.y;

    // Si un nouveau mouvement est fait après avoir annulé, supprimer l'historique après l'index actuel
    if (this.moveHistoryIndex < this.moveHistory.length - 1) {
      this.moveHistory = this.moveHistory.slice(0, this.moveHistoryIndex + 1);
    }

    // Gérer le roque (castling)
    if (piece.name === "king" && Math.abs(x - piece.position.x) === CASTLING_KING_MOVE_DISTANCE) {
      this.handleCastling(piece, x, y);
      this.lastMove = { piece, from: { x: fromX, y: fromY }, to: { x, y } };
      this.moveHistory.push({
        piece: piece.name as PieceName,
        color: piece.color,
        from: { x: fromX, y: fromY },
        to: { x, y },
        castling: true,
      });
      this.moveHistoryIndex = this.moveHistory.length - 1;
      this.switchPlayer();
      return true;
    }

    // Gérer la prise en passant
    if (piece.name === "pawn" && this.isEnPassantCapture(piece, x, y)) {
      const capturedPawn = this.handleEnPassant(piece, x, y);
      if (capturedPawn) {
        this.capturedPieces[capturedPawn.color].push(capturedPawn.name as PieceName);
      }
      this.lastMove = { piece, from: { x: fromX, y: fromY }, to: { x, y } };
      this.moveHistory.push({
        piece: piece.name as PieceName,
        color: piece.color,
        from: { x: fromX, y: fromY },
        to: { x, y },
        captured: true,
        enPassant: true,
      });
      this.moveHistoryIndex = this.moveHistory.length - 1;
      this.switchPlayer();
      return true;
    }

    // Capturer la pièce adverse si présente
    const targetPiece = this.pieces.get(x, y);
    const captured = !!targetPiece && targetPiece.color !== piece.color;
    if (captured) {
      this.capturedPieces[targetPiece?.color].push(targetPiece?.name as PieceName);
      this.pieces.remove(targetPiece!);
    }

    // Déplacer la pièce
    piece.move(x, y);

    // Enregistrer le mouvement
    this.lastMove = { piece, from: { x: fromX, y: fromY }, to: { x, y } };

    // Vérifier la promotion du pion
    if (piece.name === "pawn" && (y === WHITE_PROMOTION_RANK || y === BLACK_PROMOTION_RANK)) {
      this.pendingPromotion = { pawn: piece, x, y };
      // Ajouter à l'historique (le type de promotion sera ajouté après)
      this.moveHistory.push({
        piece: piece.name as PieceName,
        color: piece.color,
        from: { x: fromX, y: fromY },
        to: { x, y },
        captured,
      });
      this.moveHistoryIndex = this.moveHistory.length - 1;
      // Ne pas changer de joueur encore, attendre la promotion
      return true;
    }

    // Ajouter à l'historique
    this.moveHistory.push({
      piece: piece.name as PieceName,
      color: piece.color,
      from: { x: fromX, y: fromY },
      to: { x, y },
      captured,
    });
    this.moveHistoryIndex = this.moveHistory.length - 1;

    // Changer de joueur
    this.switchPlayer();

    return true;
  }

  /**
   * Promeut un pion en une autre pièce
   */
  promotePawn(pieceType: "queen" | "rook" | "bishop" | "knight"): boolean {
    if (!this.pendingPromotion) return false;

    const { pawn, x, y } = this.pendingPromotion;

    // Retirer le pion
    this.pieces.remove(pawn);

    // Créer la nouvelle pièce
    let newPiece: Piece;
    switch (pieceType) {
      case "queen":
        newPiece = new Queen(x, y, pawn.color);
        break;
      case "rook":
        newPiece = new Rook(x, y, pawn.color);
        break;
      case "bishop":
        newPiece = new Bishop(x, y, pawn.color);
        break;
      case "knight":
        newPiece = new Knight(x, y, pawn.color);
        break;
      default:
        // Par défaut, promouvoir en dame
        newPiece = new Queen(x, y, pawn.color);
        break;
    }

    // Ajouter la nouvelle pièce
    this.pieces.add(newPiece);

    // Mettre à jour l'historique avec le type de promotion
    if (this.moveHistory.length > 0) {
      const lastMove = this.moveHistory[this.moveHistory.length - 1];
      lastMove.promotion = pieceType;
    }

    // Réinitialiser la promotion en attente
    this.pendingPromotion = null;

    // Changer de joueur
    this.switchPlayer();

    return true;
  }

  /**
   * Gère le mouvement de roque
   */
  private handleCastling(king: Piece, kingX: number, kingY: number): void {
    const direction = kingX > king.position.x ? 1 : -1;
    const rookX = direction === 1 ? MAX_POSITION : MIN_POSITION;
    const newRookX = kingX - direction;

    // Récupérer la tour
    const rook = this.pieces.get(rookX, kingY);

    if (rook) {
      // Déplacer le roi
      king.move(kingX, kingY);

      // Déplacer la tour
      rook.move(newRookX, kingY);
    }
  }

  /**
   * Vérifie si un mouvement est une prise en passant
   */
  private isEnPassantCapture(pawn: Piece, toX: number, toY: number): boolean {
    if (!this.lastMove) return false;

    const { piece: lastPiece, from: lastFrom, to: lastTo } = this.lastMove;

    // Le dernier mouvement doit être un pion qui a avancé de 2 cases
    if (
      lastPiece.name !== "pawn" ||
      Math.abs(lastTo.y - lastFrom.y) !== EN_PASSANT_PAWN_MOVE_DISTANCE
    ) {
      return false;
    }

    // Le pion capturant doit être à côté du pion adverse
    if (pawn.position.y !== lastTo.y || Math.abs(pawn.position.x - lastTo.x) !== 1) {
      return false;
    }

    // La case cible doit être derrière le pion adverse
    const direction = pawn.color === "white" ? -1 : 1;
    return toX === lastTo.x && toY === lastTo.y + direction;
  }

  /**
   * Gère la prise en passant
   */
  private handleEnPassant(pawn: Piece, toX: number, toY: number): Piece | undefined {
    if (!this.lastMove) return;

    const { to: lastTo } = this.lastMove;

    // Retirer le pion capturé (qui est sur la même rangée que le pion capturant)
    const capturedPawn = this.pieces.get(lastTo.x, lastTo.y);
    if (capturedPawn) {
      this.pieces.remove(capturedPawn);
    }

    // Déplacer le pion capturant
    pawn.move(toX, toY);

    return capturedPawn;
  }

  /**
   * Vérifie si le chemin est libre (pour les pièces qui se déplacent en ligne)
   */
  isPathClear(fromX: number, fromY: number, toX: number, toY: number): boolean {
    const dx = Math.sign(toX - fromX);
    const dy = Math.sign(toY - fromY);

    let x = fromX + dx;
    let y = fromY + dy;

    while (x !== toX || y !== toY) {
      if (this.isSquareOccupied(x, y)) {
        return false;
      }
      x += dx;
      y += dy;
    }

    return true;
  }

  /**
   * Trouve le roi d'une couleur donnée
   */
  findKing(color: "white" | "black"): Piece | undefined {
    return this.pieces.getAll().find((piece) => piece.name === "king" && piece.color === color);
  }

  /**
   * Vérifie si une case est attaquée par une couleur donnée
   */
  isSquareAttacked(
    x: number,
    y: number,
    byColor: "white" | "black",
    ignoreKingCastling: boolean = true
  ): boolean {
    const attackers = this.pieces.getAll().filter((piece) => piece.color === byColor);

    for (const attacker of attackers) {
      // Pour éviter la récursion infinie, ne pas calculer le roque lors de la vérification d'attaque
      if (attacker.name === "king" && ignoreKingCastling) {
        // Calculer uniquement les mouvements de base du roi (sans roque)
        attacker.calculateBasicKingMoves(this);
      } else {
        // Calculer les mouvements possibles de l'attaquant
        attacker.calculateMoves(this);
      }

      const moves = attacker.getMovesPossible();

      // Vérifier si la case (x, y) est dans les mouvements possibles
      if (moves.some((move) => move.x === x && move.y === y)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Vérifie si le roi d'une couleur est en échec
   */
  isKingInCheck(color: "white" | "black"): boolean {
    const king = this.findKing(color);
    if (!king) return false;

    const opponentColor = color === "white" ? "black" : "white";
    return this.isSquareAttacked(king.position.x, king.position.y, opponentColor);
  }

  /**
   * Vérifie si un mouvement met son propre roi en échec
   */
  private wouldMovePutKingInCheck(piece: Piece, toX: number, toY: number): boolean {
    const fromX = piece.position.x;
    const fromY = piece.position.y;
    const hadMoved = piece.hasMoved; // Sauvegarder l'état hasMoved

    // Sauvegarder la pièce capturée (si elle existe)
    const capturedPiece = this.pieces.get(toX, toY);

    try {
      // Simuler le mouvement
      if (capturedPiece) {
        this.pieces.remove(capturedPiece);
      }
      piece.move(toX, toY);

      // Vérifier si le roi est en échec
      return this.isKingInCheck(piece.color);
    } finally {
      // Toujours annuler le mouvement même en cas d'exception
      piece.move(fromX, fromY);
      piece.setHasMoved(hadMoved); // Restaurer l'état hasMoved
      if (capturedPiece) {
        this.pieces.add(capturedPiece);
      }
    }
  }

  /**
   * Vérifie si c'est échec et mat pour une couleur donnée
   */
  isCheckmate(color: "white" | "black"): boolean {
    // Vérifier d'abord si le roi est en échec
    if (!this.isKingInCheck(color)) {
      return false;
    }

    // Vérifier si au moins un mouvement valide existe
    const pieces = this.pieces.getAll().filter((p) => p.color === color);

    for (const piece of pieces) {
      piece.calculateMoves(this);
      const validMoves = this.getValidMoves(piece);

      if (validMoves.length > 0) {
        return false; // Il existe au moins un mouvement valide
      }
    }

    return true; // Aucun mouvement valide, c'est échec et mat
  }

  /**
   * Vérifie si c'est pat (stalemate) pour une couleur donnée
   */
  isStalemate(color: "white" | "black"): boolean {
    // Le roi n'est PAS en échec mais aucun mouvement valide n'est possible
    if (this.isKingInCheck(color)) {
      return false;
    }

    const pieces = this.pieces.getAll().filter((p) => p.color === color);

    for (const piece of pieces) {
      piece.calculateMoves(this);
      const validMoves = this.getValidMoves(piece);

      if (validMoves.length > 0) {
        return false; // Il existe au moins un mouvement valide
      }
    }

    return true; // Aucun mouvement valide et pas en échec, c'est pat
  }

  /**
   * Rejoue un mouvement depuis l'historique pour restaurer l'état
   */
  replayMove(move: Move): boolean {
    const piece = this.pieces.get(move.from.x, move.from.y);

    if (!piece) {
      console.error(`No piece found at ${move.from.x}, ${move.from.y}`);
      return false;
    }

    // Vérifier que la pièce correspond
    if (piece.name !== move.piece || piece.color !== move.color) {
      console.error(`Piece mismatch at ${move.from.x}, ${move.from.y}`);
      return false;
    }

    // Rejouer le mouvement
    const success = this.movePiece(piece, move.to.x, move.to.y);

    // Gérer la promotion si nécessaire
    if (success && move.promotion && this.pendingPromotion) {
      this.promotePawn(move.promotion as "queen" | "rook" | "bishop" | "knight");
    }

    return success;
  }

  /**
   * Restaure l'état du plateau à partir d'un historique de mouvements
   */
  restoreFromHistory(moves: Move[]): void {
    // Réinitialiser complètement le board avec de nouvelles pièces fraîches
    this.pieces = createInitialPieces();
    this.moveHistory = [];
    this.capturedPieces = { white: [], black: [] };
    this.lastMove = null;
    this.pendingPromotion = null;
    this.currentPlayer = "white";

    // Recalculer les mouvements pour les nouvelles pièces
    this.getAllPieces().forEach((piece) => piece.calculateMoves(this));

    // Rejouer chaque mouvement
    for (const move of moves) {
      this.replayMove(move);
    }

    // Recalculer les mouvements possibles pour toutes les pièces après restauration
    this.getAllPieces().forEach((piece) => piece.calculateMoves(this));
  }

  /**
   * Annule le dernier mouvement
   */
  undoMove(): boolean {
    if (this.moveHistoryIndex < 0) return false;

    // Réduire l'index
    this.moveHistoryIndex--;

    // Sauvegarder l'historique complet
    const fullHistory = [...this.moveHistory];

    // Restaurer l'état à partir de l'historique tronqué
    const movesToReplay = fullHistory.slice(0, this.moveHistoryIndex + 1);
    this.restoreFromHistory(movesToReplay);

    // Restaurer l'historique complet
    this.moveHistory = fullHistory;

    return true;
  }

  /**
   * Refait le mouvement annulé
   */
  redoMove(): boolean {
    if (this.moveHistoryIndex >= this.moveHistory.length - 1) return false;

    // Augmenter l'index
    this.moveHistoryIndex++;

    // Sauvegarder l'historique complet
    const fullHistory = [...this.moveHistory];

    // Rejouer le mouvement suivant
    const nextMove = fullHistory[this.moveHistoryIndex];
    const success = this.replayMove(nextMove);

    // Restaurer l'historique complet
    this.moveHistory = fullHistory;

    return success;
  }

  /**
   * Vérifie si on peut annuler
   */
  canUndo(): boolean {
    return this.moveHistoryIndex >= 0;
  }

  /**
   * Vérifie si on peut refaire
   */
  canRedo(): boolean {
    return this.moveHistoryIndex < this.moveHistory.length - 1;
  }
}

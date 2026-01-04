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
  private moveHistoryIndex: number = -1; // Index for undo/redo
  private capturedPieces: CapturedPieces = {
    white: [],
    black: [],
  };

  constructor(pieces: Pieces) {
    this.pieces = pieces;
    this.currentPlayer = "white"; // White moves first

    // Set board reference on all pieces
    for (const piece of this.pieces.getAll()) {
      piece.setBoard(this);
    }
  }

  /**
   * Gets the current player
   */
  getCurrentPlayer(): "white" | "black" {
    return this.currentPlayer;
  }

  /**
   * Gets the last move made
   */
  getLastMove() {
    return this.lastMove;
  }

  /**
   * Gets the pending promotion
   */
  getPendingPromotion() {
    return this.pendingPromotion;
  }

  /**
   * Gets the move history
   */
  getMoveHistory(): Move[] {
    return this.moveHistory;
  }

  /**
   * Gets the captured pieces
   */
  getCapturedPieces(): CapturedPieces {
    return this.capturedPieces;
  }

  /**
   * Switches the player
   */
  private switchPlayer(): void {
    this.currentPlayer = this.currentPlayer === "white" ? "black" : "white";
  }

  /**
   * Gets all pieces on the board
   */
  getAllPieces(): Piece[] {
    return this.pieces.getAll();
  }

  /**
   * Gets a piece at a given position
   */
  getPieceAt(x: number, y: number): Piece | undefined {
    return this.pieces.get(x, y);
  }

  /**
   * Checks if a square is occupied
   */
  isSquareOccupied(x: number, y: number): boolean {
    return !!this.pieces.get(x, y);
  }

  /**
   * Checks if a square is occupied by an opponent piece
   */
  isSquareOccupiedByOpponent(x: number, y: number, color: "black" | "white"): boolean {
    const piece = this.pieces.get(x, y);
    return !!piece && piece.color !== color;
  }

  /**
   * Checks if a square is occupied by an ally piece
   */
  isSquareOccupiedByAlly(x: number, y: number, color: "black" | "white"): boolean {
    const piece = this.pieces.get(x, y);
    return !!piece && piece.color === color;
  }

  /**
   * Calculates valid moves for a given piece
   */
  getValidMoves(piece: Piece): { x: number; y: number }[] {
    // Each piece defines its possible moves
    const possibleMoves = piece.getMovesPossible();

    // The Board filters according to the rules (collisions, captures, check, etc.)
    return possibleMoves.filter(({ x, y }) => {
      // Check that the square is not occupied by an ally piece
      if (this.isSquareOccupiedByAlly(x, y, piece.color)) {
        return false;
      }

      // Check that the move does not put its own king in check
      if (this.wouldMovePutKingInCheck(piece, x, y)) {
        return false;
      }

      return true;
    });
  }

  /**
   * Moves a piece to a new position
   */
  movePiece(piece: Piece, x: number, y: number): boolean {
    // Check that it's the player's turn
    if (piece.color !== this.currentPlayer) {
      return false;
    }

    const validMoves = this.getValidMoves(piece);
    const isValidMove = validMoves.some((move) => move.x === x && move.y === y);

    if (!isValidMove) {
      return false;
    }

    // Save the starting position for the history
    const fromX = piece.position.x;
    const fromY = piece.position.y;

    // If a new move is made after undoing, delete the history after the current index
    if (this.moveHistoryIndex < this.moveHistory.length - 1) {
      this.moveHistory = this.moveHistory.slice(0, this.moveHistoryIndex + 1);
    }

    // Handle castling
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

    // Handle en passant
    if (piece.name === "pawn" && this.isEnPassantCapture(piece, x, y)) {
      const capturedPawn = this.handleEnPassant(piece, x, y);
      if (capturedPawn) {
        this.capturedPieces[capturedPawn.color].push({
          piece: capturedPawn.name as PieceName,
          id: crypto.randomUUID(),
        });
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

    // Capture the opponent piece if present
    const targetPiece = this.pieces.get(x, y);
    const captured = !!targetPiece && targetPiece.color !== piece.color;
    if (captured && targetPiece) {
      this.capturedPieces[targetPiece.color].push({
        piece: targetPiece.name as PieceName,
        id: crypto.randomUUID(),
      });
      this.pieces.remove(targetPiece);
    }

    // Move the piece
    piece.move(x, y);

    // Record the move
    this.lastMove = { piece, from: { x: fromX, y: fromY }, to: { x, y } };

    // Check for pawn promotion
    if (piece.name === "pawn" && (y === WHITE_PROMOTION_RANK || y === BLACK_PROMOTION_RANK)) {
      this.pendingPromotion = { pawn: piece, x, y };
      // Add to history (promotion type will be added later)
      this.moveHistory.push({
        piece: piece.name as PieceName,
        color: piece.color,
        from: { x: fromX, y: fromY },
        to: { x, y },
        captured,
      });
      this.moveHistoryIndex = this.moveHistory.length - 1;
      // Don't switch players yet, wait for promotion
      return true;
    }

    // Add to history
    this.moveHistory.push({
      piece: piece.name as PieceName,
      color: piece.color,
      from: { x: fromX, y: fromY },
      to: { x, y },
      captured,
    });
    this.moveHistoryIndex = this.moveHistory.length - 1;

    // Switch player
    this.switchPlayer();

    return true;
  }

  /**
   * Promotes a pawn to another piece
   */
  promotePawn(pieceType: "queen" | "rook" | "bishop" | "knight"): boolean {
    if (!this.pendingPromotion) return false;

    const { pawn, x, y } = this.pendingPromotion;

    // Remove the pawn
    this.pieces.remove(pawn);

    // Create the new piece
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
        // By default, promote to queen
        newPiece = new Queen(x, y, pawn.color);
        break;
    }

    // Add the new piece
    this.pieces.add(newPiece);

    // Set board reference on the new piece
    newPiece.setBoard(this);

    // Update history with promotion type
    if (this.moveHistory.length > 0) {
      const lastMove = this.moveHistory[this.moveHistory.length - 1];
      lastMove.promotion = pieceType;
    }

    // Reset pending promotion
    this.pendingPromotion = null;

    // Switch player
    this.switchPlayer();

    return true;
  }

  /**
   * Handles castling move
   */
  private handleCastling(king: Piece, kingX: number, kingY: number): void {
    const direction = kingX > king.position.x ? 1 : -1;
    const rookX = direction === 1 ? MAX_POSITION : MIN_POSITION;
    const newRookX = kingX - direction;

    // Get the rook
    const rook = this.pieces.get(rookX, kingY);

    if (rook) {
      // Move the king
      king.move(kingX, kingY);

      // Move the rook
      rook.move(newRookX, kingY);
    }
  }

  /**
   * Checks if a move is an en passant capture
   */
  private isEnPassantCapture(pawn: Piece, toX: number, toY: number): boolean {
    if (!this.lastMove) return false;

    const { piece: lastPiece, from: lastFrom, to: lastTo } = this.lastMove;

    // The last move must be a pawn that advanced 2 squares
    if (
      lastPiece.name !== "pawn" ||
      Math.abs(lastTo.y - lastFrom.y) !== EN_PASSANT_PAWN_MOVE_DISTANCE
    ) {
      return false;
    }

    // The capturing pawn must be next to the opponent pawn
    if (pawn.position.y !== lastTo.y || Math.abs(pawn.position.x - lastTo.x) !== 1) {
      return false;
    }

    // The target square must be behind the opponent pawn
    const direction = pawn.color === "white" ? -1 : 1;
    return toX === lastTo.x && toY === lastTo.y + direction;
  }

  /**
   * Handles en passant
   */
  private handleEnPassant(pawn: Piece, toX: number, toY: number): Piece | undefined {
    if (!this.lastMove) return;

    const { to: lastTo } = this.lastMove;

    // Remove the captured pawn (which is on the same rank as the capturing pawn)
    const capturedPawn = this.pieces.get(lastTo.x, lastTo.y);
    if (capturedPawn) {
      this.pieces.remove(capturedPawn);
    }

    // Move the capturing pawn
    pawn.move(toX, toY);

    return capturedPawn;
  }

  /**
   * Checks if the path is clear (for pieces that move in straight lines)
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
   * Finds the king of a given color
   */
  findKing(color: "white" | "black"): Piece | undefined {
    return this.pieces.getAll().find((piece) => piece.name === "king" && piece.color === color);
  }

  /**
   * Checks if a square is attacked by a given color
   */
  isSquareAttacked(
    x: number,
    y: number,
    byColor: "white" | "black",
    ignoreKingCastling: boolean = true
  ): boolean {
    const attackers = this.pieces.getAll().filter((piece) => piece.color === byColor);

    for (const attacker of attackers) {
      // To avoid infinite recursion, don't calculate castling when checking for attacks
      if (attacker.name === "king" && ignoreKingCastling) {
        // Calculate only basic king moves (without castling)
        attacker.calculateBasicKingMoves();
      } else {
        // Calculate possible moves of the attacker
        attacker.calculateMoves();
      }

      const moves = attacker.getMovesPossible();

      // Check if square (x, y) is in the possible moves
      if (moves.some((move) => move.x === x && move.y === y)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Checks if the king of a color is in check
   */
  isKingInCheck(color: "white" | "black"): boolean {
    const king = this.findKing(color);
    if (!king) return false;

    const opponentColor = color === "white" ? "black" : "white";
    return this.isSquareAttacked(king.position.x, king.position.y, opponentColor);
  }

  /**
   * Checks if a move puts its own king in check
   */
  private wouldMovePutKingInCheck(piece: Piece, toX: number, toY: number): boolean {
    const fromX = piece.position.x;
    const fromY = piece.position.y;
    const hadMoved = piece.hasMoved; // Save hasMoved state

    // Save the captured piece (if it exists)
    const capturedPiece = this.pieces.get(toX, toY);

    try {
      // Simulate the move
      if (capturedPiece) {
        this.pieces.remove(capturedPiece);
      }
      piece.move(toX, toY);

      // Check if the king is in check
      return this.isKingInCheck(piece.color);
    } finally {
      // Always undo the move even in case of exception
      piece.move(fromX, fromY);
      piece.setHasMoved(hadMoved); // Restore hasMoved state
      if (capturedPiece) {
        this.pieces.add(capturedPiece);
      }
    }
  }

  /**
   * Checks if it's checkmate for a given color
   */
  isCheckmate(color: "white" | "black"): boolean {
    // First check if the king is in check
    if (!this.isKingInCheck(color)) {
      return false;
    }

    // Check if at least one valid move exists
    const pieces = this.pieces.getAll().filter((p) => p.color === color);

    for (const piece of pieces) {
      piece.calculateMoves();
      const validMoves = this.getValidMoves(piece);

      if (validMoves.length > 0) {
        return false; // There is at least one valid move
      }
    }

    return true; // No valid move, it's checkmate
  }

  /**
   * Checks if it's stalemate for a given color
   */
  isStalemate(color: "white" | "black"): boolean {
    // The king is NOT in check but no valid move is possible
    if (this.isKingInCheck(color)) {
      return false;
    }

    const pieces = this.pieces.getAll().filter((p) => p.color === color);

    for (const piece of pieces) {
      piece.calculateMoves();
      const validMoves = this.getValidMoves(piece);

      if (validMoves.length > 0) {
        return false; // There is at least one valid move
      }
    }

    return true; // No valid move and not in check, it's stalemate
  }

  /**
   * Replays a move from history to restore state
   */
  replayMove(move: Move): boolean {
    const piece = this.pieces.get(move.from.x, move.from.y);

    if (!piece) {
      console.error(`No piece found at ${move.from.x}, ${move.from.y}`);
      return false;
    }

    // Check that the piece matches
    if (piece.name !== move.piece || piece.color !== move.color) {
      console.error(`Piece mismatch at ${move.from.x}, ${move.from.y}`);
      return false;
    }

    // Replay the move
    const success = this.movePiece(piece, move.to.x, move.to.y);

    // Handle promotion if necessary
    if (success && move.promotion && this.pendingPromotion) {
      this.promotePawn(move.promotion as "queen" | "rook" | "bishop" | "knight");
    }

    return success;
  }

  /**
   * Restores the board state from a move history
   */
  restoreFromHistory(moves: Move[]): void {
    // Completely reset the board with fresh new pieces
    this.pieces = createInitialPieces();
    this.moveHistory = [];
    this.capturedPieces = { white: [], black: [] };
    this.lastMove = null;
    this.pendingPromotion = null;
    this.currentPlayer = "white";

    // Set board reference on all fresh pieces
    for (const piece of this.getAllPieces()) {
      piece.setBoard(this);
    }

    // Recalculate moves for new pieces
    for (const piece of this.getAllPieces()) {
      piece.calculateMoves();
    }

    // Replay each move
    for (const move of moves) {
      this.replayMove(move);
    }

    // Recalculate possible moves for all pieces after restoration
    for (const piece of this.getAllPieces()) {
      piece.calculateMoves();
    }
  }

  /**
   * Undoes the last move
   */
  undoMove(): boolean {
    if (this.moveHistoryIndex < 0) return false;

    // Decrease index
    this.moveHistoryIndex--;

    // Save full history
    const fullHistory = [...this.moveHistory];

    // Restore state from truncated history
    const movesToReplay = fullHistory.slice(0, this.moveHistoryIndex + 1);
    this.restoreFromHistory(movesToReplay);

    // Restore full history
    this.moveHistory = fullHistory;

    return true;
  }

  /**
   * Redoes the undone move
   */
  redoMove(): boolean {
    if (this.moveHistoryIndex >= this.moveHistory.length - 1) return false;

    // Increase index
    this.moveHistoryIndex++;

    // Save full history
    const fullHistory = [...this.moveHistory];

    // Replay the next move
    const nextMove = fullHistory[this.moveHistoryIndex];
    const success = this.replayMove(nextMove);

    // Restore full history
    this.moveHistory = fullHistory;

    return success;
  }

  /**
   * Checks if we can undo
   */
  canUndo(): boolean {
    return this.moveHistoryIndex >= 0;
  }

  /**
   * Checks if we can redo
   */
  canRedo(): boolean {
    return this.moveHistoryIndex < this.moveHistory.length - 1;
  }
}

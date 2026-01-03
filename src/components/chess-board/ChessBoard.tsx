/**
 * Composant principal de l'échiquier
 */

import { useCallback, useState } from "react";
import { BOARD_SIZE, PLAYER_NAMES, STATUS_MESSAGES } from "../../constants/chess.constants";
import { useBoardContext } from "../../contexts/BoardContext";
import { useChessGame } from "../../hooks/useChessGame";
import type { Piece } from "../../models/Piece";
import { GamePanel } from "../game-panel";
import { PromotionDialog } from "../promotion-dialog";
import ChessBoardSquare from "./ChessBoardSquare";

const ChessBoard = () => {
  const { board, restoredAt } = useBoardContext();
  const {
    currentPlayer,
    gameStatus,
    moveHistory,
    capturedPieces,
    movePiece,
    promotePawn,
    getPendingPromotion,
    resetGame,
    getValidMoves,
    undoMove,
    redoMove,
    canUndo,
    canRedo,
  } = useChessGame(board, restoredAt);

  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);
  const [validMoves, setValidMoves] = useState<{ x: number; y: number }[]>([]);
  const [showPromotion, setShowPromotion] = useState(false);

  // Récupérer le dernier mouvement pour le highlight
  const lastMove = board.getLastMove();

  // Récupérer le roi en échec pour le highlight
  const kingInCheck = board.findKing(currentPlayer);
  const isCheck = gameStatus === "check";

  const handleSelectPiece = useCallback(
    (piece: Piece) => {
      // Ne permettre la sélection que des pièces du joueur actuel
      if (piece.color !== currentPlayer) {
        return;
      }

      setSelectedPiece(piece);
      // Calculer d'abord tous les mouvements possibles
      piece.calculateMoves(board);
      // Puis filtrer pour obtenir uniquement les mouvements valides (qui ne mettent pas le roi en échec)
      const moves = getValidMoves(piece);
      setValidMoves(moves);
    },
    [currentPlayer, board, getValidMoves]
  );

  const handleMovePiece = useCallback(
    (x: number, y: number) => {
      if (!selectedPiece) return;

      const moved = movePiece(selectedPiece, x, y);

      if (moved) {
        // Vérifier s'il y a une promotion en attente
        if (getPendingPromotion()) {
          setShowPromotion(true);
        }
      }

      setSelectedPiece(null);
      setValidMoves([]);
    },
    [selectedPiece, movePiece, getPendingPromotion]
  );

  const handlePromotion = useCallback(
    (pieceType: "queen" | "rook" | "bishop" | "knight") => {
      promotePawn(pieceType);
      setShowPromotion(false);
    },
    [promotePawn]
  );

  return (
    <div className="flex gap-6 items-start justify-center p-4">
      {/* Échiquier */}
      <div className="flex flex-col items-center gap-4">
        {gameStatus === "check" && (
          <div className="text-xl font-semibold text-red-600">{STATUS_MESSAGES.check}</div>
        )}

        {gameStatus === "checkmate" && (
          <div className="text-xl font-semibold text-red-700">
            {STATUS_MESSAGES.checkmate}{" "}
            {PLAYER_NAMES[currentPlayer === "white" ? "black" : "white"]} gagnent!
          </div>
        )}

        {gameStatus === "stalemate" && (
          <div className="text-xl font-semibold text-yellow-600">{STATUS_MESSAGES.stalemate}</div>
        )}

        {showPromotion && (
          <PromotionDialog currentPlayer={currentPlayer} onPromotion={handlePromotion} />
        )}

        <div
          className="flex flex-wrap w-3xl"
          style={{
            position: "relative",
            overflow: "hidden",
            padding: "0",
          }}
        >
          {[...Array(BOARD_SIZE).keys()].map((row) => (
            <div className="flex" key={row}>
              {[...Array(BOARD_SIZE).keys()].map((col) => {
                const isLastMoveFrom = lastMove?.from.x === col && lastMove?.from.y === row;
                const isLastMoveTo = lastMove?.to.x === col && lastMove?.to.y === row;
                const isKingInCheck =
                  isCheck && kingInCheck?.position.x === col && kingInCheck?.position.y === row;

                return (
                  <ChessBoardSquare
                    key={`${row}-${col}`}
                    position={{ x: col, y: row }}
                    enabled={validMoves.some((move) => move.x === col && move.y === row)}
                    isLastMoveFrom={isLastMoveFrom}
                    isLastMoveTo={isLastMoveTo}
                    isKingInCheck={isKingInCheck}
                    onSelectPiece={handleSelectPiece}
                    onMovePiece={handleMovePiece}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Panneau latéral */}
      <GamePanel
        currentPlayer={currentPlayer}
        gameStatus={gameStatus}
        capturedPieces={capturedPieces}
        moveHistory={moveHistory}
        onReset={resetGame}
        onUndo={undoMove}
        onRedo={redoMove}
        canUndo={canUndo()}
        canRedo={canRedo()}
      />
    </div>
  );
};

export default ChessBoard;

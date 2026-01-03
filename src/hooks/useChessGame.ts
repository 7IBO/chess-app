/**
 * Hook personnalisé pour gérer la logique du jeu d'échecs
 */

import { useCallback, useEffect, useState } from "react";
import type { Board } from "../models/Board";
import type { Piece } from "../models/Piece";
import type { CapturedPieces, GameStatus, Move, PieceColor } from "../types/chess.types";
import { gameStorage } from "../utils/gameStorage";
import { logger } from "../utils/logger";

export function useChessGame(board: Board, _restoredAt: number) {
  const [currentPlayer, setCurrentPlayer] = useState<PieceColor>("white");
  const [gameStatus, setGameStatus] = useState<GameStatus>("playing");
  const [moveHistory, setMoveHistory] = useState<Move[]>([]);
  const [capturedPieces, setCapturedPieces] = useState<CapturedPieces>({
    white: [],
    black: [],
  });
  const [, forceUpdate] = useState({});

  // Sauvegarder automatiquement l'état du jeu
  const saveGameState = useCallback(() => {
    gameStorage
      .saveGame({
        moveHistory: board.getMoveHistory(),
        capturedPieces: board.getCapturedPieces(),
        currentPlayer: board.getCurrentPlayer(),
      })
      .catch(logger.error);
  }, [board]);

  const updateGameStatus = useCallback(() => {
    const player = board.getCurrentPlayer();

    if (board.isCheckmate(player)) {
      setGameStatus("checkmate");
    } else if (board.isStalemate(player)) {
      setGameStatus("stalemate");
    } else if (board.isKingInCheck(player)) {
      setGameStatus("check");
    } else {
      setGameStatus("playing");
    }
  }, [board]);

  // Synchroniser avec l'état du board au montage et après restauration
  useEffect(() => {
    logger.log("Synchronizing with board state...", {
      currentPlayer: board.getCurrentPlayer(),
      moveHistory: board.getMoveHistory().length,
      capturedPieces: board.getCapturedPieces(),
    });
    setCurrentPlayer(board.getCurrentPlayer());
    setMoveHistory([...board.getMoveHistory()]);
    setCapturedPieces({ ...board.getCapturedPieces() });
    updateGameStatus();
    forceUpdate({});
  }, [board, updateGameStatus]);

  const movePiece = useCallback(
    (piece: Piece, x: number, y: number): boolean => {
      const moved = board.movePiece(piece, x, y);

      if (moved) {
        // Mettre à jour l'historique et les pièces capturées
        setMoveHistory([...board.getMoveHistory()]);
        setCapturedPieces({ ...board.getCapturedPieces() });

        // Vérifier si promotion en attente
        if (!board.getPendingPromotion()) {
          // Recalculer les mouvements
          board.getAllPieces().forEach((p) => p.calculateMoves(board));

          // Mettre à jour l'état
          setCurrentPlayer(board.getCurrentPlayer());
          updateGameStatus();
        }

        // Sauvegarder l'état du jeu
        saveGameState();

        // Forcer le re-render
        forceUpdate({});
      }

      return moved;
    },
    [board, updateGameStatus, saveGameState]
  );

  const promotePawn = useCallback(
    (pieceType: "queen" | "rook" | "bishop" | "knight") => {
      board.promotePawn(pieceType);

      // Mettre à jour l'historique et les pièces capturées
      setMoveHistory([...board.getMoveHistory()]);
      setCapturedPieces({ ...board.getCapturedPieces() });

      // Recalculer les mouvements
      board.getAllPieces().forEach((piece) => piece.calculateMoves(board));

      // Mettre à jour l'état
      setCurrentPlayer(board.getCurrentPlayer());
      updateGameStatus();

      // Sauvegarder l'état du jeu
      saveGameState();

      forceUpdate({});
    },
    [board, updateGameStatus, saveGameState]
  );

  // Sauvegarder l'état lors du démontage du composant
  useEffect(() => {
    return () => {
      saveGameState();
    };
  }, [saveGameState]);

  const getPendingPromotion = useCallback(() => {
    return board.getPendingPromotion();
  }, [board]);

  const getValidMoves = useCallback(
    (piece: Piece) => {
      return board.getValidMoves(piece);
    },
    [board]
  );

  const resetGame = useCallback(() => {
    // Effacer les données IndexedDB
    gameStorage.clearGame().catch(logger.error);

    // Recharger la page pour réinitialiser complètement le board
    window.location.reload();
  }, []);

  const undoMove = useCallback(() => {
    if (board.canUndo()) {
      board.undoMove();

      // Synchroniser l'état
      setCurrentPlayer(board.getCurrentPlayer());
      setMoveHistory([...board.getMoveHistory()]);
      setCapturedPieces({ ...board.getCapturedPieces() });
      updateGameStatus();

      // Sauvegarder l'état
      saveGameState();

      // Forcer le re-render
      forceUpdate({});
    }
  }, [board, updateGameStatus, saveGameState]);

  const redoMove = useCallback(() => {
    if (board.canRedo()) {
      board.redoMove();

      // Synchroniser l'état
      setCurrentPlayer(board.getCurrentPlayer());
      setMoveHistory([...board.getMoveHistory()]);
      setCapturedPieces({ ...board.getCapturedPieces() });
      updateGameStatus();

      // Sauvegarder l'état
      saveGameState();

      // Forcer le re-render
      forceUpdate({});
    }
  }, [board, updateGameStatus, saveGameState]);

  const canUndo = useCallback(() => board.canUndo(), [board]);
  const canRedo = useCallback(() => board.canRedo(), [board]);

  return {
    currentPlayer,
    gameStatus,
    moveHistory,
    capturedPieces,
    movePiece,
    promotePawn,
    getPendingPromotion,
    getValidMoves,
    resetGame,
    undoMove,
    redoMove,
    canUndo,
    canRedo,
  };
}

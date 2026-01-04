/**
 * Custom hook to manage chess game logic
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

  // Automatically save game state
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

  // Synchronize with board state on mount and after restoration
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
        // Update history and captured pieces
        setMoveHistory([...board.getMoveHistory()]);
        setCapturedPieces({ ...board.getCapturedPieces() });

        // Check if promotion pending
        if (!board.getPendingPromotion()) {
          // Recalculate moves
          board.getAllPieces().forEach((p) => {
            p.calculateMoves();
          });

          // Update state
          setCurrentPlayer(board.getCurrentPlayer());
          updateGameStatus();
        }

        // Save game state
        saveGameState();

        // Force re-render
        forceUpdate({});
      }

      return moved;
    },
    [board, updateGameStatus, saveGameState]
  );

  const promotePawn = useCallback(
    (pieceType: "queen" | "rook" | "bishop" | "knight") => {
      board.promotePawn(pieceType);

      // Update history and captured pieces
      setMoveHistory([...board.getMoveHistory()]);
      setCapturedPieces({ ...board.getCapturedPieces() });

      // Recalculate moves
      board.getAllPieces().forEach((piece) => {
        piece.calculateMoves();
      });

      // Update state
      setCurrentPlayer(board.getCurrentPlayer());
      updateGameStatus();

      // Save game state
      saveGameState();

      forceUpdate({});
    },
    [board, updateGameStatus, saveGameState]
  );

  // Save state on component unmount
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
    // Clear IndexedDB data
    gameStorage.clearGame().catch(logger.error);

    // Reload the page to completely reset the board
    window.location.reload();
  }, []);

  const undoMove = useCallback(() => {
    if (board.canUndo()) {
      board.undoMove();

      // Synchronize state
      setCurrentPlayer(board.getCurrentPlayer());
      setMoveHistory([...board.getMoveHistory()]);
      setCapturedPieces({ ...board.getCapturedPieces() });
      updateGameStatus();

      // Save state
      saveGameState();

      // Force re-render
      forceUpdate({});
    }
  }, [board, updateGameStatus, saveGameState]);

  const redoMove = useCallback(() => {
    if (board.canRedo()) {
      board.redoMove();

      // Synchronize state
      setCurrentPlayer(board.getCurrentPlayer());
      setMoveHistory([...board.getMoveHistory()]);
      setCapturedPieces({ ...board.getCapturedPieces() });
      updateGameStatus();

      // Save state
      saveGameState();

      // Force re-render
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

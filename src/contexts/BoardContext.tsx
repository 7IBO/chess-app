/**
 * Context pour partager l'instance du board dans l'application
 */

import { createContext, type ReactNode, useContext, useEffect, useState } from "react";
import { createInitialPieces } from "../data/pieces";
import { Board } from "../models/Board";
import { gameStorage } from "../utils/gameStorage";
import { logger } from "../utils/logger";

interface BoardContextValue {
  board: Board;
  restoredAt: number;
}

const BoardContext = createContext<BoardContextValue | null>(null);

export function BoardProvider({ children }: { children: ReactNode }) {
  const [boardContext, setBoardContext] = useState<BoardContextValue | null>(null);

  useEffect(() => {
    // Créer une instance du board avec des pièces fraîches
    const boardInstance = new Board(createInitialPieces());

    // Initialiser les mouvements
    boardInstance.getAllPieces().forEach((piece) => {
      piece.calculateMoves(boardInstance);
    });

    // Charger l'état sauvegardé depuis IndexedDB
    gameStorage
      .loadGame()
      .then((savedState) => {
        if (savedState && savedState.moveHistory.length > 0) {
          logger.log("Restoring game state from IndexedDB...", savedState);
          boardInstance.restoreFromHistory(savedState.moveHistory);
        }
        setBoardContext({ board: boardInstance, restoredAt: Date.now() });
      })
      .catch((error) => {
        logger.error("Failed to load game state:", error);
        setBoardContext({ board: boardInstance, restoredAt: Date.now() });
      });
  }, []);

  // Ne pas afficher le board tant qu'il n'est pas chargé
  if (!boardContext) {
    return (
      <div className="w-screen h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Chargement...</div>
      </div>
    );
  }

  return <BoardContext.Provider value={boardContext}>{children}</BoardContext.Provider>;
}

export function useBoard(): Board {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error("useBoard must be used within a BoardProvider");
  }
  return context.board;
}

export function useBoardContext(): BoardContextValue {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error("useBoardContext must be used within a BoardProvider");
  }
  return context;
}

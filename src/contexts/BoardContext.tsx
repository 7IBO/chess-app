/**
 * Context to share board instance in the application
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
    // Create a board instance with fresh pieces
    const boardInstance = new Board(createInitialPieces());

    // Initialize moves
    for (const piece of boardInstance.getAllPieces()) {
      piece.calculateMoves();
    }

    // Load saved state from IndexedDB
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

  // Don't display the board until it's loaded
  if (!boardContext) {
    return (
      <div className="w-screen h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
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

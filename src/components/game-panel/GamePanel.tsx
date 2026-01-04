/**
 * Side panel displaying game information
 */

import { memo } from "react";
import type { CapturedPieces, GameStatus, Move, PieceColor } from "../../types/chess.types";
import { CapturedPiecesDisplay } from "./CapturedPiecesDisplay";
import { CurrentPlayerInfo } from "./CurrentPlayerInfo";
import { MoveHistory } from "./MoveHistory";

interface GamePanelProps {
  currentPlayer: PieceColor;
  gameStatus: GameStatus;
  capturedPieces: CapturedPieces;
  moveHistory: Move[];
  onReset: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

export const GamePanel = memo(function GamePanel({
  currentPlayer,
  gameStatus,
  capturedPieces,
  moveHistory,
  onReset,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
}: GamePanelProps) {
  const handleReset = () => {
    if (
      moveHistory.length === 0 ||
      confirm("Are you sure you want to start a new game? The current game will be lost.")
    ) {
      onReset();
    }
  };

  return (
    <div className="flex flex-col gap-4 w-80 h-160 bg-linear-to-br from-slate-800 to-slate-900 p-6 rounded-2xl shadow-2xl border border-slate-700">
      <button
        type="button"
        onClick={handleReset}
        className="bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
      >
        New Game
      </button>

      {/* Undo/Redo buttons */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onUndo}
          disabled={!canUndo}
          className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-2 px-3 rounded-lg shadow-md transition-all duration-200 hover:scale-105 active:scale-95 disabled:hover:scale-100"
          title="Undo the last move (Ctrl+Z)"
        >
          ↶ Undo
        </button>
        <button
          type="button"
          onClick={onRedo}
          disabled={!canRedo}
          className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-2 px-3 rounded-lg shadow-md transition-all duration-200 hover:scale-105 active:scale-95 disabled:hover:scale-100"
          title="Redo the undone move (Ctrl+Y)"
        >
          ↷ Redo
        </button>
      </div>

      <CurrentPlayerInfo currentPlayer={currentPlayer} gameStatus={gameStatus} />
      <CapturedPiecesDisplay capturedPieces={capturedPieces} />
      <MoveHistory moveHistory={moveHistory} />
    </div>
  );
});

/**
 * Affiche les informations du joueur actuel et le statut de la partie
 */

import { memo } from "react";
import { PLAYER_NAMES, STATUS_MESSAGES } from "../../constants/chess.constants";
import type { GameStatus, PieceColor } from "../../types/chess.types";

interface CurrentPlayerInfoProps {
  currentPlayer: PieceColor;
  gameStatus: GameStatus;
}

export const CurrentPlayerInfo = memo(function CurrentPlayerInfo({
  currentPlayer,
  gameStatus,
}: CurrentPlayerInfoProps) {
  return (
    <div className="bg-linear-to-br from-slate-700 to-slate-800 p-4 rounded-xl shadow-lg border border-slate-600">
      <h3 className="font-bold text-lg mb-3 text-white">Tour actuel</h3>
      <div className="flex items-center gap-3">
        <div
          className={`w-6 h-6 rounded-full shadow-md transition-all ${
            currentPlayer === "white"
              ? "bg-white border-2 border-slate-400"
              : "bg-slate-900 border-2 border-slate-600"
          }`}
        />
        <span className="font-semibold text-lg text-white">{PLAYER_NAMES[currentPlayer]}</span>
      </div>
      {gameStatus !== "playing" && (
        <div className="mt-3 text-sm font-semibold">
          {gameStatus === "check" && (
            <span className="text-red-400 animate-pulse">{STATUS_MESSAGES.check}</span>
          )}
          {gameStatus === "checkmate" && (
            <span className="text-red-500 font-bold animate-bounce">
              {STATUS_MESSAGES.checkmate}
            </span>
          )}
          {gameStatus === "stalemate" && (
            <span className="text-yellow-400">{STATUS_MESSAGES.stalemate}</span>
          )}
        </div>
      )}
    </div>
  );
});

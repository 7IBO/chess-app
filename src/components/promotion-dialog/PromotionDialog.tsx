/**
 * Dialog pour choisir la pièce de promotion du pion
 */

import { memo } from "react";
import { PROMOTION_PIECES } from "../../constants/chess.constants";
import type { PieceColor } from "../../types/chess.types";

interface PromotionDialogProps {
  currentPlayer: PieceColor;
  onPromotion: (pieceType: "queen" | "rook" | "bishop" | "knight") => void;
}

export const PromotionDialog = memo(function PromotionDialog({
  currentPlayer,
  onPromotion,
}: PromotionDialogProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
      <div className="bg-linear-to-br from-slate-800 to-slate-900 p-8 rounded-2xl shadow-2xl border-2 border-slate-600 animate-in zoom-in duration-200">
        <h3 className="text-2xl font-bold mb-6 text-center text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-500">
          Promotion du pion
        </h3>
        <p className="text-sm text-slate-300 mb-6 text-center">Choisissez votre nouvelle pièce</p>
        <div className="flex gap-3">
          {PROMOTION_PIECES.map((pieceType) => (
            <button
              key={pieceType}
              onClick={() => onPromotion(pieceType)}
              className="group relative p-5 bg-linear-to-br from-slate-700 to-slate-800 border-2 border-slate-600 rounded-xl hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-200 hover:scale-110 active:scale-95"
              aria-label={`Promouvoir en ${pieceType}`}
            >
              <img
                src={`/assets/${pieceType}-${currentPlayer}.png`}
                alt={pieceType}
                className="w-20 h-20 drop-shadow-lg group-hover:drop-shadow-2xl transition-all"
              />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-600 px-2 py-0.5 rounded text-xs text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {pieceType === "queen" && "Dame"}
                {pieceType === "rook" && "Tour"}
                {pieceType === "bishop" && "Fou"}
                {pieceType === "knight" && "Cavalier"}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});

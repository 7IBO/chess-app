/**
 * Affiche les pièces capturées pour chaque joueur
 */

import { memo } from "react";
import type { CapturedPieces } from "../../types/chess.types";

interface CapturedPiecesDisplayProps {
  capturedPieces: CapturedPieces;
}

export const CapturedPiecesDisplay = memo(function CapturedPiecesDisplay({
  capturedPieces,
}: CapturedPiecesDisplayProps) {
  return (
    <div className="bg-linear-to-br from-slate-700 to-slate-800 p-4 rounded-xl shadow-lg border border-slate-600">
      <h3 className="font-bold text-lg mb-3 text-white">Pièces capturées</h3>

      {/* Pièces blanches capturées */}
      <div className="mb-3">
        <div className="text-sm font-semibold mb-2 text-slate-300">Blancs:</div>
        <div className="flex flex-wrap gap-1.5 min-h-7">
          {capturedPieces.white.length > 0 ? (
            capturedPieces.white.map((piece, idx) => (
              <img
                key={idx}
                src={`/assets/${piece}-white.png`}
                alt={piece}
                className="w-7 h-7 opacity-60 hover:opacity-100 transition-opacity"
              />
            ))
          ) : (
            <span className="text-slate-500 text-sm italic">Aucune</span>
          )}
        </div>
      </div>

      {/* Pièces noires capturées */}
      <div>
        <div className="text-sm font-semibold mb-2 text-slate-300">Noirs:</div>
        <div className="flex flex-wrap gap-1.5 min-h-7">
          {capturedPieces.black.length > 0 ? (
            capturedPieces.black.map((piece, idx) => (
              <img
                key={idx}
                src={`/assets/${piece}-black.png`}
                alt={piece}
                className="w-7 h-7 opacity-60 hover:opacity-100 transition-opacity"
              />
            ))
          ) : (
            <span className="text-slate-500 text-sm italic">Aucune</span>
          )}
        </div>
      </div>
    </div>
  );
});

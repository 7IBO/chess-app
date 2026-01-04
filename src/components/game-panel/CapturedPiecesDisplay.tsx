/**
 * Displays captured pieces for each player
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
      <h3 className="font-bold text-lg mb-3 text-white">Captured Pieces</h3>

      {/* White pieces captured */}
      <div className="mb-3">
        <div className="text-sm font-semibold mb-2 text-slate-300">White:</div>
        <div className="flex flex-wrap gap-1.5 min-h-7">
          {capturedPieces.white.length > 0 ? (
            capturedPieces.white.map((captured) => (
              <img
                key={captured.id}
                src={`/assets/${captured.piece}-white.png`}
                alt={captured.piece}
                className="w-7 h-7 opacity-60 hover:opacity-100 transition-opacity"
              />
            ))
          ) : (
            <span className="text-slate-500 text-sm italic">None</span>
          )}
        </div>
      </div>

      {/* Black pieces captured */}
      <div>
        <div className="text-sm font-semibold mb-2 text-slate-300">Black:</div>
        <div className="flex flex-wrap gap-1.5 min-h-7">
          {capturedPieces.black.length > 0 ? (
            capturedPieces.black.map((captured) => (
              <img
                key={captured.id}
                src={`/assets/${captured.piece}-black.png`}
                alt={captured.piece}
                className="w-7 h-7 opacity-60 hover:opacity-100 transition-opacity"
              />
            ))
          ) : (
            <span className="text-slate-500 text-sm italic">None</span>
          )}
        </div>
      </div>
    </div>
  );
});

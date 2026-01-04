/**
 * Displays the move history
 */

import { memo } from "react";
import { FILES, PIECE_NAMES, PLAYER_ICONS } from "../../constants/chess.constants";
import type { Move } from "../../types/chess.types";

interface MoveHistoryProps {
  moveHistory: Move[];
}

interface FormattedMoveProps {
  move: Move;
  index: number;
}

function FormattedMove({ move, index }: FormattedMoveProps) {
  const from = `${FILES[move.from.x]}${8 - move.from.y}`;
  const to = `${FILES[move.to.x]}${8 - move.to.y}`;
  const piece = PIECE_NAMES[move.piece] || move.piece;
  const icon = PLAYER_ICONS[move.color];

  return (
    <div className="flex items-center gap-2 px-2 py-1 hover:bg-slate-600/50 rounded-lg transition-colors min-w-0">
      <span className="text-slate-400 font-bold text-xs min-w-6 shrink-0">{index + 1}.</span>
      <div className="flex items-center gap-1.5 flex-1 text-xs min-w-0 overflow-hidden">
        <span className="text-lg shrink-0">{icon}</span>
        {move.castling ? (
          <span className="text-slate-200 font-semibold">Castling</span>
        ) : (
          <>
            <span className="text-slate-300 font-medium shrink-0">{piece}</span>
            <span className="text-slate-500 text-[10px] shrink-0">{from}</span>
            <span className="text-slate-400 shrink-0">→</span>
            <span className="text-slate-200 font-semibold shrink-0">{to}</span>
            {move.captured && <span className="text-red-400 font-bold ml-1 shrink-0">×</span>}
            {move.enPassant && (
              <span className="text-yellow-400 text-[10px] ml-1 shrink-0">e.p.</span>
            )}
            {move.promotion && (
              <span className="text-green-400 text-[10px] ml-1 shrink-0">
                ={PIECE_NAMES[move.promotion]}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export const MoveHistory = memo(function MoveHistory({ moveHistory }: MoveHistoryProps) {
  return (
    <div className="bg-linear-to-br from-slate-700 to-slate-800 p-4 rounded-xl shadow-lg border border-slate-600 flex-1 flex flex-col min-w-0 overflow-hidden">
      <h3 className="font-bold text-lg mb-3 text-white">History</h3>
      <div className="space-y-0.5 overflow-y-auto overflow-x-hidden pr-2 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent hover:scrollbar-thumb-slate-500">
        {moveHistory.length > 0 ? (
          moveHistory.map((move, idx) => (
            <FormattedMove
              key={`${move.piece}-${move.from.x}${move.from.y}-${move.to.x}${move.to.y}-${idx}`}
              move={move}
              index={idx}
            />
          ))
        ) : (
          <p className="text-slate-500 text-sm italic">No moves</p>
        )}
      </div>
    </div>
  );
});

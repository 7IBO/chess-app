/**
 * Composant représentant une case de l'échiquier
 */

import { memo } from "react";
import { SQUARE_BG_CLASS } from "../../config";
import { useBoard } from "../../contexts/BoardContext";
import type { Piece } from "../../models/Piece";
import ChessBoardPiece from "./ChessBoardPiece";

interface ChessBoardSquareProps {
  position: {
    x: number;
    y: number;
  };
  enabled?: boolean;
  isLastMoveFrom?: boolean;
  isLastMoveTo?: boolean;
  isKingInCheck?: boolean;
  onSelectPiece: (piece: Piece) => void;
  onMovePiece: (x: number, y: number) => void;
}

const ChessBoardSquare = memo(function ChessBoardSquare({
  position: { x, y },
  enabled = false,
  isLastMoveFrom = false,
  isLastMoveTo = false,
  isKingInCheck = false,
  onSelectPiece,
  onMovePiece,
}: ChessBoardSquareProps) {
  const board = useBoard();
  const piece = board.getPieceAt(x, y);

  const isDarkSquare = (y % 2 === 0 && x % 2 === 1) || (y % 2 === 1 && x % 2 === 0);

  // Classe CSS pour le highlight du dernier coup
  const lastMoveClass = isLastMoveFrom
    ? "ring-4 ring-yellow-400/70"
    : isLastMoveTo
      ? "ring-4 ring-yellow-500"
      : "";

  // Classe CSS pour le roi en échec
  const checkClass = isKingInCheck ? "ring-4 ring-red-600 ring-offset-2" : "";

  return (
    <div
      className={`p-2 w-24 h-24 relative ${
        isDarkSquare ? SQUARE_BG_CLASS.dark : SQUARE_BG_CLASS.light
      } ${enabled ? "cursor-pointer" : ""} ${lastMoveClass} ${checkClass} transition-all duration-200`}
      onClick={() => (!piece || enabled) && onMovePiece(x, y)}
      data-position={[x, y]}
    >
      {piece && (
        <ChessBoardPiece
          piece={piece}
          onSelectPiece={() => !enabled && onSelectPiece(piece)}
          onMovePiece={onMovePiece}
        />
      )}

      {enabled && (
        <div className="absolute w-4 h-4 top-1/2 left-1/2 rounded-full bg-blue-500 -translate-x-1/2 -translate-y-1/2 z-50" />
      )}
    </div>
  );
});

export default ChessBoardSquare;

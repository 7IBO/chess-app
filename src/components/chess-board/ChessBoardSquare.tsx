import React, { HTMLProps } from "react";
import { pieces } from "../../config/const";
import { Piece } from "../../models";
import ChessBoardPiece from "./ChessBoardPiece";

type Props = HTMLProps<HTMLDivElement> & {
  position: {
    x: number;
    y: number;
  };
  enabled?: boolean;
  onSelectPiece: (piece: Piece) => void;
  onMovePiece: (x: number, y: number) => void;
};

const ChessBoardSquare = ({
  position: { x, y },
  enabled = false,
  onSelectPiece,
  onMovePiece,
}: Props) => {
  const piece = pieces.find(
    (piece) => piece.position.x === x && piece.position.y === y
  );

  return (
    <div
      className={`p-2 w-24 h-24 relative ${
        (y % 2 === 0 && x % 2 === 0) || (y % 2 === 1 && x % 2 === 1)
          ? "bg-amber-100"
          : "bg-green-700"
      } ${enabled ? "cursor-pointer" : ""}`}
      onClick={() => !piece && onMovePiece(x, y)}
      key={(y + 1) * (x + 1)}
    >
      {piece && (
        <ChessBoardPiece
          x={x}
          y={y}
          piece={piece}
          onSelectPiece={() => onSelectPiece(piece)}
          onDragPiece={(x, y) => {}}
        />
      )}

      {enabled && (
        <div className="absolute w-4 h-4 top-1/2 left-1/2 rounded-full bg-blue-500 z-10 -translate-x-1/2 -translate-y-1/2" />
      )}
    </div>
  );
};

export default ChessBoardSquare;

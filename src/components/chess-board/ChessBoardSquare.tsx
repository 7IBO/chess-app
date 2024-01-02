import { HTMLProps } from "react";

import { pieces } from "@/data/pieces";
import { Piece } from "@/models";
import { SQUARE_BG_CLASS } from "@/config";

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
  ) as Piece;

  return (
    <div
      className={`p-2 w-24 h-24 relative ${
        (y % 2 === 0 && x % 2 === 0) || (y % 2 === 1 && x % 2 === 1)
          ? SQUARE_BG_CLASS.light
          : SQUARE_BG_CLASS.dark
      } ${enabled ? "cursor-pointer" : ""}`}
      onClick={() => !piece && onMovePiece(x, y)}
      data-position={[x, y]}
      key={(y + 1) * (x + 1)}
    >
      {piece && (
        <ChessBoardPiece
          piece={piece}
          onSelectPiece={() => onSelectPiece(piece)}
          onMovePiece={onMovePiece}
        />
      )}

      {enabled && (
        <div className="absolute w-4 h-4 top-1/2 left-1/2 rounded-full bg-blue-500 -translate-x-1/2 -translate-y-1/2 z-50" />
      )}
    </div>
  );
};

export default ChessBoardSquare;

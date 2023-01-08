import React, { useState } from "react";
import { Piece } from "../../models";
import { ChessBoardPiece } from "../chess-board-piece";

type Props = {
  pieces: Piece[];
};

const ChessBoard = ({ pieces }: Props) => {
  const [selectedPiece, setSelectedPiece] = useState<null | Piece>(null);

  const handleSelectPiece = (piece: Piece) => {
    setSelectedPiece(piece);
    piece.getMovesPossible();
  };

  const handleMovePiece = (col: number, row: number) => {
    if (
      selectedPiece &&
      selectedPiece.movesPossible.find(
        (item) => item.x === col && item.y === row
      )
    ) {
      selectedPiece.move(col, row);
      setSelectedPiece(null);
    }
  };

  return (
    <div
      className="flex flex-wrap w-[48rem]"
      style={{
        position: "relative",
        overflow: "auto",
        padding: "0",
      }}
    >
      {[...Array(8).keys()].map((row) => (
        <div className="flex" key={row}>
          {[...Array(8).keys()].map((col) => (
            <div
              className={`p-2 w-24 h-24 relative ${
                (row % 2 === 0 && col % 2 === 0) ||
                (row % 2 === 1 && col % 2 === 1)
                  ? "bg-amber-100"
                  : "bg-green-700"
              }`}
              onClick={() => handleMovePiece(col, row)}
              key={(row + 1) * (col + 1)}
            >
              <ChessBoardPiece
                x={col}
                y={row}
                pieces={pieces}
                onSelect={handleSelectPiece}
                onDrag={(x, y) => console.log(x, y)}
              />
              {selectedPiece?.movesPossible.find(
                (item) => item.x === col && item.y === row
              ) && (
                <div className="absolute w-4 h-4 top-1/2 left-1/2 rounded-full bg-blue-500 z-10 -translate-x-1/2 -translate-y-1/2" />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ChessBoard;

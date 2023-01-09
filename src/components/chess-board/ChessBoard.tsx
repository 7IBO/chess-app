import { useState } from "react";
import { Piece } from "../../models";
import ChessBoardSquare from "./ChessBoardSquare";

type Props = {
  pieces: Piece[];
};

const ChessBoard = ({ pieces }: Props) => {
  const [selectedPiece, setSelectedPiece] = useState<null | Piece>(null);

  const handleSelectPiece = (piece: Piece) => {
    setSelectedPiece(piece);
    piece.getMovesPossible();
  };

  const handleMovePiece = (x: number, y: number) => {
    if (selectedPiece) {
      selectedPiece.move(x, y);
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
            <ChessBoardSquare
              position={{ x: col, y: row }}
              enabled={selectedPiece?.hasMovePossible(col, row)}
              onSelectPiece={handleSelectPiece}
              onMovePiece={handleMovePiece}
              key={(row + 1) * (col + 1)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default ChessBoard;

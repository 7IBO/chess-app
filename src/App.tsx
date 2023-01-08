import { Bishop, King, Knight, Pawn, Piece, Queen, Rook } from "./models";

import { ChessBoard } from "./components/chess-board";

function App() {
  const pieces = [
    new Rook(0, 0, "black"),
    new Knight(1, 0, "black"),
    new Bishop(2, 0, "black"),
    new Queen(3, 0, "black"),
    new King(4, 0, "black"),
    new Bishop(5, 0, "black"),
    new Knight(6, 0, "black"),
    new Rook(7, 0, "black"),
    new Pawn(0, 1, "black"),
    new Pawn(1, 1, "black"),
    new Pawn(2, 1, "black"),
    new Pawn(3, 1, "black"),
    new Pawn(4, 1, "black"),
    new Pawn(5, 1, "black"),
    new Pawn(6, 1, "black"),
    new Pawn(7, 1, "black"),

    new Rook(0, 7, "white"),
    new Knight(1, 7, "white"),
    new Bishop(2, 7, "white"),
    new Queen(3, 7, "white"),
    new King(4, 7, "white"),
    new Bishop(5, 7, "white"),
    new Knight(6, 7, "white"),
    new Rook(7, 7, "white"),
    new Pawn(0, 6, "white"),
    new Pawn(1, 6, "white"),
    new Pawn(2, 6, "white"),
    new Pawn(3, 6, "white"),
    new Pawn(4, 6, "white"),
    new Pawn(5, 6, "white"),
    new Pawn(6, 6, "white"),
    new Pawn(7, 6, "white"),
  ];

  return (
    <div className="container m-auto">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-3xl font-bold underline">Hello world!</h1>
        <ChessBoard pieces={pieces} />
      </div>
    </div>
  );
}

export default App;

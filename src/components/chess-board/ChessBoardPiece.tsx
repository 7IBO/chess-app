import Draggable from "react-draggable";
import { Piece } from "../../models";
import { pieces } from "../../config/const";
import { HTMLProps } from "react";

type Props = {
  x: number;
  y: number;
  piece: Piece;
  onSelectPiece: VoidFunction;
  onDragPiece: (x: number, y: number) => void;
};

const ChessBoardPiece = ({
  x,
  y,
  piece,
  onSelectPiece,
  onDragPiece,
}: Props) => (
  <Draggable
    // bounds="parent"
    onStart={() => {}}
    onStop={() => {}}
    onDrag={(e, data) =>
      onDragPiece(data.node.offsetLeft + data.x, data.node.offsetTop + data.y)
    }
    position={{ x: 0, y: 0 }}
  >
    <div
      className="w-full h-full cursor-grab"
      onClick={onSelectPiece}
      style={{
        backgroundImage: `url(./assets/${piece.image})`,
        backgroundSize: "cover",
      }}
    />
  </Draggable>
);

export default ChessBoardPiece;

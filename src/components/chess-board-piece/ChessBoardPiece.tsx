import { Piece } from "../../models";
import Draggable from "react-draggable";

type Props = {
  x: number;
  y: number;
  pieces: Piece[];
  onSelect: (piece: Piece) => void;
  onDrag: (x: number, y: number) => void;
};

const ChessBoardPiece = ({ x, y, pieces, onSelect, onDrag }: Props) => {
  const piece = pieces.find(
    (piece) => piece.position.x === x && piece.position.y === y
  );

  return piece ? (
    <Draggable
      // bounds="parent"
      onStart={() => {}}
      onStop={() => {}}
      onDrag={(e, data) =>
        onDrag(data.node.offsetLeft + data.x, data.node.offsetTop + data.y)
      }
      position={{ x: 0, y: 0 }}
    >
      <div
        className="w-full h-full cursor-grab"
        onClick={() => onSelect(piece)}
        style={{
          backgroundImage: `url(./assets/${piece.image})`,
          backgroundSize: "cover",
        }}
      />
    </Draggable>
  ) : (
    <div></div>
  );
};

export default ChessBoardPiece;

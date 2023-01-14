import Draggable, { DraggableEventHandler } from "react-draggable";
import { Piece } from "../../models";

type Props = {
  piece: Piece;
  onSelectPiece: VoidFunction;
  onMovePiece: (x: number, y: number) => void;
};

const ChessBoardPiece = ({ piece, onSelectPiece, onMovePiece }: Props) => {
  const handleStopDrag: DraggableEventHandler = (e, data) => {
    data.node.classList.remove("z-[1000]");
    const movedPosition = data.node.getBoundingClientRect();

    // Get element where we want to move the piece
    const element = document
      .elementsFromPoint(
        movedPosition.left + movedPosition.width / 2,
        movedPosition.top + movedPosition.height / 2
      )
      .find((item) => item.attributes.getNamedItem("data-position"));

    if (element) {
      const positionAttr = element.attributes
        .getNamedItem("data-position")!
        .nodeValue!.split(",")
        .map((item) => parseInt(item));

      // Keep the selection if it's not a possible move
      if (piece.hasMovePossible(positionAttr[0], positionAttr[1])) {
        onMovePiece(positionAttr[0], positionAttr[1]);
      }
    }
  };

  return (
    <Draggable
      onStop={handleStopDrag}
      onStart={onSelectPiece}
      onDrag={(e, data) => data.node.classList.add("z-[1000]")}
      position={{ x: 0, y: 0 }}
    >
      <div
        className="w-full h-full cursor-grab z-50 relative"
        onClick={onSelectPiece}
        style={{
          backgroundImage: `url(./assets/${piece.image})`,
          backgroundSize: "cover",
        }}
      />
    </Draggable>
  );
};

export default ChessBoardPiece;

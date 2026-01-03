/**
 * Composant représentant une pièce d'échecs draggable
 */

import { type MouseEvent, memo, useEffect, useRef, useState } from "react";
import type { Piece } from "../../models/Piece";

interface ChessBoardPieceProps {
  piece: Piece;
  onSelectPiece: VoidFunction;
  onMovePiece: (x: number, y: number) => void;
}

const ChessBoardPiece = memo(function ChessBoardPiece({
  piece,
  onSelectPiece,
  onMovePiece,
}: ChessBoardPieceProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragStartPos = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    onSelectPiece();
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: globalThis.MouseEvent) => {
      const deltaX = e.clientX - dragStartPos.current.x;
      const deltaY = e.clientY - dragStartPos.current.y;
      setPosition({ x: deltaX, y: deltaY });
    };

    const handleMouseUp = (e: globalThis.MouseEvent) => {
      setIsDragging(false);
      setPosition({ x: 0, y: 0 });

      // Get element where we want to move the piece
      const element = document
        .elementsFromPoint(e.clientX, e.clientY)
        .find((item) => item.attributes.getNamedItem("data-position"));

      if (element) {
        const positionAttr = element.attributes
          .getNamedItem("data-position")
          ?.nodeValue?.split(",")
          .map((item) => parseInt(item, 10));

        // Keep the selection if it's not a possible move
        if (piece.hasMovePossible(positionAttr[0], positionAttr[1])) {
          onMovePiece(positionAttr[0], positionAttr[1]);
        }
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, piece, onMovePiece]);

  return (
    <div
      className={`w-full h-full cursor-grab z-10 relative ${isDragging ? "z-1000" : ""}`}
      onClick={onSelectPiece}
      onMouseDown={handleMouseDown}
      style={{
        backgroundImage: `url(./assets/${piece.image})`,
        backgroundSize: "cover",
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: isDragging ? "none" : "transform 0.2s",
      }}
    />
  );
});

export default ChessBoardPiece;

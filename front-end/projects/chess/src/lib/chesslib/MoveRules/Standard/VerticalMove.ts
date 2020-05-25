import { MoveRule } from "../../MoveRule";
import { Board } from "../../Board";
import { Piece } from "../../Piece";
import { Coordinate } from "../../Coordinate";

/**
 * Allows the piece to move `distance` units vertically.
 */
export class VerticalMove implements MoveRule {
  distance: number = -1;
  constructor(distance: number) {
    this.distance = distance;
  }

  ValidSquares(piece: Piece, board: Board): Coordinate[] {
    let toReturn: Coordinate[] = [];

    const PieceX = piece.Coordinate.x;
    const PieceY = piece.Coordinate.y;

    // Iterate over the entire column
    for (let yCoord = 1; yCoord <= board.Height; yCoord++) {
      // If distance is set to -1, that means we can move anywhere on the column.
      if (Math.abs(yCoord - PieceY) <= this.distance || this.distance === -1) {
        if (yCoord !== PieceY) {
          toReturn.push({
            x: PieceX,
            y: yCoord,
          });
        }
      }
    }

    return toReturn;
  }
}

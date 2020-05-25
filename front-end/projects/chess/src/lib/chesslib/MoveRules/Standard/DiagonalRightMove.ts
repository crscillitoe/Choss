import { MoveRule } from "../../MoveRule";
import { Board } from "../../Board";
import { Piece } from "../../Piece";
import { Coordinate } from "../../Coordinate";

/**
 * Allows the piece to move `distance` units in the up+right/down+left diagonal.
 */
export class DiagonalRightMove implements MoveRule {
  distance: number = -1;
  constructor(distance: number) {
    this.distance = distance;
  }

  ValidSquares(piece: Piece, board: Board): Coordinate[] {
    let toReturn: Coordinate[] = [];

    const PieceX = piece.Coordinate.x;
    const PieceY = piece.Coordinate.y;

    // Iterate over the entire row
    for (let xCoord = PieceX; xCoord <= board.Width; xCoord++) {
      // If distance is set to -1, that means we can move anywhere on the row.
      if (Math.abs(xCoord - PieceX) <= this.distance || this.distance === -1) {
        if (xCoord !== PieceX) {
          const toAddX: number = xCoord;
          const toAddY: number = PieceY - (xCoord - PieceX);
          const toAdd: Coordinate = {
            x: toAddX,
            y: toAddY,
          };

          toReturn.push(toAdd);

          if (board.getPieceAtCoordinate(toAddX, toAddY)) {
            break;
          }
        }
      }
    }

    for (let xCoord = PieceX; xCoord >= 1; xCoord--) {
      // If distance is set to -1, that means we can move anywhere on the row.
      if (Math.abs(xCoord - PieceX) <= this.distance || this.distance === -1) {
        if (xCoord !== PieceX) {
          const toAddX: number = xCoord;
          const toAddY: number = PieceY - (xCoord - PieceX);
          const toAdd: Coordinate = {
            x: toAddX,
            y: toAddY,
          };

          toReturn.push(toAdd);

          if (board.getPieceAtCoordinate(toAddX, toAddY)) {
            break;
          }
        }
      }
    }

    return toReturn;
  }
}

import { MoveRule } from "../../MoveRule";
import { Board } from "../../Board";
import { Piece } from "../../Piece";
import { Coordinate } from "../../Coordinate";

/**
 * Allows the piece to move `distance` units in the up+left/down+right diagonal.
 */
export class DiagonalLeftMove implements MoveRule {
  distance: number = -1;
  constructor(distance: number) {
    this.distance = distance;
  }

  ValidSqures(piece: Piece, board: Board): Coordinate[] {
    let toReturn: Coordinate[] = [];

    const PieceX = piece.Coordinate.x;
    const PieceY = piece.Coordinate.y;

    // Iterate over the entire column
    for (let yCoord = PieceY; yCoord <= board.Height; yCoord++) {
      // If distance is set to -1, that means we can move anywhere on the column.
      if (Math.abs(yCoord - PieceY) <= this.distance || this.distance === -1) {
        if (yCoord !== PieceY) {
          const toAddX: number = PieceX - (PieceY - yCoord);
          const toAddY: number = yCoord;
          const toAdd: Coordinate = {
            x: toAddX,
            y: toAddY,
          };

          const foundPiece = board.getPieceAtCoordinate(toAddX, toAddY);
          if (foundPiece) {
            if (foundPiece.Team !== piece.Team) {
              toReturn.push(toAdd);
            }

            break;
          }

          toReturn.push(toAdd);
        }
      }
    }

    // Iterate over the entire column
    for (let yCoord = PieceY; yCoord >= 1; yCoord--) {
      // If distance is set to -1, that means we can move anywhere on the column.
      if (Math.abs(yCoord - PieceY) <= this.distance || this.distance === -1) {
        if (yCoord !== PieceY) {
          const toAddX: number = PieceX - (PieceY - yCoord);
          const toAddY: number = yCoord;
          const toAdd: Coordinate = {
            x: toAddX,
            y: toAddY,
          };

          const foundPiece = board.getPieceAtCoordinate(toAddX, toAddY);
          if (foundPiece) {
            if (foundPiece.Team !== piece.Team) {
              toReturn.push(toAdd);
            }

            break;
          }

          toReturn.push(toAdd);
        }
      }
    }

    return toReturn;
  }
}

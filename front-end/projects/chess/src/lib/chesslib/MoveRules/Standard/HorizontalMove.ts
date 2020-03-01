import { MoveRule } from "../../MoveRule";
import { Board } from "../../Board";
import { Piece } from "../../Piece";
import { Coordinate } from "../../Coordinate";

/**
 * This rule, when applied to a piece, will stop it from performing
 * any movement that involves jumping over a piece.
 */
export class HorizontalMove implements MoveRule {
  distance: number = -1;
  constructor(distance: number) {
    this.distance = distance;
  }

  ValidSqures(piece: Piece, board: Board): Coordinate[] {
    let toReturn: Coordinate[] = [];

    const PieceX = piece.Coordinate.x;
    const PieceY = piece.Coordinate.y;

    // Iterate over the entire row
    for (let xCoord = 1; xCoord <= board.Width; xCoord++) {
      // If distance is set to -1, that means we can move anywhere on the row.
      if (Math.abs(xCoord - PieceX) <= this.distance || this.distance === -1) {
        if (xCoord !== PieceX) {
          toReturn.push({
            x: xCoord,
            y: PieceY
          });
        }
      }
    }

    return toReturn;
  }
}

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
    throw new Error("Not Implemented");
  }
}

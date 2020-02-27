import { MoveRule } from "../MoveRule";
import { Board } from "../board";
import { Piece } from "../piece";
import { Coordinate } from "../Coordinate";

/**
 * This rule, when applied to a piece, will stop it from performing
 * any movement that involves jumping over a piece.
 */
export class CannotMoveOverOtherPieces implements MoveRule {
  ValidSqures(piece: Piece, board: Board): Coordinate[] {
    for (let p of piece.Board.Pieces) {
    }

    return [];
  }
}

import { MoveRule } from "../../MoveRule";
import { Board } from "../../Board";
import { Piece } from "../../Piece";
import { Coordinate } from "../../Coordinate";
import { TeamOption } from "../../Team";
import { SpecialMove, SpecialMoveRule } from "../../SpecialMoveRule";

/**
 * If a pawn adjacant to this piece has just moved
 * 2 spaces forward and landed adjacant to us, we can
 * capture it by moving diagonally past it.
 */
export class EnPassant implements SpecialMoveRule {
  ValidSquares(piece: Piece, board: Board): SpecialMove[] {
    return [];
  }

  captureBehavior(piece: Piece, board: Board, target: Coordinate) {
    // Find pawn being taken.
    // Kill pawn
    // Move piece
  }
}

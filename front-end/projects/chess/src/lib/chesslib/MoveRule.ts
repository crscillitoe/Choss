import { Piece } from "./Piece";
import { Board } from "./Board";
import { Coordinate } from "./Coordinate";

/**
 * A move rule describes how a given piece can move on the given board.
 */
export interface MoveRule {
  ValidSqures: (piece: Piece, board: Board) => Coordinate[];
}

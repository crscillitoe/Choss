import { MoveRule } from "../../MoveRule";
import { Board } from "../../Board";
import { Piece } from "../../Piece";
import { Coordinate } from "../../Coordinate";
import { TeamOption } from "../../Team";
import { SpecialMove, SpecialMoveRule } from "../../SpecialMoveRule";
import { Pawn } from "../../Pieces/Standard/Pawn";

/**
 * If a pawn adjacant to this piece has just moved
 * 2 spaces forward and landed adjacant to us, we can
 * capture it by moving diagonally past it.
 */
export class QueenSideCastle implements SpecialMoveRule {
  ValidSquares(piece: Piece, board: Board): SpecialMove[] {
    if (piece.TimesMoved > 0) {
      return [];
    }

    if (
      board.getPieceAtCoordinate(new Coordinate(7, piece.Coordinate.y)) ||
      board.getPieceAtCoordinate(new Coordinate(6, piece.Coordinate.y)) ||
      board.getPieceAtCoordinate(new Coordinate(5, piece.Coordinate.y))
    ) {
      return [];
    }

    let toReturn: SpecialMove[] = [];
    // Grab the rook to our king's left.
    const rook = board.getPieceAtCoordinate(
      new Coordinate(8, piece.Coordinate.y)
    );

    if (rook && rook.TimesMoved === 0) {
      toReturn.push({
        target: new Coordinate(6, piece.Coordinate.y),
        makeMove: this.castle,
      });
    }

    return toReturn;
  }

  castle(piece: Piece, board: Board, target: Coordinate): boolean {
    if (piece.TimesMoved > 0) {
      return false;
    }

    if (
      board.getPieceAtCoordinate(new Coordinate(7, piece.Coordinate.y)) ||
      board.getPieceAtCoordinate(new Coordinate(6, piece.Coordinate.y)) ||
      board.getPieceAtCoordinate(new Coordinate(5, piece.Coordinate.y))
    ) {
      return false;
    }

    const rook = board.getPieceAtCoordinate(
      new Coordinate(8, piece.Coordinate.y)
    );

    if (rook && rook.TimesMoved === 0) {
      rook.Coordinate.x = 5;
      piece.Coordinate.x = 6;

      return true;
    }

    return false;
  }
}

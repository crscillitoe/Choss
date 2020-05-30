import { Coordinate } from "../../Coordinate";
import { Board } from "../../Board";
import { Piece } from "../../Piece";
import { TeamOption } from "../../Team";
import { ElbowMove, ElbowMoveOptions } from "./ElbowMove";
import { MoveRule } from "../../MoveRule";

export class ElbowMoveFrontLeft extends ElbowMove implements MoveRule {
  constructor(moveOptions: ElbowMoveOptions) {
    super(moveOptions);
  }

  ValidSquares(piece: Piece, board: Board): Coordinate[] {
    let valid: Coordinate[] = [];
    const delta = piece.Team.equals(TeamOption.WHITE) ? 1 : -1;
    const firstTarget = new Coordinate(
      piece.Coordinate.x + this.distanceLength * delta,
      piece.Coordinate.y + this.distanceWidth * delta
    );
    if (board.isOnBoard(firstTarget)) {
      valid = valid.concat(
        this.getStations(piece.Coordinate, firstTarget, board)
      );
    }
    const secondTarget = new Coordinate(
      piece.Coordinate.x + this.distanceWidth * delta,
      piece.Coordinate.y + this.distanceLength * delta
    );
    if (board.isOnBoard(secondTarget)) {
      valid = valid.concat(
        this.getStations(piece.Coordinate, secondTarget, board)
      );
    }
    return valid;
  }
}

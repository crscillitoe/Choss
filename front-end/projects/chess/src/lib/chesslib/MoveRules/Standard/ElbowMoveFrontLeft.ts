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
    valid = valid.concat(
      this.checkPath(
        piece,
        board,
        this.distanceLength,
        this.distanceWidth,
        delta * -1,
        delta
      )
    );
    valid = valid.concat(
      this.checkPath(
        piece,
        board,
        this.distanceWidth,
        this.distanceLength,
        delta * -1,
        delta
      )
    );
    return valid;
  }
}

import { Piece } from "../../Piece";
import { Team } from "../../Team";
import { VerticalMove } from "../../MoveRules/Standard/VerticalMove";
import {
  ElbowMove,
  ElbowMoveOptions,
} from "../../MoveRules/Standard/ElbowMove";
import { ElbowMoveFrontRight } from "../../MoveRules/Standard/ElbowMoveFrontRight";
import { ElbowMoveFrontLeft } from "../../MoveRules/Standard/ElbowMoveFrontLeft";
import { ElbowMoveBackLeft } from "../../MoveRules/Standard/ElbowMoveBackLeft";
import { ElbowMoveBackRight } from "../../MoveRules/Standard/ElbowMoveBackRight";

export class Pawn extends Piece {
  constructor(x: number, y: number, team: Team) {
    super(x, y, team, "Pawn");
    const moveOptions = {
      distanceLength: 1,
      distanceWidth: 1,
      canFly: true,
    };

    this.MoveRules = [
      new ElbowMoveFrontRight(moveOptions),
      new ElbowMoveFrontLeft(moveOptions),
      new ElbowMoveBackLeft(moveOptions),
      new ElbowMoveBackRight(moveOptions),
    ];
  }
}

import { Piece } from "../../Piece";
import { Team } from "../../Team";
import { HorizontalMove } from "../../MoveRules/Standard/HorizontalMove";
import { VerticalMove } from "../../MoveRules/Standard/VerticalMove";
import { CannotAttackFriends } from "../../MoveRestrictions/Standard/CannotAttackFriends";
import { ElbowMoveFrontLeft } from "../../MoveRules/Standard/ElbowMoveFrontLeft";
import { ElbowMoveBackRight } from "../../MoveRules/Standard/ElbowMoveBackRight";
import { ElbowMoveBackLeft } from "../../MoveRules/Standard/ElbowMoveBackLeft";
import { ElbowMoveFrontRight } from "../../MoveRules/Standard/ElbowMoveFrontRight";

export class Mann extends Piece {
  constructor(x: number, y: number, team: Team) {
    super(x, y, team, "Mann");

    this.PointValue = 5;
    this.MoveRules = [
      new ElbowMoveBackLeft({
        distanceLength: 2,
        distanceWidth: 1,
        canFly: true,
      }),
      new ElbowMoveFrontLeft({
        distanceLength: 4,
        distanceWidth: 2,
        canFly: true,
      }),
      new ElbowMoveBackRight({
        distanceLength: 2,
        distanceWidth: 1,
        canFly: true,
      }),
      new ElbowMoveFrontRight({
        distanceLength: 4,
        distanceWidth: 2,
        canFly: true,
      }),
    ];
  }
}

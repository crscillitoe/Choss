import { Piece } from "../../Piece";
import { Team } from "../../Team";
import { ElbowMove } from "../../MoveRules/Standard/ElbowMove";
import { CannotAttackFriends } from "../../MoveRestrictions/Standard/CannotAttackFriends";

export class Knight extends Piece {
  constructor(x: number, y: number, team: Team) {
    super(x, y, team, "Knight");

    this.PointValue = 3;
    this.MoveRules = [
      new ElbowMove({ distanceLength: 2, distanceWidth: 1, canFly: true }),
    ];

    this.MoveRestrictions = [new CannotAttackFriends()];
  }
}

import { Piece } from "../../Piece";
import { Team } from "../../Team";
import { VerticalMove } from "../../MoveRules/Standard/VerticalMove";
import {
  ElbowMove,
  ElbowMoveOptions,
} from "../../MoveRules/Standard/ElbowMove";

export class Pawn extends Piece {
  constructor(x: number, y: number, team: Team) {
    super(x, y, team, "Pawn");

    this.MoveRules = [
      new ElbowMove({ distanceLength: 1, distanceWidth: 1, canFly: false }),
    ];
  }
}

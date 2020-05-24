import { Piece } from "../../Piece";
import { Team } from "../../Team";
import { HorizontalMove } from "../../MoveRules/Standard/HorizontalMove";
import { VerticalMove } from "../../MoveRules/Standard/VerticalMove";

export class Bishop extends Piece {
  constructor(x: number, y: number, team: Team) {
    super(x, y, team, "Bishop");

    this.MoveRules = [];
  }
}

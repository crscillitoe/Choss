import { Piece } from "../../Piece";
import { Team } from "../../Team";
import { HorizontalMove } from "../../MoveRules/Standard/HorizontalMove";
import { VerticalMove } from "../../MoveRules/Standard/VerticalMove";
import { DiagonalLeftMove } from "../../MoveRules/Standard/DiagonalLeftMove";
import { DiagonalRightMove } from "../../MoveRules/Standard/DiagonalRightMove";

export class Bishop extends Piece {
  constructor(x: number, y: number, team: Team) {
    super(x, y, team, "Bishop");

    this.MoveRules = [new DiagonalLeftMove(-1), new DiagonalRightMove(-1)];
  }
}

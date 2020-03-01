import { Piece } from "../../Piece";
import { Team } from "../../Team";
import { Board } from "../../Board";
import { HorizontalMove } from "../../MoveRules/Standard/HorizontalMove";
import { VerticalMove } from "../../MoveRules/Standard/VerticalMove";

export class King extends Piece {
  constructor(x: number, y: number, team: Team, board: Board) {
    super(x, y, team, board, "King");

    this.MoveRules = [new HorizontalMove(1), new VerticalMove(1)];
  }
}

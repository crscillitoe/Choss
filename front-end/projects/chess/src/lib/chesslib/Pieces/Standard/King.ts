import { Piece } from "../../Piece";
import { Team } from "../../Team";
import { Board } from "../../Board";
import { HorizontalMove } from "../../MoveRules/Standard/HorizontalMove";
import { VerticalMove } from "../../MoveRules/Standard/VerticalMove";
import { DiagonalLeftMove } from "../../MoveRules/Standard/DiagonalLeftMove";
import { DiagonalRightMove } from "../../MoveRules/Standard/DiagonalRightMove";

export class King extends Piece {
  constructor(x: number, y: number, team: Team, board: Board) {
    super(x, y, team, board, "King");

    this.MoveRules = [
      new HorizontalMove(1),
      new VerticalMove(1),
      new DiagonalLeftMove(1),
      new DiagonalRightMove(1)
    ];
  }
}

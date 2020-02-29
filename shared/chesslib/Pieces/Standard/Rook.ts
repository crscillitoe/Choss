import { Piece } from "../../Piece";
import { Team } from "../../Player";
import { Board } from "../../Board";
import { HorizontalMove } from "../../MoveRules/Standard/HorizontalMove";

export class Pawn extends Piece {
  constructor(x: number, y: number, team: Team, board: Board) {
    super(x, y, team, board);

    this.MoveRules = [new HorizontalMove(-1)];
  }
}

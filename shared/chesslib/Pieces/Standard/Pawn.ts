import { Piece } from "../../Piece";
import { Team } from "../../Team";
import { Board } from "../../Board";

export class Pawn extends Piece {
  constructor(x: number, y: number, team: Team, board: Board) {
    super(x, y, team, board);

    this.MoveRules = [];
  }
}

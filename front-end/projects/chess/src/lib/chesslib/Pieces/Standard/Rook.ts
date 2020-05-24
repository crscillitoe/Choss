import { Piece } from "../../Piece";
import { Team } from "../../Team";
import { HorizontalMove } from "../../MoveRules/Standard/HorizontalMove";

export class Pawn extends Piece {
  constructor(x: number, y: number, team: Team) {
    super(x, y, team, "Rook");

    this.MoveRules = [new HorizontalMove(-1)];
  }
}

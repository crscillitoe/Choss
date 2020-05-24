import { Piece } from "../../Piece";
import { Team } from "../../Team";

export class Pawn extends Piece {
  constructor(x: number, y: number, team: Team) {
    super(x, y, team, "Pawn");

    this.MoveRules = [];
  }
}

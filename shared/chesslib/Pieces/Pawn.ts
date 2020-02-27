import { Piece } from "../Piece";
import { Team } from "../Player";
import { Board } from "../Board";
import { CannotMoveOverOtherPieces } from "../MoveRules/CannotMoveOverOtherPieces";

export class Pawn extends Piece {
  constructor(x: number, y: number, team: Team, board: Board) {
    super(x, y, team, board);

    this.MoveRules = [new CannotMoveOverOtherPieces()];
  }
}

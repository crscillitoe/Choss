import { Piece } from "../../Piece";
import { Team } from "../../Team";
import { VerticalMove } from "../../MoveRules/Standard/VerticalMove";
import {
  ElbowMove,
  ElbowMoveOptions,
} from "../../MoveRules/Standard/ElbowMove";
import { ForwardRestriction } from "../../MoveRestrictions/Standard/ForwardRestriction";
import { PawnDoubleMove } from "../../MoveRules/Standard/PawnDoubleMove";
import { DiagonalMoveOnlyIfAttack } from "../../MoveRestrictions/Standard/DiagonalMoveOnlyIfAttack";
import { CannotAttackPiecesVertically } from "../../MoveRestrictions/Standard/CannotAttackPiecesVertically";
import { CannotAttackFriends } from "../../MoveRestrictions/Standard/CannotAttackFriends";

export class Pawn extends Piece {
  constructor(x: number, y: number, team: Team) {
    super(x, y, team, "Pawn");

    this.MoveRules = [
      new ElbowMove({ distanceLength: 1, distanceWidth: 1, canFly: true }),
      new VerticalMove(1),
      new PawnDoubleMove(),
    ];

    this.MoveRestrictions = [
      new ForwardRestriction(),
      new DiagonalMoveOnlyIfAttack(),
      new CannotAttackPiecesVertically(),
      new CannotAttackFriends(),
    ];
  }
}

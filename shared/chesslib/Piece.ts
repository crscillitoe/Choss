import { MoveRule } from "./MoveRule";
import { Board } from "./Board";
import { Coordinate } from "./Coordinate";

import { Team } from "./Player";

/**
 * Contains all the information needed for a single piece
 */
export abstract class Piece {
  MoveRules: MoveRule[];
  Board: Board;
  Coordinate: Coordinate;
  Team: Team;

  constructor(x: number, y: number, team: Team, board: Board) {
    this.Coordinate = {
      x: x,
      y: y
    };

    this.Team = team;
    this.Board = board;
  }
}

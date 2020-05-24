import { MoveRule } from "./MoveRule";
import { Board } from "./Board";
import { Coordinate } from "./Coordinate";

import { Team } from "./Team";

/**
 * Contains all the information needed for a single piece
 */
export abstract class Piece {
  MoveRules: MoveRule[];
  Coordinate: Coordinate;
  Team: Team;
  SVGName: string;
  KillCount: number = 0;

  constructor(x: number, y: number, team: Team, SVGName: string) {
    this.Coordinate = {
      x: x,
      y: y,
    };

    if (team === Team.WHITE) {
      this.SVGName = `White_${SVGName}.svg`;
    } else {
      this.SVGName = `Black_${SVGName}.svg`;
    }

    this.Team = team;
  }

  /**
   * Returns a set of squares that this piece can legally move to.
   */
  getValidSquares(board: Board): Set<Coordinate> {
    let coordinates = new Set<Coordinate>();

    for (const moveRule of this.MoveRules) {
      for (const coordinate of moveRule.ValidSqures(this, board)) {
        coordinates.add(coordinate);
      }
    }

    return coordinates;
  }

  /**
   * Checks if the given square can be moved onto.
   *
   * @param x The x coordinate to move the piece to
   * @param y The y coordinate to move the piece to
   */
  isValidSquare(x: number, y: number, board: Board): boolean {
    for (const coordinate of Array.from(this.getValidSquares(board))) {
      if (coordinate.x === x && coordinate.y === y) {
        return true;
      }
    }
  }
}

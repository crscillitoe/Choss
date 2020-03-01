import { MoveRule } from "./MoveRule";
import { Board } from "./Board";
import { Coordinate } from "./Coordinate";

import { Team } from "./Team";

/**
 * Contains all the information needed for a single piece
 */
export abstract class Piece {
  MoveRules: MoveRule[];
  Board: Board;
  Coordinate: Coordinate;
  Team: Team;
  SVGName: string;

  constructor(x: number, y: number, team: Team, board: Board, SVGName: string) {
    this.Coordinate = {
      x: x,
      y: y
    };

    if (team === Team.WHITE) {
      this.SVGName = `White_${SVGName}.svg`;
    } else {
      this.SVGName = `Black_${SVGName}.svg`;
    }

    this.Team = team;
    this.Board = board;
  }

  /**
   * Returns a set of squares that this piece can legally move to.
   */
  getValidSquares(): Set<Coordinate> {
    let coordinates = new Set<Coordinate>();

    for (const moveRule of this.MoveRules) {
      for (const coordinate of moveRule.ValidSqures(this, this.Board)) {
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
  isValidSquare(x: number, y: number): boolean {
    for (const coordinate of Array.from(this.getValidSquares())) {
      if (coordinate.x === x && coordinate.y === y) {
        return true;
      }
    }
  }
}

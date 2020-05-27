import { Board } from "./Board";

/**
 * Represents a position on the board.
 * Coordinates will range from 1, 1 (A1)
 * to Board.Width, Board.Height
 */
export class Coordinate {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  /**
   * Returns a list of all coordinates starting at this coordinate,
   * and ending at the target coordinate. Inclusive.
   *
   * Throws error if it walks out of bounds.
   *
   * @param target the target coordinate
   * @param board the board the coordinate is on
   */
  getAllCoordinatesBetween(target: Coordinate, board: Board): Coordinate[] {
    throw new Error("Not implemented");
  }

  /**
   * Returns a list of all adjacent coordinates that are on the board
   * for the current coordinate.
   *
   * @param board the board the coordinate is on
   */
  getAllAdjacentCoordinatesOnBoard(board: Board): Coordinate[] {
    throw new Error("Not implemented");
  }

  /**
   * Returns up to two paths to the given target while only using one
   * horizontal move, and one vertical move.
   *
   * @param target the target coordinate
   * @param board the board the coordinate is on
   */
  getAllCoordinatesInLMove(
    target: Coordinate,
    board: Board
  ): Array<Coordinate[]> {
    throw new Error("Not implemented");
  }

  /**
   * Walks in the given direction until the edge of the board is reached.
   * Returns all coordinates found.
   */
  getAllCoordinatesInDirection(
    deltaX: number,
    deltaY: number,
    maxDistance: number,
    board: Board
  ): Coordinate[] {
    let toReturn: Coordinate[] = [];

    let startCoord = new Coordinate(this.x, this.y);

    while (true) {
      const toAdd: Coordinate = new Coordinate(
        startCoord.x + deltaX,
        startCoord.y + deltaY
      );

      if (toReturn.length === maxDistance) {
        break;
      }

      if (board.isOnBoard(toAdd)) {
        toReturn.push(toAdd);

        startCoord.x += deltaX;
        startCoord.y += deltaY;
      } else {
        break;
      }
    }

    return toReturn;
  }

  /**
   * Returns true if the given coordinate has the same x and y values
   * as this coordinate.
   *
   * @param other
   */
  static equals(a: Coordinate, b: Coordinate): boolean {
    return a.x === b.x && a.y === b.y;
  }
}

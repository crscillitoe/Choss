import { Piece } from "./Piece";
import { Coordinate } from "./Coordinate";
import { Move } from "./Move";

/**
 * A board contains a list of pieces on the board.
 */
export class Board {
  Pieces: Piece[];
  Height: number;
  Width: number;
  MoveHistory: Move[] = [];

  constructor(Pieces: Piece[], Height: number, Width: number) {
    this.Pieces = Pieces;
    this.Height = Height;
    this.Width = Width;
  }

  /**
   * Records the given move into the history
   * @param piece
   * @param pointA
   * @param pointB
   */
  logMove(piece: Piece, pointA: Coordinate, pointB: Coordinate) {
    this.MoveHistory.push({
      PointA: pointA,
      PointB: pointB,
      PieceMoved: piece
    });

    piece.TimesMoved++;
  }

  /**
   * Given a coordinate on the board, this function will return
   * the piece at the given location
   *
   * @returns `null` If no piece is found.
   *
   * @param x The x coordinate of the piece (1,1 is top left)
   * @param y The y coordinate of the piece (1,1 is top left)
   */
  getPieceAtCoordinate(coord: Coordinate): Piece {
    for (let Piece of this.Pieces) {
      if (Coordinate.equals(Piece.Coordinate, coord)) {
        return Piece;
      }
    }

    return null;
  }

  /**
   * Removes the given piece from the board's internal
   * array of pieces.
   *
   * @param Prey Piece to remove from the board
   */
  killPiece(Prey: Piece): void {
    this.Pieces = this.Pieces.filter(piece => piece !== Prey);
  }

  /**
   * Iterates over the given coords, and stops when a piece is found.
   * returns all coords up to the piece, including the coord of the piece.
   *
   * @param coords
   */
  stopAtPiece(coords: Coordinate[]): Coordinate[] {
    let toReturn: Coordinate[] = [];

    for (const coord of coords) {
      toReturn.push(coord);

      if (this.getPieceAtCoordinate(coord)) {
        break;
      }
    }

    return toReturn;
  }

  /**
   * Returns true if the given coordinate is on the board.
   *
   * @param coord
   */
  isOnBoard(coord: Coordinate): boolean {
    return (
      coord.x <= this.Width &&
      coord.y <= this.Height &&
      coord.x >= 1 &&
      coord.y >= 1
    );
  }

  /**
   * Returns an array containing every coordinate on the board.
   * Useful for filtering.
   */
  getAllSquares(): Coordinate[] {
    let toReturn: Coordinate[] = [];
    for (let x = 1; x <= this.Width; x++) {
      for (let y = 1; y <= this.Height; y++) {
        toReturn.push(new Coordinate(x, y));
      }
    }

    return toReturn;
  }
}

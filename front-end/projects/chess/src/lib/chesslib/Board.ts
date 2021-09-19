import { Piece } from "./Piece";
import { Coordinate } from "./Coordinate";
import { Move } from "./Move";
import { TeamOption, Team } from "./Team";
import { Pawn } from "./Pieces/Standard/Pawn";
import { Timer } from "./Timer";
import { ColoredSquare } from "./ColoredSquare";

/**
 * A board contains a list of pieces on the board.
 */
export class Board {
  seed: number = 0;
  Pieces: Piece[];
  Height: number;
  Width: number;
  MoveHistory: Move[] = [];
  Timer: Timer;
  ColorMap: { [coordinate: string]: ColoredSquare } = {};

  constructor(Pieces: Piece[], Height: number, Width: number) {
    this.Pieces = Pieces;
    this.Height = Height;
    this.Width = Width;
  }

  hasWhiteKing(): boolean {
    for (const piece of this.Pieces) {
      if (piece.isKing() && piece.Team.teamOption === TeamOption.WHITE) {
        return true;
      }
    }

    return false;
  }

  hasBlackKing(): boolean {
    for (const piece of this.Pieces) {
      if (piece.isKing() && piece.Team.teamOption === TeamOption.BLACK) {
        return true;
      }
    }

    return false;
  }

  getMovedTo(): Coordinate[] {
    if (this.MoveHistory.length > 0) {
      const move = this.MoveHistory[this.MoveHistory.length - 1];
      return [move.PointA, move.PointB];
    }

    return [];
  }

  expand() {
    this.Width += 2;
    this.Height += 2;

    if (this.MoveHistory.length > 0) {
      const lastMove = this.MoveHistory[this.MoveHistory.length - 1];
      lastMove.PointA.x += 1;
      lastMove.PointA.y += 1;
      lastMove.PointB.x += 1;
      lastMove.PointB.y += 1;
    }

    let piecesToUpdate: Piece[] = [];
    for (const coord of this.getAllSquares()) {
      const piece = this.getPieceAtCoordinate(coord);
      if (piece) {
        piecesToUpdate.push(piece);
      }
    }

    for (const piece of piecesToUpdate) {
      piece.Coordinate.x += 1;
      piece.Coordinate.y += 1;
    }
  }

  /**
   * Fills the given row with pawns.
   *
   * @param row
   * @param team
   */
  fillRowWithPawns(row: number, team: TeamOption) {
    for (let i = 1; i <= this.Width; i++) {
      this.Pieces.push(new Pawn(i, row, new Team(team)));
    }
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
      PieceMoved: piece,
    });

    piece.TimesMoved++;
  }

  /**
   * Returns a random piece on the board.
   */
  getRandomPiece(): Piece {
    return this.Pieces[this.randomInt(0, this.Pieces.length)];
  }

  private randomInt(min: number, max: number) {
    return Math.floor(this.random() * (max - min + 1) + min);
  }

  random() {
    var x = Math.sin(++this.seed) * 10000;
    return x - Math.floor(x);
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
    this.Pieces = this.Pieces.filter((piece) => piece !== Prey);
  }

  /**
   * Iterates over the given coords and finds the indices
   * of all pieces within
   * @param coords
   */
  identifyPieces(coords: Coordinate[]): number[] {
    let toReturn: number[] = [];
    for (let i = 0; i < coords.length; i++) {
      const coord = coords[i];
      if (this.getPieceAtCoordinate(coord)) {
        toReturn.push(i);
      }
    }
    return toReturn;
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

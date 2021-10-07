// import { ChessInstance, Square } from "chess.js";
import { ChessInstance, Square } from "chess.js";
import { ColoredSquare } from "./ColoredSquare";
import { Coordinate } from "./Coordinate";
import { Move } from "./Move";
import { Piece } from "./Piece";
import { Bishop } from "./Pieces/Standard/Bishop";
import { King } from "./Pieces/Standard/King";
import { Knight } from "./Pieces/Standard/Knight";
import { Pawn } from "./Pieces/Standard/Pawn";
import { Queen } from "./Pieces/Standard/Queen";
import { Rook } from "./Pieces/Standard/Rook";
import { Team, TeamOption } from "./Team";
import { Timer } from "./Timer";

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

  updateFromChessJS(chess: ChessInstance) {
    this.Pieces = [];
    const columnNames = ["h", "g", "f", "e", "d", "c", "b", "a"];
    for (const row of [0, 1, 2, 3, 4, 5, 6, 7]) {
      for (const col of [1, 2, 3, 4, 5, 6, 7, 8]) {
        const piece = chess.get((columnNames[row] + col) as Square);
        if (piece) {
          const team =
            piece.color === "w" ? TeamOption.WHITE : TeamOption.BLACK;
          if (piece.type === "p") {
            this.Pieces.push(new Pawn(row + 1, col, new Team(team)));
          } else if (piece.type === "k") {
            this.Pieces.push(new King(row + 1, col, new Team(team)));
          } else if (piece.type === "q") {
            this.Pieces.push(new Queen(row + 1, col, new Team(team)));
          } else if (piece.type === "r") {
            this.Pieces.push(new Rook(row + 1, col, new Team(team)));
          } else if (piece.type === "b") {
            this.Pieces.push(new Bishop(row + 1, col, new Team(team)));
          } else if (piece.type === "n") {
            this.Pieces.push(new Knight(row + 1, col, new Team(team)));
          }
        }
      }
    }

    const history = chess.history({ verbose: true });
    if (history.length > 0) {
      this.MoveHistory.push({
        PointA: this.squareToCoordinate(history[history.length - 1].from),
        PointB: this.squareToCoordinate(history[history.length - 1].to),
      });
    }
  }

  squareToCoordinate(square: Square): Coordinate {
    return new Coordinate(this.letterToNumber(square[0]), +square[1]);
  }

  letterToNumber(letter: string): number {
    return 8 - (letter.charCodeAt(0) - 97);
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

  private randomInt(min, max) {
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

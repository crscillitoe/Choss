import { Piece } from "./Piece";

/**
 * A board contains a list of pieces on the board.
 */
export class Board {
  Pieces: Piece[];
  Height: number;
  Width: number;

  constructor(Pieces: Piece[], Height: number, Width: number) {
    this.Pieces = Pieces;
    this.Height = Height;
    this.Width = Width;
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
  getPieceAtCoordinate(x: number, y: number): Piece {
    for (let Piece of this.Pieces) {
      if (Piece.Coordinate.x === x && Piece.Coordinate.y === y) {
        return Piece;
      }
    }
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
}

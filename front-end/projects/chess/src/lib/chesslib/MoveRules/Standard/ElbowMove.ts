import { MoveRule } from "../../MoveRule";
import { Board } from "../../Board";
import { Piece } from "../../Piece";
import { Coordinate } from "../../Coordinate";
import { Quadrant } from "../../Quadrant";

/**
 * Allows the piece to move `distanceLength`, `distanceWidth` spaces.
 * The piece may optionally move to `numStations` coordinates along
 * that path. If the destination station is blocked, the piece may move
 * to any earlier station if the `mustReachDestination` flag is set to False.
 * If `canFly` is set to True, the piece may move over any piece not found
 * within `tallPieces` on the board. ElbowMove will refuse to allow moves
 * into the `Quadrants` defined in `disallowedQuadrants`.
 */
export class ElbowMove implements MoveRule {
  private distanceLength: number;
  private distanceWidth: number;
  private numStations: number;
  private canFly: boolean;
  private tallPieces: Piece[];
  private disallowedQuadrants: Quadrant[];
  constructor(moveOptions: ElbowMoveOptions) {
    this.distanceLength = moveOptions.distanceLength || 1;
    this.distanceWidth = moveOptions.distanceWidth || 1;
    this.numStations = moveOptions.numStations || 2;
    if (this.numStations < 2) {
      this.numStations = 2;
    }
    this.canFly = moveOptions.canFly || false;
    this.tallPieces = moveOptions.tallPieces || [];
    this.disallowedQuadrants = moveOptions.disallowedQuadrants || [];
  }

  private checkPath(
    piece: Piece,
    board: Board,
    verticalMax: number,
    horizontalMax: number,
    delta: number
  ): Coordinate[] {
    for (let xDelta = 1 * delta; xDelta < horizontalMax; xDelta += delta) {
      const xCoord = piece.Coordinate.x + xDelta;
      if (xCoord > board.Width || xCoord < 1) {
        return [];
      }

      const currentPiece = board.getPieceAtCoordinate(
        xCoord,
        piece.Coordinate.y
      );

      if (currentPiece !== null && !this.canFly) {
        return [];
      }
    }

    const newXCoord = piece.Coordinate.x + horizontalMax * delta;
    for (let yDelta = 1 * delta; yDelta < verticalMax; yDelta += delta) {
      const yCoord = piece.Coordinate.y + yDelta;
      if (yCoord > board.Height || yCoord < 1) {
        return [];
      }

      const currentPiece = board.getPieceAtCoordinate(
        piece.Coordinate.x,
        yCoord
      );

      if (currentPiece !== null && !this.canFly) {
        return [];
      }
    }
    return [
      {
        x: piece.Coordinate.x + horizontalMax,
        y: piece.Coordinate.y + verticalMax,
      },
    ];
  }

  ValidSqures(piece: Piece, board: Board): Coordinate[] {
    let valid = this.checkPath(
      piece,
      board,
      this.distanceLength,
      this.distanceWidth,
      1
    );
    valid.concat(
      this.checkPath(piece, board, this.distanceLength, this.distanceWidth, -1)
    );
    valid.concat(
      this.checkPath(piece, board, this.distanceWidth, this.distanceLength, 1)
    );
    valid.concat(
      this.checkPath(piece, board, this.distanceWidth, this.distanceLength, -1)
    );
    return valid;
  }
}

/**
 * @param distanceLength: Long arm of maximal elbow move
 * @param distanceWidth: Short arm of maximal elbow move
 * @param numStations: Number of stations between source and maximal elbow move. Minimum of 2.
 * @param mustReachDestination: True if a piece must be able to make the maximal elbow move in order to move to any of its stations.
 * @param canFly: True if a piece may move with other pieces in its path
 * @param tallPieces: List of Pieces that prevent this piece from moving if they are in its path.
 * @param disallowedQuadrants: Quadrants which the piece may not move into
 * @param canKillFriends: Can take friendly pieces
 */
export interface ElbowMoveOptions {
  distanceLength?: number;
  distanceWidth?: number;
  numStations?: number;
  mustReachDestination?: boolean;
  canFly?: boolean;
  tallPieces?: Piece[];
  disallowedQuadrants?: Quadrant[];
  canKillFriends?: boolean;
}

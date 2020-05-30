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
export abstract class ElbowMove {
  protected distanceLength: number;
  protected distanceWidth: number;
  protected numStations: number;
  protected mustReachDestination: boolean;
  protected isTallPiece: (movingPiece: Piece, blockingPiece: Piece) => boolean;

  ALL_TALL = (movingPiece: Piece, blockingPiece: Piece): boolean => true;
  ALL_SHORT = (movingPiece: Piece, blockingPiece: Piece): boolean => false;

  constructor(moveOptions: ElbowMoveOptions) {
    this.distanceLength = moveOptions.distanceLength || 1;
    this.distanceWidth = moveOptions.distanceWidth || 1;
    this.numStations = moveOptions.numStations || 2;
    if (this.numStations < 2) {
      this.numStations = 2;
    }
    this.isTallPiece = moveOptions.isTallPiece || this.ALL_SHORT;
    this.mustReachDestination = moveOptions.mustReachDestination || true;
  }

  private canWalkTo(
    board: Board,
    movingPiece: Piece,
    coordinate: Coordinate,
    max: number,
    delta: number,
    horizontal: boolean
  ): boolean {
    for (
      let coordDelta = 1 * delta;
      coordDelta < max * delta;
      coordDelta += delta
    ) {
      const currCoord = horizontal
        ? coordinate.x + coordDelta
        : coordinate.y + coordDelta;

      if (currCoord === board.Height || currCoord < 1) {
        return false;
      }

      const blockingPiece = horizontal
        ? board.getPieceAtCoordinate(new Coordinate(currCoord, coordinate.y))
        : board.getPieceAtCoordinate(new Coordinate(coordinate.x, currCoord));

      if (blockingPiece && this.isTallPiece(movingPiece, blockingPiece)) {
        return false;
      }
    }
    return true;
  }

  protected checkPath(
    piece: Piece,
    board: Board,
    verticalMax: number,
    horizontalMax: number,
    deltaX: number,
    deltaY: number
  ): Coordinate[] {
    if (
      (this.canWalkTo(
        board,
        piece,
        piece.Coordinate,
        horizontalMax,
        deltaX,
        true
      ) &&
        this.canWalkTo(
          board,
          piece,
          new Coordinate(
            piece.Coordinate.x + horizontalMax,
            piece.Coordinate.y
          ),
          verticalMax,
          deltaY,
          false
        )) ||
      (this.canWalkTo(
        board,
        piece,
        piece.Coordinate,
        verticalMax,
        deltaY,
        false
      ) &&
        this.canWalkTo(
          board,
          piece,
          new Coordinate(piece.Coordinate.x, piece.Coordinate.y + verticalMax),
          horizontalMax,
          deltaX,
          true
        ))
    ) {
      return [
        new Coordinate(
          piece.Coordinate.x + horizontalMax * deltaX,
          piece.Coordinate.y + verticalMax * deltaY
        ),
      ];
    }

    return [];
  }
}

/**
 * @param distanceLength: Long arm of maximal elbow move
 * @param distanceWidth: Short arm of maximal elbow move
 * @param numStations: Number of stations between source and maximal elbow move. Minimum of 2.
 * @param mustReachDestination: True if a piece must be able to make the maximal elbow move in order to move to any of its stations.
 * @param isTallPiece: Function to determine whether or not a piece may block the moving piece
 */
export interface ElbowMoveOptions {
  distanceLength?: number;
  distanceWidth?: number;
  numStations?: number;
  mustReachDestination?: boolean;
  isTallPiece?: (movingPiece: Piece, blockingPiece: Piece) => boolean;
}

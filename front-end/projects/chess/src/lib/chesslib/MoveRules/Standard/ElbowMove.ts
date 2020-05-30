import { MoveRule } from "../../MoveRule";
import { Board } from "../../Board";
import { Piece } from "../../Piece";
import { Coordinate } from "../../Coordinate";
import { Quadrant } from "../../Quadrant";

interface WalkResult {
  canReachDestination: boolean;
  intermediateCoordinates: Coordinate[];
}

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

  protected getStations(
    source: Coordinate,
    target: Coordinate,
    board: Board
  ): Coordinate[] {
    const pathways = source.getAllCoordinatesInLMove(target, board);
    const movingPiece = board.getPieceAtCoordinate(source);
    let anyValidPath = false;

    for (const path of pathways) {
      const pieceIndices = board.identifyPieces(path);
      const pieces = pieceIndices.map((i) =>
        board.getPieceAtCoordinate(path[i])
      );
      let currentPathValid = true;
      pieces.forEach((blockingPiece) => {
        if (
          this.isTallPiece(movingPiece, blockingPiece) &&
          !Coordinate.equals(blockingPiece.Coordinate, target) &&
          this.mustReachDestination
        ) {
          currentPathValid = false;
        }
      });
      anyValidPath = anyValidPath || currentPathValid;
    }
    return anyValidPath ? [target] : [];
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

/**
 * Distance to destination (including dest) / number of stops - 1
 * Round to the nearest whole number
 * Walk from src to dest once, walk from dest to src once
 */

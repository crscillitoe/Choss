import { GameMode } from "../GameMode";
import { Board } from "../Board";
import { Team } from "../Team";
import { Move } from "../Move";
import { GameState } from "../GameState";
import { Game } from "../Game";

export class DoubleMove implements GameMode {
  /**
   * In `DoubleMove`, each player is allowed to make
   * *two* moves before their turn is concluded.
   *
   * We will keep track of this in memory.
   *
   * Instead of applying checkmate, which would be difficult to
   * detect, a win in `DoubleMove` is acquired by capturing
   * the enemy King. This way we do not have to implement
   * complex analysis that looks multiple moves ahead to see
   * if the player is in "check".
   *
   * @param Player The player making the move
   * @param Move The desired move to be performed
   */
  HandleMove(Player: Team, Move: Move, Board: Board): boolean {
    let Piece = Board.getPieceAtCoordinate(Move.PointA.x, Move.PointA.y);
    if (Piece) {
      Piece.Coordinate = Move.PointB;
      return true;
    }

    return false;
  }

  BuildFreshGame(): Game {
    throw new Error("Method not implemented.");
  }
}

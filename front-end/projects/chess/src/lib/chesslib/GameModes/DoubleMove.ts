import { GameMode } from "../GameMode";
import { Board } from "../Board";
import { Team } from "../Team";
import { Move } from "../Move";
import { GameState } from "../GameState";
import { Game } from "../Game";
import { King } from "../Pieces/Standard/King";
import { Pawn } from "../Pieces/Standard/Pawn";

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
  HandleMove(Player: Team, Move: Move, GameState: Game): boolean {
    let Piece = GameState.BoardState.getPieceAtCoordinate(
      Move.PointA.x,
      Move.PointA.y
    );
    if (Piece) {
      Piece.Coordinate = Move.PointB;
      return true;
    }

    return false;
  }

  BuildFreshGame(): Game {
    const board = new Board([], 8, 8);
    board.Pieces.push(new King(4, 4, Team.BLACK));
    board.Pieces.push(new Pawn(2, 2, Team.WHITE));
    return new Game(board, GameState.IN_PROGRESS_WHITE_TURN);
  }
}

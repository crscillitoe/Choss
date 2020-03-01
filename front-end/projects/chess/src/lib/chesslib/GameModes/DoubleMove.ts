import { GameMode } from "../GameMode";
import { Board } from "../Board";
import { Team } from "../Player";
import { Move } from "../Move";
import { GameState } from "../GameState";

export class DoubleMove extends GameMode {
  constructor(Board: Board) {
    super(Board);
  }

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
  HandleMove(Player: Team, Move: Move): boolean {
    throw new Error("Not Implemented");
  }

  /**
   * Returns the current state of the game.
   */
  GetGameState(): GameState {
    throw new Error("Not Implemented");
  }
}

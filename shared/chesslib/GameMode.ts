import { Team } from "./Player";
import { Move } from "./Move";
import { Board } from "./Board";
import { GameState } from "./GameState";

export abstract class GameMode {
  Board: Board;

  constructor(Board: Board) {
    this.Board = Board;
  }

  /**
   * Requests the currently selected gamemode to
   * perform the given move.
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

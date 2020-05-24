import { Team } from "./Team";
import { Move } from "./Move";
import { Board } from "./Board";
import { GameState } from "./GameState";
import { Game } from './Game';

export interface GameMode {
  /**
   * Sets the board up for a brand new game.
   */
  BuildFreshGame(): Game;

  /**
  * Requests the currently selected gamemode to
  * perform the given move.
  * @param Player The player making the move
  * @param Move The desired move to be performed
  */
  HandleMove(Player: Team, Move: Move, Board: Board): void;
}

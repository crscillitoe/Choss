import { Team } from "./Team";
import { Move } from "./Move";
import { Board } from "./Board";
import { GameState } from "./GameState";
import { Game } from "./Game";
import { Coordinate } from "./Coordinate";
import { Piece } from "./Piece";

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
   * @param GameState The current board state
   */
  HandleMove(Player: Team, Move: Move, GameState: Game): void;

  /**
   * The predator hunts its' prey, and the gamemode will define
   * how this piece taking will occur.
   * @param Predator The piece doing the taking
   * @param Prey The piece getting taken
   * @param GameState The current board state
   */
  TakePiece(Predator: Piece, Prey: Piece, GameState: Game): void;
}

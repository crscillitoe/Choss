import { Board } from "./Board";
import { GameState } from "./GameState";
import { GameMode } from "./GameMode";

export class Game {
  BoardState: Board;
  State: GameState;

  constructor(
    BoardState: Board,
    State: GameState = GameState.IN_PROGRESS_WHITE_TURN
  ) {
    this.BoardState = BoardState;
    this.State = State;
  }

  isGameOver() {
    return (
      this.State === GameState.BLACK_WIN ||
      this.State === GameState.WHITE_WIN ||
      this.State === GameState.DRAW
    );
  }
}

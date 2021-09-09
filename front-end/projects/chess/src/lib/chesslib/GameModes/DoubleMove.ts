import { Game } from "../Game";
import { GameMode } from "../GameMode";
import { GameState } from "../GameState";
import { Move } from "../Move";

export class DoubleMove extends GameMode {
  turnCounter: number;
  constructor() {
    super();
    this.turnCounter = 0;
  }

  getMoveLength(): number {
    return 2;
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
  async HandleMove(Move: Move, BoardGameState: Game): Promise<boolean> {
    const madeMove = await super.HandleMove(Move, BoardGameState);
    if (BoardGameState.isGameOver()) {
      return madeMove;
    }

    if (!madeMove) return false;

    this.turnCounter++;

    // Next players' turn
    if (Math.floor(this.turnCounter / 2) % 2 === 0) {
      BoardGameState.State = GameState.IN_PROGRESS_WHITE_TURN;
    } else {
      BoardGameState.State = GameState.IN_PROGRESS_BLACK_TURN;
    }

    return true;
  }

  /**
   * Set turncounter to 0 since we are doublemove
   */
  static BuildFreshGame(seed: number): Game {
    let game = super.BuildFreshGame(seed);
    let doubleGame = new DoubleMove();
    doubleGame.turnCounter = 0;
    return game;
  }
}

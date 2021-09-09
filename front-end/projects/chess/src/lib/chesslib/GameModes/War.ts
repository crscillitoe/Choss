import { Game } from "../Game";
import { GameMode } from "../GameMode";
import { Move } from "../Move";

export class War extends GameMode {
  turnCounter: number = 0;
  expandCount: number = 0;
  constructor() {
    super();
    this.turnCounter = 0;
  }

  async HandleMove(Move: Move, BoardGameState: Game): Promise<boolean> {
    const madeMove = super.HandleMove(Move, BoardGameState);
    if (!madeMove) return false;

    this.turnCounter++;
    if (this.turnCounter % 10 === 0 && this.expandCount < 2) {
      BoardGameState.BoardState.expand();
      this.expandCount++;
    }

    return true;
  }

  static BuildFreshGame(seed: number): Game {
    return super.BuildFreshGame(seed);
  }
}

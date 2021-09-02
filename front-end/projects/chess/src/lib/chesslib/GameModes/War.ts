import { GameMode } from "../GameMode";
import { Board } from "../Board";
import { Team, TeamOption } from "../Team";
import { Move } from "../Move";
import { GameState } from "../GameState";
import { Game } from "../Game";
import { King } from "../Pieces/Standard/King";
import { Pawn } from "../Pieces/Standard/Pawn";
import { Rook } from "../Pieces/Standard/Rook";
import { Knight } from "../Pieces/Standard/Knight";
import { Bishop } from "../Pieces/Standard/Bishop";
import { Queen } from "../Pieces/Standard/Queen";
import { Piece } from "../Piece";
import { GameModeShared } from "./GameModeShared";
import { Giraffe } from "../Pieces/Non-Standard/Giraffe";
import { Mann } from "../Pieces/Non-Standard/Mann";
import { Coordinate } from "../Coordinate";

export class War extends GameMode {
  turncounter: number = 0;
  expandCount: number = 0;
  constructor() {
    super();
    this.turncounter = 0;
  }

  async HandleMove(Move: Move, BoardGameState: Game): Promise<boolean> {
    const madeMove = super.HandleMove(Move, BoardGameState);
    if (!madeMove) return false;

    this.turncounter++;
    if (this.turncounter % 10 === 0 && this.expandCount < 2) {
      BoardGameState.BoardState.expand();
      this.expandCount++;
    }

    return true;
  }

  static BuildFreshGame(seed: number): Game {
    return super.BuildFreshGame(seed);
  }
}

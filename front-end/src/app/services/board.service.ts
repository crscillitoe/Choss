import { Injectable } from "@angular/core";
import { Coordinate } from "projects/chess/src/lib/chesslib/Coordinate";
import { Game } from "projects/chess/src/lib/chesslib/Game";
import { GameMode } from "projects/chess/src/lib/chesslib/GameMode";
import { getGameModeById } from "projects/chess/src/lib/chesslib/GameModes/GameModeRegistry";
import { Move } from "projects/chess/src/lib/chesslib/Move";
import { Piece } from "projects/chess/src/lib/chesslib/Piece";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class BoardService {
  _gameMode: GameMode;
  gameInstance: BehaviorSubject<Game> = new BehaviorSubject<Game>(null);
  _gameInstance: Game;
  constructor() {}

  buildGame(gameModeId: number, seed: number) {
    this._gameInstance = getGameModeById(gameModeId).BuildFreshGame(seed);
    this.gameInstance.next(this._gameInstance);
    this._gameMode = new (<any>getGameModeById(gameModeId))();
  }

  getValidSquares(piece: Piece): Coordinate[] {
    return Array.from(piece.getValidSquares(this._gameInstance.BoardState));
  }

  getGameInstance() {
    return this.gameInstance;
  }

  evaluateMove(move: Move) {
    this._gameMode.TimerHandleMove(move, this._gameInstance);
    this.gameInstance.next(this._gameInstance);
  }
}

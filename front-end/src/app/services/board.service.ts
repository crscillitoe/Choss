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
  private _gameMode: GameMode;
  private gameInstance: BehaviorSubject<Game> = new BehaviorSubject<Game>(null);
  private validMoves: BehaviorSubject<Coordinate[]> = new BehaviorSubject<
    Coordinate[]
  >([]);
  private preMove: BehaviorSubject<Move> = new BehaviorSubject<Move>(null);
  private _preMove: Move = null;
  private _validMoves: Coordinate[] = [];
  private _gameInstance: Game;
  constructor() {}

  buildGame(gameModeId: number, seed: number) {
    this._gameInstance = getGameModeById(gameModeId).BuildFreshGame(seed);
    this.gameInstance.next(this._gameInstance);
    this._gameMode = new (<any>getGameModeById(gameModeId))();
  }

  requestValidSquares(piece: Piece) {
    this._validMoves = Array.from(
      piece.getValidSquares(this._gameInstance.BoardState)
    );
    this.validMoves.next(this._validMoves);
  }

  clearPieceSelection() {
    this._validMoves = [];
    this.validMoves.next(this._validMoves);
  }

  makePreMove(move: Move) {
    this._preMove = move;
    this.preMove.next(this._preMove);
  }

  clearPreMove() {
    this._preMove = null;
    this.preMove.next(this._preMove);
  }

  getCurrentValidSquares() {
    return this._validMoves;
  }

  getValidSquares() {
    return this.validMoves;
  }

  getCurrentGameInstance() {
    return this._gameInstance;
  }

  getGameInstance() {
    return this.gameInstance;
  }

  getCurrentPreMove() {
    return this._preMove;
  }

  getPreMove() {
    return this.preMove;
  }

  evaluateMove(move: Move) {
    if (Coordinate.equals(move.PointA, move.PointB)) return;
    this._gameMode.TimerHandleMove(move, this._gameInstance);
    this.gameInstance.next(this._gameInstance);
  }
}

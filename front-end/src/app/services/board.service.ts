import { Injectable } from "@angular/core";
import { MatSliderModule } from "@angular/material";
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
  public gameMode: GameMode;
  public preMove: Move = null;
  public validMoves: Coordinate[] = [];
  public gameInstance: Game;

  private __gameInstance: BehaviorSubject<Game> = new BehaviorSubject<Game>(
    null
  );
  private __validMoves: BehaviorSubject<Coordinate[]> = new BehaviorSubject<
    Coordinate[]
  >([]);
  private __preMove: BehaviorSubject<Move> = new BehaviorSubject<Move>(null);
  private __previousMove: BehaviorSubject<Move> = new BehaviorSubject<Move>(
    null
  );
  constructor() {}

  buildGame(gameModeId: number, seed: number) {
    this.gameInstance = getGameModeById(gameModeId).BuildFreshGame(seed);
    this.__gameInstance.next(this.gameInstance);
    this.gameMode = new (<any>getGameModeById(gameModeId))();
  }

  isPieceAt(x: number, y: number) {
    return (
      this.gameInstance.BoardState.getPieceAtCoordinate(new Coordinate(x, y)) !=
      null
    );
  }

  getMoveLength(): number {
    return this.gameMode.getMoveLength();
  }

  requestValidSquares(piece: Piece) {
    this.validMoves = Array.from(
      piece.getValidSquares(this.gameInstance.BoardState)
    );
    this.__validMoves.next(this.validMoves);
  }

  clearPieceSelection() {
    this.validMoves = [];
    this.__validMoves.next(this.validMoves);
  }

  makePreMove(move: Move) {
    this.preMove = move;
    this.__preMove.next(this.preMove);
  }

  clearPreMove() {
    this.preMove = null;
    this.__preMove.next(this.preMove);
  }

  getValidSquares() {
    return this.__validMoves;
  }

  getGameInstance() {
    return this.__gameInstance;
  }

  getPreMove() {
    return this.__preMove;
  }

  getPreviousMove() {
    return this.__previousMove;
  }

  async evaluateMove(move: Move) {
    if (Coordinate.equals(move.PointA, move.PointB)) return;
    const madeMove = await this.gameMode.TimerHandleMove(
      move,
      this.gameInstance
    );
    if (madeMove) this.__previousMove.next(move);
    this.__gameInstance.next(this.gameInstance);
  }
}

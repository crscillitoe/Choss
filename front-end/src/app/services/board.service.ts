import { Injectable } from "@angular/core";
import { Square } from "chess.js";
import { Coordinate } from "projects/chess/src/lib/chesslib/Coordinate";
import { Game } from "projects/chess/src/lib/chesslib/Game";
import { GameMode } from "projects/chess/src/lib/chesslib/GameMode";
import { getGameModeById } from "projects/chess/src/lib/chesslib/GameModes/GameModeRegistry";
import { Move } from "projects/chess/src/lib/chesslib/Move";
import { Piece } from "projects/chess/src/lib/chesslib/Piece";
import { BehaviorSubject } from "rxjs";
import { TrainingControlsService } from "./training-controls.service";

declare var require: any;

@Injectable({
  providedIn: "root",
})
export class BoardService {
  public gameMode: GameMode;
  public preMove: Move = null;
  public validMoves: Coordinate[] = [];
  public gameInstance: Game;
  public madeFirstMove: boolean = false;

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

  private training: boolean = false;
  constructor(private controls: TrainingControlsService) {}

  setTraining(train: boolean) {
    this.training = train;
    const Chess = require("chess.js");
    this.controls.trainingBoard = new Chess();
    this.controls.update.subscribe((_) => {
      if (this.controls.resetting) {
        this.controls.resetting = false;
        this.madeFirstMove = false;
      }

      if (!this.madeFirstMove && this.controls.ourTeam === "b") {
        console.log("Making first move");
        this.playRandomContinuation(true);
        this.madeFirstMove = true;
      }
      this.gameInstance.BoardState.updateFromChessJS(
        this.controls.trainingBoard
      );
    });
  }

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

    if (!this.training) {
      const madeMove = await this.gameMode.TimerHandleMove(
        move,
        this.gameInstance
      );
      if (madeMove) this.__previousMove.next(move);

      this.__gameInstance.next(this.gameInstance);
    } else {
      const goodPlayerMoves = this.controls.getValidContinuations();

      if (goodPlayerMoves) {
        let good = false;
        for (const goodMove of goodPlayerMoves) {
          if (
            goodMove.from === this.coordinateToString(move.PointA) &&
            goodMove.to === this.coordinateToString(move.PointB)
          ) {
            good = true;
            break;
          }
        }

        if (!good) {
          // Wrong move. do something
          return;
        }
      }

      this.controls.trainingBoard.move({
        from: this.coordinateToString(move.PointA),
        to: this.coordinateToString(move.PointB),
      });

      const played = this.playRandomContinuation();
      if (!played) {
        this.controls.endOfLine = true;
      }

      this.gameInstance.BoardState.updateFromChessJS(
        this.controls.trainingBoard
      );

      console.log(this.controls.trainingBoard.ascii());
    }
  }

  playRandomContinuation(start: boolean = false) {
    const continuations = this.controls.getValidContinuations(start);
    if (
      continuations &&
      ((continuations.length > 0 && this.controls.randomLine) ||
        continuations.length == 1)
    ) {
      const randomIndex = Math.floor(Math.random() * continuations.length);
      const randomContinuation = continuations[randomIndex];

      this.controls.trainingBoard.move({
        from: randomContinuation.from as Square,
        to: randomContinuation.to as Square,
      });
    } else if (continuations) {
      return true;
    } else {
      return false;
    }

    return true;
  }
  squareToCoordinate(square: Square): Coordinate {
    return new Coordinate(this.letterToNumber(square[0]), +square[1]);
  }

  letterToNumber(letter: string): number {
    return 8 - (letter.charCodeAt(0) - 97);
  }

  highlightContinuation(continuation: {
    from: string;
    to: string;
    san: string;
  }) {
    const coordinateA = this.squareToCoordinate(continuation.from as Square);
    const coordinateB = this.squareToCoordinate(continuation.to as Square);

    this.gameInstance.BoardState.ColorMap[coordinateA.toString()] = {
      color: "#67a17d",
    };
    this.gameInstance.BoardState.ColorMap[coordinateB.toString()] = {
      color: "#67a17d",
    };
  }

  unhighlightContinuation(continuation: {
    from: string;
    to: string;
    san: string;
  }) {
    const coordinateA = this.squareToCoordinate(continuation.from as Square);
    const coordinateB = this.squareToCoordinate(continuation.to as Square);

    this.gameInstance.BoardState.ColorMap[coordinateA.toString()] = null;
    this.gameInstance.BoardState.ColorMap[coordinateB.toString()] = null;
  }

  coordinateToString(coordinate: Coordinate): any {
    const coords = ["h", "g", "f", "e", "d", "c", "b", "a"];
    return coords[coordinate.x - 1] + coordinate.y;
  }
}

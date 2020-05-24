import { GameMode } from "../GameMode";
import { Board } from "../Board";
import { Team } from "../Team";
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

export class DoubleMove implements GameMode {
  turnCounter: number;
  constructor() {
    this.turnCounter = 0;
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
  HandleMove(Player: Team, Move: Move, BoardGameState: Game): boolean {
    let Piece = BoardGameState.BoardState.getPieceAtCoordinate(
      Move.PointA.x,
      Move.PointA.y
    );

    let TargetPiece = BoardGameState.BoardState.getPieceAtCoordinate(
      Move.PointB.x,
      Move.PointB.y
    );

    if (Piece) {
      if (
        !Piece.isValidSquare(
          Move.PointB.x,
          Move.PointB.y,
          BoardGameState.BoardState
        )
      ) {
        return false;
      }

      if (TargetPiece) {
        this.TakePiece(Piece, TargetPiece, BoardGameState);

        // TakePiece may cause the game to end, if we are taking a king.
        if (
          BoardGameState.State === GameState.BLACK_WIN_CHECKMATE ||
          BoardGameState.State === GameState.BLACK_WIN_VARIANT ||
          BoardGameState.State === GameState.WHITE_WIN_CHECKMATE ||
          BoardGameState.State === GameState.WHITE_WIN_VARIANT
        ) {
          return true;
        }
      } else {
        // No killing has been done.
        Piece.Coordinate = Move.PointB;
      }

      this.turnCounter++;

      // Next players' turn
      if (Math.floor(this.turnCounter / 2) % 2 === 0) {
        BoardGameState.State = GameState.IN_PROGRESS_WHITE_TURN;
      } else {
        BoardGameState.State = GameState.IN_PROGRESS_BLACK_TURN;
      }

      return true;
    }

    return false;
  }

  TakePiece(Predator: Piece, Prey: Piece, BoardGameState: Game): void {
    Predator.KillCount++;
    BoardGameState.BoardState.killPiece(Prey);

    Predator.Coordinate = Prey.Coordinate;

    if (Prey instanceof King) {
      if (Prey.Team === Team.WHITE) {
        BoardGameState.State = GameState.BLACK_WIN_VARIANT;
      } else {
        BoardGameState.State = GameState.WHITE_WIN_VARIANT;
      }
    }
  }

  BuildFreshGame(): Game {
    return new Game(
      GameModeShared.StandardChessBoard(),
      GameState.IN_PROGRESS_WHITE_TURN
    );
  }
}

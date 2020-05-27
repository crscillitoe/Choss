import { Team, TeamOption } from "./Team";
import { Move } from "./Move";
import { Board } from "./Board";
import { GameState } from "./GameState";
import { Game } from "./Game";
import { Coordinate } from "./Coordinate";
import { Piece } from "./Piece";
import { GameModeShared } from "./GameModes/GameModeShared";
import { King } from "./Pieces/Standard/King";
import { Pawn } from "./Pieces/Standard/Pawn";
import { Queen } from "./Pieces/Standard/Queen";

export abstract class GameMode {
  /**
   * Sets the board up for a brand new game.
   */
  BuildFreshGame(): Game {
    return new Game(
      GameModeShared.StandardChessBoard(),
      GameState.IN_PROGRESS_WHITE_TURN
    );
  }

  /**
   * Requests the currently selected gamemode to
   * perform the given move.
   * @param Player The player making the move
   * @param Move The desired move to be performed
   * @param GameState The current board state
   */
  HandleMove(Move: Move, BoardGameState: Game): boolean {
    let Piece = BoardGameState.BoardState.getPieceAtCoordinate(Move.PointA);

    let TargetPiece = BoardGameState.BoardState.getPieceAtCoordinate(
      Move.PointB
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
        if (BoardGameState.isGameOver()) {
          return true;
        }
      } else {
        // No killing has been done.
        Piece.Coordinate = new Coordinate(Move.PointB.x, Move.PointB.y);
        console.log(
          `${Piece.Coordinate.x} ${Piece.Coordinate.y} ${
            Piece.Team.teamOption
          } ${Piece instanceof Pawn}`
        );
        if (Piece instanceof Pawn) {
          if (
            (Piece.Coordinate.y === BoardGameState.BoardState.Height &&
              Piece.Team.equals(TeamOption.WHITE)) ||
            (Piece.Coordinate.y === 1 && Piece.Team.equals(TeamOption.BLACK))
          ) {
            BoardGameState.BoardState.killPiece(Piece);
            BoardGameState.BoardState.Pieces.push(
              new Queen(Move.PointB.x, Move.PointB.y, Piece.Team)
            );
            console.log("queen");
          }
        }
      }

      BoardGameState.BoardState.logMove(Piece, Move.PointA, Move.PointB);

      if (BoardGameState.State === GameState.IN_PROGRESS_WHITE_TURN) {
        BoardGameState.State = GameState.IN_PROGRESS_BLACK_TURN;
      } else {
        BoardGameState.State = GameState.IN_PROGRESS_WHITE_TURN;
      }

      return true;
    }

    return false;
  }

  /**
   * The predator hunts its' prey, and the gamemode will define
   * how this piece taking will occur.
   * @param Predator The piece doing the taking
   * @param Prey The piece getting taken
   * @param GameState The current board state
   */
  TakePiece(Predator: Piece, Prey: Piece, BoardGameState: Game): void {
    this.KillPiece(Predator, Prey, BoardGameState);
    Predator.Coordinate = new Coordinate(Prey.Coordinate.x, Prey.Coordinate.y);

    if (Prey instanceof King) {
      if (Prey.Team === new Team(TeamOption.WHITE)) {
        BoardGameState.State = GameState.BLACK_WIN_VARIANT;
      } else {
        BoardGameState.State = GameState.WHITE_WIN_VARIANT;
      }
    }
  }

  /**
   * Kills the prey. Assigns proper killcount/cost effectiveness
   * @param Predator
   * @param Prey
   * @param BoardGameState
   */
  KillPiece(Predator: Piece, Prey: Piece, BoardGameState: Game): void {
    Predator.KillCount++;
    Predator.CostEffectiveness += Prey.PointValue;
    BoardGameState.BoardState.killPiece(Prey);
  }
}

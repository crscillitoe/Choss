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
    BoardGameState.BoardState.Pieces = BoardGameState.BoardState.Pieces.filter(
      (piece) => piece !== Prey
    );

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
    const board = new Board([], 8, 8);
    board.Pieces.push(new Queen(5, 1, Team.WHITE));
    board.Pieces.push(new King(4, 1, Team.WHITE));

    board.Pieces.push(new Rook(1, 1, Team.WHITE));
    board.Pieces.push(new Rook(8, 1, Team.WHITE));

    board.Pieces.push(new Knight(2, 1, Team.WHITE));
    board.Pieces.push(new Knight(7, 1, Team.WHITE));

    board.Pieces.push(new Bishop(3, 1, Team.WHITE));
    board.Pieces.push(new Bishop(6, 1, Team.WHITE));

    board.Pieces.push(new Pawn(1, 2, Team.WHITE));
    board.Pieces.push(new Pawn(2, 2, Team.WHITE));
    board.Pieces.push(new Pawn(3, 2, Team.WHITE));
    board.Pieces.push(new Pawn(4, 2, Team.WHITE));
    board.Pieces.push(new Pawn(5, 2, Team.WHITE));
    board.Pieces.push(new Pawn(6, 2, Team.WHITE));
    board.Pieces.push(new Pawn(7, 2, Team.WHITE));
    board.Pieces.push(new Pawn(8, 2, Team.WHITE));

    board.Pieces.push(new Queen(5, 8, Team.BLACK));
    board.Pieces.push(new King(4, 8, Team.BLACK));

    board.Pieces.push(new Rook(1, 8, Team.BLACK));
    board.Pieces.push(new Rook(8, 8, Team.BLACK));

    board.Pieces.push(new Knight(2, 8, Team.BLACK));
    board.Pieces.push(new Knight(7, 8, Team.BLACK));

    board.Pieces.push(new Bishop(3, 8, Team.BLACK));
    board.Pieces.push(new Bishop(6, 8, Team.BLACK));

    board.Pieces.push(new Pawn(1, 7, Team.BLACK));
    board.Pieces.push(new Pawn(2, 7, Team.BLACK));
    board.Pieces.push(new Pawn(3, 7, Team.BLACK));
    board.Pieces.push(new Pawn(4, 7, Team.BLACK));
    board.Pieces.push(new Pawn(5, 7, Team.BLACK));
    board.Pieces.push(new Pawn(6, 7, Team.BLACK));
    board.Pieces.push(new Pawn(7, 7, Team.BLACK));
    board.Pieces.push(new Pawn(8, 7, Team.BLACK));
    return new Game(board, GameState.IN_PROGRESS_WHITE_TURN);
  }
}

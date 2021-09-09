import { Coordinate } from "../Coordinate";
import { Game } from "../Game";
import { GameMode } from "../GameMode";
import { Piece } from "../Piece";
import { TeamOption } from "../Team";

export class RandomAtomic extends GameMode {
  TakePiece(Predator: Piece, Prey: Piece, BoardGameState: Game): void {
    if (!Predator.IsBomb && !Prey.IsBomb) {
      super.TakePiece(Predator, Prey, BoardGameState);
      return;
    }

    Predator.Coordinate = new Coordinate(Prey.Coordinate.x, Prey.Coordinate.y);
    BoardGameState.BoardState.killPiece(Predator);

    const deadBoys: Coordinate[] =
      Prey.Coordinate.getAllAdjacentCoordinatesOnBoard(
        BoardGameState.BoardState
      );

    for (const boy of deadBoys) {
      const piece = BoardGameState.BoardState.getPieceAtCoordinate(boy);

      if (piece) {
        if (piece.IsBomb) {
          for (const moreDeadBoy of piece.Coordinate.getAllAdjacentCoordinatesOnBoard(
            BoardGameState.BoardState
          )) {
            const otherPiece =
              BoardGameState.BoardState.getPieceAtCoordinate(moreDeadBoy);
            if (otherPiece) {
              super.KillPiece(Predator, otherPiece, BoardGameState);
            }
          }

          super.KillPiece(Predator, piece, BoardGameState);
        } else {
          super.KillPiece(Predator, piece, BoardGameState);
        }
      }
    }

    super.KillPiece(Predator, Prey, BoardGameState);
  }

  /**
   * Sets the board up for a brand new game.
   */
  static BuildFreshGame(seed: number): Game {
    let standardGame: Game = super.BuildFreshGame(seed);

    const whiteBombs: number = 3;
    const blackBombs: number = 3;
    let whiteCount = 0;
    let blackCount = 0;
    while (whiteCount < whiteBombs) {
      const piece = standardGame.BoardState.getRandomPiece();
      if (
        piece.Team.equals(TeamOption.WHITE) &&
        !piece.isKing() &&
        !piece.IsBomb
      ) {
        piece.IsBomb = true;
        whiteCount++;
      }
    }

    while (blackCount < blackBombs) {
      const piece = standardGame.BoardState.getRandomPiece();
      if (
        piece.Team.equals(TeamOption.BLACK) &&
        !piece.isKing() &&
        !piece.IsBomb
      ) {
        piece.IsBomb = true;
        blackCount++;
      }
    }

    return standardGame;
  }
}

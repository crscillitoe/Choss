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

export class Duplicate extends GameMode {
  TakePiece(Predator: Piece, Prey: Piece, BoardGameState: Game): void {
    // this.KillPiece(Predator, Prey, BoardGameState);

    if (Prey instanceof King) {
      if (Prey.Team === new Team(TeamOption.WHITE)) {
        BoardGameState.State = GameState.BLACK_WIN_VARIANT;
      } else {
        BoardGameState.State = GameState.WHITE_WIN_VARIANT;
      }
    } else {
      Prey.Team.teamOption = Prey.Team.opposite();
      Prey.updatePieceImage();
      // const oldCoord = Prey.Coordinate;
      // Prey = JSON.parse(JSON.stringify(Predator));
      // Prey.Coordinate = oldCoord;
    }
  }
}

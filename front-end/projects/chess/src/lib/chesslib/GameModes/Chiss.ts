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

export class Chiss extends GameMode {
  constructor() {
    super();
  }

  /**
   * Set turncounter to 0 since we are doublemove
   */
  static BuildFreshGame(seed: number): Game {
    let game = super.BuildFreshGame(seed);
    game.BoardState.Width = 6;
    game.BoardState.Height = 6;
    game.BoardState.Pieces = [];

    game.BoardState.fillRowWithPawns(2, TeamOption.WHITE);
    game.BoardState.fillRowWithPawns(5, TeamOption.BLACK);

    game.BoardState.Pieces.push(new King(3, 1, new Team(TeamOption.WHITE)));
    game.BoardState.Pieces.push(new King(3, 6, new Team(TeamOption.BLACK)));

    game.BoardState.Pieces.push(new King(4, 1, new Team(TeamOption.WHITE)));
    game.BoardState.Pieces.push(new King(4, 6, new Team(TeamOption.BLACK)));

    game.BoardState.Pieces.push(new Bishop(1, 1, new Team(TeamOption.WHITE)));
    game.BoardState.Pieces.push(new Bishop(6, 6, new Team(TeamOption.BLACK)));

    game.BoardState.Pieces.push(new Knight(2, 1, new Team(TeamOption.WHITE)));
    game.BoardState.Pieces.push(new Knight(5, 6, new Team(TeamOption.BLACK)));

    game.BoardState.Pieces.push(new Rook(6, 1, new Team(TeamOption.WHITE)));
    game.BoardState.Pieces.push(new Rook(1, 6, new Team(TeamOption.BLACK)));

    game.BoardState.Pieces.push(new Knight(5, 1, new Team(TeamOption.WHITE)));
    game.BoardState.Pieces.push(new Knight(2, 6, new Team(TeamOption.BLACK)));
    return game;
  }
}

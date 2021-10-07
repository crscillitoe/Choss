import { Injectable } from "@angular/core";
import { GameState } from "projects/chess/src/lib/chesslib/GameState";
import { TeamOption } from "projects/chess/src/lib/chesslib/Team";
import { BoardService } from "./board.service";

@Injectable({
  providedIn: "root",
})
export class PlayerService {
  public team: TeamOption = TeamOption.BLACK;

  constructor(private boardService: BoardService) {}

  setPlayerTeam(team: TeamOption) {
    this.team = team;
  }

  getX(x: number): number {
    if (this.team === TeamOption.BLACK) {
      return x + 1;
    }

    return this.boardService.gameInstance.BoardState.Width - x;
  }

  getY(y: number): number {
    if (this.team === TeamOption.BLACK) {
      return y + 1;
    }

    return this.boardService.gameInstance.BoardState.Height - y;
  }

  isTheirTurn(): boolean {
    return false;
  }

  isOurTurn(): boolean {
    return true;
  }
  weWin(): boolean {
    return (
      (this.boardService.gameInstance.State === GameState.WHITE_WIN &&
        this.team === TeamOption.WHITE) ||
      (this.boardService.gameInstance.State === GameState.BLACK_WIN &&
        this.team === TeamOption.BLACK)
    );
  }

  theyWin(): boolean {
    return (
      (this.boardService.gameInstance.State === GameState.WHITE_WIN &&
        this.team === TeamOption.BLACK) ||
      (this.boardService.gameInstance.State === GameState.BLACK_WIN &&
        this.team === TeamOption.WHITE)
    );
  }
}

import { Injectable } from "@angular/core";
import { DropEvent } from "angular-draggable-droppable";
import { GameState } from "projects/chess/src/lib/chesslib/GameState";
import { TeamOption } from "projects/chess/src/lib/chesslib/Team";
import { BoardService } from "./board.service";

@Injectable({
  providedIn: "root",
})
export class PlayerService {
  private team: TeamOption = TeamOption.BLACK;

  constructor(private boardService: BoardService) {}

  setPlayerTeam(team: TeamOption) {
    this.team = team;
  }

  getX(x: number): number {
    if (this.getPlayerTeam() === TeamOption.BLACK) {
      return x + 1;
    }

    return this.boardService.getCurrentGameInstance().BoardState.Width - x;
  }

  getY(y: number): number {
    if (this.getPlayerTeam() === TeamOption.BLACK) {
      return y + 1;
    }

    return this.boardService.getCurrentGameInstance().BoardState.Height - y;
  }

  getPlayerTeam(): TeamOption {
    return this.team;
  }

  isTheirTurn(): boolean {
    return (
      (this.boardService.getCurrentGameInstance().State ===
        GameState.IN_PROGRESS_BLACK_TURN &&
        this.getPlayerTeam() === TeamOption.WHITE) ||
      (this.boardService.getCurrentGameInstance().State ===
        GameState.IN_PROGRESS_WHITE_TURN &&
        this.getPlayerTeam() === TeamOption.BLACK)
    );
  }

  isOurTurn(): boolean {
    return (
      (this.boardService.getCurrentGameInstance().State ===
        GameState.IN_PROGRESS_BLACK_TURN &&
        this.getPlayerTeam() === TeamOption.BLACK) ||
      (this.boardService.getCurrentGameInstance().State ===
        GameState.IN_PROGRESS_WHITE_TURN &&
        this.getPlayerTeam() === TeamOption.WHITE)
    );
  }
  weWin(): boolean {
    return (
      (this.boardService.getCurrentGameInstance().State ===
        GameState.WHITE_WIN &&
        this.getPlayerTeam() === TeamOption.WHITE) ||
      (this.boardService.getCurrentGameInstance().State ===
        GameState.BLACK_WIN &&
        this.getPlayerTeam() === TeamOption.BLACK)
    );
  }

  theyWin(): boolean {
    return (
      (this.boardService.getCurrentGameInstance().State ===
        GameState.WHITE_WIN &&
        this.getPlayerTeam() === TeamOption.BLACK) ||
      (this.boardService.getCurrentGameInstance().State ===
        GameState.BLACK_WIN &&
        this.getPlayerTeam() === TeamOption.WHITE)
    );
  }
}

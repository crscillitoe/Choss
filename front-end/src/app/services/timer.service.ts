import { Injectable } from "@angular/core";
import { Board } from "projects/chess/src/lib/chesslib/Board";
import { TeamOption } from "projects/chess/src/lib/chesslib/Team";
import { Timer } from "projects/chess/src/lib/chesslib/Timer";
import { BoardService } from "./board.service";
import { PlayerService } from "./player.service";

@Injectable({
  providedIn: "root",
})
export class TimerService {
  public timer: Timer;

  constructor(
    private boardService: BoardService,
    private playerService: PlayerService
  ) {
    this.timer = {
      BlackClock: 0,
      BlackTicking: false,
      WhiteClock: 0,
      WhiteTicking: false,
      PreviousTime: 0,
    };
    this.boardService.getGameInstance().subscribe((board) => {
      if (board) {
        this.timer = board.BoardState.Timer;
      }
    });
  }

  weTicking() {
    return this.playerService.getPlayerTeam() === TeamOption.WHITE
      ? this.timer.WhiteTicking
      : this.timer.BlackTicking;
  }

  theyTicking() {
    return this.playerService.getPlayerTeam() === TeamOption.BLACK
      ? this.timer.WhiteTicking
      : this.timer.BlackTicking;
  }

  getOurClock() {
    return this.playerService.getPlayerTeam() === TeamOption.WHITE
      ? this.timer.WhiteClock
      : this.timer.BlackClock;
  }

  getTheirClock() {
    return this.playerService.getPlayerTeam() === TeamOption.WHITE
      ? this.timer.BlackClock
      : this.timer.WhiteClock;
  }
}

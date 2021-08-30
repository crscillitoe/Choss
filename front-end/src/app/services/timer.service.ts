import { Injectable } from "@angular/core";
import { Board } from "projects/chess/src/lib/chesslib/Board";
import { TeamOption } from "projects/chess/src/lib/chesslib/Team";
import { BoardService } from "./board.service";

@Injectable({
  providedIn: "root",
})
export class TimerService {
  private player: TeamOption;
  private timerId: any;

  constructor(private boardService: BoardService) {}

  startTimer(ourTeam: TeamOption) {
    this.player = ourTeam;
    this.timerId = setTimeout(() => this.handleTimers(), 200);
  }

  stopTimer() {
    if (this.timerId) clearTimeout(this.timerId);
  }

  getOurClock() {
    return this.player === TeamOption.WHITE
      ? this.boardService.getCurrentGameInstance().BoardState.Timer.WhiteClock
      : this.boardService.getCurrentGameInstance().BoardState.Timer.BlackClock;
  }

  getTheirClock() {
    return this.player === TeamOption.WHITE
      ? this.boardService.getCurrentGameInstance().BoardState.Timer.BlackClock
      : this.boardService.getCurrentGameInstance().BoardState.Timer.WhiteClock;
  }

  handleTimers() {
    const ourTimer = document.getElementById("ourtimer");
    const theirTimer = document.getElementById("theirtimer");

    const time = +new Date();
    const timeDiff =
      time -
      this.boardService.getCurrentGameInstance().BoardState.Timer.PreviousTime;

    if (
      (ourTimer &&
        this.boardService.getCurrentGameInstance().BoardState.Timer
          .BlackTicking &&
        this.player === TeamOption.BLACK) ||
      (this.boardService.getCurrentGameInstance().BoardState.Timer
        .WhiteTicking &&
        this.player === TeamOption.WHITE)
    ) {
      // Our timer
      const diff = this.getOurClock() - timeDiff;
      const minutes = Math.trunc(diff / (60 * 1000)) % 60;
      const seconds = Math.trunc(diff / 1000) % 60;

      ourTimer.textContent =
        (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") +
        ":" +
        (seconds ? (seconds > 9 ? seconds : "0" + seconds) : "00");
    }

    if (
      (theirTimer &&
        this.boardService.getCurrentGameInstance().BoardState.Timer
          .BlackTicking &&
        this.player === TeamOption.WHITE) ||
      (this.boardService.getCurrentGameInstance().BoardState.Timer
        .WhiteTicking &&
        this.player === TeamOption.BLACK)
    ) {
      // Our timer
      const diff = this.getTheirClock() - timeDiff;
      const minutes = Math.trunc(diff / (60 * 1000)) % 60;
      const seconds = Math.trunc(diff / 1000) % 60;

      theirTimer.textContent =
        (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") +
        ":" +
        (seconds ? (seconds > 9 ? seconds : "0" + seconds) : "00");
    }

    this.timerId = setTimeout(() => this.handleTimers(), 200);
  }
}

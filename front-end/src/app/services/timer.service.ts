import { Injectable } from "@angular/core";
import { Board } from "projects/chess/src/lib/chesslib/Board";
import { TeamOption } from "projects/chess/src/lib/chesslib/Team";
import { BoardService } from "./board.service";

@Injectable({
  providedIn: "root",
})
export class TimerService {
  private board: Board;
  private player: TeamOption;
  private timerId: any;

  constructor(private boardService: BoardService) {
    this.boardService.getGameInstance().subscribe((game) => {
      if (game) {
        this.board = game.BoardState;
      }
    });
  }

  startTimer(ourTeam: TeamOption) {
    this.player = ourTeam;
    this.timerId = setTimeout(() => this.handleTimers(), 200);
  }

  stopTimer() {
    if (this.timerId) clearTimeout(this.timerId);
  }

  getOurClock() {
    return this.player === TeamOption.WHITE
      ? this.board.Timer.WhiteClock
      : this.board.Timer.BlackClock;
  }

  getTheirClock() {
    return this.player === TeamOption.WHITE
      ? this.board.Timer.BlackClock
      : this.board.Timer.WhiteClock;
  }

  handleTimers() {
    const ourTimer = document.getElementById("ourtimer");
    const theirTimer = document.getElementById("theirtimer");

    const time = +new Date();
    const timeDiff = time - this.board.Timer.PreviousTime;

    if (
      (ourTimer &&
        this.board.Timer.BlackTicking &&
        this.player === TeamOption.BLACK) ||
      (this.board.Timer.WhiteTicking && this.player === TeamOption.WHITE)
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
        this.board.Timer.BlackTicking &&
        this.player === TeamOption.WHITE) ||
      (this.board.Timer.WhiteTicking && this.player === TeamOption.BLACK)
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

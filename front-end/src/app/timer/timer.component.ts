import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { TeamOption } from "projects/chess/src/lib/chesslib/Team";
import { PlayerService } from "../services/player.service";
import { TimerService } from "../services/timer.service";

@Component({
  selector: "choss-timer",
  templateUrl: "./timer.component.html",
  styleUrls: ["./timer.component.scss"],
})
export class TimerComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild("ourTimer", { static: true }) ourTimer: ElementRef;
  @ViewChild("theirTimer", { static: true }) theirTimer: ElementRef;

  @Input() timerMessage: string;

  private running: boolean = false;
  private player: TeamOption;
  private timerId: any;

  constructor(
    public timerService: TimerService,
    private playerService: PlayerService
  ) {}

  ngOnInit() {}

  ngOnChanges() {
    if (this.timerMessage === "start" && !this.running) {
      this.running = true;
      this.startTimer(this.playerService.getPlayerTeam());
    } else if (this.timerMessage === "stop") {
      this.stopTimer();
    }
  }

  ngOnDestroy() {
    this.stopTimer();
  }

  stopTimer() {
    if (this.timerId) clearTimeout(this.timerId);
  }

  startTimer(ourTeam: TeamOption) {
    this.player = ourTeam;
    this.timerId = setTimeout(() => this.handleTimers(), 200);
  }

  handleTimers() {
    const time = +new Date();
    const timer = this.timerService.timer;
    const timeDiff = time - timer.PreviousTime;

    if (
      (this.ourTimer &&
        timer.BlackTicking &&
        this.player === TeamOption.BLACK) ||
      (timer.WhiteTicking && this.player === TeamOption.WHITE)
    ) {
      // Our timer
      const diff = this.timerService.getOurClock() - timeDiff;
      const minutes = Math.trunc(diff / (60 * 1000)) % 60;
      const seconds = Math.trunc(diff / 1000) % 60;

      this.ourTimer.nativeElement.textContent =
        (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") +
        ":" +
        (seconds ? (seconds > 9 ? seconds : "0" + seconds) : "00");
    }

    if (
      (this.theirTimer &&
        timer.BlackTicking &&
        this.player === TeamOption.WHITE) ||
      (timer.WhiteTicking && this.player === TeamOption.BLACK)
    ) {
      // Our timer
      const diff = this.timerService.getTheirClock() - timeDiff;
      const minutes = Math.trunc(diff / (60 * 1000)) % 60;
      const seconds = Math.trunc(diff / 1000) % 60;

      this.theirTimer.nativeElement.textContent =
        (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") +
        ":" +
        (seconds ? (seconds > 9 ? seconds : "0" + seconds) : "00");
    }

    this.timerId = setTimeout(() => this.handleTimers(), 200);
  }
}

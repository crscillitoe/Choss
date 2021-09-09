import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { Board } from "../../../projects/chess/src/lib/chesslib/Board";
import { AnimationService } from "../services/animation.service";
import { BoardService } from "../services/board.service";
import { MouseService } from "../services/mouse.service";
import { MusicService } from "../services/music.service";
import { PlayerService } from "../services/player.service";
import { TileService } from "../services/tile.service";
import { TimerService } from "../services/timer.service";
import { TunnelService } from "../services/tunnel.service";

@Component({
  selector: "choss-board",
  templateUrl: "./board.component.html",
  styleUrls: ["./board.component.scss"],
})
export class BoardComponent implements OnInit, OnDestroy {
  @Output() startGame = new EventEmitter();
  Board: Board;
  subscriptions: Subscription[] = [];
  initialLoad: boolean = true;
  rows = [];

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
  ngOnInit(): void {
    this.subscriptions.push(
      this.boardService.getGameInstance().subscribe((data) => {
        if (data) {
          this.Board = data.BoardState;

          if (this.initialLoad) {
            this.startGame.emit("start");
            this.initialLoad = false;
          }

          this.rows = [];
          for (let i = 0; i < this.Board.Width; i++) {
            this.rows.push(i + 1);
          }
        }
      })
    );
  }
  constructor(
    private tunnelService: TunnelService,
    private route: ActivatedRoute,
    private musicService: MusicService,
    public tileService: TileService,
    private boardService: BoardService,
    private timerService: TimerService,
    public playerService: PlayerService,
    public mouseService: MouseService,
    public dialog: MatDialog,
    private animationService: AnimationService
  ) {}
}

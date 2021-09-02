import { Component, OnInit, OnDestroy } from "@angular/core";
import { TunnelService } from "../services/tunnel.service";
import { Board } from "../../../projects/chess/src/lib/chesslib/Board";
import { Team } from "../../../projects/chess/src/lib/chesslib/Team";
import { Piece } from "projects/chess/src/lib/chesslib/Piece";
import { Coordinate } from "projects/chess/src/lib/chesslib/Coordinate";
import { ActivatedRoute } from "@angular/router";
import { MusicService } from "../services/music.service";
import { Subscription } from "rxjs";
import { MatDialog } from "@angular/material";
import { BoardService } from "../services/board.service";
import { TileService } from "../services/tile.service";
import { TimerService } from "../services/timer.service";
import { PlayerService } from "../services/player.service";
import { Move } from "projects/chess/src/lib/chesslib/Move";
import { PieceService } from "../services/piece.service";
import { MouseService } from "../services/mouse.service";
import { AnimationService } from "../services/animation.service";

@Component({
  selector: "choss-board",
  templateUrl: "./board.component.html",
  styleUrls: ["./board.component.css"],
})
export class BoardComponent implements OnInit, OnDestroy {
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
            this.timerService.startTimer(this.playerService.getPlayerTeam());
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

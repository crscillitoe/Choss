import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { ActivatedRoute } from "@angular/router";
import { Board } from "projects/chess/src/lib/chesslib/Board";
import { Team } from "projects/chess/src/lib/chesslib/Team";
import { Subscription } from "rxjs";
import { BoardService } from "../services/board.service";
import { MouseService } from "../services/mouse.service";
import { MusicService } from "../services/music.service";
import { PlayerService } from "../services/player.service";
import { TileService } from "../services/tile.service";
import { TimerService } from "../services/timer.service";
import { TunnelService } from "../services/tunnel.service";

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.scss"],
})
export class GameComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  timerMessage: string = "";

  constructor(
    private tunnelService: TunnelService,
    private route: ActivatedRoute,
    public tileService: TileService,
    public playerService: PlayerService,
    public mouseService: MouseService,
    public dialog: MatDialog
  ) {
    this.subscriptions.push(
      this.route.queryParams.subscribe((params) => {
        this.playerService.setPlayerTeam(
          new Team(parseInt(params["team"])).teamOption
        );
      })
    );
  }

  startGame(message: string) {
    this.timerMessage = message;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.tunnelService.closeConnection();
    this.timerMessage = "stop";
  }

  ngOnInit() {
    this.tunnelService.connect();
  }
}

import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { TunnelService } from "../services/tunnel.service";
import { GameModeDescription } from "projects/chess/src/lib/chesslib/GameModes/GameModeRegistry";
import { MatDialog } from "@angular/material";
import { StartGameDialogComponent } from "../start-game-dialog/start-game-dialog.component";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  private gameModeDescriptions: GameModeDescription[] = [];
  private gamemodeID: number;

  constructor(
    private router: Router,
    private tunnel: TunnelService,
    public dialog: MatDialog
  ) {
    tunnel.getAvailableGameModes().subscribe((gameModeDescriptions) => {
      console.log(gameModeDescriptions);
      this.gameModeDescriptions = gameModeDescriptions;
    });
  }

  ngOnInit() {}

  newGame() {
    const roomId = this.uuidv4();
    this.openDialog(roomId);
  }

  setGamemode(id: number) {
    this.gamemodeID = id;
  }

  uuidv4(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        let r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  openDialog(roomId: string): void {
    const dialogRef = this.dialog.open(StartGameDialogComponent, {
      data: { teamId: 1, roomId: roomId, gamemodeId: this.gamemodeID },
    });

    dialogRef.afterClosed().subscribe((teamId: number | undefined) => {
      if (teamId === undefined) {
        return;
      }
      this.router.navigateByUrl(
        `/play?roomId=${roomId}&gameId=${this.gamemodeID}&team=${teamId}`
      );
    });
  }
}

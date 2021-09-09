import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import {
  GameModeDescription,
  getGameModeDescriptions,
} from "projects/chess/src/lib/chesslib/GameModes/GameModeRegistry";
import { StartGameDialogComponent } from "../start-game-dialog/start-game-dialog.component";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  gameModeDescriptions: GameModeDescription[] = [];
  private gamemodeID: number;

  constructor(private router: Router, public dialog: MatDialog) {
    this.gameModeDescriptions = getGameModeDescriptions();
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

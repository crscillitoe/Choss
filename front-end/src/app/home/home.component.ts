import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { TunnelService } from "../services/tunnel.service";
import { GameModeDescription } from "projects/chess/src/lib/chesslib/GameModes/GameModeRegistry";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  private gameModeDescriptions: GameModeDescription[] = [];
  constructor(private router: Router, private tunnel: TunnelService) {
    tunnel.getAvailableGameModes().subscribe((gameModeDescriptions) => {
      console.log(gameModeDescriptions);
      this.gameModeDescriptions = gameModeDescriptions;
    });
  }

  ngOnInit() {}

  newGame() {
    const roomId = this.uuidv4();
    this.router.navigateByUrl(`/play?roomId=${roomId}&team=1`);
  }

  uuidv4(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (
      c
    ) {
      let r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}

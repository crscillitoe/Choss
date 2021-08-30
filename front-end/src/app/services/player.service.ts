import { Injectable } from "@angular/core";
import { TeamOption } from "projects/chess/src/lib/chesslib/Team";

@Injectable({
  providedIn: "root",
})
export class PlayerService {
  private team: TeamOption = TeamOption.BLACK;

  constructor() {}
  setPlayerTeam(team: TeamOption) {
    this.team = team;
  }

  getPlayerTeam(): TeamOption {
    return this.team;
  }
}

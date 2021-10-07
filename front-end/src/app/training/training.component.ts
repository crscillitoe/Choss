import { Component, OnInit } from "@angular/core";
import { BoardService } from "../services/board.service";
import { PlayerService } from "../services/player.service";
import { TrainingControlsService } from "../services/training-controls.service";

@Component({
  selector: "app-training",
  templateUrl: "./training.component.html",
  styleUrls: ["./training.component.scss"],
})
export class TrainingComponent implements OnInit {
  constructor(
    private boardService: BoardService,
    private controls: TrainingControlsService,
    private playerService: PlayerService
  ) {}

  ngOnInit(): void {
    this.boardService.buildGame(2, 1);
    this.boardService.setTraining(true);
    this.controls.update.subscribe((_) => {
      this.updateTeam();
    });
  }

  updateTeam() {
    console.log(this.controls.ourTeam);
    if (this.controls.ourTeam === "w") {
      this.playerService.setPlayerTeam(1);
    } else {
      this.playerService.setPlayerTeam(0);
    }
  }
}

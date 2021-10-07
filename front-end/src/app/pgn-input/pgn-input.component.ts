import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { PlayerService } from "../services/player.service";
import { TrainingControlsService } from "../services/training-controls.service";

@Component({
  selector: "app-pgn-input",
  templateUrl: "./pgn-input.component.html",
  styleUrls: ["./pgn-input.component.scss"],
})
export class PgnInputComponent implements OnInit {
  inputPgn: string = "";

  constructor(
    public dialogRef: MatDialogRef<PgnInputComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public controls: TrainingControlsService,
    private playerService: PlayerService
  ) {}

  ngOnInit(): void {}

  import(color: string) {
    this.controls.ourTeam = color;
    this.controls.loadMovesFromPgn(this.inputPgn);
    localStorage.setItem("team", color);
    this.dialogRef.close();
  }
}

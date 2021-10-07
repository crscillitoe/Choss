import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { PgnInputComponent } from "../pgn-input/pgn-input.component";
import { TrainingControlsService } from "../services/training-controls.service";

@Component({
  selector: "left-controls",
  templateUrl: "./left-controls.component.html",
  styleUrls: ["./left-controls.component.scss"],
})
export class LeftControlsComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    public controls: TrainingControlsService
  ) {}

  ngOnInit(): void {}

  openPgnEdit(): void {
    const _ = this.dialog.open(PgnInputComponent);
  }
}

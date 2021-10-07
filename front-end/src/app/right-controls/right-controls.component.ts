import { Component, OnInit } from "@angular/core";
import { BoardService } from "../services/board.service";
import { TrainingControlsService } from "../services/training-controls.service";

@Component({
  selector: "right-controls",
  templateUrl: "./right-controls.component.html",
  styleUrls: ["./right-controls.component.scss"],
})
export class RightControlsComponent implements OnInit {
  constructor(
    public controls: TrainingControlsService,
    public boardService: BoardService
  ) {}

  ngOnInit(): void {}
}

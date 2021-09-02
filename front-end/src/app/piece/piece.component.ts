import { Component, Input, OnInit } from "@angular/core";
import { BoardService } from "../services/board.service";
import { MouseService } from "../services/mouse.service";
import { PieceService } from "../services/piece.service";
import { PlayerService } from "../services/player.service";
import { TileService } from "../services/tile.service";

@Component({
  selector: "choss-piece",
  templateUrl: "./piece.component.html",
  styleUrls: ["./piece.component.scss"],
})
export class PieceComponent implements OnInit {
  @Input() x: number;
  @Input() y: number;
  constructor(
    public mouseService: MouseService,
    public pieceService: PieceService,
    public playerService: PlayerService,
    public tileService: TileService
  ) {}

  ngOnInit() {}
}

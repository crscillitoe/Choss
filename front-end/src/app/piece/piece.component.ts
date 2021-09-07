import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { Board } from "projects/chess/src/lib/chesslib/Board";
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
  @ViewChild("pieceRef", { static: true }) piece: ElementRef;
  @Input() x: number;
  @Input() y: number;
  constructor(
    public mouseService: MouseService,
    public pieceService: PieceService,
    public playerService: PlayerService,
    public tileService: TileService,
    public boardService: BoardService
  ) {}

  ngOnInit() {
    this.pieceService.registerPieceRef(
      this.piece,
      this.playerService.getX(this.x),
      this.playerService.getY(this.y)
    );
  }
}

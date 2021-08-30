import { Component, OnInit, OnDestroy } from "@angular/core";
import { TunnelService } from "../services/tunnel.service";
import { Board } from "../../../projects/chess/src/lib/chesslib/Board";
import { Team } from "../../../projects/chess/src/lib/chesslib/Team";
import { Piece } from "projects/chess/src/lib/chesslib/Piece";
import { Coordinate } from "projects/chess/src/lib/chesslib/Coordinate";
import { ActivatedRoute } from "@angular/router";
import { MusicService } from "../services/music.service";
import { Subscription } from "rxjs";
import { MatDialog } from "@angular/material";
import { BoardService } from "../services/board.service";
import { TileService } from "../services/tile.service";
import { TimerService } from "../services/timer.service";
import { PlayerService } from "../services/player.service";
import { Move } from "projects/chess/src/lib/chesslib/Move";

@Component({
  selector: "app-board",
  templateUrl: "./board.component.html",
  styleUrls: ["./board.component.css"],
})
export class BoardComponent implements OnInit, OnDestroy {
  initialLoad: boolean = true;
  Board: Board;
  selectedPiece: Piece = null;
  rows = [];

  subscriptions: Subscription[] = [];

  constructor(
    private tunnelService: TunnelService,
    private route: ActivatedRoute,
    private musicService: MusicService,
    public tileService: TileService,
    private boardService: BoardService,
    private timerService: TimerService,
    public playerService: PlayerService,
    public dialog: MatDialog
  ) {
    this.subscriptions.push(
      this.route.queryParams.subscribe((params) => {
        this.playerService.setPlayerTeam(
          new Team(parseInt(params["team"])).teamOption
        );
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.tunnelService.closeConnection();
    this.timerService.stopTimer();
  }

  /**
   * Selects the given piece (or unselects it, if it is already selected.)
   *
   * @param x The x coordinate on the board of the piece
   * @param y The y coordinate on the board of the piece
   */
  selectPiece(x: number, y: number) {
    this.boardService.clearPreMove();
    const Piece = this.Board.getPieceAtCoordinate(new Coordinate(x, y));
    if (
      !Piece ||
      !(this.playerService.getPlayerTeam() === Piece.Team.teamOption)
    ) {
      return;
    }

    this.selectedPiece = Piece;
    this.boardService.clearPieceSelection();
    this.boardService.requestValidSquares(Piece);
  }

  placePiece(x: number, y: number) {
    if (!this.selectedPiece) return;

    const location = new Coordinate(x, y);
    if (this.playerService.isTheirTurn()) {
      if (Coordinate.equals(this.selectedPiece.Coordinate, location)) {
        return;
      }

      const preMove: Move = {
        PointA: this.selectedPiece.Coordinate,
        PointB: location,
      };
      this.boardService.makePreMove(preMove);
    } else {
      this.tunnelService.makeMove(this.selectedPiece.Coordinate, location);
    }

    this.boardService.clearPieceSelection();
    this.selectedPiece = null;
  }

  ngOnInit() {
    this.selectedPiece = null;
    this.tunnelService.connect();
    this.subscriptions.push(
      this.boardService.getGameInstance().subscribe((data) => {
        if (data) {
          this.Board = data.BoardState;

          if (!this.initialLoad) {
            this.musicService.playClick();
          } else {
            this.timerService.startTimer(this.playerService.getPlayerTeam());
            this.initialLoad = false;
          }

          this.rows = [];
          for (let i = 0; i < this.Board.Width; i++) {
            this.rows.push(i + 1);
          }
        }
      })
    );
  }
}

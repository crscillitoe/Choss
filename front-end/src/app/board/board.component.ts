import { Component, OnInit, OnDestroy } from "@angular/core";
import { TunnelService } from "../services/tunnel.service";
import { Board } from "../../../projects/chess/src/lib/chesslib/Board";
import { King } from "../../../projects/chess/src/lib/chesslib/Pieces/Standard/King";
import {
  Team,
  TeamOption,
} from "../../../projects/chess/src/lib/chesslib/Team";
import { Piece } from "projects/chess/src/lib/chesslib/Piece";
import { Coordinate } from "projects/chess/src/lib/chesslib/Coordinate";
import { GameMode } from "projects/chess/src/lib/chesslib/GameMode";
import { DoubleMove } from "projects/chess/src/lib/chesslib/GameModes/DoubleMove";
import { ActivatedRoute } from "@angular/router";
import { GameState } from "projects/chess/src/lib/chesslib/GameState";
import { MusicService } from "../services/music.service";
import { Subscription } from "rxjs";
import { MatDialog } from "@angular/material";
import { StartGameDialogComponent } from "../start-game-dialog/start-game-dialog.component";
import { BoardService } from "../services/board.service";
import { TileService } from "../services/tile.service";
import { TimerService } from "../services/timer.service";
import { PlayerService } from "../services/player.service";

@Component({
  selector: "app-board",
  templateUrl: "./board.component.html",
  styleUrls: ["./board.component.css"],
})
export class BoardComponent implements OnInit, OnDestroy {
  initialLoad: boolean = true;
  Board: Board;
  Status: GameState;
  timerId: any;
  selectedPiece: Piece = null;
  pieceMoves: Coordinate[] = null;
  preMoves: Coordinate[] = [];
  weWinLocalTimer: boolean = false;
  weLoseLocalTimer: boolean = false;
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

  drop(x, y) {
    console.log("Dropped at", x, y);
  }

  dragEnd(event) {
    console.log("Element was dragged", event);
  }

  getColor(x: number, y: number): string {
    return this.tileService.getColor(x, y, this.preMoves);
  }

  /**
   * Selects the given piece (or unselects it, if it is already selected.)
   *
   * @param x The x coordinate on the board of the piece
   * @param y The y coordinate on the board of the piece
   */
  selectPiece(x: number, y: number) {
    this.preMoves = [];
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
    if (this.isTheirTurn()) {
      if (Coordinate.equals(this.selectedPiece.Coordinate, location)) {
        return;
      }

      this.preMoves = [this.selectedPiece.Coordinate, location];
    } else {
      this.tunnelService.makeMove(this.selectedPiece.Coordinate, location);
    }

    this.boardService.clearPieceSelection();
    this.selectedPiece = null;
  }

  weWin(): boolean {
    return (
      this.weWinLocalTimer ||
      (this.Status === GameState.WHITE_WIN &&
        this.playerService.getPlayerTeam() === TeamOption.WHITE) ||
      (this.Status === GameState.BLACK_WIN &&
        this.playerService.getPlayerTeam() === TeamOption.BLACK)
    );
  }

  theyWin(): boolean {
    return (
      this.weLoseLocalTimer ||
      (this.Status === GameState.WHITE_WIN &&
        this.playerService.getPlayerTeam() === TeamOption.BLACK) ||
      (this.Status === GameState.BLACK_WIN &&
        this.playerService.getPlayerTeam() === TeamOption.WHITE)
    );
  }

  isTheirTurn(): boolean {
    return (
      !this.weWinLocalTimer &&
      ((this.Status === GameState.IN_PROGRESS_BLACK_TURN &&
        this.playerService.getPlayerTeam() === TeamOption.WHITE) ||
        (this.Status === GameState.IN_PROGRESS_WHITE_TURN &&
          this.playerService.getPlayerTeam() === TeamOption.BLACK))
    );
  }

  isOurTurn(): boolean {
    return (
      !this.weLoseLocalTimer &&
      ((this.Status === GameState.IN_PROGRESS_BLACK_TURN &&
        this.playerService.getPlayerTeam() === TeamOption.BLACK) ||
        (this.Status === GameState.IN_PROGRESS_WHITE_TURN &&
          this.playerService.getPlayerTeam() === TeamOption.WHITE))
    );
  }

  ngOnInit() {
    this.preMoves = [];
    this.selectedPiece = null;
    this.tunnelService.connect();
    this.subscriptions.push(
      this.boardService.getValidSquares().subscribe((squares) => {
        this.pieceMoves = squares;
      })
    );
    this.subscriptions.push(
      this.boardService.getGameInstance().subscribe((data) => {
        if (data) {
          this.Board = data.BoardState;
          this.Status = data.State;

          if (!this.initialLoad) {
            this.musicService.playClick();
          } else {
            this.timerService.startTimer(this.playerService.getPlayerTeam());
            this.initialLoad = false;
          }

          if (this.isOurTurn() && this.preMoves.length !== 0) {
            this.tunnelService.makeMove(this.preMoves[0], this.preMoves[1]);
            this.preMoves = [];
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

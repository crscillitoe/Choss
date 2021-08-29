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

@Component({
  selector: "app-board",
  templateUrl: "./board.component.html",
  styleUrls: ["./board.component.css"],
})
export class BoardComponent implements OnInit, OnDestroy {
  initialLoad: boolean = true;
  Board: Board;
  Status: GameState;
  timeoutId: any;
  rows = [];
  columns = [];
  alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"];
  player = new Team(TeamOption.BLACK);
  selectedPiece: Piece = null;
  pieceMoves: Coordinate[] = null;
  preMoves: Coordinate[] = [];
  weWinLocalTimer: boolean = false;
  weLoseLocalTimer: boolean = false;

  subscriptions: Subscription[] = [];

  constructor(
    private tunnelService: TunnelService,
    private route: ActivatedRoute,
    private musicService: MusicService,
    public dialog: MatDialog
  ) {
    this.subscriptions.push(
      this.route.queryParams.subscribe((params) => {
        this.player = new Team(parseInt(params["team"]));
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.tunnelService.closeConnection();
    if (this.timeoutId) {
      window.clearTimeout(this.timeoutId);
    }
  }

  drop(x, y) {
    console.log("Dropped at", x, y);
  }

  dragEnd(event) {
    console.log("Element was dragged", event);
  }

  /**
   * Gets the background tile of the tile at the given location.
   *
   * @param x X coordinate of the tile
   * @param y Y coordinate of the tile
   */
  getColor(x: number, y: number) {
    const piece = this.Board.getPieceAtCoordinate(new Coordinate(x, y));
    if (piece) {
      if (piece.IsBomb && piece.Team.teamOption === this.player.teamOption) {
        return "red";
      }
    }

    for (const coordinate of this.preMoves) {
      if (coordinate.x === x && coordinate.y === y) {
        if ((x + y) % 2 === 0) {
          return "#5f637d";
        }

        return "#43465d";
      }
    }

    const movedCoords = this.Board.getMovedTo();
    if (movedCoords.length >= 2) {
      if (
        Coordinate.equals(movedCoords[0], new Coordinate(x, y)) ||
        Coordinate.equals(movedCoords[1], new Coordinate(x, y))
      ) {
        if ((x + y) % 2 === 1) {
          return "#bd9b2d";
        }

        return "#f5cb42";
      }
    }

    if ((x + y) % 2 === 1) {
      return "#878787";
    }

    return "#ADADAD";
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
    if (!Piece || !this.player.equals(Piece.Team.teamOption)) {
      return;
    }

    this.selectedPiece = Piece;
    this.pieceMoves = [];
    this.tunnelService.requestValidSquares(Piece);
  }

  placePiece(x: number, y: number) {
    if (!this.selectedPiece) return;

    const location = new Coordinate(x, y);
    if (!this.isOurTurn()) {
      if (Coordinate.equals(this.selectedPiece.Coordinate, location)) {
        return;
      }

      this.preMoves = [this.selectedPiece.Coordinate, location];
    } else {
      this.tunnelService.makeMove(this.selectedPiece.Coordinate, location);
    }

    this.pieceMoves = [];
    this.selectedPiece = null;
  }

  weWin(): boolean {
    return (
      this.weWinLocalTimer ||
      (this.Status === GameState.WHITE_WIN &&
        this.player.teamOption === TeamOption.WHITE) ||
      (this.Status === GameState.BLACK_WIN &&
        this.player.teamOption === TeamOption.BLACK)
    );
  }

  theyWin(): boolean {
    return (
      this.weLoseLocalTimer ||
      (this.Status === GameState.WHITE_WIN &&
        this.player.teamOption === TeamOption.BLACK) ||
      (this.Status === GameState.BLACK_WIN &&
        this.player.teamOption === TeamOption.WHITE)
    );
  }

  isTheirTurn(): boolean {
    return (
      !this.weWinLocalTimer &&
      ((this.Status === GameState.IN_PROGRESS_BLACK_TURN &&
        this.player.teamOption === TeamOption.WHITE) ||
        (this.Status === GameState.IN_PROGRESS_WHITE_TURN &&
          this.player.teamOption === TeamOption.BLACK))
    );
  }

  isOurTurn(): boolean {
    return (
      !this.weLoseLocalTimer &&
      ((this.Status === GameState.IN_PROGRESS_BLACK_TURN &&
        this.player.teamOption === TeamOption.BLACK) ||
        (this.Status === GameState.IN_PROGRESS_WHITE_TURN &&
          this.player.teamOption === TeamOption.WHITE))
    );
  }

  /**
   * Returns the given SVG of the piece at this location on the board.
   * If no piece is found, this function will return a blank SVG.
   *
   * @param x The x coordinate on the board of the piece
   * @param y The y coordinate on the board of the piece
   */
  getSVG(x: number, y: number) {
    if (this.Board) {
      const Piece = this.Board.getPieceAtCoordinate(new Coordinate(x, y));
      if (Piece) {
        return `assets/chess_pieces/${Piece.SVGName}`;
      }

      if (this.pieceMoves) {
        for (const coordinate of this.pieceMoves) {
          if (coordinate.x === x && coordinate.y === y) {
            return `assets/chess_pieces/dot.svg`;
          }
        }
      }
    }

    return "assets/chess_pieces/Blank.svg";
  }

  getClockForCurrentTurn() {
    const OurClock =
      this.player.teamOption === TeamOption.WHITE
        ? this.Board.Timer.WhiteClock
        : this.Board.Timer.BlackClock;
    const TheirClock =
      this.player.teamOption === TeamOption.WHITE
        ? this.Board.Timer.BlackClock
        : this.Board.Timer.WhiteClock;

    return this.isOurTurn() ? OurClock : TheirClock;
  }

  getPreviousTimeForCurrentTurn() {
    const OurPreviousMove =
      this.player.teamOption === TeamOption.WHITE
        ? this.Board.Timer.PreviousWhiteMoveTime
        : this.Board.Timer.PreviousBlackMoveTime;
    const TheirPreviousMove =
      this.player.teamOption === TeamOption.WHITE
        ? this.Board.Timer.PreviousBlackMoveTime
        : this.Board.Timer.PreviousWhiteMoveTime;

    return this.isOurTurn() ? TheirPreviousMove : OurPreviousMove;
  }

  handleTimer() {
    const id = this.isOurTurn() ? "ourtimer" : "theirtimer";
    const display = document.getElementById(id);

    let done = false;
    const clock = this.getClockForCurrentTurn();
    const previousTime = this.getPreviousTimeForCurrentTurn();

    if (display) {
      const now = +new Date();
      const diff = clock - (now - previousTime);
      let minutes = Math.trunc(diff / (60 * 1000)) % 60;
      let seconds = Math.trunc(diff / 1000) % 60;
      let millis = diff % 1000;

      if (diff <= 0) {
        minutes = 0;
        seconds = 0;
        millis = 0;
        done = true;
      }

      display.textContent =
        (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") +
        ":" +
        (seconds ? (seconds > 9 ? seconds : "0" + seconds) : "00") +
        "." +
        (millis
          ? millis > 99
            ? millis
            : millis > 9
            ? "0" + millis
            : "00" + millis
          : "000");
    }
    if (!done) {
      this.timeoutId = setTimeout(() => this.handleTimer(), 50);
    } else {
      if (id === "theirtimer") {
        this.weWinLocalTimer = true;
      } else {
        this.weLoseLocalTimer = true;
      }
    }
  }

  ngOnInit() {
    this.preMoves = [];
    this.pieceMoves = [];
    this.selectedPiece = null;
    this.tunnelService.connect();
    this.subscriptions.push(
      this.tunnelService.receiveBoardState().subscribe((data) => {
        if (data) {
          console.log(data);
          console.log(data.BoardState.Timer);
          this.Board = data.BoardState;
          this.Status = data.State;

          if (!this.initialLoad) {
            this.musicService.playClick();
          } else {
            this.handleTimer();
            this.initialLoad = false;
          }

          if (this.isOurTurn() && this.preMoves.length !== 0) {
            this.tunnelService.makeMove(this.preMoves[0], this.preMoves[1]);
            this.preMoves = [];
          }

          this.rows = [];
          this.columns = [];
          for (let i = 0; i < this.Board.Width; i++) {
            this.rows.push(i + 1);
            this.columns.push(this.alphabet[i]);
          }
        }
      })
    );

    this.subscriptions.push(
      this.tunnelService.getValidSquares().subscribe((data) => {
        if (this.selectedPiece) {
          this.pieceMoves = data;
        }
      })
    );
  }
}

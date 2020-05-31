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

@Component({
  selector: "app-board",
  templateUrl: "./board.component.html",
  styleUrls: ["./board.component.css"],
})
export class BoardComponent implements OnInit, OnDestroy {
  initialLoad: boolean = true;
  Board: Board;
  Status: GameState;
  rows = [];
  columns = [];
  alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"];
  player = new Team(TeamOption.BLACK);
  selectedPiece: Piece = null;
  pieceMoves: Coordinate[] = null;

  subscriptions: Subscription[] = [];

  constructor(
    private tunnelService: TunnelService,
    private route: ActivatedRoute,
    private musicService: MusicService
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
    if (this.selectedPiece) {
      if (this.pieceMoves) {
        for (const coordinate of this.pieceMoves) {
          if (coordinate.x === x && coordinate.y === y) {
            if ((x + y) % 2 === 0) {
              return "indianred";
            }

            return "salmon";
          }
        }
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
      return "#303030";
    }

    return "#888888";
  }

  /**
   * Selects the given piece (or unselects it, if it is already selected.)
   *
   * @param x The x coordinate on the board of the piece
   * @param y The y coordinate on the board of the piece
   */
  selectPiece(x: number, y: number) {
    if (
      (this.player.equals(TeamOption.WHITE) &&
        this.Status === GameState.IN_PROGRESS_WHITE_TURN) ||
      (this.player.equals(TeamOption.BLACK) &&
        this.Status === GameState.IN_PROGRESS_BLACK_TURN)
    ) {
      const Piece = this.Board.getPieceAtCoordinate(new Coordinate(x, y));
      if (Piece && this.player.equals(Piece.Team.teamOption)) {
        if (this.selectedPiece === Piece) {
          this.selectedPiece = null;
        } else {
          this.selectedPiece = Piece;
          this.pieceMoves = [];
          this.tunnelService.requestValidSquares(Piece);
        }
      } else if (this.selectedPiece) {
        const location = new Coordinate(x, y);
        this.tunnelService.makeMove(this.selectedPiece.Coordinate, location);
        this.pieceMoves = [];
        this.selectedPiece = null;
      }
    }
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
    }

    return "assets/chess_pieces/Blank.svg";
  }

  ngOnInit() {
    this.tunnelService.connect();
    this.subscriptions.push(
      this.tunnelService.receiveBoardState().subscribe((data) => {
        if (data) {
          if (!this.initialLoad) {
            this.musicService.playClick();
          } else {
            this.initialLoad = false;
          }

          this.Board = data.BoardState;
          this.Status = data.State;

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
        this.pieceMoves = data;
      })
    );
  }
}

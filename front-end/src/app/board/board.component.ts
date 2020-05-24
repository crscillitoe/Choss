import { Component, OnInit } from "@angular/core";
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

@Component({
  selector: "app-board",
  templateUrl: "./board.component.html",
  styleUrls: ["./board.component.css"],
})
export class BoardComponent implements OnInit {
  Board: Board;
  Status: GameState;
  rows = [];
  columns = [];
  alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"];
  player = new Team(TeamOption.BLACK);
  selectedPiece: Piece = null;
  pieceMoves: Coordinate[] = null;

  constructor(
    private tunnelService: TunnelService,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe((params) => {
      console.log(params);
      this.player = new Team(parseInt(params["team"]));
    });
  }

  /**
   * Gets the background tile of the tile at the given location.
   *
   * @param x X coordinate of the tile
   * @param y Y coordinate of the tile
   */
  getColor(x: number, y: number) {
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
      const Piece = this.Board.getPieceAtCoordinate(x, y);
      if (Piece && Piece.Team == this.player) {
        if (this.selectedPiece === Piece) {
          this.selectedPiece = null;
        } else {
          this.selectedPiece = Piece;
          this.tunnelService.requestValidSquares(Piece);
        }
      } else if (this.selectedPiece) {
        const location: Coordinate = {
          x: x,
          y: y,
        };
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
      const Piece = this.Board.getPieceAtCoordinate(x, y);
      if (Piece) {
        return `assets/chess_pieces/${Piece.SVGName}`;
      }
    }

    return "assets/chess_pieces/Blank.svg";
  }

  ngOnInit() {
    this.tunnelService.receiveBoardState().subscribe((data) => {
      if (data) {
        this.Board = data.BoardState;
        this.Status = data.State;

        this.rows = [];
        this.columns = [];
        for (let i = 0; i < this.Board.Width; i++) {
          this.rows.push(i + 1);
          this.columns.push(this.alphabet[i]);
        }
      }
    });

    this.tunnelService.getValidSquares().subscribe((data) => {
      this.pieceMoves = data;
    });
  }
}

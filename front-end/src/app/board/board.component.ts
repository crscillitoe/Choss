import { Component, OnInit } from "@angular/core";
import { TunnelService } from "../services/tunnel.service";
import { Board } from "../../../projects/chess/src/lib/chesslib/Board";
import { King } from "../../../projects/chess/src/lib/chesslib/Pieces/Standard/King";
import { Piece } from "projects/chess/src/lib/chesslib/Piece";
import { Coordinate } from "projects/chess/src/lib/chesslib/Coordinate";
import { GameMode } from "projects/chess/src/lib/chesslib/GameMode";
import { DoubleMove } from "projects/chess/src/lib/chesslib/GameModes/DoubleMove";

@Component({
  selector: "app-board",
  templateUrl: "./board.component.html",
  styleUrls: ["./board.component.css"],
})
export class BoardComponent implements OnInit {
  Board: Board;
  rows = [];
  columns = [];
  alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"];
  player = Team.WHITE;
  selectedPiece: Piece = null;
  pieceMoves: Coordinate[] = null;

  constructor(private tunnelService: TunnelService) {}

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

    if ((x + y) % 2 === 0) {
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
    const Piece = this.Board.getPieceAtCoordinate(x, y);
    if (Piece && Piece.Team == this.player) {
      if (this.selectedPiece === Piece) {
        this.selectedPiece = null;
      } else {
        this.selectedPiece = Piece;
        this.tunnelService.requestValidSquares(Piece);
      }
    } else {
      const location: Coordinate = {
        x: x,
        y: y,
      };
      this.tunnelService.makeMove(this.selectedPiece.Coordinate, location);
      this.pieceMoves = [];
      this.selectedPiece = null;
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

export enum Team {
  WHITE = 1,
  BLACK = 0,
}

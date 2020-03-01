import { Component, OnInit } from "@angular/core";
import { TunnelService } from "../services/tunnel.service";
import { Board } from "../../../projects/chess/src/lib/chesslib/Board";
import { King } from "../../../projects/chess/src/lib/chesslib/Pieces/Standard/King";

@Component({
  selector: "app-board",
  templateUrl: "./board.component.html",
  styleUrls: ["./board.component.css"]
})
export class BoardComponent implements OnInit {
  Board: Board;

  rows = [];
  columns = [];

  alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"];

  player = Team.BLACK;

  constructor(private tunnelService: TunnelService) {}

  /**
   * Gets the background tile of the tile at the given location.
   * @param x X coordinate of the tile
   * @param y Y coordinate of the tile
   */
  getColor(x: number, y: number) {
    if ((x + y) % 2 === 0) {
      return "#303030";
    }

    return "#888888";
  }

  test(x: number, y: number) {
    const Piece = this.Board.getPieceAtCoordinate(x, y);
    console.log(Piece.MoveRules);
    console.log(Piece.getValidSquares());
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
    this.Board = new Board([], 8, 8);
    this.Board.Pieces.push(new King(4, 4, Team.BLACK, this.Board));
    console.log(this.Board);

    for (let i = 0; i < this.Board.Width; i++) {
      this.rows.push(i + 1);
      this.columns.push(this.alphabet[i]);
    }

    this.tunnelService.receiveBoardState().subscribe(data => {
      if (data) {
        this.Board = data;
      }
    });
  }
}

export enum Team {
  WHITE = 1,
  BLACK = 0
}

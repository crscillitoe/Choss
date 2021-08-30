import { Injectable } from "@angular/core";
import { Board } from "projects/chess/src/lib/chesslib/Board";
import { Coordinate } from "projects/chess/src/lib/chesslib/Coordinate";
import { TeamOption } from "projects/chess/src/lib/chesslib/Team";
import { BoardService } from "./board.service";
import { PlayerService } from "./player.service";

@Injectable({
  providedIn: "root",
})
export class TileService {
  private board: Board;
  private validMoves: Coordinate[];
  constructor(
    private boardService: BoardService,
    private playerSerivce: PlayerService
  ) {
    this.boardService.getGameInstance().subscribe((game) => {
      if (game) {
        this.board = game.BoardState;
      }
    });

    this.boardService.getValidSquares().subscribe((validSquares) => {
      this.validMoves = validSquares;
    });
  }

  /**
   * Returns the given SVG of the piece at this location on the board.
   * If no piece is found, this function will return a blank SVG.
   *
   * @param x The x coordinate on the board of the piece
   * @param y The y coordinate on the board of the piece
   */
  getSVG(x: number, y: number) {
    if (this.board) {
      const Piece = this.board.getPieceAtCoordinate(new Coordinate(x, y));
      if (Piece) {
        return `assets/chess_pieces/${Piece.SVGName}`;
      }

      if (this.validMoves) {
        for (const coordinate of this.validMoves) {
          if (coordinate.x === x && coordinate.y === y) {
            return `assets/chess_pieces/dot.svg`;
          }
        }
      }
    }

    return "assets/chess_pieces/Blank.svg";
  }

  /**
   * Gets the background tile of the tile at the given location.
   *
   * @param x X coordinate of the tile
   * @param y Y coordinate of the tile
   */
  getColor(x: number, y: number, preMoves: Coordinate[]): string {
    const lookupKey = new Coordinate(x, y).toString();
    const coloredSquare = this.board.ColorMap[lookupKey];
    if (
      coloredSquare &&
      coloredSquare.viewableBy === this.playerSerivce.getPlayerTeam()
    ) {
      return coloredSquare.color;
    }
    const piece = this.board.getPieceAtCoordinate(new Coordinate(x, y));
    if (piece) {
      if (
        piece.IsBomb &&
        piece.Team.teamOption === this.playerSerivce.getPlayerTeam()
      ) {
        return "red";
      }
    }

    for (const coordinate of preMoves) {
      if (coordinate.x === x && coordinate.y === y) {
        if ((x + y) % 2 === 0) {
          return "#5f637d";
        }

        return "#43465d";
      }
    }

    const movedCoords = this.board.getMovedTo();
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
}

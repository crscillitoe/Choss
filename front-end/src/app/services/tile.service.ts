import { Injectable } from "@angular/core";
import { Board } from "projects/chess/src/lib/chesslib/Board";
import { Coordinate } from "projects/chess/src/lib/chesslib/Coordinate";
import { TeamOption } from "projects/chess/src/lib/chesslib/Team";
import { BoardService } from "./board.service";
import { MouseService } from "./mouse.service";
import { PlayerService } from "./player.service";

@Injectable({
  providedIn: "root",
})
export class TileService {
  constructor(
    private boardService: BoardService,
    private playerSerivce: PlayerService,
    private dragService: MouseService
  ) {}

  /**
   * Returns the given SVG of the piece at this location on the board.
   * If no piece is found, this function will return a blank SVG.
   *
   * @param x The x coordinate on the board of the piece
   * @param y The y coordinate on the board of the piece
   */
  getSVG(x: number, y: number) {
    if (this.boardService.getCurrentGameInstance()) {
      const Piece = this.boardService
        .getCurrentGameInstance()
        .BoardState.getPieceAtCoordinate(new Coordinate(x, y));
      if (Piece) {
        return `assets/chess_pieces/${Piece.SVGName}`;
      }

      if (this.boardService.getCurrentValidSquares()) {
        for (const coordinate of this.boardService.getCurrentValidSquares()) {
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
  getColor(x: number, y: number): string {
    const lookupKey = new Coordinate(x, y).toString();
    const coloredSquare =
      this.boardService.getCurrentGameInstance().BoardState.ColorMap[lookupKey];
    if (
      coloredSquare &&
      coloredSquare.viewableBy === this.playerSerivce.getPlayerTeam()
    ) {
      return coloredSquare.color;
    }

    const piece = this.boardService
      .getCurrentGameInstance()
      .BoardState.getPieceAtCoordinate(new Coordinate(x, y));
    if (piece) {
      if (
        piece.IsBomb &&
        piece.Team.teamOption === this.playerSerivce.getPlayerTeam()
      ) {
        return "red";
      }
    }

    const preMove = this.boardService.getCurrentPreMove();
    if (preMove) {
      for (const coordinate of [preMove.PointA, preMove.PointB]) {
        if (coordinate.x === x && coordinate.y === y) {
          if ((x + y) % 2 === 0) {
            return "#5f637d";
          }

          return "#43465d";
        }
      }
    }

    const history =
      this.boardService.getCurrentGameInstance().BoardState.MoveHistory;
    const length = this.boardService.getMoveLength();
    const movedCoords = history.slice(history.length - length, history.length);
    let index = 0;
    for (const movedCoord of movedCoords) {
      if (
        Coordinate.equals(movedCoord.PointA, new Coordinate(x, y)) ||
        Coordinate.equals(movedCoord.PointB, new Coordinate(x, y))
      ) {
        let red = 245 - index * 10;
        let green = 203 - index * 10;
        let blue = 66;
        if ((x + y) % 2 === 1) {
          red = 189 - index * 10;
          green = 155 - index * 10;
          blue = 45;
        }

        return `rgb(${red}, ${green}, ${blue})`;
      }
      index++;
    }

    if ((x + y) % 2 === 1) {
      return "#878787";
    }

    return "#ADADAD";
  }
}

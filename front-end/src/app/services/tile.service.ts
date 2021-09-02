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

    if (this.dragService.dragging(x, y)) {
      return "#3f634d";
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

    const movedCoords = this.boardService
      .getCurrentGameInstance()
      .BoardState.getMovedTo();
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

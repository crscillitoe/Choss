import { Injectable } from "@angular/core";
import { Board } from "projects/chess/src/lib/chesslib/Board";
import { Coordinate } from "projects/chess/src/lib/chesslib/Coordinate";
import { TeamOption } from "projects/chess/src/lib/chesslib/Team";
import { BoardService } from "./board.service";
import { MouseService } from "./mouse.service";
import { PieceService } from "./piece.service";
import { PlayerService } from "./player.service";

@Injectable({
  providedIn: "root",
})
export class TileService {
  constructor(
    private boardService: BoardService,
    private playerSerivce: PlayerService,
    private pieceService: PieceService
  ) {}

  /**
   * Returns the given SVG of the piece at this location on the board.
   * If no piece is found, this function will return a blank SVG.
   *
   * @param x The x coordinate on the board of the piece
   * @param y The y coordinate on the board of the piece
   */
  getSVG(x: number, y: number) {
    if (this.boardService.gameInstance) {
      const Piece =
        this.boardService.gameInstance.BoardState.getPieceAtCoordinate(
          new Coordinate(x, y)
        );
      if (Piece) {
        return `assets/chess_pieces/${Piece.SVGName}`;
      }

      if (this.boardService.validMoves) {
        for (const coordinate of this.boardService.validMoves) {
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
    if (this.pieceService.selectedPiece) {
      if (
        this.pieceService.selectedPiece.Coordinate.x === x &&
        this.pieceService.selectedPiece.Coordinate.y === y
      ) {
        return "#57916d";
      }
    }
    const lookupKey = new Coordinate(x, y).toString();
    const coloredSquare =
      this.boardService.gameInstance.BoardState.ColorMap[lookupKey];
    if (coloredSquare && coloredSquare.viewableBy === this.playerSerivce.team) {
      return coloredSquare.color;
    }

    const piece =
      this.boardService.gameInstance.BoardState.getPieceAtCoordinate(
        new Coordinate(x, y)
      );
    if (piece) {
      if (piece.IsBomb && piece.Team.teamOption === this.playerSerivce.team) {
        return "red";
      }
    }

    const preMove = this.boardService.preMove;
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

    const history = this.boardService.gameInstance.BoardState.MoveHistory;
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

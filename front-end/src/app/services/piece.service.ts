import { ElementRef, Injectable } from "@angular/core";
import { Coordinate } from "projects/chess/src/lib/chesslib/Coordinate";
import { Move } from "projects/chess/src/lib/chesslib/Move";
import { Piece } from "projects/chess/src/lib/chesslib/Piece";
import { BoardService } from "./board.service";
import { PlayerService } from "./player.service";
import { TunnelService } from "./tunnel.service";

@Injectable({
  providedIn: "root",
})
export class PieceService {
  private selectedPiece: Piece;
  private pieceRefMap: { [key: string]: HTMLElement } = {};
  constructor(
    private boardService: BoardService,
    private playerService: PlayerService,
    private tunnelService: TunnelService
  ) {}
  /**
   * Selects the given piece (or unselects it, if it is already selected.)
   *
   * @param x The x coordinate on the board of the piece
   * @param y The y coordinate on the board of the piece
   */
  selectPiece(x: number, y: number) {
    this.boardService.clearPreMove();
    const Piece = this.boardService
      .getCurrentGameInstance()
      .BoardState.getPieceAtCoordinate(new Coordinate(x, y));
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

  registerPieceRef(pieceRef: ElementRef, x: number, y: number) {
    this.pieceRefMap[`${x},${y}`] = pieceRef.nativeElement;
  }

  getPieceRef(x: number, y: number): HTMLElement {
    return this.pieceRefMap[`${x},${y}`];
  }

  placePiece(x: number, y: number) {
    if (!this.selectedPiece) {
      this.boardService.clearPieceSelection();
      return;
    }

    const location = new Coordinate(x, y);
    if (this.playerService.isTheirTurn()) {
      if (Coordinate.equals(this.selectedPiece.Coordinate, location)) {
        return;
      }

      const preMove: Move = {
        PointA: this.selectedPiece.Coordinate,
        PointB: location,
      };
      this.boardService.makePreMove(preMove);
    } else {
      this.tunnelService.makeMove(this.selectedPiece.Coordinate, location);
    }

    this.boardService.clearPieceSelection();
    this.selectedPiece = null;
  }
}

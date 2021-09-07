import { Injectable } from "@angular/core";
import { DragStartEvent } from "angular-draggable-droppable";
import { Coordinate } from "projects/chess/src/lib/chesslib/Coordinate";
import { BoardService } from "./board.service";
import { PieceService } from "./piece.service";

@Injectable({
  providedIn: "root",
})
export class MouseService {
  public dragOrigin: Coordinate = null;
  public draggingPiece: HTMLElement;
  public placedWithClick: boolean = false;

  constructor(
    private pieceService: PieceService,
    private boardService: BoardService
  ) {}

  getCurrentDragOrigin(): Coordinate {
    return this.dragOrigin;
  }

  dragging(x: number, y: number): boolean {
    if (!this.dragOrigin) return false;
    return this.dragOrigin.x === x && this.dragOrigin.y === y;
  }

  mouseDown(
    pieceRef: HTMLElement,
    event: MouseEvent,
    x: number,
    y: number
  ): void {
    // Left click
    if (event.button === 0) {
      // Drag origin is set to previous coordinate
      for (const coord of this.boardService.validMoves) {
        if (coord.x === x && coord.y === y) {
          this.placedWithClick = true;
          this.pieceService.placePiece(x, y);
          return;
        }
      }

      this.dragOrigin = new Coordinate(x, y);
      this.draggingPiece = pieceRef;
      pieceRef.style.left =
        5 + (event.offsetX - pieceRef.offsetWidth / 2) + "px";
      pieceRef.style.top = event.offsetY - pieceRef.offsetHeight / 2 + "px";
      this.pieceService.selectPiece(x, y);
    }
  }

  clearPiece() {
    if (this.draggingPiece) {
      this.draggingPiece.style.left = "";
      this.draggingPiece.style.top = "";
      this.draggingPiece = null;
    }
  }

  mouseUp(x: number, y: number): void {
    this.clearPiece();
    if (this.dragOrigin && this.dragOrigin.x === x && this.dragOrigin.y === y) {
      this.dragOrigin = null;
      return;
    }

    this.placedWithClick = false;
    this.pieceService.placePiece(x, y);
    if (this.boardService.preMove != null) {
      this.placedWithClick = true;
    }
  }
}

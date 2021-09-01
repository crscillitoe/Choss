import { Injectable } from "@angular/core";
import { DragStartEvent } from "angular-draggable-droppable";
import { Coordinate } from "projects/chess/src/lib/chesslib/Coordinate";
import { PieceService } from "./piece.service";

@Injectable({
  providedIn: "root",
})
export class DragService {
  private dragOrigin: Coordinate = null;

  constructor(private pieceService: PieceService) {}

  getCurrentDragOrigin(): Coordinate {
    return this.dragOrigin;
  }

  dragging(x: number, y: number): boolean {
    if (!this.dragOrigin) return false;
    return this.dragOrigin.x === x && this.dragOrigin.y === y;
  }

  startDrag(x: number, y: number): void {
    this.dragOrigin = new Coordinate(x, y);
    this.pieceService.selectPiece(x, y);
  }

  stopDrag(x: number, y: number): void {
    this.dragOrigin = null;
    this.pieceService.placePiece(x, y);
  }
}

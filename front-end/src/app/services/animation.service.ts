import { Injectable } from "@angular/core";
import { Move } from "projects/chess/src/lib/chesslib/Move";
import { BoardService } from "./board.service";
import { MouseService } from "./mouse.service";
import { PieceService } from "./piece.service";
import { PlayerService } from "./player.service";

@Injectable({
  providedIn: "root",
})
export class AnimationService {
  constructor(
    private pieceService: PieceService,
    private boardService: BoardService,
    private mouseService: MouseService,
    private playerService: PlayerService
  ) {
    this.boardService.getPreviousMove().subscribe((move) => {
      if (move && this.shouldAnimate(move)) this.animate(move);
    });
  }

  shouldAnimate(move: Move) {
    return (
      this.mouseService.getPlacedWithClick() ||
      this.boardService
        .getCurrentGameInstance()
        .BoardState.getPieceAtCoordinate(move.PointB).Team.teamOption !=
        this.playerService.getPlayerTeam()
    );
  }

  animate(move: Move) {
    const originalLocation = this.pieceService.getPieceRef(
      move.PointA.x,
      move.PointA.y
    );

    const pieceRef = this.pieceService.getPieceRef(
      move.PointB.x,
      move.PointB.y
    );

    const aRect = originalLocation.getBoundingClientRect() as DOMRect;
    const pointAX = aRect.x;
    const pointAY = aRect.y;

    const magicX = aRect.width / 17;
    const magicY = aRect.height / 19;

    const bRect = pieceRef.getBoundingClientRect() as DOMRect;
    const pointBX = bRect.x;
    const pointBY = bRect.y;

    pieceRef.style.position = "absolute";
    pieceRef.style.left = pointAX - pointBX + magicX + "px";
    pieceRef.style.top = pointAY - pointBY + magicY + "px";

    pieceRef.style.transform = `translate(${pointBX - pointAX}px, ${
      pointBY - pointAY
    }px)`;
    pieceRef.style.transition = "transform 0.3s";

    setTimeout(() => {
      pieceRef.style.position = "";
      pieceRef.style.left = "";
      pieceRef.style.top = "";
      pieceRef.style.width = "";
      pieceRef.style.height = "";
      pieceRef.style.transform = "";
      pieceRef.style.transition = "";
    }, 300);
  }
}

import { Injectable } from "@angular/core";
import * as io from "socket.io-client";
import { Observable, BehaviorSubject } from "rxjs";
import { Board } from "../../../projects/chess/src/lib/chesslib/Board";
import { Move } from "../../../projects/chess/src/lib/chesslib/Move";
import { Coordinate } from "../../../projects/chess/src/lib/chesslib/Coordinate";
import { Piece } from "projects/chess/src/lib/chesslib/Piece";

@Injectable({
  providedIn: "root",
})
export class TunnelService {
  private socket: SocketIOClient.Socket;
  private server_ip: string = "api.woohoojin.dev";

  private boardState: BehaviorSubject<Board> = new BehaviorSubject<Board>(null);
  private validSquares: BehaviorSubject<Coordinate[]> = new BehaviorSubject<
    Coordinate[]
  >(null);

  constructor() {
    this.socket = io.connect(this.server_ip);

    this.socket.on("board-update", (data: Board) => {
      const toPush: Board = new Board(data.Pieces, data.Height, data.Width);
      this.boardState.next(toPush);
    });

    this.socket.on("piece-moves", (data: Coordinate[]) => {
      this.validSquares.next(data);
    });
  }

  /**
   * Returns a set of coordinates the selected piece is allowed to move to.
   */
  getValidSquares(): Observable<Coordinate[]> {
    return this.validSquares;
  }

  /**
   * Lets the API know we wanna know the valid squares for this piece.
   *
   * @param piece the piece that you want to know valid squares for
   */
  requestValidSquares(piece: Piece) {
    this.socket.emit("valid-squares", piece);
  }

  /**
   * Connects to the given game.
   *
   * @param ID The ID of the game to connect to.
   */
  connectToGame(ID: number) {
    throw new Error("Not Implemented");
  }

  /**
   * Returns an obsevable containing the state of the board
   * from the server.
   */
  receiveBoardState(): Observable<Board> {
    return this.boardState;
  }

  /**
   * Constructs and sends a move to the server
   *
   * @param pointA The coordinate of the piece you would like to move
   * @param pointB The coordinate that you would like to move the piece to
   */
  makeMove(pointA: Coordinate, pointB: Coordinate) {
    const move: Move = {
      PointA: pointA,
      PointB: pointB,
    };

    this.socket.emit("make-move", move);
  }
}

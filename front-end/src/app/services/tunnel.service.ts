import { Injectable } from "@angular/core";
import * as io from "socket.io-client";
import { Observable, BehaviorSubject } from "rxjs";
import { Board } from "../../../../shared/chesslib/Board";
import { Coordinate } from "../../../../shared/chesslib/Coordinate";

@Injectable({
  providedIn: "root"
})
export class TunnelService {
  private socket: SocketIOClient.Socket;
  private server_ip: string = "localhost:3000";

  private boardState: BehaviorSubject<Board> = new BehaviorSubject<Board>(null);

  constructor() {
    this.socket = io.connect(this.server_ip);

    this.socket.on("board-update", (data: Board) => {
      console.log(data);
      this.boardState.next(data);
    });
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
   * @param pointA The coordinate of the piece you would like to move
   * @param pointB The coordinate that you would like to move the piece to
   */
  makeMove(pointA: Coordinate, pointB: Coordinate) {
    console.log([pointA, pointB]);
    this.socket.emit("make-move", [pointA, pointB]);
  }
}

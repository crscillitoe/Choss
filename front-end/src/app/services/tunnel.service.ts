import { Injectable } from "@angular/core";
import * as io from "socket.io-client";
import { Observable, BehaviorSubject } from "rxjs";
import { Board } from "../../../projects/chess/src/lib/chesslib/Board";
import { Move } from "../../../projects/chess/src/lib/chesslib/Move";
import { Coordinate } from "../../../projects/chess/src/lib/chesslib/Coordinate";
import { Piece } from "projects/chess/src/lib/chesslib/Piece";
import { Game } from "projects/chess/src/lib/chesslib/Game";
import { serverIp } from "projects/chess/src/localConfiguration";
import { ActivatedRoute } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class TunnelService {
  private socket: SocketIOClient.Socket;
  private server_ip: string = serverIp || "api.woohoojin.dev";

  private boardState: BehaviorSubject<Game> = new BehaviorSubject<Game>(null);
  private validSquares: BehaviorSubject<Coordinate[]> = new BehaviorSubject<
    Coordinate[]
  >(null);

  constructor(private route: ActivatedRoute) {
    this.socket = io.connect(this.server_ip);
    this.socket.on("initial-connect", () => {
      this.route.queryParams.subscribe((params) => {
        this.socket.emit("connect-to-room", params["roomId"]);
      });
    });

    this.socket.on("board-update", (data: Game) => {
      let temp = new Board(
        data.BoardState.Pieces,
        data.BoardState.Height,
        data.BoardState.Width
      );

      temp.MoveHistory = data.BoardState.MoveHistory;
      data.BoardState = temp;

      this.boardState.next(data);
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
   * Tells the server to reset the board.
   */
  resetGame() {
    this.socket.emit("reset");
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
  receiveBoardState(): Observable<Game> {
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

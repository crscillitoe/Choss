import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Game } from "projects/chess/src/lib/chesslib/Game";
import { GameModeDescription } from "projects/chess/src/lib/chesslib/GameModes/GameModeRegistry";
import { Piece } from "projects/chess/src/lib/chesslib/Piece";
import { BehaviorSubject, Observable } from "rxjs";
import * as io from "socket.io-client";
import { Coordinate } from "../../../projects/chess/src/lib/chesslib/Coordinate";
import { Move } from "../../../projects/chess/src/lib/chesslib/Move";
import { BoardService } from "./board.service";
import { PlayerService } from "./player.service";

@Injectable({
  providedIn: "root",
})
export class TunnelService {
  private socket: SocketIOClient.Socket;
  private waitSocket: SocketIOClient.Socket;
  private socket_ip: string = "https://api.woohoojin.dev";

  private boardState: BehaviorSubject<Game> = new BehaviorSubject<Game>(null);
  private validSquares: BehaviorSubject<Coordinate[]> = new BehaviorSubject<
    Coordinate[]
  >(null);

  private gameId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private boardService: BoardService,
    private playerService: PlayerService
  ) {}

  /**
   * Disconnect from the server
   */
  closeConnection() {
    this.socket.disconnect();
  }

  closeWaitConnection() {
    this.waitSocket.disconnect();
  }

  createGameWait(uuid: string, callback: () => any) {
    this.waitSocket = io.connect(this.socket_ip);
    this.waitSocket.on("initial-connect", () => {
      this.waitSocket.emit("host-room", uuid);
    });

    this.waitSocket.on("game-ready", () => {
      this.waitSocket.disconnect();
      callback();
    });
  }

  /**
   * Connect to the server
   */
  connect() {
    this.socket = io.connect(this.socket_ip);
    this.socket.on("initial-connect", () => {
      this.route.queryParams.subscribe((params) => {
        this.gameId = params["gameId"];
        // Updates observable, unused in tunnel
        const fullSeed: string[] = params["roomId"].match(/\d/g);
        const seedFromRoomID = +fullSeed.slice(0, 5).join("");
        this.boardService.buildGame(this.gameId, seedFromRoomID);
        this.socket.emit("connect-to-room", params["roomId"], params["gameId"]);
      });
    });

    this.socket.on("move-made", async (move: Move) => {
      const coordinateA = new Coordinate(move.PointA.x, move.PointA.y);
      const coordinateB = new Coordinate(move.PointB.x, move.PointB.y);
      const tempMove = {
        PointA: coordinateA,
        PointB: coordinateB,
        PieceMoved: move.PieceMoved,
      };
      await this.boardService.evaluateMove(tempMove);

      const preMove = this.boardService.preMove;
      if (this.playerService.isOurTurn() && preMove) {
        this.makeMove(preMove.PointA, preMove.PointB);
        this.boardService.clearPreMove();
      }
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
    this.socket.emit("reset", this.gameId);
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
  async makeMove(pointA: Coordinate, pointB: Coordinate) {
    const move: Move = {
      PointA: pointA,
      PointB: pointB,
    };

    console.log();

    if (this.socket) {
      this.socket.emit("make-move", move);
    } else {
      await this.boardService.evaluateMove(move);
    }
  }

  makePremove(pointA: Coordinate, pointB: Coordinate) {
    const move: Move = {
      PointA: pointA,
      PointB: pointB,
    };

    this.socket.emit("make-premove", move);
  }

  /**
   * List all supported game modes
   */
  getAvailableGameModes(): Observable<GameModeDescription[]> {
    return this.http.get<GameModeDescription[]>(
      `https://api.woohoojin.dev/listGameModes`
    );
  }
}

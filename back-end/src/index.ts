import express from "express";
import { TeamOption } from "../../front-end/projects/chess/src/lib/chesslib/Team";
import { DoubleMove } from "../../front-end/projects/chess/src/lib/chesslib/GameModes/DoubleMove";
import { RandomAtomic } from "../../front-end/projects/chess/src/lib/chesslib/GameModes/RandomAtomic";
import { War } from "../../front-end/projects/chess/src/lib/chesslib/GameModes/War";
import { Move } from "../../front-end/projects/chess/src/lib/chesslib/Move";
import { Piece } from "../../front-end/projects/chess/src/lib/chesslib/Piece";
import { boardGame } from "../../front-end/projects/chess/src/localConfiguration";
import { Game } from "../../front-end/projects/chess/src/lib/chesslib/Game";
import {
  getGameModeDescriptions,
  getGameModeById
} from "../../front-end/projects/chess/src/lib/chesslib/GameModes/GameModeRegistry";
import cors from "cors";
import { GameMode } from "../../front-end/projects/chess/src/lib/chesslib/GameMode";

const app = express();
const options: cors.CorsOptions = {
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "X-Access-Token"
  ],
  credentials: true,
  methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
  origin: "*",
  preflightContinue: false
};

app.use(cors(options));

const port = process.env.PORT || 3000;
app.set("port", port);

const http = require("http").Server(app);
const io = require("socket.io")(http);

const clientIdToRooms: { [clientId: string]: string } = {};
const roomIdToGames: { [roomId: string]: Game } = {};
const roomIdToGameModes: { [roomId: string]: GameMode } = {};

app.get("/listGameModes", async (request: any, response: any) => {
  const gameModeDescriptions = getGameModeDescriptions();
  response.status(200).send(gameModeDescriptions);
});

const getBoardFromClientId = (clientId: string): Game => {
  const roomId = clientIdToRooms[clientId];
  return roomIdToGames[roomId];
};

const getGameModeFromClientId = (clientId: string): GameMode => {
  const roomId = clientIdToRooms[clientId];
  return roomIdToGameModes[roomId];
};

io.on("connection", (socket: SocketIO.Socket) => {
  console.log(`Received connection from client: ${socket.client.id}`);
  socket.emit("initial-connect");

  socket.on("connect-to-room", (roomId: string, gameId: number) => {
    if (roomId != null && gameId != null) {
      clientIdToRooms[socket.client.id] = roomId;
      socket.join(roomId);
      if (!roomIdToGames[roomId]) {
        roomIdToGames[roomId] = getGameModeById(gameId).BuildFreshGame();
        roomIdToGameModes[roomId] = new (<any>getGameModeById(gameId))();
      }

      io.to(roomId).emit(
        "board-update",
        getBoardFromClientId(socket.client.id)
      );
    }
  });

  socket.on("make-move", (move: Move) => {
    const board = getBoardFromClientId(socket.client.id);
    if (getGameModeFromClientId(socket.client.id).HandleMove(move, board)) {
      io.to(clientIdToRooms[socket.client.id]).emit("board-update", board);
    }
  });

  socket.on("reset", (gameId: number) => {
    const roomId = clientIdToRooms[socket.client.id];
    roomIdToGames[roomId] = getGameModeById(gameId).BuildFreshGame();
    io.to(clientIdToRooms[socket.client.id]).emit(
      "board-update",
      getBoardFromClientId(socket.client.id)
    );
  });

  socket.on("valid-squares", (piece: Piece) => {
    const board = getBoardFromClientId(socket.client.id);
    const pieceOnBoard = board.BoardState.getPieceAtCoordinate(
      piece.Coordinate
    );

    if (pieceOnBoard) {
      const validSquares = Array.from(
        pieceOnBoard.getValidSquares(board.BoardState)
      );

      socket.emit("piece-moves", validSquares);
    }
  });
});

// start our simple server up on localhost:3000
const server = http.listen(port, () => {
  console.log(`listening on *:${port}`);
});

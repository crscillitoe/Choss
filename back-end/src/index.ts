import express from "express";
import { TeamOption } from "../../front-end/projects/chess/src/lib/chesslib/Team";
import { DoubleMove } from "../../front-end/projects/chess/src/lib/chesslib/GameModes/DoubleMove";
import { RandomAtomic } from "../../front-end/projects/chess/src/lib/chesslib/GameModes/RandomAtomic";
import { War } from "../../front-end/projects/chess/src/lib/chesslib/GameModes/War";
import { Move } from "../../front-end/projects/chess/src/lib/chesslib/Move";
import { Piece } from "../../front-end/projects/chess/src/lib/chesslib/Piece";
import { Game } from "../../front-end/projects/chess/src/lib/chesslib/Game";
import {
  getGameModeDescriptions,
  getGameModeById,
} from "../../front-end/projects/chess/src/lib/chesslib/GameModes/GameModeRegistry";
import cors from "cors";
import { GameMode } from "../../front-end/projects/chess/src/lib/chesslib/GameMode";
import { GameState } from "../../front-end/projects/chess/src/lib/chesslib/GameState";

const app = express();
const options: cors.CorsOptions = {
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "X-Access-Token",
  ],
  credentials: true,
  methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
  origin: "*",
  preflightContinue: false,
};

app.use(cors(options));

app.set("port", process.env.PORT || 3000);

const http = require("http").Server(app);
const io = require("socket.io")(http);

const clientIdToRooms: { [clientId: string]: string } = {};
const waitingRooms: { [roomId: string]: boolean } = {};

app.get("/listGameModes", async (request: any, response: any) => {
  const gameModeDescriptions = getGameModeDescriptions();
  response.status(200).send(gameModeDescriptions);
});

io.on("connection", (socket: SocketIO.Socket) => {
  console.log(`Received connection from client: ${socket.client.id}`);
  socket.emit("initial-connect");

  socket.on("host-room", (roomId: string) => {
    console.log(`Client ${socket.client.id} is hosting room ${roomId}`);
    socket.join(roomId);
    waitingRooms[roomId] = true;
  });

  socket.on("connect-to-room", (roomId: string, gameId: number) => {
    if (roomId != null && gameId != null) {
      if (waitingRooms[roomId]) {
        waitingRooms[roomId] = false;
        io.to(roomId).emit("game-ready");
      }

      clientIdToRooms[socket.client.id] = roomId;
      socket.join(roomId);
    }
  });

  socket.on("make-move", async (move: Move) => {
    io.to(clientIdToRooms[socket.client.id]).emit("move-made", move);
  });
});

// start our simple server up on localhost:3000
const server = http.listen(process.env.PORT || 3000, () => {
  console.log(`listening on *:${process.env.PORT || 3000}`);
});

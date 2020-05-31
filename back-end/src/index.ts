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
  getGameModeById,
} from "../../front-end/projects/chess/src/lib/chesslib/GameModes/GameModeRegistry";

const app = express();
app.set("port", process.env.PORT || 3000);

const http = require("http").Server(app);
const io = require("socket.io")(http);
const clientIdToRooms: { [clientId: string]: string } = {};
const roomIdToGames: { [roomId: string]: Game } = {};

app.get("/listGameModes", async (request: any, response: any) => {
  const gameModeDescriptions = getGameModeDescriptions();
  response.send(gameModeDescriptions);
});

const getBoardFromClientId = (clientId: string): Game => {
  const roomId = clientIdToRooms[clientId];
  return roomIdToGames[roomId];
};

io.on("connection", (socket: SocketIO.Socket) => {
  console.log(`Received connection from client: ${socket.client.id}`);
  socket.emit("initial-connect");

  socket.on("connect-to-room", (roomId: string) => {
    clientIdToRooms[socket.client.id] = roomId;
    socket.join(roomId);
    if (!roomIdToGames[roomId]) {
      roomIdToGames[roomId] = boardGame.BuildFreshGame();
    }
    io.to(roomId).emit("board-update", getBoardFromClientId(socket.client.id));
  });

  socket.on("make-move", (move: Move) => {
    const board = getBoardFromClientId(socket.client.id);
    if (boardGame.HandleMove(move, board)) {
      io.to(clientIdToRooms[socket.client.id]).emit("board-update", board);
    }
  });

  socket.on("reset", () => {
    const roomId = clientIdToRooms[socket.client.id];
    roomIdToGames[roomId] = boardGame.BuildFreshGame();
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
const server = http.listen(3000, () => {
  console.log("listening on *:3000");
});

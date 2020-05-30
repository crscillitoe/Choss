import express from "express";
import { TeamOption } from "../../front-end/projects/chess/src/lib/chesslib/Team";
import { DoubleMove } from "../../front-end/projects/chess/src/lib/chesslib/GameModes/DoubleMove";
import { RandomAtomic } from "../../front-end/projects/chess/src/lib/chesslib/GameModes/RandomAtomic";
import { War } from "../../front-end/projects/chess/src/lib/chesslib/GameModes/War";
import { Move } from "../../front-end/projects/chess/src/lib/chesslib/Move";
import { Piece } from "../../front-end/projects/chess/src/lib/chesslib/Piece";
import { boardGame } from "../../front-end/projects/chess/src/localConfiguration";

const app = express();
app.set("port", process.env.PORT || 3000);

const http = require("http").Server(app);
const io = require("socket.io")(http);

// simple '/' endpoint sending a Hello World
// response
app.get("/", (req: any, res: any) => {
  res.send("hello world");
});

let board = boardGame.BuildFreshGame();

io.on("connection", (socket: SocketIO.Socket) => {
  console.log(`Received connection from client: ${socket.client.id}`);
  io.emit("board-update", board);

  socket.on("make-move", (move: Move) => {
    if (boardGame.HandleMove(move, board)) {
      io.emit("board-update", board);
    }
  });

  socket.on("reset", () => {
    board = boardGame.BuildFreshGame();
    io.emit("board-update", board);
  });

  socket.on("valid-squares", (piece: Piece) => {
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

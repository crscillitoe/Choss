import express from "express";
import { Coordinate } from "../../front-end/projects/chess/src/lib/chesslib/Coordinate";
import { Board } from "../../front-end/projects/chess/src/lib/chesslib/Board";
import {
  Team,
  TeamOption,
} from "../../front-end/projects/chess/src/lib/chesslib/Team";
import { King } from "../../front-end/projects/chess/src/lib/chesslib/Pieces/Standard/King";
import { DoubleMove } from "../../front-end/projects/chess/src/lib/chesslib/GameModes/DoubleMove";
import { Move } from "../../front-end/projects/chess/src/lib/chesslib/Move";
import { Piece } from "../../front-end/projects/chess/src/lib/chesslib/Piece";

const app = express();
app.set("port", process.env.PORT || 3000);

const http = require("http").Server(app);
const io = require("socket.io")(http);

// simple '/' endpoint sending a Hello World
// response
app.get("/", (req: any, res: any) => {
  res.send("hello world");
});

const boardGame = new DoubleMove();
const board = boardGame.BuildFreshGame();

io.on("connection", (socket: SocketIO.Socket) => {
  console.log(`Received connection from client: ${socket.client.id}`);
  io.emit("board-update", board);

  socket.on("make-move", (move: Move) => {
    if (boardGame.HandleMove(TeamOption.WHITE, move, board)) {
      io.emit("board-update", board);
    }
  });

  socket.on("valid-squares", (piece: Piece) => {
    console.log(
      `requesting valid squares for ${piece.Coordinate.x}, ${piece.Coordinate.y}`
    );
    const pieceOnBoard = board.BoardState.getPieceAtCoordinate(
      piece.Coordinate.x,
      piece.Coordinate.y
    );

    if (pieceOnBoard) {
      console.log(`found piece: ${pieceOnBoard}`);
      const validSquares = Array.from(
        pieceOnBoard.getValidSquares(board.BoardState)
      );

      console.log(`valid squares: ${validSquares}`);
      socket.emit("piece-moves", validSquares);
    }
  });
});

// start our simple server up on localhost:3000
const server = http.listen(3000, () => {
  console.log("listening on *:3000");
});

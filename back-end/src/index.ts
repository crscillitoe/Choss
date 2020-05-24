import express from "express";
import { Coordinate } from "../../front-end/projects/chess/src/lib/chesslib/Coordinate";
import { Board } from "../../front-end/projects/chess/src/lib/chesslib/Board";
import { Team } from "../../front-end/projects/chess/src/lib/chesslib/Team";
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

const board = new Board([], 8, 8);
board.Pieces.push(new King(4, 4, Team.BLACK));
board.Pieces.push(new King(2, 2, Team.WHITE));
const boardGame = new DoubleMove();

io.on("connection", (socket: SocketIO.Socket) => {
  console.log(`Received connection from client: ${socket.client.id}`);
  io.emit("board-update", board);

  socket.on("make-move", (move: Move) => {
    boardGame.HandleMove(Team.WHITE, move, board);
    io.emit("board-update", board);
  });

  socket.on("valid-squares", (piece: Piece) => {
    console.log(
      `requesting valid squares for ${piece.Coordinate.x}, ${piece.Coordinate.y}`
    );
    const pieceOnBoard = board.getPieceAtCoordinate(
      piece.Coordinate.x,
      piece.Coordinate.y
    );

    if (pieceOnBoard) {
      console.log(`found piece: ${pieceOnBoard}`);
      const validSquares = Array.from(pieceOnBoard.getValidSquares(board));

      console.log(`valid squares: ${validSquares}`);
      io.emit("piece-moves", validSquares);
    }
  });
});

// start our simple server up on localhost:3000
const server = http.listen(3000, () => {
  console.log("listening on *:3000");
});

import { Board } from "../Board";
import { Coordinate } from "../Coordinate";
import { Game } from "../Game";
import { GameMode } from "../GameMode";
import { GameState } from "../GameState";
import { Move } from "../Move";
import { Zebra } from "../Pieces/Non-Standard/Zebra";
import { Bishop } from "../Pieces/Standard/Bishop";
import { King } from "../Pieces/Standard/King";
import { Knight } from "../Pieces/Standard/Knight";
import { Rook } from "../Pieces/Standard/Rook";
import { Team, TeamOption } from "../Team";

const QUEUED_MOVE_COLORS = ["lightblue", "blue", "darkblue"];

export class QChess extends GameMode {
  constructor() {
    super();
  }

  whiteMoveArray: Move[] = [];
  blackMoveArray: Move[] = [];

  getMoveLength(): number {
    return 6;
  }

  async HandleMove(Move: Move, BoardGameState: Game): Promise<boolean> {
    const piece = BoardGameState.BoardState.getPieceAtCoordinate(Move.PointA);
    Move.PointA = new Coordinate(Move.PointA.x, Move.PointA.y);
    Move.PointB = new Coordinate(Move.PointB.x, Move.PointB.y);
    if (piece.Team.teamOption === TeamOption.WHITE) {
      if (this.whiteMoveArray.length < 3) {
        this.whiteMoveArray.push(Move);
      }
      BoardGameState.BoardState.ColorMap[Move.PointA.toString()] = {
        color: QUEUED_MOVE_COLORS[this.whiteMoveArray.length - 1],
        viewableBy: TeamOption.WHITE,
      };
      BoardGameState.BoardState.ColorMap[Move.PointB.toString()] = {
        color: QUEUED_MOVE_COLORS[this.whiteMoveArray.length - 1],
        viewableBy: TeamOption.WHITE,
      };
    } else if (piece.Team.teamOption === TeamOption.BLACK) {
      if (this.blackMoveArray.length < 3) {
        this.blackMoveArray.push(Move);
      }
      BoardGameState.BoardState.ColorMap[Move.PointA.toString()] = {
        color: QUEUED_MOVE_COLORS[this.blackMoveArray.length - 1],
        viewableBy: TeamOption.BLACK,
      };
      BoardGameState.BoardState.ColorMap[Move.PointB.toString()] = {
        color: QUEUED_MOVE_COLORS[this.blackMoveArray.length - 1],
        viewableBy: TeamOption.BLACK,
      };
    }

    let toReturn = false;
    if (this.whiteMoveArray.length === 3 && this.blackMoveArray.length === 3) {
      // The speedier player gets initiative
      // -> The slower player will have the game state set to their turn
      // -> The faster player will have their moves played first
      if (BoardGameState.State === GameState.IN_PROGRESS_WHITE_TURN) {
        BoardGameState.State = GameState.IN_PROGRESS_BLACK_TURN;
        toReturn = await this.processMoves(
          this.blackMoveArray,
          this.whiteMoveArray,
          BoardGameState
        );
      } else {
        BoardGameState.State = GameState.IN_PROGRESS_WHITE_TURN;
        toReturn = await this.processMoves(
          this.whiteMoveArray,
          this.blackMoveArray,
          BoardGameState
        );
      }
      this.whiteMoveArray = [];
      this.blackMoveArray = [];
      BoardGameState.BoardState.ColorMap = {};
      BoardGameState.State = GameState.IN_PROGRESS_BOTH_TURN;
      BoardGameState.BoardState.Timer.BlackTicking = true;
      BoardGameState.BoardState.Timer.WhiteTicking = true;
    } else if (this.whiteMoveArray.length === 3) {
      BoardGameState.State = GameState.IN_PROGRESS_BLACK_TURN;
    } else if (this.blackMoveArray.length === 3) {
      BoardGameState.State = GameState.IN_PROGRESS_WHITE_TURN;
    } else {
      BoardGameState.State = GameState.IN_PROGRESS_BOTH_TURN;
    }

    return toReturn;
  }

  async processMoves(
    firstMoves: Move[],
    secondMoves: Move[],
    BoardGameState: Game
  ): Promise<boolean> {
    let toReturn = false;

    for (let i = 0; i < 3; i++) {
      BoardGameState.State = GameState.IN_PROGRESS_BOTH_TURN;
      toReturn =
        (await super.HandleMove(firstMoves[i], BoardGameState)) || toReturn;
      if (BoardGameState.isGameOver()) {
        return toReturn;
      }
      await this.sleep(1000);

      BoardGameState.State = GameState.IN_PROGRESS_BOTH_TURN;
      toReturn =
        (await super.HandleMove(secondMoves[i], BoardGameState)) || toReturn;
      if (BoardGameState.isGameOver()) {
        return toReturn;
      }
      await this.sleep(1000);
    }

    return toReturn;
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static BuildFreshGame(seed: number): Game {
    const game = super.BuildFreshGame(seed);
    const timer = game.BoardState.Timer;
    const board: Board = new Board([], 11, 11);
    game.BoardState = board;
    board.Timer = timer;
    game.State = GameState.IN_PROGRESS_BOTH_TURN;
    board.Timer.BlackTicking = true;

    board.Pieces.push(new King(6, 1, new Team(TeamOption.WHITE)));

    board.Pieces.push(new Zebra(4, 1, new Team(TeamOption.WHITE)));
    board.Pieces.push(new Zebra(5, 1, new Team(TeamOption.WHITE)));
    board.Pieces.push(new Zebra(7, 1, new Team(TeamOption.WHITE)));
    board.Pieces.push(new Zebra(8, 1, new Team(TeamOption.WHITE)));

    board.Pieces.push(new Rook(1, 1, new Team(TeamOption.WHITE)));
    board.Pieces.push(new Rook(11, 1, new Team(TeamOption.WHITE)));

    board.Pieces.push(new Knight(2, 1, new Team(TeamOption.WHITE)));
    board.Pieces.push(new Knight(10, 1, new Team(TeamOption.WHITE)));

    board.Pieces.push(new Bishop(3, 1, new Team(TeamOption.WHITE)));
    board.Pieces.push(new Bishop(9, 1, new Team(TeamOption.WHITE)));

    board.fillRowWithPawns(2, TeamOption.WHITE);
    board.fillRowWithPawns(10, TeamOption.BLACK);

    board.Pieces.push(new Zebra(4, 11, new Team(TeamOption.BLACK)));
    board.Pieces.push(new Zebra(5, 11, new Team(TeamOption.BLACK)));

    board.Pieces.push(new King(6, 11, new Team(TeamOption.BLACK)));

    board.Pieces.push(new Zebra(7, 11, new Team(TeamOption.BLACK)));
    board.Pieces.push(new Zebra(8, 11, new Team(TeamOption.BLACK)));

    board.Pieces.push(new Rook(1, 11, new Team(TeamOption.BLACK)));
    board.Pieces.push(new Rook(11, 11, new Team(TeamOption.BLACK)));

    board.Pieces.push(new Knight(2, 11, new Team(TeamOption.BLACK)));
    board.Pieces.push(new Knight(10, 11, new Team(TeamOption.BLACK)));

    board.Pieces.push(new Bishop(3, 11, new Team(TeamOption.BLACK)));
    board.Pieces.push(new Bishop(9, 11, new Team(TeamOption.BLACK)));

    return game;
  }
}

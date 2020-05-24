import { Board } from "../Board";
import { Team } from "../Team";
import { Queen } from "../Pieces/Standard/Queen";
import { King } from "../Pieces/Standard/King";
import { Rook } from "../Pieces/Standard/Rook";
import { Knight } from "../Pieces/Standard/Knight";
import { Bishop } from "../Pieces/Standard/Bishop";
import { Pawn } from "../Pieces/Standard/Pawn";

/**
 * Contains definitions for built data/function implementations
 * that may be commonly shared across many gamemodes.
 */
export class GameModeShared {
  /**
   * Returns a normal 8x8 chessboard with all the pieces
   * right where you'd expect em. Normal, boring chess.
   */
  static StandardChessBoard(): Board {
    const board = new Board([], 8, 8);
    board.Pieces.push(new Queen(5, 1, Team.WHITE));
    board.Pieces.push(new King(4, 1, Team.WHITE));

    board.Pieces.push(new Rook(1, 1, Team.WHITE));
    board.Pieces.push(new Rook(8, 1, Team.WHITE));

    board.Pieces.push(new Knight(2, 1, Team.WHITE));
    board.Pieces.push(new Knight(7, 1, Team.WHITE));

    board.Pieces.push(new Bishop(3, 1, Team.WHITE));
    board.Pieces.push(new Bishop(6, 1, Team.WHITE));

    board.Pieces.push(new Pawn(1, 2, Team.WHITE));
    board.Pieces.push(new Pawn(2, 2, Team.WHITE));
    board.Pieces.push(new Pawn(3, 2, Team.WHITE));
    board.Pieces.push(new Pawn(4, 2, Team.WHITE));
    board.Pieces.push(new Pawn(5, 2, Team.WHITE));
    board.Pieces.push(new Pawn(6, 2, Team.WHITE));
    board.Pieces.push(new Pawn(7, 2, Team.WHITE));
    board.Pieces.push(new Pawn(8, 2, Team.WHITE));

    board.Pieces.push(new Queen(5, 8, Team.BLACK));
    board.Pieces.push(new King(4, 8, Team.BLACK));

    board.Pieces.push(new Rook(1, 8, Team.BLACK));
    board.Pieces.push(new Rook(8, 8, Team.BLACK));

    board.Pieces.push(new Knight(2, 8, Team.BLACK));
    board.Pieces.push(new Knight(7, 8, Team.BLACK));

    board.Pieces.push(new Bishop(3, 8, Team.BLACK));
    board.Pieces.push(new Bishop(6, 8, Team.BLACK));

    board.Pieces.push(new Pawn(1, 7, Team.BLACK));
    board.Pieces.push(new Pawn(2, 7, Team.BLACK));
    board.Pieces.push(new Pawn(3, 7, Team.BLACK));
    board.Pieces.push(new Pawn(4, 7, Team.BLACK));
    board.Pieces.push(new Pawn(5, 7, Team.BLACK));
    board.Pieces.push(new Pawn(6, 7, Team.BLACK));
    board.Pieces.push(new Pawn(7, 7, Team.BLACK));
    board.Pieces.push(new Pawn(8, 7, Team.BLACK));

    return board;
  }
}

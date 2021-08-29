/**
 * `GameState` will be used to indicate to the
 * client(s) whether or not a game has been
 * concluded, and how.
 */
export enum GameState {
  // White has won, via one of the special conditions in this mode.
  WHITE_WIN,

  // Black has won, via one of the special conditions in this mode.
  BLACK_WIN,

  // The game has ended in a draw, the current player has no legal moves and is not in check.
  DRAW,

  // The game is not over, it is in progress, and it is white's turn
  IN_PROGRESS_WHITE_TURN,

  // The game is not over, it is in progress, and it is black's turn
  IN_PROGRESS_BLACK_TURN,
}

import { Board } from './Board';
import { GameState } from './GameState';

export class Game {
    BoardState: Board;
    State: GameState;

    constructor(BoardState: Board, State: GameState = GameState.IN_PROGRESS_WHITE_TURN) {
        this.BoardState = BoardState;
        this.State = State;
    }
}
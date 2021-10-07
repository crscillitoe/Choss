import { Injectable } from "@angular/core";
import { ChessInstance } from "chess.js";
import { Chess as Pgn } from "cm-chess/src/cm-chess/Chess.js";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class TrainingControlsService {
  randomLine: boolean = true;

  public trainingBoard: ChessInstance;
  public fenMapToSans: Map<
    string,
    { from: string; to: string; san: string }[]
  > = new Map<string, { from: string; to: string; san: string }[]>();
  public update: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  public ourTeam: string = "w";
  public endOfLine: boolean = false;
  public resetting: boolean = false;

  ourTurn(): boolean {
    return this.trainingBoard.turn() === this.ourTeam;
  }

  reset() {
    this.resetting = true;
    this.endOfLine = false;
    this.trainingBoard.reset();
    this.update.next(true);
  }

  getMoveFromMainline() {
    const moves = this.fenMapToSans.get(
      this.shortFen(this.trainingBoard.fen())
    );

    return moves[0];
  }

  playContinuation(continuation: { from: string; to: string; san: string }) {
    this.trainingBoard.move(continuation.san);
    this.update.next(true);
  }

  loadMovesFromPgn(pgn: string) {
    const parsed = new Pgn({ pgn: pgn });
    this.loadMoves(parsed.pgn.history.moves);
    console.log(this.fenMapToSans);
    localStorage.setItem("pgn", pgn);
    this.update.next(true);
  }

  loadMoves(moves: any) {
    for (let x = 0; x < moves.length; x++) {
      const move = moves[x];
      if (move.previous) {
        const fen = this.shortFen(move.previous.fen);
        if (this.fenMapToSans.has(fen)) {
          this.fenMapToSans
            .get(fen)
            .push({ from: move.from, to: move.to, san: move.san });
        } else {
          this.fenMapToSans.set(fen, []);
          this.fenMapToSans
            .get(fen)
            .push({ from: move.from, to: move.to, san: move.san });
        }
      } else {
        if (this.fenMapToSans.has("start")) {
          this.fenMapToSans
            .get("start")
            .push({ from: move.from, to: move.to, san: move.san });
        } else {
          this.fenMapToSans.set("start", []);
          this.fenMapToSans
            .get("start")
            .push({ from: move.from, to: move.to, san: move.san });
        }
      }

      for (const variation of move.variations) {
        this.loadMoves(variation);
      }
    }
  }

  getValidContinuations(start: boolean = false) {
    if (start) {
      return this.fenMapToSans.get("start");
    }

    const fen = this.shortFen(this.trainingBoard.fen());
    return this.fenMapToSans.get(fen);
  }

  shortFen(fen: string): string {
    return fen.split(" ")[0] + " " + fen.split(" ")[1];
  }

  constructor() {
    if (localStorage.getItem("pgn")) {
      this.loadMovesFromPgn(localStorage.getItem("pgn"));
    }

    if (localStorage.getItem("team")) {
      this.ourTeam = localStorage.getItem("team");
    }
  }
}

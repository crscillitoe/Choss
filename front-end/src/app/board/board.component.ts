import { Component, OnInit } from "@angular/core";
import { TunnelService } from "../services/tunnel.service";
import { Board } from "../../../../shared/chesslib/Board";
import { Team } from "../../../../shared/chesslib/Team";

@Component({
  selector: "app-board",
  templateUrl: "./board.component.html",
  styleUrls: ["./board.component.css"]
})
export class BoardComponent implements OnInit {
  Board: Board = {
    Pieces: [],
    Width: 8,
    Height: 8
  };

  rows = [];
  columns = [];

  alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m"];

  player = Team.BLACK;

  constructor(private tunnelService: TunnelService) {}

  /**
   * Gets the background tile of the tile at the given location.
   * @param x X coordinate of the tile
   * @param y Y coordinate of the tile
   */
  getColor(x: number, y: number) {
    if ((x + y) % 2 === 0) {
      return "#303030";
    }

    return "#888888";
  }

  ngOnInit() {
    for (let i = 0; i < this.Board.Width; i++) {
      this.rows.push(i + 1);
      this.columns.push(this.alphabet[i]);
    }

    this.tunnelService.receiveBoardState().subscribe(data => {
      this.Board = data;
    });
  }
}

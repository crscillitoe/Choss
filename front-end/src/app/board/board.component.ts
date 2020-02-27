import { Component, OnInit } from "@angular/core";
import { TunnelService } from "../services/tunnel.service";

@Component({
  selector: "app-board",
  templateUrl: "./board.component.html",
  styleUrls: ["./board.component.css"]
})
export class BoardComponent implements OnInit {
  constructor(private tunnelService: TunnelService) {}

  ngOnInit() {
    this.tunnelService.receiveBoardState().subscribe(data => {
      console.log(`Received board update: ${data}`);
    });
  }

  sendUpdate() {
    console.log("sending move");
    this.tunnelService.makeMove({ x: 1, y: 1 }, { x: 2, y: 2 });
  }
}

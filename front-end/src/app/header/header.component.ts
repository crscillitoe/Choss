import { Component, OnInit } from "@angular/core";
import { MusicService } from "../services/music.service";
import { TunnelService } from "../services/tunnel.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
  isPlaying: boolean = false;
  playClicks: boolean = false;
  constructor(
    private musicSerivce: MusicService,
    private tunnelService: TunnelService
  ) {
    musicSerivce.playing().subscribe((isPlaying) => {
      this.isPlaying = isPlaying;
    });

    musicSerivce.playClicks().subscribe((playClicks) => {
      this.playClicks = playClicks;
    });
  }

  /**
   * Resets the board state to its' starting position.
   */
  resetBoard() {
    this.tunnelService.resetGame();
  }

  /**
   * Turns the music on or off.
   */
  toggleMusic() {
    if (this.isPlaying) {
      this.musicSerivce.pause();
    } else {
      this.musicSerivce.play();
    }
  }

  /**
   * Toggles whether or not to mute clicks.
   */
  muteClicks() {
    this.musicSerivce.muteClicks();
  }

  ngOnInit() {}
}

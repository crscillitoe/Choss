import { Component, OnInit } from "@angular/core";
import { MusicService } from "../services/music.service";
import { TunnelService } from "../services/tunnel.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  isPlaying: boolean = false;
  playClicks: boolean = false;
  constructor(
    private musicSerivce: MusicService,
    private tunnelService: TunnelService,
    private router: Router
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

  /**
   * Take the user back to the home screen.
   */
  home() {
    this.router.navigateByUrl("");
  }

  ngOnInit() {}
}

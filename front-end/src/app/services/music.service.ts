import { Injectable } from "@angular/core";
import { Howl } from "howler";
import { Observable, BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class MusicService {
  music: Howl = null;
  pieceMove: Howl = null;
  private _playing: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  private _playClicks: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  constructor() {
    let playing = localStorage.getItem("musicPlaying");
    if (playing == null) {
      localStorage.setItem("playing", "true");
      playing = "true";
    }

    let playClicks = localStorage.getItem("playClicks");
    if (playClicks == null) {
      localStorage.setItem("playClicks", "true");
      playClicks = "true";
    }

    this.pieceMove = new Howl({
      src: ["assets/audio/sfx/movePiece.wav"],
      autoplay: false,
      loop: false,
    });

    this.music = new Howl({
      src: ["assets/audio/music/chess.wav"],
      autoplay: playing == "true",
      loop: true,
    });

    this._playing.next(playing == "true");
  }

  /**
   * Plays the clickng sound used when a piece is moved.
   */
  playClick() {
    if (localStorage.getItem("playClicks") == "true") {
      this.pieceMove.play();
    }
  }

  /**
   * toggles whether or not to mute clicking noises
   */
  muteClicks() {
    if (localStorage.getItem("playClicks") == "true") {
      localStorage.setItem("playClicks", "false");
      this._playClicks.next(false);
    } else {
      localStorage.setItem("playClicks", "true");
      this._playClicks.next(true);
    }
  }

  /**
   * returns an observable that indicates whether or not clicks will be played
   */
  playClicks(): Observable<boolean> {
    return this._playClicks;
  }

  /**
   * returns an observable that indicates whether or not music is currently playing
   */
  playing(): Observable<boolean> {
    return this._playing;
  }

  /**
   * Tells the music player to play the current song
   */
  play() {
    this.music.play();
    localStorage.setItem("musicPlaying", "true");
    this._playing.next(true);
  }

  /**
   * Tells the music player to pause the current song
   */
  pause() {
    this.music.stop();
    localStorage.setItem("musicPlaying", "false");
    this._playing.next(false);
  }
}

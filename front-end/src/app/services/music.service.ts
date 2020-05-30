import { Injectable } from "@angular/core";
import { Howl } from "howler";
import { Observable, BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class MusicService {
  music: Howl = null;
  private _playing: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  constructor() {
    this.music = new Howl({
      src: ["assets/audio/music/chess.wav"],
      autoplay: true,
      loop: true,
    });

    this._playing.next(true);
  }

  playing(): Observable<boolean> {
    return this._playing;
  }

  play() {
    this.music.play();
    this._playing.next(true);
  }

  pause() {
    this.music.stop();
    this._playing.next(false);
  }
}

import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { DoubleMove } from 'projects/chess/src/lib/chesslib/GameModes/DoubleMove';
import Chessground from 'projects/chessground/src';
import { Api } from 'projects/chessground/src/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  @ViewChild('chess')
  chess!: ElementRef;
  api!: Api;

  ngAfterViewInit(): void {
    const db = new DoubleMove();
    this.api = Chessground(this.chess.nativeElement, db);
    this.api.move('e2', 'e4');
  }

  title = 'front-end-lichess';
}

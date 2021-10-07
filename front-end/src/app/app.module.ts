import { HttpClientModule } from "@angular/common/http";
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatToolbarModule } from "@angular/material/toolbar";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { DragAndDropModule } from "angular-draggable-droppable";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BoardComponent } from "./board/board.component";
import { GameComponent } from "./game/game.component";
import { HeaderComponent } from "./header/header.component";
import { HomeComponent } from "./home/home.component";
import { LeftControlsComponent } from "./left-controls/left-controls.component";
import { PgnInputComponent } from "./pgn-input/pgn-input.component";
import { PieceComponent } from "./piece/piece.component";
import { RightControlsComponent } from "./right-controls/right-controls.component";
import { StartGameDialogComponent } from "./start-game-dialog/start-game-dialog.component";
import { TimerComponent } from "./timer/timer.component";
import { TrainingComponent } from "./training/training.component";

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    HomeComponent,
    HeaderComponent,
    StartGameDialogComponent,
    GameComponent,
    PieceComponent,
    TimerComponent,
    TrainingComponent,
    LeftControlsComponent,
    RightControlsComponent,
    PgnInputComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatInputModule,
    MatSnackBarModule,
    MatButtonModule,
    MatDialogModule,
    MatToolbarModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatButtonToggleModule,
    DragAndDropModule,
    MatIconModule,
    MatMenuModule,
    BrowserAnimationsModule,
    HttpClientModule,
  ],
  entryComponents: [StartGameDialogComponent, PgnInputComponent],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule {}

import { BrowserModule } from "@angular/platform-browser";
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BoardComponent } from "./board/board.component";
import { HomeComponent } from "./home/home.component";
import {
  MatButtonModule,
  MatInputModule,
  MatSnackBarModule,
} from "@angular/material";
import { MatToolbarModule } from "@angular/material";
import { MatIconModule } from "@angular/material";
import { MatSelectModule } from "@angular/material";
import { MatProgressSpinnerModule } from "@angular/material";
import { MatMenuModule } from "@angular/material";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HeaderComponent } from "./header/header.component";
import { DragAndDropModule } from "angular-draggable-droppable";
import { StartGameDialogComponent } from "./start-game-dialog/start-game-dialog.component";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    HomeComponent,
    HeaderComponent,
    StartGameDialogComponent,
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
  entryComponents: [StartGameDialogComponent],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule {}

import { BrowserModule } from "@angular/platform-browser";
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BoardComponent } from "./board/board.component";
import { HomeComponent } from "./home/home.component";
import { MatButtonModule } from "@angular/material";
import { MatToolbarModule } from "@angular/material";
import { MatIconModule } from "@angular/material";
import { MatSelectModule } from "@angular/material";
import { MatProgressSpinnerModule } from "@angular/material";
import { MatMenuModule } from "@angular/material";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HeaderComponent } from "./header/header.component";

@NgModule({
  declarations: [AppComponent, BoardComponent, HomeComponent, HeaderComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatButtonModule,
    MatToolbarModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatMenuModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule {}

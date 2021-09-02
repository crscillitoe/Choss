import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { BoardComponent } from "./board/board.component";
import { GameComponent } from "./game/game.component";
import { HomeComponent } from "./home/home.component";

const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
  },
  {
    path: "play",
    component: GameComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

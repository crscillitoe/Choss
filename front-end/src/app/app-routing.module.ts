import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TrainingComponent } from "./training/training.component";

const routes: Routes = [
  // {
  //   path: "",
  //   component: HomeComponent,
  // },
  {
    path: "",
    component: TrainingComponent,
  },
  // {
  //   path: "play",
  //   component: GameComponent,
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

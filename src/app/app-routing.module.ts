import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { GameLifeComponent } from './game-life/game-life.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'game-life', component: GameLifeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

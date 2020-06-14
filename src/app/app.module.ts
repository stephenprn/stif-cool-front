import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./components/home/home.component";
import { GameLifeComponent } from "./components/game-life/game-life.component";
import { SortingComponent } from "./components/sorting/sorting.component";

import { SoundsService } from "./services/sounds.service";
import { UtilsService } from './services/utils.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    GameLifeComponent,
    SortingComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [SoundsService, UtilsService],
  bootstrap: [AppComponent],
})
export class AppModule {}

import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { GameLifeComponent } from "./game-life/game-life.component";
import { SortingComponent } from "./sorting/sorting.component";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    GameLifeComponent,
    SortingComponent,
  ],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  private readonly STARS_NUMBER = 300;
  private readonly STARS_SIZE = {
    min: 1,
    max: 5,
  };

  constructor() {}

  ngOnInit() {
    this.initStars();
  }

  private initStars() {
    const starsBackground = document.getElementById("stars-background");

    for (let i = 0; i < this.STARS_NUMBER; i++) {
      const star = document.createElement("div");
      const size =
        this.STARS_SIZE.min +
        Math.random() * (this.STARS_SIZE.max - this.STARS_SIZE.min);

      star.style.position = "absolute";
      star.style.backgroundColor = "#FFFFFF";
      star.style.borderRadius = `${String(this.STARS_SIZE.max)}px`;
      star.style.boxShadow = `0 0 ${String(size)}px #FFFFFF`;

      star.style.top = String(Math.random() * 100) + "vh";
      star.style.left = String(Math.random() * 100) + "vw";

      star.style.height = String(size) + "px";
      star.style.width = String(size) + "px";

      starsBackground.appendChild(star);
    }
  }
}

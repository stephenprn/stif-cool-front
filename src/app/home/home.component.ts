import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  private readonly STARS_SIZE = {
    min: 1,
    max: 5,
  };
  private starsFrequency = 1;

  @ViewChild("starsBackground") starsBackground: ElementRef;

  constructor() {}

  ngOnInit() {
    setTimeout(() => {
      this.initStars();
    }, this.starsFrequency);
  }

  private initStars() {
    this.addStar();
  }

  private addStar() {
    const star = document.createElement("div");
    const size =
      this.STARS_SIZE.min +
      Math.random() * (this.STARS_SIZE.max - this.STARS_SIZE.min);
    const x = Math.random() * 100;
    const y = Math.random() * 50;

    star.className = "star";
    star.style.boxShadow = `0 0 ${String(size)}px #FFFFFF`;

    star.style.top = String(y) + "vh";
    star.style.left = String(x) + "vw";

    star.style.height = String(size) + "px";
    star.style.width = String(size) + "px";

    this.starsBackground.nativeElement.appendChild(star);

    setTimeout(() => {
      this.addStar();
    }, this.getStarFrequency());
  }

  private getStarFrequency() {
    this.starsFrequency += 1;

    return Math.max(0, this.starsFrequency + (Math.random() - 1) * 20);
  }
}

import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Router } from "@angular/router";
import { Location } from "@angular/common";

type ElementId = "GAME_LIFE" | "HOME" | "SORTING";
interface RouteElement {
  id: ElementId;
  route: string;
}

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
  private readonly ANIMATION_SHINE_DURATIONS = {
    min: 5,
    max: 30,
  };
  private readonly ANIMATION_APPEARS_DURATION = "0.5s";
  private readonly ROUTES_ELEMENTS: RouteElement[] = [
    { id: "HOME", route: "/" },
    { id: "GAME_LIFE", route: "/game-life" },
    { id: "SORTING", route: "/sorting" },
  ];

  private starsFrequency = 1;

  public elementIdShowed: ElementId;

  @ViewChild("starsBackground") starsBackground: ElementRef;

  constructor(private router: Router, private location: Location) {}

  ngOnInit() {
    this.initElementShowed();
    setTimeout(() => {
      this.initStars();
    }, this.starsFrequency);
  }

  private initStars() {
    this.addStar();
  }

  private initElementShowed() {
    const route = this.router.url;

    for (const elt of this.ROUTES_ELEMENTS) {
      if (route === elt.route) {
        this.elementIdShowed = elt.id;
        return;
      }
    }

    this.elementIdShowed = "HOME";
  }

  // public methods

  public showElement(elementId: ElementId) {
    if (elementId !== "HOME" && this.elementIdShowed === elementId) {
      this.elementIdShowed = "HOME";
    } else {
      this.elementIdShowed = elementId;
    }

    this.location.replaceState(
      this.ROUTES_ELEMENTS.find(
        (elt: RouteElement) => elt.id === this.elementIdShowed
      ).route
    );
  }

  // private methods

  private addStar() {
    const star = document.createElement("div");
    const size =
      this.STARS_SIZE.min +
      Math.random() * (this.STARS_SIZE.max - this.STARS_SIZE.min);
    const x = Math.random() * 100;
    const y = Math.random() * 50;

    star.className = "star";
    star.style.animationDuration = `${this.ANIMATION_APPEARS_DURATION}, ${
      Math.random() *
      (this.ANIMATION_SHINE_DURATIONS.max - this.ANIMATION_SHINE_DURATIONS.min)
    }s`;
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
    this.starsFrequency += 2;

    return Math.max(0, this.starsFrequency + (Math.random() - 1) * 20);
  }

  private addShootingStar() {
    const shootingStar = document.createElement("div");
  }
}

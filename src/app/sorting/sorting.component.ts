import { Component, OnInit } from "@angular/core";
import shuffle from "lodash/shuffle";

type SortingAlgoIds = "SELECTION";
class SortingElement {
  value: number;
  height: string; // height in percentage

  constructor(value: number, total: number) {
    this.value = value;
    this.height = String((value * 100) / total) + "%";
  }
}

@Component({
  selector: "app-sorting",
  templateUrl: "sorting.component.html",
  styleUrls: ["./sorting.component.scss"],
})
export class SortingComponent implements OnInit {
  private readonly REFRESH_FREQ = 50; // milliseconds

  public sortingElements: SortingElement[];
  public nbrElements = 100;
  public widthElement: string;
  public running = false;

  private timeoutSteps: any = null;

  constructor() {}

  ngOnInit() {
    this.fillSortingElements();
  }

  // public methods

  public fillSortingElements() {
    this.sortingElements = [];

    for (let i = 1; i < this.nbrElements + 1; i++) {
      this.sortingElements.push(new SortingElement(i, this.nbrElements));
    }

    this.widthElement = String(100 / this.nbrElements) + "%";
    this.shuffleSortingElements();
  }

  public shuffleSortingElements() {
    this.sortingElements = shuffle(this.sortingElements);
  }

  public triggerSteps(sortingAlgoIds: SortingAlgoIds) {
    if (this.running) {
      this.stopSteps();
    } else {
      this.startSteps(sortingAlgoIds);
    }
  }

  // private methods

  private startSteps(sortingAlgoIds: SortingAlgoIds) {
    console.log("startSteps");
    if (this.timeoutSteps !== null) {
      console.log("startSteps no");
      return;
    }

    this.running = true;

    switch (sortingAlgoIds) {
      case "SELECTION":
        this.selectionSortAlgo(0);
        break;
    }
  }

  private stopSteps() {
    if (this.timeoutSteps === null) {
      return;
    }

    this.running = false;

    clearTimeout(this.timeoutSteps);
    this.timeoutSteps = null;
  }

  private selectionSortAlgo(index: number) {
    let minValue = this.sortingElements[index].value;
    let minValueIndex = index;

    for (let j = index; j < this.nbrElements; j++) {
      if (this.sortingElements[j].value < minValue) {
        minValue = this.sortingElements[j].value;
        minValueIndex = j;
      }
    }

    this.swapSortingElements(index, minValueIndex);

    // end of sort
    if (index === this.sortingElements.length - 1) {
      this.stopSteps();
      return;
    }

    this.timeoutSteps = setTimeout(() => {
      this.selectionSortAlgo(index + 1);
    }, this.REFRESH_FREQ);
  }

  private swapSortingElements(indexFirst, indexSecond) {
    this.sortingElements[indexFirst] = this.sortingElements.splice(
      indexSecond,
      1,
      this.sortingElements[indexFirst]
    )[0];
  }
}

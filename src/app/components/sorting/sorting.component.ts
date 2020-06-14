import { Component, OnInit, OnDestroy } from "@angular/core";
import shuffle from "lodash/shuffle";
import { SoundsService } from "src/app/services/sounds.service";
import { UtilsService } from "src/app/services/utils.service";

type SortingAlgoIds = "SELECTION" | "BUBBLE" | "INSERTION";

class SortingElement {
  value: number;
  height: string; // height in percentage
  selected: boolean;
  frequency: number;

  constructor(value: number, total: number) {
    this.value = value;
    this.height = String((value * 100) / total) + "%";
    this.frequency = (value + 1) * 10;

    this.selected = false;
  }
}

class SortingAlgo {
  id: SortingAlgoIds;
  name: string;
}

@Component({
  selector: "app-sorting",
  templateUrl: "sorting.component.html",
  styleUrls: ["./sorting.component.scss"],
})
export class SortingComponent implements OnInit, OnDestroy {
  private readonly REFRESH_FREQ = 50; // milliseconds
  public readonly SORT_ALGOS: SortingAlgo[] = [
    { id: "SELECTION", name: "selection" },
    { id: "BUBBLE", name: "bubble" },
    { id: "INSERTION", name: "insertion" },
  ];

  public sortingElements: SortingElement[];

  // parameters
  public sortingAlgoIdSelected = this.SORT_ALGOS[0].id;
  public nbrElements = 100;
  public running = false;
  public muted: boolean;

  private timeoutSteps: any = null;
  public widthElement: string;

  private promises = {
    muted: null,
  };

  constructor(
    private soundsService: SoundsService,
    private utilsService: UtilsService
  ) {}

  ngOnInit() {
    this.initPromises();
    this.fillSortingElements();
  }

  ngOnDestroy() {
    this.utilsService.unsubscribeAll(this.promises);
  }

  // init methods

  private initPromises() {
    if (this.promises.muted === null) {
      this.promises.muted = this.soundsService.muted$.subscribe(
        (state: boolean) => {
          this.muted = state;
        }
      );
    }
  }

  // public methods

  public fillSortingElements() {
    this.sortingElements = [];

    for (let i = 1; i < this.nbrElements + 1; i++) {
      this.sortingElements.push(new SortingElement(i, this.nbrElements));
    }

    this.widthElement = String(100 / this.nbrElements) + "%";
    this.randomize();
  }

  public randomize() {
    this.sortingElements = shuffle(this.sortingElements);
  }

  public triggerSortAlgo() {
    if (this.running) {
      this.stopSortAlgo();
    } else {
      this.startSortAlgo();
    }
  }

  public setMuted() {
    this.soundsService.setMuted();
  }

  // private methods

  private startSortAlgo() {
    if (this.timeoutSteps !== null) {
      return;
    }

    this.running = true;

    switch (this.sortingAlgoIdSelected) {
      case "SELECTION":
        this.selectionSortAlgo();
        break;
      case "BUBBLE":
        this.bubbleSortAlgo();
        break;
      case "INSERTION":
        this.insertionSortAlgo();
        break;
    }
  }

  private stopSortAlgo() {
    if (this.timeoutSteps === null) {
      return;
    }

    this.running = false;
    this.selectSortingElements();

    clearTimeout(this.timeoutSteps);
    this.timeoutSteps = null;
  }

  private checkOrder(index: number = 0) {
    if (
      this.sortingElements[index].value > this.sortingElements[index + 1].value
    ) {
      return;
    }

    this.selectSortingElements([index]);
    this.playFreq(this.sortingElements[index].frequency, this.REFRESH_FREQ);

    if (index === this.sortingElements.length - 2) {
      this.stopSortAlgo();
      return;
    }

    this.timeoutSteps = setTimeout(() => {
      this.checkOrder(index + 1);
    }, this.REFRESH_FREQ);
  }

  private selectionSortAlgo(index: number = 0) {
    let minValue = this.sortingElements[index].value;
    let minValueIndex = index;

    for (let i = index; i < this.nbrElements; i++) {
      if (this.sortingElements[i].value < minValue) {
        minValue = this.sortingElements[i].value;
        minValueIndex = i;
      }
    }

    this.swapSortingElements(index, minValueIndex);

    // end of sort
    if (index === this.sortingElements.length - 1) {
      this.checkOrder();
      return;
    }

    this.timeoutSteps = setTimeout(() => {
      this.selectionSortAlgo(index + 1);
    }, this.REFRESH_FREQ);
  }

  private bubbleSortAlgo(step: number = 0) {
    let value: number;
    let valueNext: number;

    for (let i = 0; i < this.nbrElements - step - 1; i++) {
      value = this.sortingElements[i].value;
      valueNext = this.sortingElements[i + 1].value;

      if (value > valueNext) {
        this.swapSortingElements(i, i + 1);
      }
    }

    // end of sort
    if (step === this.sortingElements.length - 1) {
      this.checkOrder();
      return;
    }

    this.timeoutSteps = setTimeout(() => {
      this.bubbleSortAlgo(step + 1);
    }, this.REFRESH_FREQ);
  }

  private insertionSortAlgo(index: number = 1) {
    const value = this.sortingElements[index].value;

    for (let i = 0; i < index; i++) {
      if (this.sortingElements[i].value > value) {
        this.moveSortingElements(index, i);
        break;
      }
    }

    // end of sort
    if (index === this.sortingElements.length - 1) {
      this.checkOrder();
      return;
    }

    this.timeoutSteps = setTimeout(() => {
      this.insertionSortAlgo(index + 1);
    }, this.REFRESH_FREQ);
  }

  private swapSortingElements(indexFirst: number, indexSecond: number) {
    this.sortingElements[indexFirst] = this.sortingElements.splice(
      indexSecond,
      1,
      this.sortingElements[indexFirst]
    )[0];
    this.selectSortingElements([indexFirst, indexSecond]);
  }

  private moveSortingElements(indexFirst: number, indexSecond: number) {
    const elt = this.sortingElements.splice(indexFirst, 1)[0];
    this.sortingElements.splice(indexSecond, 0, elt);
    this.selectSortingElements([indexFirst, indexSecond]);
  }

  private selectSortingElements(indexes?: number[]) {
    this.sortingElements
      .filter((elt: SortingElement) => elt.selected)
      .forEach((elt: SortingElement) => (elt.selected = false));

    if (indexes == null) {
      return;
    }

    indexes.forEach((index: number) => {
      const elt = this.sortingElements[index];

      elt.selected = true;
      this.playFreq(elt.frequency, this.REFRESH_FREQ);
    });
  }

  private playFreq(frequency: number, duration: number) {
    if (this.muted) {
      return;
    }

    this.soundsService.playFreq(frequency, duration);
  }
}

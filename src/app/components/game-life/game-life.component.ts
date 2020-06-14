import { Component, OnInit } from "@angular/core";
import cloneDeep from "lodash/cloneDeep";
import sample from "lodash/sample";

class GameCase {
  x: number;
  y: number;

  full: boolean;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;

    this.full = false;
  }
}

@Component({
  selector: "app-game-life",
  templateUrl: "./game-life.component.html",
  styleUrls: ["./game-life.component.scss"],
})
export class GameLifeComponent implements OnInit {
  private readonly BOARD_SIZE = 20;
  private readonly REFRESH_FREQ = 500; // milliseconds

  public board: GameCase[][];
  private intervalSteps: any = null;

  public running = false;

  constructor() {}

  ngOnInit() {
    this.initBoard();
  }

  // init methods

  // ---> x
  // |
  // |
  // v y

  private initBoard() {
    this.board = [];

    for (let y = 0; y < this.BOARD_SIZE; y++) {
      const row: GameCase[] = [];

      for (let x = 0; x < this.BOARD_SIZE; x++) {
        row.push(new GameCase(x, y));
      }

      this.board.push(row);
    }
  }

  // public methods

  public setCase(gameCase: GameCase) {
    gameCase.full = !gameCase.full;
  }

  public triggerSteps() {
    if (this.running) {
      this.stopSteps();
    } else {
      this.startSteps();
    }
  }

  public nextStep() {
    const newBoard = [];
    let empty = true;

    this.board.forEach((row: GameCase[]) => {
      const newRow = [];

      row.forEach((gameCase: GameCase) => {
        gameCase = cloneDeep(gameCase);

        const nbrAdj = this.getNbrAdjacents(gameCase);
        if (nbrAdj === 3 || (gameCase.full && nbrAdj === 2)) {
          gameCase.full = true;
          empty = false;
        } else {
          gameCase.full = false;
        }

        newRow.push(gameCase);
      });

      newBoard.push(newRow);
    });

    this.board = newBoard;

    if (empty) {
      this.stopSteps();
    }
  }

  public trackByFn(index, item) {
    return index;
  }

  public clearGrid() {
    this.stopSteps();

    this.board.forEach((row: GameCase[]) => {
      row.forEach((gameCase: GameCase) => {
        gameCase.full = false;
      });
    });
  }

  public randomizeGrid() {
    this.board.forEach((row: GameCase[]) => {
      row.forEach((gameCase: GameCase) => {
        gameCase.full = sample([true, false]);
      });
    });
  }

  // private methods

  private startSteps() {
    console.log('startSteps');
    console.log('running', this.running);
    if (this.intervalSteps !== null) {
      return;
    }

    this.running = true;
    this.nextStep();

    this.intervalSteps = setInterval(() => {
      this.nextStep();
    }, this.REFRESH_FREQ);
  }

  private stopSteps() {
    if (this.intervalSteps === null) {
      return;
    }

    this.running = false;
    clearInterval(this.intervalSteps);
    this.intervalSteps = null;
  }

  private getNbrAdjacents(gameCase: GameCase) {
    let nbr = 0;

    this.board.forEach((row: GameCase[]) => {
      row.forEach((gc: GameCase) => {
        if (
          ((gc.x + 1 === gameCase.x && gc.y + 1 === gameCase.y) ||
            (gc.x + 1 === gameCase.x && gc.y + 0 === gameCase.y) ||
            (gc.x + 1 === gameCase.x && gc.y - 1 === gameCase.y) ||
            (gc.x + 0 === gameCase.x && gc.y + 1 === gameCase.y) ||
            (gc.x + 0 === gameCase.x && gc.y - 1 === gameCase.y) ||
            (gc.x - 1 === gameCase.x && gc.y + 1 === gameCase.y) ||
            (gc.x - 1 === gameCase.x && gc.y + 0 === gameCase.y) ||
            (gc.x - 1 === gameCase.x && gc.y - 1 === gameCase.y)) &&
          gc.full
        ) {
          nbr += 1;
        }
      });
    });

    return nbr;
  }
}

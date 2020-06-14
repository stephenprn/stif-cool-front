import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class SoundsService {
  public muted$ = new BehaviorSubject<boolean>(true);

  private audioCtx: AudioContext;

  constructor() {
    this.initAudioVars();
  }

  // init methods

  private initAudioVars() {
    this.audioCtx = new window.AudioContext();
  }

  // public methods

  public playFreq(frequency: number, duration: number) {
    const oscillator = this.audioCtx.createOscillator();
    oscillator.type = "square";

    oscillator.frequency.value = frequency; // value in hertz
    oscillator.connect(this.audioCtx.destination);
    oscillator.start();

    setTimeout(() => {
      oscillator.stop();
    }, duration);
  }

  public setMuted(state?: boolean) {
    if (state == null) {
      this.muted$.next(!this.muted$.value);
      return;
    }

    this.muted$.next(state);
  }
}

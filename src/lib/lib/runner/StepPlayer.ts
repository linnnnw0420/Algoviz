import type { Step } from "../types";

export class StepPlayer {
  private steps: Step[] = [];
  private idx = 0;
  private rafId: number | null = null;
  private speedMs = 120;
  private onFrame: (s: Step) => void;

  constructor(onFrame: (s: Step) => void) {
    this.onFrame = onFrame;
  }

  load(steps: Step[]) {
    this.stop();
    this.steps = steps;
    this.idx = 0;
  }

  play() {
    if (this.rafId !== null || this.steps.length === 0) return;
    const tick = () => {
      this.onFrame(this.steps[this.idx]);
      this.idx = Math.min(this.idx + 1, this.steps.length - 1);
      if (this.idx >= this.steps.length - 1) {
        this.stop();
        return;
      }
      this.rafId = window.setTimeout(() => requestAnimationFrame(tick), this.speedMs) as unknown as number;
    };
    this.rafId = window.setTimeout(() => requestAnimationFrame(tick), this.speedMs) as unknown as number;
  }

  pause() {
    if (this.rafId !== null) {
      clearTimeout(this.rafId);
      this.rafId = null;
    }
  }

  stop() {
    this.pause();
    this.idx = 0;
  }

  stepOnce() {
    if (this.steps.length === 0) return;
    const s = this.steps[this.idx];
    this.onFrame(s);
    this.idx = Math.min(this.idx + 1, this.steps.length - 1);
  }

  setSpeed(ms: number) { this.speedMs = Math.max(10, ms); }
}

import type { Step } from "../types";

export class StepPlayer {
  private steps: Step[] = [];
  private idx = 0;
  private rafId: number | null = null;
  private speedMs = 120; // Delay in ms. If 0, we run multiple steps per frame.
  private stepsPerFrame = 1;
  private lastTime = 0;
  private onFrame: (s: Step, idx: number, total: number) => void;

  constructor(onFrame: (s: Step, idx: number, total: number) => void) {
    this.onFrame = onFrame;
  }

  load(steps: Step[]) {
    this.stop();
    this.steps = steps;
    this.idx = 0;
  }

  play() {
    if (this.rafId !== null || this.steps.length === 0) return;
    
    this.lastTime = performance.now();

    const tick = (time: number) => {
      if (this.steps.length === 0) return;

      const delta = time - this.lastTime;
      
      if (delta >= this.speedMs) {
        // If speedMs is low (fast), we might want to execute multiple steps
        const count = this.speedMs < 16 ? this.stepsPerFrame : 1;
        
        for (let k = 0; k < count; k++) {
          if (this.idx >= this.steps.length - 1) {
            this.onFrame(this.steps[this.idx], this.idx, this.steps.length);
            this.stop();
            return;
          }
          this.idx++;
        }
        
        this.onFrame(this.steps[this.idx], this.idx, this.steps.length);
        this.lastTime = time;
      }
      
      this.rafId = requestAnimationFrame(tick);
    };
    
    this.rafId = requestAnimationFrame(tick);
  }

  pause() {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  stop() {
    this.pause();
    this.idx = 0;
  }

  seek(index: number) {
    if (this.steps.length === 0) return;
    this.idx = Math.max(0, Math.min(index, this.steps.length - 1));
    this.onFrame(this.steps[this.idx], this.idx, this.steps.length);
  }

  stepOnce() {
    if (this.steps.length === 0) return;
    this.idx = Math.min(this.idx + 1, this.steps.length - 1);
    this.onFrame(this.steps[this.idx], this.idx, this.steps.length);
  }

  setSpeed(val: number) { 
    // val is 1 (slow) to 100 (fast)
    // Map 1..50 -> 500ms .. 10ms
    // Map 51..100 -> 1 step/frame .. 50 steps/frame
    
    if (val <= 50) {
      // 1 -> 500ms, 50 -> 10ms
      this.speedMs = 500 - ((val - 1) * (490 / 49));
      this.stepsPerFrame = 1;
    } else {
      this.speedMs = 0; // Run every frame
      // 51 -> 1 step, 100 -> 50 steps
      this.stepsPerFrame = Math.floor(1 + (val - 51)); 
    }
  }

  get hasFinished() {
    return this.steps.length > 0 && this.idx >= this.steps.length - 1;
  }
}

export class SoundEngine {
  private ctx: AudioContext | null = null;
  private enabled = false;

  constructor() {
    // Lazy init to comply with browser autoplay policies
  }

  toggle(on: boolean) {
    this.enabled = on;
    if (on && !this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (on && this.ctx?.state === "suspended") {
      this.ctx.resume();
    }
  }

  play(value: number, max: number, index: number, total: number) {
    if (!this.enabled || !this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const panner = this.ctx.createStereoPanner();

    // Map value to frequency (200Hz - 800Hz)
    const freq = 200 + (value / max) * 600;
    
    // Map index to pan (-1 to 1)
    const pan = total > 1 ? (index / (total - 1)) * 2 - 1 : 0;
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.00001, this.ctx.currentTime + 0.1);

    panner.pan.setValueAtTime(pan, this.ctx.currentTime);

    osc.connect(gain);
    gain.connect(panner);
    panner.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }
}

export const soundEngine = new SoundEngine();

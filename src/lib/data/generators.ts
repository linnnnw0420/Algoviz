// Box–Muller transform for Gaussian
function gaussian01() {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  }
  
  export type Distribution = "Uniform" | "Gaussian" | "Nearly-sorted";
  
  export function genArray(n: number, dist: Distribution, min = 1, max = 100): number[] {
    switch (dist) {
      case "Uniform":
        return Array.from({ length: n }, () => Math.floor(min + Math.random() * (max - min + 1)));
      case "Gaussian": {
        const mu = (min + max) / 2;
        const sigma = (max - min) / 6; // 99.7% in [min,max]
        return Array.from({ length: n }, () =>
          Math.max(min, Math.min(max, Math.round(mu + gaussian01() * sigma)))
        );
      }
      case "Nearly-sorted": {
        const a = Array.from({ length: n }, (_, i) => Math.floor(min + (i * (max - min)) / (n - 1)));
        // introduce small local disorder
        const swaps = Math.max(1, Math.floor(n * 0.05));
        for (let k = 0; k < swaps; k++) {
          const i = Math.floor(Math.random() * n);
          const j = Math.min(n - 1, Math.max(0, i + (Math.random() < 0.5 ? -1 : 1) * Math.ceil(Math.random() * 3)));
          [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
      }
    }
  }
  
  /** Map sorted indices to a perfect straight “target” line (visual cue after sorting). */
  export function targetLine(n: number, min = 1, max = 100): number[] {
    if (n <= 1) return [min];
    return Array.from({ length: n }, (_, i) => Math.floor(min + (i * (max - min)) / (n - 1)));
  }
  
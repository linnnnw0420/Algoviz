import { algos } from "../algorithms/registry";
import type { AlgoId } from "../types";
import { processSteps } from "../utils/stepUtils";

self.onmessage = (e: MessageEvent) => {
  const { id, algo, array } = e.data as { id: number; algo: AlgoId; array: number[] };
  
  try {
    const generator = algos[algo];
    if (!generator) throw new Error(`Unknown algorithm: ${algo}`);

    const rawSteps = Array.from(generator(array));
    const { steps, stats } = processSteps(rawSteps);

    self.postMessage({ type: "success", id, steps, stats });
  } catch (err: any) {
    self.postMessage({ type: "error", id, error: err.message });
  }
};

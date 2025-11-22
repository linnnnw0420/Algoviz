import type { Step } from "../types";

export type StepStats = {
  compares: number;
  swaps: number;
};

export function processSteps(steps: Step[]): { steps: Step[]; stats: StepStats[] } {
  const stats: StepStats[] = [];
  let compares = 0;
  let swaps = 0;

  for (let i = 0; i < steps.length; i++) {
    const s = steps[i];
    const op = s.op;

    // Update stats
    if (op.kind === "compare") compares++;
    if (op.kind === "swap") swaps++;
    
    stats.push({ compares, swaps });

    // Memory optimization: Deduplicate array references
    // If a step doesn't change the array (e.g. compare), reuse the previous array instance.
    if (i > 0) {
      const prev = steps[i - 1];
      if (op.kind === "compare" || op.kind === "mark" || op.kind === "pivot") {
        s.array = prev.array;
      }
    }
  }

  return { steps, stats };
}

import type { AlgoGenerator, Step } from "../../types";

export const selectionSort: AlgoGenerator = function* (input) {
  const a = [...input];
  const n = a.length;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      yield snap({ kind: "compare", i: minIdx, j }, a);
      if (a[j] < a[minIdx]) {
        minIdx = j;
      }
    }

    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
      yield snap({ kind: "swap", i, j: minIdx }, a);
    }
  }

  yield snap({ kind: "done" }, a);
};

function snap(op: Step["op"], arr: number[]): Step {
  return { op, array: [...arr] };
}

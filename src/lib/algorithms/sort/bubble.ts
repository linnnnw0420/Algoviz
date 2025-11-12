import type { AlgoGenerator, Step } from "../../types";

export const bubbleSort: AlgoGenerator = function* (input) {
  const a = [...input];
  const n = a.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      yield snap({ kind: "compare", i: j, j: j + 1 }, a);
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        yield snap({ kind: "swap", i: j, j: j + 1 }, a);
      }
    }
  }
  yield snap({ kind: "done" }, a);
};

function snap(op: Step["op"], arr: number[]): Step {
  return { op, array: [...arr] };
}

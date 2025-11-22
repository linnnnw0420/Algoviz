import type { AlgoGenerator, Step } from "../../types";

export const cocktailSort: AlgoGenerator = function* (input) {
  const a = [...input];
  let swapped = true;
  let start = 0;
  let end = a.length;

  while (swapped) {
    swapped = false;

    for (let i = start; i < end - 1; ++i) {
      yield snap({ kind: "compare", i, j: i + 1 }, a);
      if (a[i] > a[i + 1]) {
        [a[i], a[i + 1]] = [a[i + 1], a[i]];
        yield snap({ kind: "swap", i, j: i + 1 }, a);
        swapped = true;
      }
    }

    if (!swapped) break;
    swapped = false;
    end--;

    for (let i = end - 1; i >= start; i--) {
      yield snap({ kind: "compare", i, j: i + 1 }, a);
      if (a[i] > a[i + 1]) {
        [a[i], a[i + 1]] = [a[i + 1], a[i]];
        yield snap({ kind: "swap", i, j: i + 1 }, a);
        swapped = true;
      }
    }
    start++;
  }
  yield snap({ kind: "done" }, a);
};

function snap(op: Step["op"], arr: number[]): Step {
  return { op, array: [...arr] };
}

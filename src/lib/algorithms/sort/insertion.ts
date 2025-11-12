import type { AlgoGenerator, Step } from "../../types";

export const insertionSort: AlgoGenerator = function* (input) {
  const a = [...input];
  for (let i = 1; i < a.length; i++) {
    const key = a[i];
    let j = i - 1;

    while (j >= 0) {
      yield snapshot({ kind: "compare", i: j, j: j + 1 }, a);
      if (a[j] > key) {
        a[j + 1] = a[j];
        yield snapshot({ kind: "overwrite", i: j + 1, value: a[j + 1] }, a);
        j--;
      } else {
        break;
      }
    }

    if (a[j + 1] !== key) {
      a[j + 1] = key;
      yield snapshot({ kind: "overwrite", i: j + 1, value: key }, a);
    }
  }
  yield snapshot({ kind: "done" }, a);
};

function snapshot(op: Step["op"], arr: number[]): Step {
  return { op, array: [...arr] };
}

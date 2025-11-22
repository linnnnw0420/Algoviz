import type { AlgoGenerator, Step } from "../../types";

export const heapSort: AlgoGenerator = function* (input) {
  const a = [...input];
  const n = a.length;

  const heapify = function* (n: number, i: number): Generator<Step, void, unknown> {
    let largest = i;
    const l = 2 * i + 1;
    const r = 2 * i + 2;

    if (l < n) {
      yield snap({ kind: "compare", i: l, j: largest }, a);
      if (a[l] > a[largest]) largest = l;
    }

    if (r < n) {
      yield snap({ kind: "compare", i: r, j: largest }, a);
      if (a[r] > a[largest]) largest = r;
    }

    if (largest !== i) {
      [a[i], a[largest]] = [a[largest], a[i]];
      yield snap({ kind: "swap", i, j: largest }, a);
      yield* heapify(n, largest);
    }
  };

  // Build heap (rearrange array)
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* heapify(n, i);
  }

  // One by one extract an element from heap
  for (let i = n - 1; i > 0; i--) {
    [a[0], a[i]] = [a[i], a[0]];
    yield snap({ kind: "swap", i: 0, j: i }, a);
    yield* heapify(i, 0);
  }

  yield snap({ kind: "done" }, a);
};

function snap(op: Step["op"], arr: number[]): Step {
  return { op, array: [...arr] };
}

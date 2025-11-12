import type { AlgoGenerator, Step } from "../../types";

export const mergeSort: AlgoGenerator = function* (input) {
  const a = [...input];
  if (a.length <= 1) {
    yield capture({ kind: "done" }, a);
    return;
  }

  const aux = Array.from(a);

  function* sort(lo: number, hi: number): Generator<Step, void, unknown> {
    if (lo >= hi) return;
    const mid = Math.floor((lo + hi) / 2);
    yield* sort(lo, mid);
    yield* sort(mid + 1, hi);
    yield* merge(lo, mid, hi);
  }

  function* merge(lo: number, mid: number, hi: number): Generator<Step, void, unknown> {
    let i = lo;
    let j = mid + 1;
    let k = lo;

    while (i <= mid && j <= hi) {
      yield capture({ kind: "compare", i, j }, a);
      if (a[i] <= a[j]) {
        aux[k++] = a[i++];
      } else {
        aux[k++] = a[j++];
      }
    }
    while (i <= mid) aux[k++] = a[i++];
    while (j <= hi) aux[k++] = a[j++];

    for (let idx = lo; idx <= hi; idx++) {
      a[idx] = aux[idx];
      yield capture({ kind: "overwrite", i: idx, value: a[idx] }, a);
    }
  }

  yield* sort(0, a.length - 1);
  yield capture({ kind: "done" }, a);
};

function capture(op: Step["op"], arr: number[]): Step {
  return { op, array: [...arr] };
}

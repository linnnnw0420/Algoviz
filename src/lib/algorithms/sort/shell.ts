import type { AlgoGenerator, Step } from "../../types";

export const shellSort: AlgoGenerator = function* (input) {
  const a = [...input];
  const n = a.length;

  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    for (let i = gap; i < n; i++) {
      const temp = a[i];
      let j;
      for (j = i; j >= gap; j -= gap) {
        yield snap({ kind: "compare", i: j - gap, j: i }, a); // Visualizing comparison
        if (a[j - gap] > temp) {
          a[j] = a[j - gap];
          yield snap({ kind: "overwrite", i: j, value: a[j] }, a);
        } else {
          break;
        }
      }
      a[j] = temp;
      yield snap({ kind: "overwrite", i: j, value: temp }, a);
    }
  }
  yield snap({ kind: "done" }, a);
};

function snap(op: Step["op"], arr: number[]): Step {
  return { op, array: [...arr] };
}

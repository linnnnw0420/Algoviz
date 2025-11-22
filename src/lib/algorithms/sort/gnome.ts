import type { AlgoGenerator, Step } from "../../types";

export const gnomeSort: AlgoGenerator = function* (input) {
  const a = [...input];
  let index = 0;
  const n = a.length;

  while (index < n) {
    if (index === 0) index++;
    
    yield snap({ kind: "compare", i: index, j: index - 1 }, a);
    if (a[index] >= a[index - 1]) {
      index++;
    } else {
      [a[index], a[index - 1]] = [a[index - 1], a[index]];
      yield snap({ kind: "swap", i: index, j: index - 1 }, a);
      index--;
    }
  }
  yield snap({ kind: "done" }, a);
};

function snap(op: Step["op"], arr: number[]): Step {
  return { op, array: [...arr] };
}

import type { AlgoGenerator, Step } from "../../types";

export const quickSort: AlgoGenerator = function* (input) {
  const a = [...input];
  function* qs(l: number, r: number): Generator<Step, void, unknown> {
    if (l >= r) return;
    const p = a[r];
    yield take({ kind: "pivot", i: r });
    let i = l;
    for (let j = l; j < r; j++) {
      yield take({ kind: "compare", i: j, j: r });
      if (a[j] <= p) {
        [a[i], a[j]] = [a[j], a[i]];
        yield take({ kind: "swap", i, j });
        i++;
      }
    }
    [a[i], a[r]] = [a[r], a[i]];
    yield take({ kind: "swap", i, j: r });
    yield* qs(l, i - 1);
    yield* qs(i + 1, r);
  }
  function take(op: Step["op"]): Step {
    return { op, array: [...a] };
  }
  yield* qs(0, a.length - 1);
  yield { op: { kind: "done" }, array: [...a] };
};

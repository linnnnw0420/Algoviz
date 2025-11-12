export type Value = number;

export type Op =
  | { kind: "compare"; i: number; j: number }
  | { kind: "swap"; i: number; j: number }
  | { kind: "overwrite"; i: number; value: number }
  | { kind: "pivot"; i: number }
  | { kind: "mark"; i: number }
  | { kind: "done" };

export interface Step {
  op: Op;
  array: Value[]; // 某一步的“可视化快照”（可用同一数组拷贝）
}

export type AlgoGenerator = (arr: Value[]) => Generator<Step, void, unknown>;

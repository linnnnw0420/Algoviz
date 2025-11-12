import type { AlgoId } from "../types";

export type AlgoOption = { id: AlgoId; label: string };

export const ALGORITHM_OPTIONS: AlgoOption[] = [
  { id: "bubble", label: "Bubble Sort" },
  { id: "insertion", label: "Insertion Sort" },
  { id: "selection", label: "Selection Sort" },
  { id: "merge", label: "Merge Sort" },
  { id: "quick", label: "Quick Sort" },
];

export const ALGORITHM_SEQUENCE: AlgoId[] = ALGORITHM_OPTIONS.map(opt => opt.id);

const labelMap = {} as Record<AlgoId, string>;
for (const { id, label } of ALGORITHM_OPTIONS) {
  labelMap[id] = label;
}

export const ALGORITHM_LABELS = labelMap;

import type { AlgoId } from "../types";

export type AlgoOption = { 
  id: AlgoId; 
  label: string;
  complexity: { time: string; space: string };
  description: string;
};

export const ALGORITHM_OPTIONS: AlgoOption[] = [
  { 
    id: "bubble", 
    label: "Bubble Sort", 
    complexity: { time: "O(n²)", space: "O(1)" },
    description: "Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted."
  },
  { 
    id: "bubble-opt", 
    label: "Bubble Sort (Opt)", 
    complexity: { time: "O(n²)", space: "O(1)" },
    description: "An optimized version of Bubble Sort that stops early if no swaps occurred during a pass, indicating the list is already sorted."
  },
  { 
    id: "cocktail", 
    label: "Cocktail Sort", 
    complexity: { time: "O(n²)", space: "O(1)" },
    description: "Also known as bidirectional bubble sort, it extends bubble sort by operating in two directions: forward and backward passes."
  },
  { 
    id: "gnome", 
    label: "Gnome Sort", 
    complexity: { time: "O(n²)", space: "O(1)" },
    description: "A sorting algorithm which is similar to insertion sort in that it works with one item at a time but gets the item to the proper place by a series of swaps, similar to a bubble sort."
  },
  { 
    id: "insertion", 
    label: "Insertion Sort", 
    complexity: { time: "O(n²)", space: "O(1)" },
    description: "Builds the final sorted array (or list) one item at a time. It is much less efficient on large lists than more advanced algorithms such as quicksort, heapsort, or merge sort."
  },
  { 
    id: "selection", 
    label: "Selection Sort", 
    complexity: { time: "O(n²)", space: "O(1)" },
    description: "Divides the input list into two parts: a sorted sublist of items which is built up from left to right at the front (left) of the list and a sublist of the remaining unsorted items."
  },
  { 
    id: "shell", 
    label: "Shell Sort", 
    complexity: { time: "O(n log² n)", space: "O(1)" },
    description: "An in-place comparison sort. It can be seen as either a generalization of sorting by exchange (bubble sort) or sorting by insertion (insertion sort)."
  },
  { 
    id: "heap", 
    label: "Heap Sort", 
    complexity: { time: "O(n log n)", space: "O(1)" },
    description: "A comparison-based sorting technique based on Binary Heap data structure. It is similar to selection sort where we first find the minimum element and place the minimum element at the beginning."
  },
  { 
    id: "merge", 
    label: "Merge Sort", 
    complexity: { time: "O(n log n)", space: "O(n)" },
    description: "A divide and conquer algorithm that divides the input array into two halves, calls itself for the two halves, and then merges the two sorted halves."
  },
  { 
    id: "quick", 
    label: "Quick Sort", 
    complexity: { time: "O(n log n)", space: "O(log n)" },
    description: "A divide-and-conquer algorithm. It works by selecting a 'pivot' element from the array and partitioning the other elements into two sub-arrays, according to whether they are less than or greater than the pivot."
  },
];

export const ALGORITHM_SEQUENCE: AlgoId[] = ALGORITHM_OPTIONS.map(opt => opt.id);

const labelMap = {} as Record<AlgoId, string>;
export const ALGORITHM_INFO = {} as Record<AlgoId, AlgoOption>;
for (const opt of ALGORITHM_OPTIONS) {
  ALGORITHM_INFO[opt.id] = opt;
  labelMap[opt.id] = opt.label;
}

export const ALGORITHM_LABELS = labelMap;

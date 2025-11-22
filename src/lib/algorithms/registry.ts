import { bubbleSort } from "./sort/bubble";
import { bubbleSortOptimized } from "./sort/bubbleOptimized";
import { cocktailSort } from "./sort/cocktail";
import { gnomeSort } from "./sort/gnome";
import { heapSort } from "./sort/heap";
import { insertionSort } from "./sort/insertion";
import { mergeSort } from "./sort/merge";
import { quickSort } from "./sort/quick";
import { selectionSort } from "./sort/selection";
import { shellSort } from "./sort/shell";
import type { AlgoGenerator, AlgoId } from "../types";

export const algos: Record<AlgoId, AlgoGenerator> = {
  bubble: bubbleSort,
  "bubble-opt": bubbleSortOptimized,
  cocktail: cocktailSort,
  gnome: gnomeSort,
  insertion: insertionSort,
  selection: selectionSort,
  shell: shellSort,
  heap: heapSort,
  merge: mergeSort,
  quick: quickSort,
};

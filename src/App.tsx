import React, { useMemo, useRef, useState } from "react";
import ControlPanel from "./components/ControlPanel";
import StatsBar from "./components/StatsBar";
import VisualizerCanvas from "./components/VisualizerCanvas";
import ComparePane from "./components/ComparePane";
import { StepPlayer } from "@/lib/runner/StepPlayer";
import { bubbleSort } from "@/lib/algorithms/sort/bubble";
import { insertionSort } from "@/lib/algorithms/sort/insertion";
import { mergeSort } from "@/lib/algorithms/sort/merge";
import { quickSort } from "@/lib/algorithms/sort/quick";
import { selectionSort } from "@/lib/algorithms/sort/selection";
import type { Step, AlgoGenerator, AlgoId } from "@/lib/types";
import { genArray, targetLine, type Distribution } from "@/lib/data/generators";
import { ALGORITHM_LABELS, ALGORITHM_SEQUENCE } from "@/lib/algorithms/list";

const algos: Record<AlgoId, AlgoGenerator> = {
  bubble: bubbleSort,
  insertion: insertionSort,
  selection: selectionSort,
  merge: mergeSort,
  quick: quickSort,
};

function nextAlgo(id: AlgoId): AlgoId {
  if (ALGORITHM_SEQUENCE.length <= 1) return id;
  const idx = ALGORITHM_SEQUENCE.indexOf(id);
  if (idx === -1) return ALGORITHM_SEQUENCE[0];
  return ALGORITHM_SEQUENCE[(idx + 1) % ALGORITHM_SEQUENCE.length];
}

export default function App() {
  const [algo, setAlgo] = useState<AlgoId>(ALGORITHM_SEQUENCE[0]);
  const [dist, setDist] = useState<Distribution>("Uniform");
  const [n, setN] = useState(50);
  const [speed, setSpeed] = useState(120);
  const [compare, setCompare] = useState(false);

  const [step, setStep] = useState<Step | undefined>();
  const [stepB, setStepB] = useState<Step | undefined>(); // for compare
  const playerA = useMemo(() => new StepPlayer(setStep), []);
  const playerB = useMemo(() => new StepPlayer(setStepB), []);
  const arrRef = useRef<number[]>([]);

  const comparisonAlgo = nextAlgo(algo);

  function generate() {
    const a = genArray(n, dist, 1, 100);
    arrRef.current = a;
    const line = targetLine(n, 1, 100); // visual goal line after sorting
    // show initial state (mark op) — primary pane
    setStep({ op: { kind: "mark", i: -1 }, array: [...a] });
    // compare pane initial (shows target line to hint the goal)
    setStepB({ op: { kind: "mark", i: -1 }, array: [...line] });
    playerA.stop(); playerB.stop();
  }

  function buildSteps(a: number[], id: AlgoId) {
    const g = algos[id](a);
    return Array.from(g);
  }

  function onPlay() {
    const base = [...arrRef.current];
    playerA.setSpeed(speed);
    if (!compare) {
      playerA.load(buildSteps(base, algo));
      playerA.play();
    } else {
      // left fixed: selected algo; right: a second algorithm for comparison
      const other = comparisonAlgo;
      const a1 = [...base], a2 = [...base];
      playerA.load(buildSteps(a1, algo));
      playerB.load(buildSteps(a2, other));
      playerA.setSpeed(speed);
      playerB.setSpeed(speed);
      playerA.play(); playerB.play();
    }
  }

  return (
    <div className="app">
      <h1>AlgoViz · Sorting Playground</h1>

      <ControlPanel
        algo={algo} setAlgo={setAlgo}
        dist={dist} setDist={setDist}
        n={n} setN={setN}
        speed={speed} setSpeed={setSpeed}
        compare={compare} setCompare={setCompare}
        onGenerate={generate}
        onPlay={onPlay}
        onPause={() => { playerA.pause(); playerB.pause(); }}
        onStep={() => { playerA.stepOnce(); if (compare) playerB.stepOnce(); }}
      />

      <StatsBar step={step} />

      {!compare ? (
        <VisualizerCanvas step={step} />
      ) : (
        <ComparePane
          left={{ title: `Left: ${ALGORITHM_LABELS[algo] ?? algo}`, step }}
          right={{
            title: `Right: ${ALGORITHM_LABELS[comparisonAlgo] ?? comparisonAlgo}`,
            step: stepB,
          }}
        />
      )}
    </div>
  );
}

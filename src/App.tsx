import React, { useMemo, useRef, useState } from "react";
import ControlPanel from "./components/ControlPanel";
import StatsBar from "./components/StatsBar";
import VisualizerCanvas from "./components/VisualizerCanvas";
import { StepPlayer } from "./lib/runner/StepPlayer";
import { bubbleSort } from "./lib/algorithms/sort/bubble";
import { quickSort } from "./lib/algorithms/sort/quick";
import type { Step, AlgoGenerator } from "./lib/types";

const algos: Record<string, AlgoGenerator> = {
  bubble: bubbleSort,
  quick: quickSort
};

export default function App() {
  const [algo, setAlgo] = useState<keyof typeof algos>("bubble");
  const [n, setN] = useState(50);
  const [speed, setSpeed] = useState(120);
  const [step, setStep] = useState<Step | undefined>();
  const arrRef = useRef<number[]>([]);
  const player = useMemo(() => new StepPlayer(setStep), []);

  function genArray() {
    const a = Array.from({ length: n }, () => Math.floor(Math.random() * 100) + 1);
    arrRef.current = a;
    setStep({ op: { kind: "mark", i: -1 }, array: [...a] });
    player.stop();
  }

  function buildSteps() {
    const g = algos[algo](arrRef.current);
    return Array.from(g);
  }

  function onPlay() {
    const steps = buildSteps();
    player.load(steps);
    player.setSpeed(speed);
    player.play();
  }

  return (
    <div className="app">
      <h1>AlgoViz · 排序可视化</h1>
      <ControlPanel
        algo={algo}
        setAlgo={v => setAlgo(v as any)}
        n={n}
        setN={setN}
        speed={speed}
        setSpeed={setSpeed}
        onShuffle={genArray}
        onPlay={onPlay}
        onPause={() => player.pause()}
        onStep={() => player.stepOnce()}
      />
      <StatsBar step={step} />
      <VisualizerCanvas step={step} />
    </div>
  );
}

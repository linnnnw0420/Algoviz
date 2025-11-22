import React, { useMemo, useRef, useState, useEffect } from "react";
import ControlPanel from "./components/ControlPanel";
import StatsBar from "./components/StatsBar";
import VisualizerCanvas from "./components/VisualizerCanvas";
import ComparePane from "./components/ComparePane";
import DescriptionPage from "./components/DescriptionPage";
import { StepPlayer } from "@/lib/runner/StepPlayer";
import { algos } from "@/lib/algorithms/registry";
import type { Step, AlgoId } from "@/lib/types";
import { genArray, type Distribution } from "@/lib/data/generators";
import { ALGORITHM_LABELS, ALGORITHM_SEQUENCE } from "@/lib/algorithms/list";
import { soundEngine } from "@/lib/audio/SoundEngine";
import { processSteps, type StepStats } from "@/lib/utils/stepUtils";

const DEFAULT_PRIMARY: AlgoId = ALGORITHM_SEQUENCE[0] ?? "bubble";
const DEFAULT_SECONDARY: AlgoId = ALGORITHM_SEQUENCE[1] ?? DEFAULT_PRIMARY;

export default function App() {
  const [view, setView] = useState<"playground" | "info">("playground");
  const [algo, setAlgo] = useState<AlgoId>(DEFAULT_PRIMARY);
  const [compareAlgo, setCompareAlgo] = useState<AlgoId>(DEFAULT_SECONDARY);
  const [dist, setDist] = useState<Distribution>("Uniform");
  const [n, setN] = useState(50);
  const [speed, setSpeed] = useState(50); // 1-100
  const [compare, setCompare] = useState(false);
  const [sound, setSound] = useState(false);
  const [useWorker, setUseWorker] = useState(true);
  const [needsReset, setNeedsReset] = useState(true);
  const [loading, setLoading] = useState(false);

  const [step, setStep] = useState<Step | undefined>();
  const [stepB, setStepB] = useState<Step | undefined>();

  const [progressA, setProgressA] = useState({ idx: 0, total: 0 });
  const [progressB, setProgressB] = useState({ idx: 0, total: 0 });

  const [statsA, setStatsA] = useState<StepStats[]>([]);
  const [statsB, setStatsB] = useState<StepStats[]>([]);

  // Sound toggle effect
  useEffect(() => {
    soundEngine.toggle(sound);
  }, [sound]);

  // Mark reset needed when config changes
  useEffect(() => {
    setNeedsReset(true);
  }, [algo, compareAlgo, n, dist, compare]);

  const playerA = useMemo(
    () =>
      new StepPlayer((s, idx, total) => {
        setStep(s);
        setProgressA({ idx, total });
        if (s.op.kind === "overwrite" || s.op.kind === "swap") {
          soundEngine.play(s.array[s.op.i], 100, s.op.i, s.array.length);
        }
      }),
    []
  );

  const playerB = useMemo(
    () =>
      new StepPlayer((s, idx, total) => {
        setStepB(s);
        setProgressB({ idx, total });
      }),
    []
  );

  const arrRef = useRef<number[]>([]);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    workerRef.current = new Worker(new URL("./lib/worker/algo.worker.ts", import.meta.url), { type: "module" });
    return () => workerRef.current?.terminate();
  }, []);

  function generate() {
    const a = genArray(n, dist, 1, 100);
    arrRef.current = a;
    setStep({ op: { kind: "mark", i: -1 }, array: [...a] });
    setStepB({ op: { kind: "mark", i: -1 }, array: [...a] });
    setProgressA({ idx: 0, total: 0 });
    setProgressB({ idx: 0, total: 0 });
    setStatsA([]);
    setStatsB([]);
    setNeedsReset(true);
    playerA.stop();
    playerB.stop();
  }

  async function buildStepsAsync(a: number[], id: AlgoId): Promise<{ steps: Step[], stats: StepStats[] }> {
    if (useWorker && workerRef.current) {
      return new Promise((resolve, reject) => {
        const worker = workerRef.current!;
        const msgId = Math.random();
        
        const handler = (e: MessageEvent) => {
          if (e.data.id === msgId) {
            worker.removeEventListener("message", handler);
            if (e.data.type === "success") {
              resolve({ steps: e.data.steps, stats: e.data.stats });
            } else {
              reject(new Error(e.data.error));
            }
          }
        };
        
        worker.addEventListener("message", handler);
        worker.postMessage({ id: msgId, algo: id, array: a });
      });
    } else {
      // Main thread fallback
      const g = algos[id](a);
      const rawSteps = Array.from(g);
      return processSteps(rawSteps);
    }
  }

  async function onPlay() {
    const base = [...arrRef.current];
    playerA.setSpeed(speed);
    playerB.setSpeed(speed);

    const finished = playerA.hasFinished || (compare && playerB.hasFinished);

    if (needsReset || finished) {
      setLoading(true);
      try {
        if (!compare) {
          const { steps, stats } = await buildStepsAsync(base, algo);
          playerA.load(steps);
          setStatsA(stats);
        } else {
          const [resA, resB] = await Promise.all([
            buildStepsAsync([...base], algo),
            buildStepsAsync([...base], compareAlgo)
          ]);
          playerA.load(resA.steps);
          setStatsA(resA.stats);
          playerB.load(resB.steps);
          setStatsB(resB.stats);
        }
        setNeedsReset(false);
        playerA.play();
        if (compare) playerB.play();
      } catch (e) {
        console.error(e);
        alert("Error generating steps. Try smaller array size.");
      } finally {
        setLoading(false);
      }
    } else {
      playerA.play();
      if (compare) playerB.play();
    }
  }

  // Update speed dynamically
  useEffect(() => {
    playerA.setSpeed(speed);
    playerB.setSpeed(speed);
  }, [speed, playerA, playerB]);

  if (view === "info") {
    return (
      <div className="app">
        <div className="row" style={{justifyContent: "space-between", alignItems: "baseline"}}>
          <h1>AlgoViz <span style={{fontSize: "0.5em", color: "var(--accent)", textTransform: "uppercase", letterSpacing: 2}}>Wiki</span></h1>
        </div>
        <DescriptionPage onBack={() => setView("playground")} />
      </div>
    );
  }

  return (
    <div className="app">
      <div
        className="row"
        style={{ justifyContent: "space-between", alignItems: "baseline" }}
      >
        <h1>
          AlgoViz{" "}
          <span
            style={{
              fontSize: "0.5em",
              color: "var(--accent)",
              textTransform: "uppercase",
              letterSpacing: 2,
            }}
          >
            Playground
          </span>
        </h1>
        <button className="btn" onClick={() => setView("info")} style={{fontSize: "0.8rem"}}>Algorithm Info &rarr;</button>
      </div>

      <ControlPanel
        algo={algo}
        setAlgo={setAlgo}
        compareAlgo={compareAlgo}
        setCompareAlgo={setCompareAlgo}
        dist={dist}
        setDist={setDist}
        n={n}
        setN={setN}
        speed={speed}
        setSpeed={setSpeed}
        compare={compare}
        setCompare={setCompare}
        sound={sound}
        setSound={setSound}
        useWorker={useWorker}
        setUseWorker={setUseWorker}
        onGenerate={generate}
        onPlay={onPlay}
        onPause={() => {
          playerA.pause();
          playerB.pause();
        }}
        onStep={() => {
          playerA.stepOnce();
          if (compare) playerB.stepOnce();
        }}
        loading={loading}
      />

      {!compare ? (
        <>
          <StatsBar 
            step={step} 
            algoId={algo} 
            progress={progressA.total > 0 ? (progressA.idx / (progressA.total - 1)) * 100 : 0}
            totalSteps={progressA.total}
            currentStep={progressA.idx}
            stats={statsA[progressA.idx]}
            onSeek={(idx) => {
              playerA.pause();
              playerA.seek(idx);
            }}
          />
          <div
            className="panel"
            style={{
              padding: 0,
              overflow: "hidden",
              border: "none",
            }}
          >
            <VisualizerCanvas step={step} />
          </div>
        </>
      ) : (
        <ComparePane
          left={{
            title: `Left: ${ALGORITHM_LABELS[algo] ?? algo}`,
            algoId: algo,
            step,
            progress: progressA.total > 0 ? (progressA.idx / (progressA.total - 1)) * 100 : 0,
            stats: statsA[progressA.idx],
          }}
          right={{
            title: `Right: ${ALGORITHM_LABELS[compareAlgo] ?? compareAlgo}`,
            algoId: compareAlgo,
            step: stepB,
            progress: progressB.total > 0 ? (progressB.idx / (progressB.total - 1)) * 100 : 0,
            stats: statsB[progressB.idx],
          }}
        />
      )}
    </div>
  );
}

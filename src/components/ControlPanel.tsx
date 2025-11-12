import React from "react";
import type { Distribution } from "@/lib/data/generators";
import type { AlgoId } from "@/lib/types";
import { ALGORITHM_OPTIONS } from "@/lib/algorithms/list";

type Props = {
  algo: AlgoId; setAlgo: (v: AlgoId) => void;
  compareAlgo: AlgoId; setCompareAlgo: (v: AlgoId) => void;
  n: number; setN: (v: number) => void;
  speed: number; setSpeed: (v: number) => void;
  dist: Distribution; setDist: (d: Distribution) => void;
  compare: boolean; setCompare: (b: boolean) => void;
  onGenerate: () => void; onPlay: () => void; onPause: () => void; onStep: () => void;
};

export default function ControlPanel(p: Props) {
  return (
    <div className="panel row">
      <label>Algorithm</label>
      <select value={p.algo} onChange={e => p.setAlgo(e.target.value as AlgoId)}>
        {ALGORITHM_OPTIONS.map(opt => (
          <option key={opt.id} value={opt.id}>{opt.label}</option>
        ))}
      </select>

      <label>Compare With</label>
      <select
        value={p.compareAlgo}
        disabled={!p.compare}
        onChange={e => p.setCompareAlgo(e.target.value as AlgoId)}
      >
        {ALGORITHM_OPTIONS.map(opt => (
          <option key={opt.id} value={opt.id}>{opt.label}</option>
        ))}
      </select>

      <label>Distribution</label>
      <select value={p.dist} onChange={e => p.setDist(e.target.value as Distribution)}>
        <option value="Uniform">Uniform</option>
        <option value="Gaussian">Gaussian</option>
        <option value="Nearly-sorted">Nearly-sorted</option>
      </select>

      <label>N = {p.n}</label>
      <input type="range" min={5} max={200} value={p.n} onChange={e => p.setN(+e.target.value)} />

      <label>Speed (ms) = {p.speed}</label>
      <input type="range" min={10} max={500} value={p.speed} onChange={e => p.setSpeed(+e.target.value)} />

      <label style={{display:"flex", gap:6, alignItems:"center"}}>
        <input type="checkbox" checked={p.compare} onChange={e => p.setCompare(e.target.checked)} />
        Compare Mode
      </label>

      <button className="btn" onClick={p.onGenerate}>Generate</button>
      <button className="btn primary" onClick={p.onPlay}>Play</button>
      <button className="btn" onClick={p.onPause}>Pause</button>
      <button className="btn" onClick={p.onStep}>Step</button>
    </div>
  );
}

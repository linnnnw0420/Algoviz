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
  sound: boolean; setSound: (b: boolean) => void;
  useWorker: boolean; setUseWorker: (b: boolean) => void;
  onGenerate: () => void; onPlay: () => void; onPause: () => void; onStep: () => void;
  loading?: boolean;
};

export default function ControlPanel(p: Props) {
  return (
    <div className="panel controls-grid">
      {/* Group 1: Algorithm Selection */}
      <div className="control-group">
        <label>Algorithm</label>
        <select value={p.algo} onChange={e => p.setAlgo(e.target.value as AlgoId)}>
          {ALGORITHM_OPTIONS.map(opt => (
            <option key={opt.id} value={opt.id}>{opt.label}</option>
          ))}
        </select>
        
        <div className="row" style={{marginTop: 8}}>
          <input type="checkbox" id="cmp" checked={p.compare} onChange={e => p.setCompare(e.target.checked)} />
          <label htmlFor="cmp" style={{cursor:"pointer", margin:0, textTransform:"none", color:"var(--fg)"}}>Compare</label>
          
          <input type="checkbox" id="snd" checked={p.sound} onChange={e => p.setSound(e.target.checked)} style={{marginLeft: 8}} />
          <label htmlFor="snd" style={{cursor:"pointer", margin:0, textTransform:"none", color:"var(--fg)"}}>Sound</label>

          <input type="checkbox" id="wrk" checked={p.useWorker} onChange={e => p.setUseWorker(e.target.checked)} style={{marginLeft: 8}} />
          <label htmlFor="wrk" style={{cursor:"pointer", margin:0, textTransform:"none", color:"var(--fg)"}}>Worker</label>
        </div>

        {p.compare && (
          <select
            value={p.compareAlgo}
            onChange={e => p.setCompareAlgo(e.target.value as AlgoId)}
            style={{marginTop: 4}}
          >
            {ALGORITHM_OPTIONS.map(opt => (
              <option key={opt.id} value={opt.id}>vs. {opt.label}</option>
            ))}
          </select>
        )}
      </div>

      {/* Group 2: Data Settings */}
      <div className="control-group">
        <label>Data Distribution</label>
        <select value={p.dist} onChange={e => p.setDist(e.target.value as Distribution)}>
          <option value="Uniform">Uniform Random</option>
          <option value="Gaussian">Gaussian (Normal)</option>
          <option value="Nearly-sorted">Nearly Sorted</option>
        </select>

        <label style={{marginTop: 8}}>Array Size: {p.n}</label>
        <input type="range" min={10} max={1000} step={10} value={p.n} onChange={e => p.setN(+e.target.value)} />
      </div>

      {/* Group 3: Playback Controls */}
      <div className="control-group">
        <label>Speed</label>
        <input type="range" min={1} max={100} value={p.speed} onChange={e => p.setSpeed(+e.target.value)} />
        
        <div className="row" style={{marginTop: 8}}>
          <button className="btn" onClick={p.onGenerate} disabled={p.loading}>Reset</button>
          <button className="btn primary" onClick={p.onPlay} disabled={p.loading}>
            {p.loading ? "Loading..." : "Play"}
          </button>
          <button className="btn" onClick={p.onPause}>Pause</button>
          <button className="btn" onClick={p.onStep}>Step</button>
        </div>
      </div>
    </div>
  );
}

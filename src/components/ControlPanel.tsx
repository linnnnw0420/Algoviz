import React from "react";

type Props = {
  algo: string;
  setAlgo: (v: string) => void;
  n: number;
  setN: (v: number) => void;
  speed: number;
  setSpeed: (v: number) => void;
  onShuffle: () => void;
  onPlay: () => void;
  onPause: () => void;
  onStep: () => void;
};

export default function ControlPanel(p: Props) {
  return (
    <div className="panel row">
      <select value={p.algo} onChange={e => p.setAlgo(e.target.value)}>
        <option value="bubble">Bubble Sort</option>
        <option value="quick">Quick Sort</option>
      </select>
      <label>数量 {p.n}</label>
      <input type="range" min={5} max={200} value={p.n} onChange={e => p.setN(+e.target.value)} />
      <label>速度(ms) {p.speed}</label>
      <input type="range" min={10} max={500} value={p.speed} onChange={e => p.setSpeed(+e.target.value)} />
      <button className="btn" onClick={p.onShuffle}>生成</button>
      <button className="btn primary" onClick={p.onPlay}>播放</button>
      <button className="btn" onClick={p.onPause}>暂停</button>
      <button className="btn" onClick={p.onStep}>单步</button>
    </div>
  );
}

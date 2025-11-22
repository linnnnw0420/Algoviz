import React from "react";
import type { Step, AlgoId } from "@/lib/types";
import { ALGORITHM_INFO } from "@/lib/algorithms/list";
import type { StepStats } from "@/lib/utils/stepUtils";

type Props = { 
  step?: Step; 
  algoId?: AlgoId;
  progress?: number; // 0 to 100
  totalSteps?: number;
  currentStep?: number;
  stats?: StepStats;
  onSeek?: (idx: number) => void;
};

export default function StatsBar({ step, algoId, progress = 0, totalSteps = 0, currentStep = 0, stats, onSeek }: Props) {
  const info = algoId ? ALGORITHM_INFO[algoId] : null;

  return (
    <div className="panel" style={{ padding: "8px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
      <div className="row" style={{ justifyContent: "space-between", fontSize: "0.8rem" }}>
        <div className="row">
          <div className="stat">OP: <strong>{step?.op.kind.toUpperCase() ?? "IDLE"}</strong></div>
          <div className="stat">IDX: <strong>{step && "i" in step.op ? step.op.i : "-"}</strong></div>
          <div className="stat" title="Comparisons">CMP: <strong>{stats?.compares ?? 0}</strong></div>
          <div className="stat" title="Swaps">SWP: <strong>{stats?.swaps ?? 0}</strong></div>
          {info && (
            <>
              <div className="stat" title="Time Complexity">T: <strong>{info.complexity.time}</strong></div>
              <div className="stat" title="Space Complexity">S: <strong>{info.complexity.space}</strong></div>
            </>
          )}
        </div>
        <div className="stat" style={{minWidth: 60, textAlign: "right"}}>
          {progress.toFixed(0)}%
        </div>
      </div>
      
      {/* Time Travel Slider */}
      <div style={{ width: "100%", display: "flex", alignItems: "center", marginTop: 4 }}>
        <input 
          type="range" 
          min={0} 
          max={Math.max(0, totalSteps - 1)} 
          value={currentStep} 
          onChange={(e) => onSeek?.(Number(e.target.value))}
          disabled={totalSteps <= 1}
          style={{ 
            width: "100%", 
            height: 6, 
            accentColor: "var(--accent)",
            cursor: totalSteps > 1 ? "pointer" : "default"
          }} 
        />
      </div>
    </div>
  );
}

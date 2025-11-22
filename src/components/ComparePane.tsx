import React from "react";
import type { Step, AlgoId } from "@/lib/types";
import VisualizerCanvas from "./VisualizerCanvas";
import StatsBar from "./StatsBar";
import type { StepStats } from "@/lib/utils/stepUtils";

type PaneData = { 
  title: string; 
  algoId: AlgoId;
  step?: Step; 
  progress: number;
  stats?: StepStats;
};

type Props = {
  left: PaneData;
  right: PaneData;
};

export default function ComparePane({ left, right }: Props) {
  return (
    <div className="row" style={{alignItems:"flex-start"}}>
      <div style={{flex:1}}>
        <div className="panel" style={{marginBottom:8, padding: "8px 12px"}}><strong>{left.title}</strong></div>
        <VisualizerCanvas step={left.step} />
        <div style={{marginTop: 8}}>
          <StatsBar step={left.step} algoId={left.algoId} progress={left.progress} stats={left.stats} />
        </div>
      </div>
      <div style={{flex:1}}>
        <div className="panel" style={{marginBottom:8, padding: "8px 12px"}}><strong>{right.title}</strong></div>
        <VisualizerCanvas step={right.step} />
        <div style={{marginTop: 8}}>
          <StatsBar step={right.step} algoId={right.algoId} progress={right.progress} stats={right.stats} />
        </div>
      </div>
    </div>
  );
}

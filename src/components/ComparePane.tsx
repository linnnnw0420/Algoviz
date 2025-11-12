import React from "react";
import type { Step } from "@/lib/types";
import VisualizerCanvas from "./VisualizerCanvas";

type Props = {
  left: { title: string; step?: Step };
  right: { title: string; step?: Step };
};

export default function ComparePane({ left, right }: Props) {
  return (
    <div className="row" style={{alignItems:"flex-start"}}>
      <div style={{flex:1}}>
        <div className="panel" style={{marginBottom:8}}><strong>{left.title}</strong></div>
        <VisualizerCanvas step={left.step} />
      </div>
      <div style={{flex:1}}>
        <div className="panel" style={{marginBottom:8}}><strong>{right.title}</strong></div>
        <VisualizerCanvas step={right.step} />
      </div>
    </div>
  );
}

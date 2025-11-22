import React from "react";
import { ALGORITHM_OPTIONS } from "@/lib/algorithms/list";

export default function DescriptionPage({ onBack }: { onBack: () => void }) {
  return (
    <div className="panel" style={{ maxWidth: 800, margin: "0 auto" }}>
      <div className="row" style={{ marginBottom: 20 }}>
        <button className="btn" onClick={onBack}>&larr; Back to Playground</button>
        <h2>Algorithm Descriptions</h2>
      </div>
      
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {ALGORITHM_OPTIONS.map(algo => (
          <div key={algo.id} style={{ borderBottom: "1px solid var(--border)", paddingBottom: 16 }}>
            <h3 style={{ margin: "0 0 8px 0", color: "var(--accent)" }}>{algo.label}</h3>
            <p style={{ margin: "0 0 12px 0", lineHeight: 1.6, color: "var(--fg-muted)" }}>
              {algo.description}
            </p>
            <div className="row" style={{ gap: 16, fontSize: "0.9em" }}>
              <div className="stat">Time: <strong>{algo.complexity.time}</strong></div>
              <div className="stat">Space: <strong>{algo.complexity.space}</strong></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

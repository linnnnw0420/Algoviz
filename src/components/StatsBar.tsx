import React from "react";
import type { Step } from "@/lib/types";

export default function StatsBar({ step }: { step?: Step }) {
  return (
    <div className="panel row">
      <div className="stat">operation: {step?.op.kind ?? "-"}</div>
      <div className="stat">length: {step?.array.length ?? "-"}</div>
    </div>
  );
}

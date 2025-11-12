import React from "react";
import type { Step } from "@/lib/types";

export default function StatsBar({ step }: { step?: Step }) {
  return (
    <div className="panel row">
      <div className="stat">操作: {step?.op.kind ?? "-"}</div>
      <div className="stat">长度: {step?.array.length ?? "-"}</div>
    </div>
  );
}

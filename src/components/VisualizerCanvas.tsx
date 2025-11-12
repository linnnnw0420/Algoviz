import React, { useEffect, useRef } from "react";
import type { Step } from "@/lib/types";

type Props = { step?: Step; width?: number; height?: number };

export default function VisualizerCanvas({ step, width = 800, height = 300 }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cvs = ref.current; if (!cvs || !step) return;
    const ctx = cvs.getContext("2d")!;
    const arr = step.array;
    ctx.clearRect(0, 0, width, height);

    const w = width / arr.length;
    const max = Math.max(...arr, 1);

    for (let i = 0; i < arr.length; i++) {
      const h = (arr[i] / max) * (height - 10);
      const x = i * w;
      const y = height - h;
      // 根据操作高亮
      let color = "#94a3b8";
      const op = step.op;
      if (op.kind === "swap" && (i === op.i || i === op.j)) color = "#ef4444";
      else if (op.kind === "overwrite" && i === op.i) color = "#3b82f6";
      else if (op.kind === "compare" && (i === op.i || i === op.j)) color = "#f59e0b";
      else if (op.kind === "pivot" && i === op.i) color = "#22c55e";

      ctx.fillStyle = color;
      ctx.fillRect(x + 1, y, Math.max(1, w - 2), h);
    }
  }, [step, width, height]);

  return <canvas ref={ref} width={width} height={height} />;
}

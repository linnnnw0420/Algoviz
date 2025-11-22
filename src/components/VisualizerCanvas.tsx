import React, { useEffect, useRef, memo } from "react";
import type { Step } from "@/lib/types";

type Props = { step?: Step; width?: number; height?: number };

function VisualizerCanvas({ step, width = 800, height = 300 }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cvs = ref.current;
    if (!cvs || !step) return;
    const ctx = cvs.getContext("2d")!;

    const drawBars = (celebrated?: Set<number>) => {
      const arr = step.array;
      ctx.clearRect(0, 0, width, height);
      if (arr.length === 0) return;

      const barWidth = width / arr.length;
      const max = Math.max(...arr, 1);
      const op = step.op;

      for (let i = 0; i < arr.length; i++) {
        const h = (arr[i] / max) * (height - 10);
        const x = i * barWidth;
        const y = height - h;
        
        // Rainbow Mode: Hue based on value (0..300 covers Red -> Violet)
        const hue = (arr[i] / max) * 300;
        let color = `hsl(${hue}, 75%, 60%)`;
        
        if (celebrated?.has(i)) color = `hsl(${hue}, 90%, 70%)`; // Done: Brighter Rainbow
        else if (op.kind === "swap" && (i === op.i || i === op.j)) color = "#f87171"; // Swap: Red 400
        else if (op.kind === "overwrite" && i === op.i) color = "#60a5fa"; // Overwrite: Blue 400
        else if (op.kind === "compare" && (i === op.i || i === op.j)) color = "#ffffff"; // Compare: White (High contrast)
        else if (op.kind === "pivot" && i === op.i) color = "#a3e635"; // Pivot: Lime 400
        else if (op.kind === "mark" && i === op.i) color = "#c084fc"; // Mark: Purple

        ctx.fillStyle = color;
        ctx.fillRect(x + 1, y, Math.max(1, barWidth - 2), h);
      }
    };

    if (step.op.kind !== "done") {
      drawBars();
      return;
    }

    const order = step.array
      .map((value, index) => ({ value, index }))
      .sort((a, b) => (a.value - b.value) || (a.index - b.index))
      .map(({ index }) => index);

    let progress = 0;
    const highlight = new Set<number>();
    const intervalMs = Math.max(30, 800 / Math.max(order.length, 1));
    drawBars(highlight);

    const interval = window.setInterval(() => {
      if (progress >= order.length) {
        clearInterval(interval);
        return;
      }
      highlight.add(order[progress]);
      progress += 1;
      drawBars(highlight);
      if (progress >= order.length) clearInterval(interval);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [step, width, height]);

  return <canvas ref={ref} width={width} height={height} />;
}

export default memo(VisualizerCanvas);

// src/components/PixelMosaic.jsx
"use client";
import { useEffect, useMemo, useRef } from "react";

/**
 * Rejilla con “píxeles vivos” aleatorios.
 * - Ajusta cols/rows para cambiar el aspecto (p.ej. 16x9, 9x16, 1x1…)
 * - rate/pulse controlan la velocidad de parpadeo.
 * - stroke/border configuran rejilla y bordes (superior/derecho).
 */
export default function PixelMosaic({
  cols = 16,
  rows = 9,
  cell = 10,
  rate = 180,         // ms entre ráfagas
  pulse = 700,        // ms encendido por píxel
  className = "",
  gridStroke = "#f7f7f733",
  gridStrokeWidth = 0.6,
  onFill = "#f7f7f7",
  bg = "#0f0f0f",
  showTopRightBorder = true,
}) {
  const total = cols * rows;
  const cellsRef = useRef([]);
  const timerRef = useRef();

  const cells = useMemo(
    () =>
      Array.from({ length: total }, (_, i) => ({
        x: (i % cols) * cell,
        y: Math.floor(i / cols) * cell,
      })),
    [cols, rows, cell]
  );

  useEffect(() => {
    const tick = () => {
      const bursts = 1 + Math.floor(Math.random() * 3); // 1..3 celdas por ráfaga
      for (let b = 0; b < bursts; b++) {
        const idx = Math.floor(Math.random() * total);
        const r = cellsRef.current[idx];
        if (!r) continue;
        r.classList.add("on");
        setTimeout(() => r.classList.remove("on"), pulse + Math.random() * pulse);
      }
      timerRef.current = setTimeout(tick, rate + Math.random() * rate);
    };
    tick();
    return () => clearTimeout(timerRef.current);
  }, [total, rate, pulse]);

  const W = cols * cell;
  const H = rows * cell;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={className} aria-hidden="true">
      <rect width="100%" height="100%" fill={bg} />
      {cells.map((c, i) => (
        <rect
          key={i}
          ref={(el) => (cellsRef.current[i] = el)}
          x={c.x}
          y={c.y}
          width={cell}
          height={cell}
          className="cell"
        />
      ))}
      
      <style>{`
        .cell{
          fill:${bg};
          stroke:${gridStroke};
          stroke-width:${gridStrokeWidth};
          transition: fill 180ms ease, opacity 180ms ease;
        }
        .cell.on{
          fill:${onFill};
          opacity:.75;
        }
        .brd{
          stroke:${onFill};
          stroke-width:1.4;
        }
      `}</style>
    </svg>
  );
}

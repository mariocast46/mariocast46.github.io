"use client";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

/* Evita reinicios en StrictMode dev */
let PRE_DONE = false;

function makeSteps() {
  const count = 6 + Math.floor(Math.random() * 9); // 5..8
  const vals = [0];
  let v = 0;
  for (let i = 0; i < count - 2; i++) {
    const remain = 99 - v;
    const inc = Math.max(
      1,
      Math.floor(remain / (count - i)) + Math.floor((Math.random() - 0.5) * 2)
    );
    v = Math.min(99, v + inc);
    vals.push(v);
  }
  vals.push(100);
  const times = vals.map((_, i) =>
    i === vals.length - 1 ? 1000 : 300 + Math.floor(Math.random() * 600)
  );
  return vals.map((vv, i) => ({ v: vv, ms: times[i] }));
}

export default function Preloader({ onDone }) {
  const steps = useMemo(() => (PRE_DONE ? [{ v: 100, ms: 400 }] : makeSteps()), []);
  const [n, setN] = useState(steps[0].v);

  useEffect(() => {
    if (PRE_DONE) {
      const t = setTimeout(() => onDone?.(), steps[0].ms);
      return () => clearTimeout(t);
    }
    let i = 0, t;
    const run = () => {
      setN(steps[i].v);
      t = setTimeout(() => {
        if (i === steps.length - 1) {
          PRE_DONE = true;                 
          onDone?.();
        } else { i++; run(); }
      }, steps[i].ms);
    };
    run();
    return () => clearTimeout(t);
  }, [onDone, steps]);

  const ui = (
    <div className="preloader preloader--white" aria-live="polite">
      <div className="pre-num">{n}</div>
    </div>
  );

  // 👇 Esto garantiza que está fuera de cualquier <motion.main> con transform
  return typeof window !== "undefined" ? createPortal(ui, document.body) : null;
}

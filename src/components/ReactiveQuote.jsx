// ReactiveQuote.jsx
"use client";
import { useEffect, useRef, useState } from "react";

const renderAccent = (str) =>
  String(str).split(/(\[\[.*?\]\])/g).map((chunk, i) => {
    const m = chunk.match(/^\[\[(.*)\]\]$/);
    return m ? <span key={i} className="rq-accent">{m[1]}</span>
             : <span key={i}>{chunk}</span>;
  });

export default function ReactiveQuote({ base, alt, style, diameter = 200 }) {
  const [lens, setLens] = useState({ x: 0, y: 0, r: 0 });
  const rafRef = useRef(0);
  const last = useRef({ x: 0, y: 0 });
  const ringRef = useRef(null);

  useEffect(() => { ringRef.current = document.querySelector(".c-ring"); }, []);

  const onEnter = () => {
    setLens(v => ({ ...v, r: diameter / 2 }));
    if (ringRef.current) {
      ringRef.current.style.setProperty("--rq-diam", `${diameter}px`);
      ringRef.current.classList.add("is-lens");
    }
  };

  const onLeave = () => {
    setLens(v => ({ ...v, r: 0 }));
    if (ringRef.current) ringRef.current.classList.remove("is-lens");
  };

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    last.current.x = e.clientX - r.left;
    last.current.y = e.clientY - r.top;
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        setLens(v => ({ ...v, x: last.current.x, y: last.current.y }));
      });
    }
  };

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  // === MÁSCARA INVERSA SOBRE LA BASE ===
  // Oculta la base dentro del círculo (para que solo se vea la alternativa ahí).
  const baseMask =
    lens.r > 0
      ? {
          WebkitMaskImage: `radial-gradient(circle at ${lens.x}px ${lens.y}px, transparent ${lens.r}px, #fff ${lens.r}px)`,
          maskImage:       `radial-gradient(circle at ${lens.x}px ${lens.y}px, transparent ${lens.r}px, #fff ${lens.r}px)`,
        }
      : { WebkitMaskImage: "none", maskImage: "none" };

  return (
    <div
      className="reactive-quote"
      style={style}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onMouseMove={onMove}
      role="note"
      data-clickable
    >
      <span className="hero-quote1" style={baseMask}>
        {renderAccent(base)}
      </span>

      <span
        className="hero-quote2"
        style={{ clipPath: `circle(${lens.r}px at ${lens.x}px ${lens.y}px)` }}
        aria-hidden="true"
      >
        {renderAccent(alt)}
      </span>
    </div>
  );
}

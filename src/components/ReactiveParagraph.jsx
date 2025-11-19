"use client";
import { useEffect, useRef, useState } from "react";

/** Remarca [[…]] con un span .rq-accent */
function renderAccent(str) {
  const s = String(str ?? "");
  return s.split(/(\[\[.*?\]\])/g).map((chunk, i) => {
    const m = chunk.match(/^\[\[(.*)\]\]$/);
    return m
      ? <span key={i} className="rq-accent-paragraph">{m[1]}</span>
      : <span key={i}>{chunk}</span>;
  });
}

/**
 * Props:
 *  - baseText: string con [[…]] para resaltar
 *  - altText : string con [[…]] (lo que se ve dentro de la “lupa”)
 *  - className: clase (ej. s.spP) aplicada a <p> de ambos textos
 *  - diameter: tamaño de la “lupa”
 */
export default function ReactiveParagraph({
  baseText,
  altText,
  className,
  style,
  diameter = 200,
}) {
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

  // MÁSCARA inversa sobre la base: oculta la base dentro del círculo
  const baseMask = lens.r > 0
    ? {
        WebkitMaskImage: `radial-gradient(circle at ${lens.x}px ${lens.y}px, transparent ${lens.r}px, #000 ${lens.r}px)`,
        maskImage:       `radial-gradient(circle at ${lens.x}px ${lens.y}px, transparent ${lens.r}px, #000 ${lens.r}px)`,
      }
    : { WebkitMaskImage: "none", maskImage: "none" };

  return (
    <div
      className="reactive-paragraph"
      style={style}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onMouseMove={onMove}
      role="note"
      data-clickable
    >
      {/* BASE (debajo) */}
      <p className={className + " rq-base"} style={baseMask}>
        {renderAccent(baseText)}
      </p>

      {/* ALT (encima, recortado en círculo) */}
      <p
        className={className + " rq-alt"}
        style={{ clipPath: `circle(${lens.r}px at ${lens.x}px ${lens.y}px)` }}
        aria-hidden="true"
      >
        {renderAccent(altText)}
      </p>
    </div>
  );
}

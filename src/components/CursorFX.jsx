// CursorFX.jsx
"use client";
import { useEffect } from "react";

export default function CursorFX() {
  useEffect(() => {
    // Si es “pointer: coarse” (táctil) o <=768px, no crear el anillo
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    const isNarrow = window.matchMedia("(max-width: 768px)").matches;
    if (isCoarse || isNarrow) return;

    const ring = document.createElement("div");
    ring.className = "c-ring";
    document.body.appendChild(ring);

    const isInteractive = (el) =>
      !!(el.closest &&
        el.closest('a, button, label, [role="button"], [data-clickable], .olh-link, .olh-cta, .reactive-quote'));

    const onMove = (e) => {
      ring.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%,-50%)`;
      ring.dataset.pointer = isInteractive(e.target) ? "1" : "0";
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      ring.remove();
    };
  }, []);

  return null;
}

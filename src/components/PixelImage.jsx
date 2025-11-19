// src/components/PixelImage.jsx
"use client";
import { useEffect, useRef, useState, useLayoutEffect } from "react";
import useAppReady from "../lib/useAppReady";

export default function PixelImage({
  src,
  startScale = 28,
  duration = 1400,
  width = 320,          // usado en modo NO fill
  height = 400,         // usado en modo NO fill
  fill = false,         // modo responsive que ocupa 100% del contenedor
  className = "",
}) {
  const wrapRef = useRef(null);
  const cnvRef  = useRef(null);
  const [imgEl, setImgEl] = useState(null);
  const [size, setSize] = useState({ w: width, h: height });
  const appReady = useAppReady();

  // Hi-DPI: limita el múltiplo para no “reventar” memoria
  const QUALITY_DPR = Math.min(2, Math.max(1, typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1));

  // Precarga de la imagen
  useEffect(() => {
    const i = new Image();
    i.crossOrigin = "anonymous";
    i.decoding = "async";
    i.loading = "eager";
    i.src = src;
    i.onload = () => setImgEl(i);
  }, [src]);

  // En modo fill, seguimos el tamaño del contenedor
  useLayoutEffect(() => {
    if (!fill) return;
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width: w, height: h } = entry.contentRect;
      setSize({ w: Math.max(1, Math.round(w)), h: Math.max(1, Math.round(h)) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [fill]);

  // Configura el canvas para el tamaño/tipo actual
  const setupCanvas = () => {
    const cnv = cnvRef.current;
    if (!cnv) return null;
    const { w, h } = size;
    // CSS size
    cnv.style.width = `${w}px`;
    cnv.style.height = `${h}px`;
    // Buffer real a Hi-DPI
    cnv.width  = Math.max(1, Math.round(w * QUALITY_DPR));
    cnv.height = Math.max(1, Math.round(h * QUALITY_DPR));
    const ctx = cnv.getContext("2d");
    ctx.setTransform(QUALITY_DPR, 0, 0, QUALITY_DPR, 0, 0);
    return ctx;
  };

  useEffect(() => {
    if (!imgEl || !appReady || !size.w || !size.h) return;

    const ctx = setupCanvas();
    if (!ctx) return;
    const { w, h } = size;

    const startAt = performance.now();
    let raf;

    const draw = (now) => {
      const t = Math.min(1, (now - startAt) / duration);

      if (t < 1) {
        // FASE PIXELADA (suavizado OFF)
        const s = startScale - (startScale - 1) * t;
        const pw = Math.max(1, Math.floor(w / s));
        const ph = Math.max(1, Math.floor(h / s));

        const off = document.createElement("canvas");
        off.width = pw; off.height = ph;
        const o = off.getContext("2d");
        o.imageSmoothingEnabled = false;
        o.drawImage(imgEl, 0, 0, pw, ph);

        ctx.clearRect(0, 0, w, h);
        ctx.imageSmoothingEnabled = false; // mantener el look “pixel”
        ctx.drawImage(off, 0, 0, pw, ph, 0, 0, w, h);

        raf = requestAnimationFrame(draw);
      } else {
        // FASE FINAL NÍTIDA (suavizado ON, imagen completa)
        ctx.clearRect(0, 0, w, h);
        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(imgEl, 0, 0, w, h);
      }
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [imgEl, appReady, size, startScale, duration, QUALITY_DPR]);

  // Wrapper: absoluto cuando fill, intrínseco si no
  const wrapStyle = fill
    ? { position: "absolute", inset: 0, width: "100%", height: "100%" }
    : { position: "relative", width: size.w, height: size.h };

  return (
    <div ref={wrapRef} className={`pixel-wrap ${className}`} style={wrapStyle}>
      <canvas
        ref={cnvRef}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          // que el navegador no fuerce “pixel-art” al escalar el canvas CSS
          imageRendering: "auto",
        }}
      />
      <div className="shade" />
    </div>
  );
}

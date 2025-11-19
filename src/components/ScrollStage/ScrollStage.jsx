"use client";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";

/**
 * Props:
 *  - bg:           ReactNode  → contenido de la sección actual (fondo fijado)
 *  - overlay:      ReactNode  → siguiente sección (sube como tarjeta)
 *  - stageVH:      number     → altura total del escenario en svh (duración del efecto)
 *  - overlayStart: number     → progreso (0..1) donde la tarjeta empieza a entrar
 *  - overlayEnd:   number     → progreso (0..1) donde la tarjeta ya está full-screen
 *  - holdSVH:      number     → “pausa” a pantalla completa (en svh)
 *  - overlayBg:    string     → color de fondo de la tarjeta
 *  - accent:       string     → color acento (p.ej. #f2ff00) para borde/halo opcional

export default function ScrollStage({
  bg,
  overlay,
  stageVH = 300,
  overlayStart = 0.70,
  overlayEnd = 0.94,
  holdSVH = 48,
  overlayBg = "#101010",
  accent = "#f2ff00",
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // 1) La “tarjeta” sube de 100% (fuera por abajo) hasta 0% (full-screen)
  const yRaw = useTransform(scrollYProgress, [overlayStart, overlayEnd], ["100%", "0%"]);
  const y = useSpring(yRaw, { stiffness: 42, damping: 20, mass: 0.9 });

  // 2) Opacidad: empieza un poco después para que “flote” por encima
  const oRaw = useTransform(scrollYProgress, [overlayStart + 0.04, overlayEnd], [0, 1]);
  const o = useSpring(oRaw, { stiffness: 48, damping: 22, mass: 0.9 });

  // 3) Bordes redondeados y sombra: de tarjeta → pantalla completa
  const radiusRaw = useTransform(scrollYProgress, [overlayStart, overlayEnd], [28, 0]);
  const radius = useSpring(radiusRaw, { stiffness: 70, damping: 26, mass: 0.8 });

  const shadowRaw = useTransform(
    scrollYProgress,
    [overlayStart, overlayEnd],
    [
      "0px 30px 100px rgba(0,0,0,0.45), 0 0 0 0 rgba(0,0,0,0.0)",
      "0px 0px 0px rgba(0,0,0,0.0), 0 0 0 0 rgba(0,0,0,0.0)",
    ]
  );
  const shadow = useSpring(shadowRaw, { stiffness: 60, damping: 24, mass: 0.9 });

  // 4) Trazo/sutileza de acento al principio (se desvanece a full)
  const borderAlpha = useTransform(scrollYProgress, [overlayStart, overlayEnd], [0.6, 0]);
  const borderColor = useTransform(borderAlpha, (a) => `color-mix(in oklab, ${accent} ${a * 100}%, transparent)`);

  return (
    <section
      ref={ref}
      className="stage"
      style={
        {
          "--stage-h": `${stageVH}svh`,
          "--hold-h": `${holdSVH}svh`,
        }
      }
    >
      <div className="stage-pin">
        {bg}
      </div>
    
      <motion.div className="stage-overlay" style={{ y, opacity: o }}>
        <motion.div 
          className="stage-overlay-inner"
          style={{
            background: overlayBg,
            borderRadius: radius,
            boxShadow: shadow,
            outline: `1px solid`,
            outlineColor: borderColor,
          }}
        >
          {overlay}
        </motion.div>
      </motion.div>

      {/* “Hold” a pantalla completa: impide que el scroll pase al siguiente bloque
      <div className="stage-hold" aria-hidden />
    </section>
  );
}
*/

/**
 * Sticky-stack reveal:
 *  - bg:           ReactNode → sección actual (queda fijada)
 *  - overlay:      ReactNode → siguiente sección (sube y tapa)
 *  - stageVH:      number    → recorrido total del escenario (svh)
 *  - overlayStart: number    → progreso 0..1 donde empieza a entrar overlay
 *  - overlayDur:   number    → longitud 0..1 del tramo en que sube 100%→0%
 *  - holdSVH:      number    → retención extra a pantalla completa (svh)
 *  - overlayBg:    string    → color de fondo del overlay (cubre todo)
 */
export default function ScrollStage({
  bg,
  overlay,
  stageVH = 280,
  overlayStart = 0.70,
  overlayDur = 0.18,     // cuánto tarda en cubrir toda la pantalla
  holdSVH = 48,          // “enganche” a pantalla completa
  overlayBg = "#101010",
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // tramo de entrada (0..1 → 100% a 0%)
  const overlayEnd = Math.min(0.98, overlayStart + overlayDur);
  const yOverlay = useTransform(
    scrollYProgress,
    [overlayStart, overlayEnd],
    ["100%", "0%"]
  );

  // opacidad muy sutil (opcional). Pon [1,1] si no quieres fade.
  const oOverlay = useTransform(
    scrollYProgress,
    [overlayStart, overlayEnd],
    [0.25, 1]
  );

  return (
    <section
      ref={ref}
      className="stage"
      style={{
        // total del escenario + el “hold” final para bloquear la salida
        // (ese div extra evita que el scroll se vaya a lo siguiente antes de tiempo)
        "--stage-h": `${stageVH}svh`,
        "--hold-h": `${holdSVH}svh`,
      }}
    >
      {/* Sección actual: se queda fijada hasta que el escenario termina */}
      <div className="stage-pin">
        {bg}
      </div>

      {/* Siguiente sección: sticky y animada de abajo→arriba */}
      <motion.div className="stage-overlay" style={{ y: yOverlay, opacity: oOverlay }}>
        <div className="stage-overlay-inner" style={{ background: overlayBg }}>
          {overlay}
        </div>
      </motion.div>

      {/* Bloque de retención: “engancha” el overlay a pantalla completa */}
      <div className="stage-hold" aria-hidden />
    </section>
  );
}

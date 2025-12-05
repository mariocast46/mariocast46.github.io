"use client";
import Image from "next/image";
import { useRef, useLayoutEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useSpring,
  useMotionValueEvent,
} from "framer-motion";
import "./about.css";
import { useT } from "../../app/providers/DictProvider";
import ReactiveParagraph from "../ReactiveParagraph";

const SIDE_IMGS = [
  {
    src: "/images/portfolio_mario.webp",
    side: "left",
    w: 18,
    h: 36,
    start: 0.14,
    spread: 30,
    x0VW: -30,
    yIn: 20,
    yOut: 300,
    infoKey: "info1",
  },
  {
    src: "/images/Progresa-Formacion-Logo.png",
    side: "right",
    w: 18,
    h: 36,
    start: 0.14,
    spread: 30,
    x0VW: 30,
    yIn: 20,
    yOut: 500,
    infoKey: "info2",
  },
  {
    src: "/images/Xufa Logo.webp",
    side: "left",
    w: 15,
    h: 30,
    start: 0.14,
    spread: 20,
    x0VW: -30,
    yIn: 180,
    yOut: 800,
    infoKey: "info3",
  },
  {
    src: "/images/Porfolio Stack Developer.webp",
    side: "right",
    w: 15,
    h: 30,
    start: 0.14,
    spread: 20,
    x0VW: 30,
    yIn: 180,
    yOut: 1000,
    infoKey: "info4",
  },
];
export function seg(progress, s, e, from, to) {
  return useTransform(progress, [s, e], [from, to]);
}
export function appear(progress, s, e) {
  return useTransform(progress, [s - 0.02, s, e, e + 0.02], [0, 1, 1, 0]);
}

// === Timeline de tramos (debe existir antes de usar TL.ghost...)
export const TL = {
  ghost: { s: 0.18, e: 0.52 },
  ruler: { s: 0.6, e: 0.95 },
  rail: { s: 0.0, e: 1.0 },
  dots: { s: 0.1, e: 0.9 },
};

// === (Opcional) datos estáticos fuera del componente
export const DOTS = [
  { x: 12, y: 22, s: 4 },
  { x: 18, y: 68, s: 6 },
  { x: 28, y: 40, s: 5 },
  { x: 72, y: 28, s: 4 },
  { x: 84, y: 62, s: 6 },
  { x: 66, y: 70, s: 5 },
  { x: 42, y: 18, s: 4 },
  { x: 54, y: 56, s: 4 },
];
export default function AboutSectionFull({ bottomSpacePx = 1600 }) {
  const wrapRef = useRef(null);
  const pinRef = useRef(null);
  const heroRef = useRef(null);
  const t = useT();
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });
  const maskIn = {
    hidden: { clipPath: "inset(0 0 100% 0 round 0px)", opacity: 1 },
    show: {
      clipPath: "inset(0 0 0% 0 round 0px)",
      opacity: 1,
      transition: { duration: 2, ease: [0.2, 0.8, 0.2, 1] },
    },
  };

  // Parallax sutil del hero
  const heroY = useTransform(scrollYProgress, [0, 1], ["0vh", "8vh"]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.04]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.0]);

  const ghostOpacity = appear(scrollYProgress, TL.ghost.s, TL.ghost.e);

  // (2) Rail de progreso
  const railFillH = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // (4) Ruler
  const rulerScaleX = useTransform(scrollYProgress, [0.6, 0.95], [0, 1]);
  const showHint = useTransform(rulerScaleX, (v) => (v > 0.9 ? 1 : 0));

  const show = appear(scrollYProgress, 0.25, 0.45); // visible solo del 25% al 45%
  const y = seg(scrollYProgress, 0.25, 0.45, 60, 0); // sube de 60px → 0

  const ghostY = seg(scrollYProgress, TL.ghost.s, TL.ghost.e, "60%", "0%");
  const ghostClip = seg(
    scrollYProgress,
    TL.ghost.s,
    TL.ghost.e,
    "inset(100% 0 0 0)",
    "inset(0 0 0 0)"
  );
  const [tailSVH, setTailSVH] = useState(0);

  useLayoutEffect(() => {
    // cuánto bajan respecto a su punto de entrada
    const maxDownPx = Math.max(
      ...SIDE_IMGS.map((it) => Math.max(0, (it.yOut ?? 0) - (it.yIn ?? 0)))
    );
    const vh = window.innerHeight || 800;
    // deja margen extra (p.ej. +400px para figcaption/aires)
    const extraSVH = Math.max(0, Math.ceil(((maxDownPx + 400) / vh) * 100));
    setTailSVH(extraSVH);
  }, []);

  useLayoutEffect(() => {
    if (!pinRef.current || !heroRef.current) return;
    const pin = pinRef.current;
    const hero = heroRef.current;

    const measure = () => {
      const pr = pin.getBoundingClientRect();
      const hr = hero.getBoundingClientRect();
      const cx = hr.left - pr.left + hr.width / 2;
      const cy = hr.top - pr.top + hr.height / 2;
      pin.style.setProperty("--hero-x", `${cx}px`);
      pin.style.setProperty("--hero-y", `${cy}px`);
      pin.style.setProperty("--hero-w", `${hr.width}px`); // << NUEVO
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(pin);
    ro.observe(hero);
    window.addEventListener("resize", measure, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);
  const [ghostOn, setGhostOn] = useState(false);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const { s, e } = TL.ghost;
    setGhostOn(v >= s && v <= e);
  });

  const TEXT_PX = 220; // texto + aire bajo cada imagen
  const BAR_VIEWPORT_MIN = 121; // %svh mínimo donde puede caer una barra
  const BAR_VIEWPORT_MAX = 276; // %svh máximo donde puede caer una barra
  const GHOST_TOP_SVH = 78; // las ghost words se quedan donde ya las querías
  const DOT_SHIFT_FACTOR = 0.7; // % del padding-bottom que convertimos a desplazamiento vertical en vh
  const DOT_Y_OFFSET_VH = 6; // desplaza todos los puntos hacia abajo en vh
  // BARRAS
  const BARS = [
    { topPct: 34, left: "22vw", width: "44vw", start: 0.18 },
    { topPct: 56, left: "18vw", width: "58vw", start: 0.32 },
    { topPct: 78, left: "24vw", width: "50vw", start: 0.48 },
  ];
  const BAR_COUNT = 3; // ← 3 barras
  const BAR_DELAY = [0.25, 0.35, 0.4]; // ← retraso por barra (en fracción 0..1 del scroll)
  const BAR_SPREAD = 0.22; // ← distancia vertical entre barras (0..1 de la sección)
  const BAR_OFFSET_ABOVE = 0.02; // ← ajuste fino: cae un poco por debajo del ancla
  const BAR_WIDTHS = ["42vw", "58vw", "50vw"]; // longitudes de cada barra
  const BAR_LEFTS = ["28vw", "20vw", "24vw"]; // desplazamiento horizontal

  // Rail: retardo de inicio y “hold” al final (no llega a 100% al llegar al final de sección)
  const RAIL = { startLag: 0.06, endHold: 0.12 };
  const RAIL_TIMING = { startLag: 0.06, endHold: 0.12 };
  const RAIL_COLORS_STOPS = [0.0, 0.35, 0.7, 1.0];
  const RAIL_COLORS = ["#FDE68A", "#F59E0B", "#EF4444", "#8B5CF6"]; // amarillo → naranja → rojo → violeta
  const { scrollY } = useScroll();

  // 2b) progreso personalizado: 0 cuando el bottom del viewport toca el top de la sección,
  // 1 cuando el bottom del viewport toca el BOTTOM REAL de la sección (incluye padding-bottom)
  const railBase = useTransform(scrollY, (y) => {
    const el = wrapRef.current;
    if (!el) return 0;

    const rect = el.getBoundingClientRect();
    const sectionTop = window.scrollY + rect.top;
    const sectionBottom = sectionTop + el.offsetHeight; // incluye padding-bottom
    const viewportBottom = y + window.innerHeight;

    const raw =
      (viewportBottom - sectionTop) / Math.max(1, sectionBottom - sectionTop);
    return Math.max(0, Math.min(1, raw)); // clamp
  });

  // 2c) lag/opciones (ajusta a tu gusto)
  const RAIL_LAG_START = 0.08; // empieza un pelín tarde
  const RAIL_LAG_END = 0.0; // si quieres que termine después de 1, súbelo p.ej. 0.05

  const railProgress = useTransform(railBase, (p) => {
    const t =
      (p - RAIL_LAG_START) /
      Math.max(0.0001, 1 - RAIL_LAG_START - RAIL_LAG_END);
    return Math.max(0, Math.min(1, t));
  });

  // color (tu acento fijo; si luego quieres gradiente, aquí lo cambias)
  const railColor = useTransform(railProgress, [0, 1], ["#f2ff00", "#f2ff00"]);
  // dentro del componente:
  const [layout, setLayout] = useState({ anchors: [], dotsOffsetVH: 0 });

  // p0: ancla base para la 1ª barra: usa la 1ª ancla real, y si no, un fallback
  const p0 = (layout.anchors[0] ?? 0.22) + BAR_OFFSET_ABOVE;

  // posiciones verticales (0..1) para las 3 barras
  const barPositions = Array.from({ length: BAR_COUNT }, (_, i) =>
    Math.min(0.98, p0 + i * BAR_SPREAD)
  );
  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const compute = () => {
      const vh = Math.max(1, window.innerHeight || 1);
      // asegúrate de que el es válido
      const scrollable = Math.max(1, el.scrollHeight - vh);

      // anclas por imagen (yOut + alto + texto) → normalizado 0..1
      const anchors = SIDE_IMGS.map((it) => {
        const downPx = Math.max(0, Number(it.yOut) || 0);
        const leafHpx = ((Number(it.h) || 32) / 100) * vh;
        const reach = downPx + leafHpx + TEXT_PX;
        return Math.min(0.98, Math.max(0, reach / scrollable));
      });

      // offset vertical adicional para overlays derivado del padding-bottom real
      const cs = getComputedStyle(el);
      const pbPx = parseFloat(cs.paddingBottom) || 0;
      const dotsOffsetVH = (pbPx / vh) * 100 * DOT_SHIFT_FACTOR;

      setLayout({ anchors, dotsOffsetVH });
    };

    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    window.addEventListener("resize", compute, { passive: true });

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", compute);
    };
  }, []);

  // B) Expone --pb-extra como CSS var (para que el rail respete tu padding-bottom)
  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const apply = () => {
      const pb = parseFloat(getComputedStyle(el).paddingBottom) || 0;
      el.style.setProperty("--pb-extra", `${pb}px`);
    };

    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    window.addEventListener("resize", apply, { passive: true });

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", apply);
    };
  }, []);

  return (
    <section ref={wrapRef} className="ab-wrap">
      <div ref={pinRef} className="ab-pin">
        {/* HERO centrado (por encima) */}
        <motion.div
          ref={heroRef}
          className="ab-hero"
          style={{ y: heroY, scale: heroScale }}
        >
          <div className="ab-heroShade" aria-hidden />
        </motion.div>

        <motion.div
          className="rq-wrap2" // <- wrapper neutro SOLO para la animación
        ></motion.div>

        {/* TÍTULO con blend */}
        <motion.h2 className="ab-title" style={{ opacity: titleOpacity }}>
          {t("about.title")}
        </motion.h2>

        {/* IMÁGENES LATERALES: nacen centradas DETRÁS y se abren */}
        <div className="ab-sides" aria-hidden>
          {SIDE_IMGS.map((it, i) => {
            const s = (it.start ?? 0.12) + i * 0.12; // empieza más tarde cada img
            const e = Math.min(1, s + (it.span ?? 0.35));

            const dir = it.side === "left" ? -1 : 1;
            const spread = it.spread ?? (it.side === "left" ? 34 : 36);

            const xShiftVW = useTransform(
              scrollYProgress,
              [s, e],
              [0, dir * spread]
            );
            const baseVW = it.x0VW ?? 0;

            const yRaw = useTransform(
              scrollYProgress,
              [0, 1],
              [`${it.yIn}px`, `${it.yOut}px`]
            );
            const opRaw = useTransform(
              scrollYProgress,
              [s - 0.05, s + 0.15],
              [0, 1]
            );
            const scRaw = useTransform(scrollYProgress, [s, e], [0.92, 1]);
            const blur = useTransform(scrollYProgress, [s, e], [8, 0]);
            const filter = useMotionTemplate`blur(${blur}px)`;

            // Suavizados
            // visibilidad solo dentro del tramo
            const vis = useTransform(
              scrollYProgress,
              [s - 0.02, s, 1],
              [0, 1, 1]
            );
            const y = seg(scrollYProgress, s, e, `${it.yIn}px`, `${it.yOut}px`);
            const scale = seg(scrollYProgress, s, e, 0.92, 1.0);
            const xvw = seg(
              scrollYProgress,
              s,
              e,
              0,
              (it.side === "left" ? -1 : 1) * (it.spread ?? 30)
            );
            const x = useMotionTemplate`calc(${it.x0VW ?? 0}vw + ${xvw}vw)`;

            // texto: entra un poco después del frame
            const cap = appear(scrollYProgress, e - 0.08, e + 0.05);
            const capY = seg(scrollYProgress, e - 0.08, e + 0.05, 12, 0);
            const opacity = useSpring(opRaw, {
              stiffness: 120,
              damping: 24,
              mass: 0.6,
            });

            // === CAPTION: aparece al final del tramo (cuando la imagen se asienta)
            const capOpacity = useTransform(
              scrollYProgress,
              [e - 0.04, e + 0.06],
              [0, 1]
            );
            const rich = (str) => ({
              __html: String(str || "").replace(
                /\[\[(.*?)\]\]/g,
                '<span class="accentZoom">$1</span>'
              ),
            });

            const BASE_SVH = 160; // recorrido base (ajústalo: 140–220 suele ir bien)

            return (
              <div key={i} className="ab-seed">
                <motion.figure
                  className={`ab-leaf ab-${it.side}`}
                  style={{ x, y, scale, opacity: vis, filter }}
                >
                  {/* IMAGEN */}
                  <div
                    className="ab-sideFrame"
                    style={{ "--leaf-w": `${it.w}vw`, "--leaf-h": `${it.h}vh` }}
                  >
                    <Image
                      src={it.src}
                      alt=""
                      fill
                      className="ab-sideImg"
                      sizes="(max-width:1024px) 60vw, 24vw"
                    />
                  </div>

                  {/* TEXTO DEBAJO (hermano del frame) */}
                  <motion.figcaption
                    className="ab-info"
                    style={{ opacity: capOpacity, y: capY }}
                  >
                    <h3 className="ab-infoTitle">
                      {t(`about.${it.infoKey}.title`)}
                    </h3>
                    <p
                      className="ab-infoTxt"
                      dangerouslySetInnerHTML={rich(
                        t(`about.${it.infoKey}.description`)
                      )}
                    />
                  </motion.figcaption>
                </motion.figure>
              </div>
            );
          })}
        </div>
        <div className="ab-sidesMobile">
          {SIDE_IMGS.map((it, i) => {
            const rich = (str) => ({
              __html: String(str || "").replace(
                /\[\[(.*?)\]\]/g,
                '<span class="accentZoom">$1</span>'
              ),
            });

            return (
              <figure key={`m-${i}`} className="ab-leafMobile">
                <div className="ab-sideFrameMobile">
                  <Image
                    src={it.src}
                    alt=""
                    fill
                    className="ab-sideImg"
                    sizes="(max-width:768px) 80vw, 40vw"
                  />
                </div>
                <figcaption className="ab-infoMobile">
                  <strong className="ab-infoMobileTitle">
                    {t(`about.${it.infoKey}.title`)}
                  </strong>
                  <p
                    className="ab-infoMobileTxt"
                    dangerouslySetInnerHTML={rich(
                      t(`about.${it.infoKey}.description`)
                    )}
                  />
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
      {/* === OVERLAYS LIGADOS AL SCROLL === */}
      <div className="ab-overlays">
        {/* (A) LÍNEA IZQUIERDA: bottom → top con lag/hold */}
        {(() => {
          // Arranca un poco tarde y no “clava” al 100% exactamente al final
          const LAG_START = 0.08;
          const END_HOLD = 0.08;

          // Progreso “con lag”, de 0→1, mapeado a top->bottom
          const railProg = useTransform(scrollYProgress, (v) => {
            const t = (v - LAG_START) / (1 - END_HOLD - LAG_START);
            return Math.max(0, Math.min(1, t));
          });

          // Cambio de color suave con tu acento
          const railColor = useTransform(
            railProg,
            [0, 1],
            ["#f2ff00", "#f2ff00"]
          ); // si quieres gradiente, cambia aquí

          return (
            <div className="ab-rail">
              <motion.span
                className="ab-railFill"
                style={{ scaleY: railProgress, backgroundColor: railColor }}
              />
            </div>
          );
        })()}

        {/*RAIL VERTICAL (IZQUIERDA) CON LAG*/}
        <div className="ab-rail">
          {(() => {
            // controla el timing del rail
            const RAIL = {
              startLag: 0.06, // empieza un poquito después del scroll
              endHold: 0.18, // NO alcanza el 100%; se queda al ~82%
            };
            // mapea el progreso con retardo y sin completar del todo
            const railFill = useTransform(
              scrollYProgress,
              [RAIL.startLag, 1], // tramo efectivo
              [0, 1 - RAIL.endHold] // 0% → ~82%
            );
            // mapeo 0..1 → progreso retrasado y con fin “hold”
            const railProgress = useTransform(scrollYProgress, (v) => {
              // desplaza el inicio
              const t = (v - RAIL.startLag) / (1 - RAIL.startLag);
              const clamped = Math.max(0, Math.min(1, t));
              // reduce el techo para no terminar al 100% al final
              return clamped * (1 - RAIL.endHold); // p.ej. 0.88 al final
            });
            return (
              <motion.span
                className="ab-railFill"
                style={{ scaleY: railProgress, transformOrigin: "top" }}
              />
            );
          })()}
        </div>

        {/* Barras horizontales (largas) con retrasos */}
        {(() => {
          // Edita estos 3 objetos a tu gusto (topVH = posición vertical en vh)
          const BARS = [
            {
              topVH: 28,
              left: "18vw",
              width: "56vw",
              start: 0.18,
              delay: 0.06,
              span: 0.12,
              color: "#f2ff00",
            },
            {
              topVH: 52,
              left: "22vw",
              width: "50vw",
              start: 0.34,
              delay: 0.1,
              span: 0.12,
              color: "#f2ff00",
            },
            {
              topVH: 78,
              left: "20vw",
              width: "60vw",
              start: 0.52,
              delay: 0.14,
              span: 0.16,
              color: "#f2ff00",
            },
          ];

          return BARS.map((b, i) => {
            const s = b.start + (b.delay ?? 0);
            const e = s + (b.span ?? 0.12);

            // visibilidad y crecimiento
            const vis = useTransform(
              scrollYProgress,
              [s - 0.02, s, e],
              [0, 1, 1]
            );
            const grow = useTransform(scrollYProgress, [s, e], [0, 1]);

            return (
              <motion.span
                key={`bar-${i}`}
                className="ab-bar"
                style={{
                  top: `${b.topVH}vh`,
                  left: b.left,
                  width: b.width,
                  opacity: vis,
                  scaleX: grow,
                  backgroundColor: b.color,
                }}
              />
            );
          });
        })()}

        {["DESIGN", "CODE", "MOTION", "UI MOTION"].map((word, i) => {
          const p = layout.anchors[i] ?? 0.25 + i * 0.18;
          const show = appear(scrollYProgress, p - 0.06, p + 0.02);
          const yPct = useTransform(
            scrollYProgress,
            [0, 1],
            [`${GHOST_TOP_SVH}%`, `${GHOST_TOP_SVH}%`]
          );
          return (
            <motion.div
              key={`ghost-${i}`}
              className="ghostWord"
              style={{ opacity: show, top: yPct }}
            >
              {word}
            </motion.div>
          );
        })}

        {/* (4) Ruler inferior que crece hacia la CTA/siguiente sección */}
        
      </div>
      <div className="ab-tail" style={{ height: bottomSpacePx }}></div>
    </section>
  );
}

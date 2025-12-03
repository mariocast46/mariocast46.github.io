"use client";
import { useRef, useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent, useMotionValue, useInView } from "framer-motion";
import s from "./style.module.css";
import { useT } from "../../app/providers/DictProvider";
import ShowcasePinned from "./ShowcasePinned";
import PixelImage from "../PixelImage";
import OverlayHud from "./OverlayHud";
import HudCaption from "./HudCaption";
import { useEffectEvent } from "react";
import { createPortal } from "react-dom";
import ReactiveParagraph from "../ReactiveParagraph";

const IMAGES = [
  { id: "w1", src: "/images/parallax/works/ClinicaNavarroViana-Works.webp",    ar: 2/3, url:"https://clinicanavarroviana.com"},
  { id: "w2", src: "/images/parallax/works/ClinicaNavarroViana-Works2.webp",   ar: 3/2, url:"https://clinicanavarroviana.com" },
  { id: "w3", src: "/images/parallax/works/FEDACV-Works.webp",                 ar: 16/9, url:"https://fedacv.com" },
  { id: "w4", src: "/images/parallax/works/FEDACV-WorksB&W.webp",                ar: 16/9, url:"https://fedacv.com" }, // -> objetivo
  { id: "w5", src: "/images/parallax/works/GGStudio-Works.webp",               ar: 2/3, url:"https://ggstudio.es" },
  { id: "w6", src: "/images/parallax/works/GGStudio-Works2.webp",              ar: 3/2, url:"https://ggstudio.es" },
  { id: "w7", src: "/images/parallax/works/EspaiMariameta-Works.webp",         ar: 4/3, url:"https://espaimariameta.com" },
  { id: "w8", src: "/images/parallax/works/SantiagoSevillano-16-9.webp",        ar: 16/9, url:"https://www.santiagosevillano.com" },
];

const SLIDES = [
  "/images/parallax/works/ClinicaNavarroViana-Works2.webp",
  "/images/parallax/works/GGStudio-Works.webp",
  "/images/parallax/works/EspaiMariameta-Works2.webp",
  "/images/parallax/works/FEDACV-Works.webp",
];

const ITEMS = [
  {
    bg: "/images/parallax/works/FEDACV-WorksB&W.webp", // la primera, la misma que quedó tras el zoom
    thumb: "/images/parallax/works/FEDACV-Works.webp",
    info: "FEDACV",
    year: "2025",
    url:"https://fedacv.com"
  },
  {
    bg: "/images/parallax/works/SantiagoSevillano-WorksB&W.webp",
    thumb: "/images/parallax/works/SantiagoSevillano-16-9.webp",
    info: "Santiago Sevillano",
    year: "2025",
    url:"https://www.santiagosevillano.com"
  },
  {
    bg: "/images/parallax/works/ClinicaNavarroViana-WorksB&W.webp",
    thumb: "/images/parallax/works/ClinicaNavarroViana-Works2-16-9.webp",
    info: "Navarro Viana",
    year: "2025",
    url:"https://clinicanavarroviana.com/"
  },
  {
    bg: "/images/parallax/works/EspaiMariameta-WorksB&W.webp",
    thumb: "/images/parallax/works/EspaiMariameta-Works2.webp",
    info: "Espai Mariameta",
    year: "2025",
    url:"https://espaimariameta.com/"
  },
  {
    bg: "/images/parallax/works/GGStudio-WorksB&W.webp",
    thumb: "/images/parallax/works/GGStudio-Works2-16-9.webp",
    info: "GG Studio",
    year: "2025",
    url:"https://ggstudio.es"
  },
];
const showcaseHeight = `calc(100svh + (${SLIDES.length} - 1) * 125svh)`;
const FEATURE_ID = "w4";
const PLATEAU_AT   = 0.74;  
const REVEAL_FROM  = 0.76; 
const REVEAL_TO    = 0.88;  
const MOUNT_NEXT   = 0.995; 

function Card({ img, i, attachRef, hiresOpacity }) {
  /*
  return (
    <div className={`${s.item} ${s[`w${i + 1}`]}`}>
      <div
        className={s.media}
        style={{ "--ar": img.ar }}
        data-id={img.id}
        ref={attachRef ?? null}>
        <PixelImage
          src={img.src}
          alt=""
          fill
          url
          sizes="(max-width:1024px) 100vw, 33vw"
          priority={img.id === FEATURE_ID}
          delay={250}
        />
        {img.id === FEATURE_ID && (
        <motion.div
          className={s.hiresWrap}
          style={{ opacity: hiresOpacity }}
          aria-hidden>
          <Image
            src={img.src}
            alt=""
            fill
            sizes="(max-width: 100000px) 120vw"
            priority
            quality={95}
            style={{
              willChange: "transform, opacity",
              transform: "translateZ(0)",
              backfaceVisibility: "hidden",
            }}
            fetchPriority="high"
            decoding="sync"
          />
        </motion.div>
        )}
      </div>
    </div>
  );*/
  const inner = (
    <div
      className={s.media}
      style={{ "--ar": img.ar }}
      data-id={img.id}
      ref={attachRef ?? null}
    >
      <PixelImage
        src={img.src}
        alt=""
        fill
        sizes="(max-width:1024px) 100vw, 33vw"
        priority={img.id === FEATURE_ID}
        delay={250}
      />

      {img.id === FEATURE_ID && (
        <motion.div className={s.hiresWrap} style={{ opacity: hiresOpacity }} aria-hidden>
          <Image
            src={img.src}
            alt=""
            fill
            sizes="(max-width: 100000px) 120vw"
            priority
            quality={95}
            style={{ willChange: "transform, opacity", transform: "translateZ(0)", backfaceVisibility: "hidden" }}
            fetchPriority="high"
            decoding="sync"
          />
        </motion.div>
      )}
    </div>
  );

  return (
    <div className={`${s.item} ${s[`w${i + 1}`]}`}>
      {/*{img.url ? (
        <a
          href={img.url}
          target="_blank"
          rel="noopener noreferrer"
          className={s.mediaLink}
          aria-label={`Abrir ${img.url}`}
        >
          {inner}
        </a>
      ) : (
        inner
      )}*/}
      {inner}
    </div>
  );
}

export default function SelectedWorks() {
  const t = useT();
  const [showShowcase, setShowShowcase]= useState(false);
  const travelRef = useRef(null);      // sección que gobierna el zoom (alto 260–320vh)
  const pinRef    = useRef(null);      // contenedor sticky (100vh)
  const stageRef  = useRef(null);      // wrapper que vamos a transformar (contiene el collage)
  const featureRef= useRef(null);      // miniatura w4
  const showcaseRef = useRef(null);
  const showcaseInView = useInView(showcaseRef, {
    amount: 0.01,       // con un 1% ya lo consideramos “en vista”
    margin: "0px",      // puedes afinar con márgenes si quieres
  });
  const { scrollYProgress } = useScroll({
    target: travelRef,
    offset: ["start start", "end start"], // 0→1 mientras “pasas” esta sección
  });
  const { scrollYProgress : showcaseProgress } = useScroll({
    target: showcaseRef,
    offset: ["start start", "end end"], // 0→1 mientras “pasas” esta sección
  });
  const [canHold, setCanHold] = useState(false);
  const [geom, setGeom] = useState({ vw: 0, vh: 0, x0: 0, y0: 0, S: 2 });

  const [split, setSplit] = useState(null);

  const itemBySlide = (i) => {
    const idx = i + 1;                               // offset: slide0 -> ITEMS[1]
    return ITEMS[Math.min(ITEMS.length - 1, Math.max(0, idx))];
  };

  const [hudSplit, setHudSplit] = useState(null); // {fromSrc,toSrc,cut} | null
  const [hudSrc, setHudSrc] = useState(ITEMS[0].thumb); // imagen central fuera de split
  const [hudBase, setHudBase] = useState(ITEMS[0].thumb); // <- la imagen "normal" del HUD
  const [splitState, setSplitState] = useState(null);
  const [hudData, setHudData] = useState(ITEMS[0]);
  // estados para visibilidad del HUD
  const [inZoomPlateau, setInZoomPlateau] = useState(false); // w4 fullscreen (plateau)
  const [inShowcase, setInShowcase] = useState(false);       // showcase en viewport
  const lastActiveRef = useRef(1)
  const [mode, setMode] = useState("zoom"); // 'zoom' | 'showcase'
  const lastIdxRef = useRef(0);             // índice actual consolidado (0..N-1)
  // split estable (latch + debounce)
  const isSplittingRef = useRef(false);
  const [isSplitting, setIsSplitting] = useState(false);
  const lastToggleTs = useRef(0);
  const [handoverArmed, setHandoverArmed] = useState(false);
  const [panelIdx, setPanelIdx] = useState(null);
  const panelOpen = panelIdx !== null;
  const panelSide = panelOpen ? (panelIdx % 2 === 0 ? "right" : "left") : "left";
  const spApi = useRef(null);

  const ENTER_MARGIN = 0.04;   // entra a split a partir de start+4%
  const EXIT_MARGIN  = 0.06;   // sale de split fuera de start-6% / end+6%
  const TOGGLE_DEBOUNCE_MS = 90; // ignora toggles muy seguidos
  // umbrales con histéresis para no parpadear en la frontera
  const ENTER_SHOWCASE = 0.80;  // cuando superes esto -> 'showcase'
  const EXIT_SHOWCASE  = 0.76;  // cuando bajes de esto -> 'zoom'
  const HUD01_START = 0.1;   // progreso del showcase al que empieza la transición del HUD (0..1)
  const HUD01_END   = 0.22;   // progreso del showcase al que termina la transición del HUD (0..1)
  const HUD01_EPS   = 0.001;  // umbral para consolidar al principio/fin
  const HUD01_CENTER = 0.50;   // centro del solape en el PRIMER tramo del showcase (0..1)
  const HUD01_WINDOW = 0.36;   // ancho del solape (0..1) → más alto = transición más larga
  const HUD01_SYNC   = 0.00;   // micro-desfase si el HUD va antes/después (±0.02 útil)
  const HUD_HYS      = 0.02;   // histéresis para consolidar el estado tras el solape
  const prevShowcase = useRef(0); // para saber dirección del scroll
  const prevShowV = useRef(0);
  const cutMV = useMotionValue(0);          // <- corte animado continuo (0..1)
  const splitInfoRef = useRef({ fromSrc: ITEMS[0].thumb, toSrc: ITEMS[1].thumb });
  const SEAM0_OFFSET = 0.80;
  const [showCaption, setShowCaption] = useState(false);
  const CAP_ON  = PLATEAU_AT - 0.02;
  const CAP_OFF = 0.02;

  const [spPanel, setSpPanel] = useState({ open: false, idx: null, side: "left" });
  useEffect(() => {
    const onSp = (e) => {
      const { open, idx, side } = e.detail || {};
      setSpPanel({ open: !!open, idx: idx ?? null, side: side || "left" });
    };
    window.addEventListener("sp:panelState", onSp);
    return () => window.removeEventListener("sp:panelState", onSp);
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (!showCaption && v >= CAP_ON) setShowCaption(true);
    if (showCaption && v <= CAP_OFF) setShowCaption(false);
  });
  
  // fija el modo según el progreso del tramo de zoom
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (mode === "zoom" && v > ENTER_SHOWCASE) setMode("showcase");
    if (mode === "showcase" && v < EXIT_SHOWCASE) setMode("zoom");
  });

  // NEW: estado del panel
const [panel, setPanel] = useState(null); // { idx, data } | null

// NEW: quién es el idx HUD actual para pasarlo al HUD
const currentHudIdx = Math.max(0, ITEMS.findIndex(x => x.thumb === hudBase));

// NEW: escuchar apertura/cierre del panel
useEffect(() => {
  const onToggle = (ev) => {
    const { idx, data } = ev.detail || {};
    // si clickas el mismo, alterna (abre/cierra); si es otro, cambia contenido
    setPanel(prev => (prev && prev.idx === idx ? null : { idx, data }));
  };
  window.addEventListener("hud:togglePanel", onToggle);
  return () => window.removeEventListener("hud:togglePanel", onToggle);
}, []);

  const enterV0Ref = useRef(0);

  useEffect(() => {
  if (!showcaseRef.current) return;
  const el = showcaseRef.current;

  const onScroll = () => {
    const top = el.getBoundingClientRect().top;
    // cuando pega arriba, fijamos el baseline del tramo 0↔1
    if (top <= 0) {
      // baseline del primer tramo: dónde estaba showcaseProgress en ese instante
      enterV0Ref.current = showcaseProgress.get();
    }
  };

  // primera pasada y listener
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
  }, [showcaseRef, showcaseProgress]);
  // cada vez que cambie de modo, consolida estado del HUD
  useEffect(() => {
    if (mode === "zoom") {
      // bloquea HUD en el item 0 (w4) y limpia transiciones
      setSplitState(null);
      setHudData(ITEMS[0]);
      if(!isSplittingRef.current){
      setHudBase(ITEMS[0].thumb);
      }
      lastIdxRef.current = 0;
    }
  // si entras a showcase, no hacemos nada aquí: esperas a señales del showcase
  }, [mode]);

    // 1) plateau del zoom (con histéresis para no parpadear)
  useMotionValueEvent(scrollYProgress, "change", (v) => {
  const s = scale.get();
  const filled = geom.S ? s >= geom.S * 0.999 : false;

  // márgenes de histéresis (ajusta a tu gusto)
  const ON  = PLATEAU_AT;        // p.ej. 0.74
  const OFF = PLATEAU_AT - 0.02; // apaga un poco antes al subir

  if (!inZoomPlateau && filled && v >= ON && v < MOUNT_NEXT) {
    setInZoomPlateau(true);
  }
  if (inZoomPlateau && (v < OFF || v >= MOUNT_NEXT)) {
    setInZoomPlateau(false);
  }
  });

  // 2) cuando el showcase entra/sale de vista
  useEffect(() => {
    setInShowcase(!!showcaseInView);
  }, [showcaseInView]);

  useEffect(() => {
  if (!inZoomPlateau && panelIdx === 0) setPanelIdx(null);
  }, [inZoomPlateau, panelIdx]);

  // mientras w4 está llenando (plateau), base = item 0
  const hudIdx = useMemo(() => {
    const i = ITEMS.findIndex(x => x.thumb === hudBase);
    return i >= 0 ? i : 0;
  }, [hudBase]);

  const w4Open = hudIdx === 0 && panelIdx === 0;         // visible solo en plateau
  const w4Side = "right";                                  // w4 es idx 0 → lado derecho

  // Si cambia la imagen central y no es w4, cierra el panel de w4
  useEffect(() => {
  if (hudIdx !== 0 && panelIdx === 0) setPanelIdx(null);
  }, [hudIdx, panelIdx]);

  // cuando w4 llena pantalla (zoom), mostramos el item 0
  useMotionValueEvent(showcaseProgress, "change", (v) => {
  const N = ITEMS.length - 1;
  if (N <= 0) return;
  const seg = 1 / N;
  const EPS = 1e-4;

  // --- FIX: clamp para no caer en el tramo inexistente al final
  const vClamped = Math.max(0, Math.min(1 - EPS, v));

  // === Dirección para simetría arriba/abajo
  const dir = vClamped > (prevShowcase.current ?? 0) ? "down"
            : vClamped < (prevShowcase.current ?? 0) ? "up"   : "none";
  prevShowcase.current = vClamped;

  // pareja activa k y progreso local genérico
  let k     = Math.max(0, Math.min(N - 1, Math.floor(vClamped / seg)));
  let local = (vClamped - k * seg) / seg; // 0..1 dentro del tramo

  // --- FIX: caso final explícito: bloquea en el último item
  if (v >= 1 - EPS) {
    const last = ITEMS[ITEMS.length - 1];
    setSplitState(null);
    if (hudBase !== last.thumb) setHudBase(last.thumb);
    if (hudData !== last)       setHudData(last);
    return;
  }

  const fromItem = ITEMS[k + 0];
  const toItem   = ITEMS[k + 1];
  if (!fromItem || !toItem) return;

  // ========== PAREJA ESPECIAL 0↔1: costura EXACTA del fondo ==========
  if (k === 0) {
    // seg = tamaño de tramo; la costura 0↔1 ocurre cuando v cruza seg
    // DIAL fino para mover el umbral: OFFSET0_FRAC (negativo = antes, positivo = después)
    const OFFSET0_FRAC = -0.0;        // p.ej. -0.05 o +0.05
    const THRESH = seg * (1 + OFFSET0_FRAC);
    // Histéresis pequeña para evitar rebotes (no exagerada)
    const HYS0 = 0.8;               // 1.5% del tramo
    setSplitState(null);               // entre 0↔1 queremos corte limpio, sin split
    if (v <= THRESH - HYS0) {
      if (hudBase !== fromItem.thumb) setHudBase(fromItem.thumb);
      if (hudData !== fromItem)       setHudData(fromItem);
      return;
    }
    if (v >= THRESH + HYS0) {
      if (hudBase !== toItem.thumb) setHudBase(toItem.thumb);
      if (hudData !== toItem)       setHudData(toItem);
      return;
    }
    // zona muerta: no tocar nada
    return;
  }
  // ========== RESTO DE PAREJAS: tu lógica actual con ventana ==========
  const CENTERS = [/* (1↔2) */ 0.50, /* (2↔3) */ 0.50, 0.50,0.50];
  const WINDOWS = [/* (1↔2) */ 0.34, /* (2↔3) */ 0.34,0.34,0.34];
  const SYNC    =  0.00;

  const center = Math.max(0, Math.min(1, (CENTERS[k - 1] ?? 0.50) + SYNC));
  const window = Math.max(0.02, Math.min(1, (WINDOWS[k - 1] ?? 0.34)));
  const start  = Math.max(0, center - window / 2);
  const end    = Math.min(1, center + window / 2);
  const HYS    = 0.9;

  const inside = local > start && local < end;

  if (inside) {
    let t = (local - start) / Math.max(1e-6, (end - start));
    t = t * t * (3 - 2 * t);
    if (dir === "up") t = 1 - t;

    setSplitState(prev => {
      if (prev &&
          prev.fromSrc === fromItem.thumb &&
          prev.toSrc   === toItem.thumb &&
          Math.abs(prev.cut - t) < 0.01) return prev;
      return { cut: t, dir, fromSrc: fromItem.thumb, toSrc: toItem.thumb };
    });
  } else {
    if (local <= start - HYS) {
      if (splitState) setSplitState(null);
      if (hudBase !== fromItem.thumb) setHudBase(fromItem.thumb);
      if (hudData !== fromItem)       setHudData(fromItem);
    } else if (local >= end + HYS) {
      if (splitState) setSplitState(null);
      if (hudBase !== toItem.thumb) setHudBase(toItem.thumb);
      if (hudData !== toItem)       setHudData(toItem);
    }
  }
  });
  // callback de slide ACTIVO (usar índice tal cual)
  const handleActiveChange = (i) => {
  // mientras el handover está armado NO permitas que el HUD cambie a 1 por “centro”
  if (handoverArmed) return;

  if (i < 0 || i >= ITEMS.length) return;
  setHudData(ITEMS[i]);
};

  // split = { from, to, cut } con índices del showcase (0..slides-1)
  // callback de split (i -> i+1 o i <- i-1)
  const handleSplitChange = (s) => {
  if (mode !== "showcase") return;       // fuera de showcase no hay split

  if (!s) { setSplitState(null); return; }

  // traducir índices del showcase (slice(1)) a ITEMS
  const from = s.from + 1;
  const to   = s.to + 1;
  if (!ITEMS[from] || !ITEMS[to]) { setSplitState(null); return; }

  setSplitState({
    cut: s.cut, dir: s.dir,
    fromSrc: ITEMS[from].thumb,
    toSrc:   ITEMS[to].thumb,
  });
  };

  useEffect(() => {
  if (!splitState) return;

  const { cut, dir, toSrc } = splitState;

  // Al bajar: consolidamos cuando el corte llega al final (≈1)
  // Al subir : consolidamos cuando el corte vuelve al inicio (≈0)
  const doneDown = dir === "down" && cut >= 0.999;
  const doneUp   = dir === "up"   && cut <= 0.001;

  if (doneDown || doneUp) {
    if(!isSplittingRef.current){
    setHudBase(toSrc);                  // imagen base del HUD
    }
    const nextIdx = ITEMS.findIndex(x => x.thumb === toSrc);
    if (nextIdx !== -1) {
      setHudData(ITEMS[nextIdx]);       // metadatos sincronizados
      lastIdxRef.current = nextIdx;
    }
    setSplitState(null);                 // limpiamos el split
  }
  }, [splitState]);
  
  // Monta el showcase al finalizar el tramo del zoom (~98% del progreso)
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (v >= 0.985 && !showShowcase) setShowShowcase(true);
    if (v < 0.90 && showShowcase) setShowShowcase(false); // por si el usuario hace scroll hacia arriba
  });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const done = v >= 0.995;
    if (done !== canHold) setCanHold(done);
  });

  const [hudFromZoom, setHudFromZoom] = useState(false);
  const [hudFromShowcase, setHudFromShowcase] = useState(false);
  const [hudIndex, setHudIndex] = useState(0);     
  const [hudPortalEl, setHudPortalEl] = useState(null);

  // 2) listener que hace el scroll fino al centro del fondo pedido
  useEffect(() => {
  const handler = (ev) => {
    const idx = Math.max(0, Math.min(ITEMS.length - 1, ev.detail?.idx ?? 0));

    // 0 => plateau del zoom (w4 fullscreen)
    if (idx === 0) {
      if (!travelRef.current) return;
      const tr = travelRef.current.getBoundingClientRect();
      const topAbs = window.scrollY + tr.top;
      const target = topAbs + tr.height * (PLATEAU_AT || 0.74);
      window.scrollTo({ top: target, behavior: "smooth" });
      return;
    }

    // idx >= 1 => dentro del showcase (que es ITEMS.slice(1))
    if (!showcaseRef.current) return;
    const k = idx - 1;                   // índice dentro de slice(1)
    const slides = ITEMS.length - 1;     // nº de fondos del showcase
    const denom  = Math.max(1, slides - 1);
    const vv     = k / denom;            // 0..1 al centro del fondo k

    const el = showcaseRef.current;
    const r  = el.getBoundingClientRect();
    const topAbs = window.scrollY + r.top;

    const scrollRange = Math.max(0, el.clientHeight - window.innerHeight);
    const target = topAbs + vv * scrollRange;

    window.scrollTo({ top: target, behavior: "smooth" });
  };

  window.addEventListener("hud:jumpToSlide", handler);
  return () => window.removeEventListener("hud:jumpToSlide", handler);
}, [showcaseRef, travelRef]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const s = scale.get();
    const filled = geom.S ? s >= geom.S * 0.999 : false;
    setHudFromZoom(filled && v >= PLATEAU_AT && v < MOUNT_NEXT);
  });
  useEffect(() => {
    setHudFromShowcase(!!showcaseInView);
  }, [showcaseInView]);

  useEffect(() => {
    setInShowcase(!!showcaseInView);
  }, [showcaseInView]);
  // Trigger para forzar recalculo cuando cambian las medidas
  const geomTrigger = useMotionValue(0);
  // Cada vez que recalculamos medidas, actualizamos el trigger
  useEffect(() => {
    const key = geom.vw + geom.vh + geom.x0 + geom.y0 + geom.S;
    geomTrigger.set(key);                   // <- fuerza re-evaluación de useTransform
  }, [geom, geomTrigger]);
  // Medidas para centrar w4
  useEffect(() => {
  if (!pinRef.current || !stageRef.current || !featureRef.current) return;

  const pin   = pinRef.current;
  const stage = stageRef.current;
  const feat  = featureRef.current;
  const ro = new ResizeObserver(() => doMeasure());

  ro.observe(pin);
  ro.observe(stage);
  ro.observe(feat);
  const onLoad = () => doMeasure();
  window.addEventListener("load", onLoad, { passive: true });

  // 1º tick tras hidratar
  requestAnimationFrame(() => doMeasure());
  function doMeasure(){
    const vw = pin.clientWidth;
    const vh = pin.clientHeight;
    const sr = stage.getBoundingClientRect();
    const fr = feat.getBoundingClientRect();
    if (!vw || !vh || !fr.width || !fr.height) return;
    const x0 = (fr.left - sr.left) + fr.width  / 2;
    const y0 = (fr.top  - sr.top ) + fr.height / 2;
    const S  = Math.max(vw / fr.width, vh / fr.height); // cover
    setGeom({ vw, vh, x0, y0, S });
  }
  return () => {
    ro.disconnect();
    window.removeEventListener("load", onLoad);
  };
  }, []);
  // --- TIMING PROFESIONAL ---
  const p = scrollYProgress;
  const scaleRaw = useTransform(p, [0, 0.12, 0.78, 1], [1, 1, geom.S * 1.02, geom.S]);
  const scale = useSpring(scaleRaw, { stiffness: 120, damping: 20, mass: 0.3, /* clamp:false */});
  const k = useTransform(p, [0, 0.16, 0.28, 1], [0, 0, 1, 1]);

  const tx = useTransform([scale, k, geomTrigger], ([s, kk]) => {
    if (!geom.vw || !geom.vh || !geom.x0 || !geom.y0) return 0;
    return ((geom.vw / 2) - (s * geom.x0)) * kk;
  });
  const ty = useTransform([scale, k, geomTrigger], ([s, kk]) => {
    if (!geom.vw || !geom.vh || !geom.x0 || !geom.y0) return 0;
    return ((geom.vh / 2) - (s * geom.y0)) * kk;
  });

  const hiresOpacity = useTransform(scale, [1.06, 1.25], [0, 1]);
  const hudY       = useTransform(p, [0.76, 0.88], [24, 0]);   // leve subida
  const hudLeftX   = useTransform(p, [0.76, 0.88], [-30, 0]);  // INFO desde izq
  const hudRightX  = useTransform(p, [0.76, 0.88], [ 30, 0]);  // AÑO desde dcha

  useMotionValueEvent(scrollYProgress, "change", (v) => {
  if (v >= MOUNT_NEXT && !showShowcase) setShowShowcase(true);
  if (v < 0.90 && showShowcase) setShowShowcase(false);
  });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
  // cuando te acercas al final del zoom, arma el handover
  if (v >= MOUNT_NEXT - 0.01 && !handoverArmed) setHandoverArmed(true);

  // si el usuario se va para arriba antes de entrar al showcase, lo desarmas
  if (v < PLATEAU_AT && handoverArmed) setHandoverArmed(false);
  });
  useEffect(() => {
  if (!handoverArmed || !showcaseRef.current) return;

  const el = showcaseRef.current;
  const onScroll = () => {
    const top = el.getBoundingClientRect().top;
    // momento exacto en que el showcase “engancha” (sticky)
    if (top <= 0) {
      // Fijamos la imagen central en el item 1, sin split
      setSplitState(null);
      setHudData(ITEMS[1]);
      setHudBase(ITEMS[1].thumb);
      setHandoverArmed(false); // ¡hecho!
      // Opcional: bloquear breve tiempo para evitar rebotes al subir/bajar
    }
  };
  // disparo inicial (por si ya está pegado al montar el efecto)
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
  }, [handoverArmed, showcaseRef, ITEMS]);

  const hudIndexRef = useRef(0); 
  useEffect(() => {
    const i = ITEMS.findIndex(x => x.thumb === hudBase);
    hudIndexRef.current = i >= 0 ? i : 0;
  }, [hudBase]);

  useEffect(() => {
   if (hudFromZoom) {
      setHudIndex(0);
      setHudData(ITEMS[0]);
   }
  }, [hudFromZoom]);
  useEffect(() => {
  if (!inShowcase) {
    if (!isSplittingRef.current) {
      setHudBase(ITEMS[0].thumb);
    }
    setSplitState(null);
  }
  }, [inShowcase]);

  // mientras w4 está llenando (plateau), base = item 0
  useEffect(() => {
    if (inZoomPlateau) {
      if(!isSplittingRef.current){
        setHudBase(ITEMS[0].thumb);
      }
      setSplitState(null);
    }
  }, [inZoomPlateau]);
  
  const openDetailsForCurrentHud = () => {
  const idx = hudIdx; // 0..N-1

  // 1) centra el fondo correcto
  try { window.dispatchEvent(new CustomEvent("hud:jumpToSlide", { detail: { idx } })); } catch {}

  // 2) toggle panel
  if (idx === 0) {
    // w4: panel especial (el tuyo propio)
    setPanelIdx(prev => (prev === 0 ? null : 0));
  } else {
    // dentro del showcase
    setTimeout(() => { spApi.current?.toggleByGlobalIdx(idx); }, 30);
    // si estaba abierto el especial de w4, ciérralo
    setPanelIdx(prev => (prev === 0 ? null : prev));
  }
  };

  /*const hudPanelOpen = (panelIdx === 0) ? true : spPanel.open;
  const hudPanelSide = (panelIdx === 0) ? ((0 % 2 === 0) ? "right" : "left"): spPanel.side;*/
  const hudPanelOpen = (hudIdx === 0) ? w4Open : !!spPanel.open;
  const hudPanelSide = (hudIdx === 0) ? w4Side : (spPanel.side || "left");
  // cierra panel w4 al cambiar de imagen central
  useEffect(() => { setPanelIdx(null); }, [hudBase]);

  const hudOpacity = useTransform(scrollYProgress, [0.70, 0.75], [0, 1]);
  const showHud = inZoomPlateau || inShowcase;
  const hudMeta = useMemo(() => ITEMS[hudIdx] ?? {}, [hudIdx]);
  
  
  function rich(str = "") {
  const html = String(str).replace(
    /\[\[(.+?)\]\]/g,
    '<span class="accentZoom">$1</span>'
  );
  return { __html: html };
  }

  return (
    <section className={s.wrap}>
    {/* ===== 1) ZOOM (pinned) ===== */}
    <section ref={travelRef} className={s.travel}>
      <div ref={pinRef} className={s.pin}>
        <motion.div ref={stageRef} className={s.stage} style={{ x: tx, y: ty, scale }}>
          <h1 className={s.gridTitle}>{t("works.title")}</h1>
          <div className={s.grid}>
            {IMAGES.map((img, i) => (
              <Card
                key={img.id}
                img={img}
                i={i}
                attachRef={img.id === FEATURE_ID ? featureRef : undefined}
                hiresOpacity={hiresOpacity}
              />
            ))}
          </div>
        </motion.div>
        {inZoomPlateau && (
          <div className={s.zoomCap}>
            <span className={s.zoomCapL}>{ITEMS[0].info}</span>
            <span className={s.zoomCapR}>{ITEMS[0].year}</span>
          </div>
        )}
        {inZoomPlateau && hudIdx === 0 && panelIdx === 0 && (
        <aside className={`${s.w4SidePanel} ${s.open}`} role="dialog" aria-modal="true">
          <button
            className={s.w4Close}
            onClick={() => setPanelIdx(null)}
            aria-label="Close"
            type="button"
          >
            ×
          </button>

          <div className={s.w4InnerCentered}>
            <h3 className={s.w4Title}>{t("works.work1.h3")}</h3>

            <p className={s.w4P} dangerouslySetInnerHTML={rich(t("works.work1.paragraph1"))} />
            <p className={s.w4P} dangerouslySetInnerHTML={rich(t("works.work1.paragraph2"))} />
            <p className={s.w4P} dangerouslySetInnerHTML={rich(t("works.work1.paragraph3"))} />

            <ReactiveParagraph
              baseText={t("works.work1.collab1")}
              altText={t("works.work1.collab2")}
              className={s.w4P}
              diameter={200}
            />

            {ITEMS[0].url && (
              <a className={s.w4Link} href={ITEMS[0].url} target="_blank" rel="noopener noreferrer">
                {t("works.site")}
              </a>
            )}
          </div>
        </aside>
      )}
      </div>
    </section>
    {/* ===== 2) HUD FIJO (no pertenece al pinned): no interfiere con scroll ===== */}
    <OverlayHud
      show={showHud}
      baseSrc={hudBase}
      isSplitting={isSplitting}
      fromSrc={splitInfoRef.current.fromSrc}
      toSrc={splitInfoRef.current.toSrc}
      cutMV={cutMV}
      href={hudMeta?.url || null}
      onDetailsClick={openDetailsForCurrentHud}
      hudIdx={hudIdx}
      panelOpen={hudPanelOpen}
      panelSide= {hudPanelSide}
      hudMeta={hudMeta}
      ctaOffLabel={t("works.detailsoff")}
      /*label={t("works.details")}*/
    />
    <HudCaption
      show={showCaption}
      left={inShowcase ? hudData?.info : ITEMS[0].info}
      right={inShowcase ? hudData?.year : ITEMS[0].year}
    />
    {/* ===== 3) SHOWCASE SIEMPRE MONTADO (sin wrappers con opacity) ===== */}
    <div ref={showcaseRef}>
    <ShowcasePinned
      apiRef={spApi}
      slides={ITEMS.slice(1).map(it => it.bg)}
      itemsMeta={ITEMS.slice(1).map((it, idx) => ({ info: it.info, title: t(`works.work${idx + 2}.h3`), year: it.year, url: it.url, 
      p1: t(`works.work${idx + 2}.paragraph1`), p2: t(`works.work${idx + 2}.paragraph2`), p3: t(`works.work${idx + 2}.paragraph3`),
        c1: t(`works.work${idx + 2}.collab1`), c2: t(`works.work${idx + 2}.collab2`), }))}
      overlapCenter={0.70}
      overlapWindow={0.55}
      syncOffset={0.00}             // ajuste global fino
      pairOffsets={[  // uno por tramo del showcase: (1↔2), (2↔3), (3↔4)...
        +0.00,  // 1↔2 (te va bien → 0)
        -0.02,  // 2↔3 (se adelanta → restamos)
        +0.00   // 3↔4 (si lo hay)
      ]}
       // micro-ajuste si lo quisieras ±0.01
      onActiveChange={(i) => {
        const real = i + 1;              // por el slice(1)
        if (ITEMS[real]){
          setHudData(ITEMS[real]); 
          if(!isSplittingRef.current){
          setHudBase(ITEMS[real].thumb);             // base del HUD = visible      
          }
        }
      }}
      onSplitChange={(s) => {
        if (!s) { setSplitState(null); return; }
        const fromItem = ITEMS[s.from + 1];
        const toItem   = ITEMS[s.to   + 1];
        if (!fromItem || !toItem) { setSplitState(null); return; }
        setSplitState({
          cut: s.cut, dir: s.dir,
          fromSrc: fromItem.thumb, toSrc: toItem.thumb,
        });
      }}
      onSeamCross={({ i, dir }) => {
      // i es la pareja i↔i+1 dentro de slides.slice(1)
      // Para la costura 0↔1 del HUD, i === 0
      if (i === 0) return; 
        // Armamos un “umbral” desplazado: costura ± offset
        const seg = 1 / (ITEMS.length - 1);       // tamaño de un tramo
        const target = i + (dir === "down" ? SEAM0_OFFSET : -SEAM0_OFFSET); // en unidades de tramo
        const check = () => {
        const p = showcaseProgress.get() * (ITEMS.length - 1);
        if ((dir === "down" && p >= target) || (dir === "up" && p <= target)) {
          setSplitState(null);
          if (dir === "down") { setHudBase(ITEMS[1].thumb); setHudData(ITEMS[1]); }
          else { setHudBase(ITEMS[0].thumb); setHudData(ITEMS[0]); }
          window.removeEventListener("scroll", check, { passive: true });
        }
      };
      // comprobación inmediata + escuchar un instante el scroll
      check();
      window.addEventListener("scroll", check, { passive: true });
      }}
      onPanelChange={({ open, idxGlobal }) => {
        // refleja el estado del showcase en el HUD
        if (open) setPanelIdx(idxGlobal); else setPanelIdx(prev => (prev === 0 ? prev : null));
      }}
    />
    {/* Para w4 (idx=0) pintamos un panel propio acoplado a pantalla (w4 está fullscreen). */}
      {/* ===== 2.5) PANEL DENTRO DE LA IMAGEN DE W4 (centrado 560×340) ===== */}
    {inZoomPlateau && hudIdx === 0 && panelIdx === 0 && (
    <div className={`${s.spPanel} ${s.alignRight} ${s.open}`}>
    <button
      className={s.spClose}
      onClick={() => { setPanelOpen(false); setPanelIdx(null); }}
      aria-label="Close"
    >
      ×
    </button>

    <div className={s.spInnerCentered}>
      <h3 className={s.spTitle}>{t("works.work1.h3")}</h3>

      {/* párrafos */}
      <p className={s.spP} dangerouslySetInnerHTML={rich(t("works.work1.paragraph1"))} />
      <p className={s.spP} dangerouslySetInnerHTML={rich(t("works.work1.paragraph2"))} />
      <p className={s.spP} dangerouslySetInnerHTML={rich(t("works.work1.paragraph3"))} />

      <ReactiveParagraph
        baseText={t("works.work1.collab1")}
        altText={t("works.work1.collab2")}
        className={s.spP}
        diameter={200}
      />
      
      {ITEMS[0].url && (
        <a className={s.spLink} href={ITEMS[0].url} target="_blank" rel="noopener noreferrer">
          {t("works.site")}
        </a>
      )}
      </div>
      </div>
    )}    
    </div>
    </section>
  );
}
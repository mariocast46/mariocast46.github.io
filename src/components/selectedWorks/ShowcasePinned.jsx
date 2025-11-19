// ShowcasePinned.jsx
"use client";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import s from "./showcase.module.css";
import { useT } from "../../app/providers/DictProvider";
import ReactiveParagraph from "../ReactiveParagraph";

export default function ShowcasePinned({
  slides,
  itemsMeta = [],
  onActiveChange,
  onSplitChange,
  onSeamCross,
  overlapCenter = 0.50,
  overlapWindow = 0.36,
  syncOffset = 0.00,
  pairOffsets = [],
  apiRef,     
  onPanelChange        
}) {
  const ref = useRef(null);
  const t = useT();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const total = Math.max(1, slides.length);
  const K = Math.max(1, total - 1);

  const [activeIdx, setActiveIdx] = useState(0);
  const [panelIdx, setPanelIdx]   = useState(null);   // índice de slide (0..slides-1) o null
  const [panelOpen, setPanelOpen] = useState(false);  // abierto/cerrado
  const panelIdxRef = useRef(null);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const p = v * K;
    let idx = Math.round(p);
    idx = Math.max(0, Math.min(K, idx));
    onActiveChange?.(idx);
    setActiveIdx(idx);
  });

  const prevP = useRef(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (K <= 0) { onSplitChange?.(null); return; }
    const p = v * K;
    const dir = p > prevP.current ? "down" : p < prevP.current ? "up" : "none";
    prevP.current = p;

    let base = Math.floor(p);
    base = Math.max(0, Math.min(K - 1, base));
    let local = p - base;

    const offPair = pairOffsets[base] ?? 0;
    const center  = Math.max(0, Math.min(1, overlapCenter + syncOffset + offPair));
    const start   = Math.max(0, Math.min(1, center - overlapWindow / 2));
    const end     = Math.max(0, Math.min(1, center + overlapWindow / 2));

    if (local <= start || local >= end) { onSplitChange?.(null); return; }

    let t = (local - start) / Math.max(1e-6, (end - start));
    t = t * t * (3 - 2 * t);
    if (dir === "up") t = 1 - t;

    onSplitChange?.({ from: base, to: base + 1, cut: t, dir });
  });

  useEffect(() => {
  const open = panelOpen;
  const idxGlobal = panelIdx != null ? panelIdx + 1 : null; // recuerda: showcase es ITEMS.slice(1)
  const side = (panelIdx != null ? ((panelIdx + 1) % 2 === 0 ? "right" : "left") : "left");

  // callback al padre
  onPanelChange?.({ open, idxGlobal, side });

  // y evento global (si quieres que el HUD lo escuche también)
  try {
    window.dispatchEvent(new CustomEvent("sp:panelState", { detail: { open, idx: idxGlobal, side } }));
  } catch {}
  }, [panelOpen, panelIdx]);
  
  useEffect(() => {
  if (!apiRef) return;
  apiRef.current = {
    toggleByGlobalIdx(idx) {
      if (idx <= 0) return;        // w4 no vive aquí (Showcase es ITEMS.slice(1))
      const k = idx - 1;           // índice local del showcase (0..slides-1)
      setPanelIdx(prev => (prev === k ? null : k));

      // usa setter funcional para calcular el "next" real
      setPanelOpen(prevOpen => {
        const next = (panelIdxRef.current === k ? !prevOpen : true);
        panelIdxRef.current = k;

        // lado del panel (pares → right, impares → left)
        const side = ((k + 1) % 2 === 0) ? "right" : "left";

        // avisa al exterior (SelectedWorks) y a quien escuche el evento
        try {
          window.dispatchEvent(new CustomEvent("sp:panelState", {
            detail: { open: next, idx: k + 1, side } // idx global (ITEMS)
          }));
        } catch {}

        onPanelChange?.({ open: next, idxGlobal: next ? idx : null });

        return next;
      });
    },
    close() {
      setPanelOpen(false);
      setPanelIdx(null);
      panelIdxRef.current = null;
      try {
        window.dispatchEvent(new CustomEvent("sp:panelState", {
          detail: { open: false, idx: null, side: "left" }
        }));
      } catch {}
      onPanelChange?.({ open: false, idxGlobal: null });
    }
  };
  return () => { apiRef.current = null; };
}, [apiRef, onPanelChange]);

  useEffect(() => {
  if (panelIdx == null) return;
  if (activeIdx !== panelIdx) setPanelOpen(false);
}, [activeIdx, panelIdx]);

 useEffect(() => {
   window.dispatchEvent(new CustomEvent("sp:panelState", {
     detail: {
       open: panelOpen,
       idx: panelOpen && panelIdx != null ? (panelIdx + 1) : null, // global
       side: panelOpen && panelIdx != null
         ? (((panelIdx + 1) % 2 === 0) ? "right" : "left")
         : "left"
     }
   }));
 }, [panelOpen, panelIdx]);

  function rich(str = "") {
  const html = String(str).replace(
    /\[\[(.+?)\]\]/g,
    '<span class="accentZoom">$1</span>'
  );
  return { __html: html };
  }

  return (
    <section ref={ref} className={s.shcWrap} style={{ "--n": total }}>
      <div className={s.shcPin}>
        {slides.map((src, i) => {
  const y = useTransform(scrollYProgress, (vv) =>
    `calc(${i * 100}% - ${vv * (total - 1) * 100}%)`
  );
  const meta = itemsMeta[i] || {};
  const showPanelHere = panelOpen && panelIdx === i && itemsMeta[i];

  return (
    <motion.div key={src + i} className={s.shcBg} style={{ y }}>
      {/* Fondo + caption */}
      <div className={s.shcFrame}>
        <Image src={src} alt="" fill sizes="140vw" quality={98} priority={i===0} />
        <div className={s.shcCap} aria-hidden>
          <span className={s.shcCapL}>{meta.info ?? ""}</span>
          <span className={s.shcCapR}>{meta.year ?? ""}</span>
        </div>
      </div>

      {/* 👇 Panel como HERMANO, no hijo, para evitar quedar debajo del <Image /> */}
      {showPanelHere && (
  <div className={`${s.spPanel} ${((i + 1) % 2 === 0) ? s.right : s.left} ${s.open}`}>

    <div className={s.spInnerCentered}>
      <h3 className={s.spTitle}>{itemsMeta[i].title || itemsMeta[i].info}</h3>

      {/* p1, p1b opcional, p2, p3 */}
      {itemsMeta[i].p1  && <p className={s.spP} dangerouslySetInnerHTML={rich(itemsMeta[i].p1)} />}
      {itemsMeta[i].p2  && <p className={s.spP} dangerouslySetInnerHTML={rich(itemsMeta[i].p2)} />}
      {itemsMeta[i].p3  && <p className={s.spP} dangerouslySetInnerHTML={rich(itemsMeta[i].p3)} />}

      <ReactiveParagraph
                          baseText={itemsMeta[i].c1}
                          altText={itemsMeta[i].c2}
                          className={s.spP}
                          diameter={200}
                        />

      {itemsMeta[i].url && (
        <a className={s.spLink} href={itemsMeta[i].url} target="_blank" rel="noopener noreferrer">
          {t("works.site")}
        </a>
      )}
    </div>
  </div>
)}
    </motion.div>
  );
})}
      </div>
    </section>
  );
}

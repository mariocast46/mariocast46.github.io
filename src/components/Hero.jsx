"use client";
import { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image"; 
import PixelImage from "../components/PixelImage";
import ContactDistance from "./ContactDistance";
import { motion, AnimatePresence, useScroll as useFmScroll, useTransform, useAnimation } from "framer-motion";
import { runScrambleOnce } from "../lib/scrambleText";
import useAppReady from "../lib/useAppReady";
import { useT } from "../app/providers/DictProvider";
import { useLang } from "../app/providers/DictProvider";
import MosaicOverlay from "./MosaicOverlay";
import ReactiveQuote from "./ReactiveQuote";
import useIsMobile from "../lib/useIsMovil";

const SHIFT_2 = 61; 
const SHIFT_3 = 153; 

function highlightChar(text, target) {
  if (!text || !target) return text;
  const idx = text.toLowerCase().indexOf(target.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span className="svc-accent">{text[idx]}</span>
      {text.slice(idx + 1)}
    </>
  );
}
const GALLERY = [
  "/images/gallery/ClinicaNavarroViana-16-9.webp",
  "/images/gallery/EspaiMariameta2-16-9.webp",
  "/images/gallery/FEDACV2-16-9.webp",
  "/images/gallery/ClinicaNavarroViana2-16-9.webp",
  "/images/gallery/GGStudio-16-9.webp",
  "/images/gallery/FEDACV-16-9.webp",
  "/images/gallery/ClinicaNavarroViana3-16-9.webp",
  "/images/gallery/GGStudio2-16-9.webp",
  "/images/gallery/EspaiMariameta3-16-9.webp",
  "/images/gallery/GGStudio3-16-9.webp",
];

export default function Hero() {
  // 1) contextos/refs básicos SIEMPRE primero
  const t    = useT();
  const lang = useLang();
  const ref  = useRef(null);

  // 2) estados/refs que usarás después (mantén este orden siempre)
  const [idx, setIdx]   = useState(0);        // <- estado galería SIEMPRE aquí
  const lockRef         = useRef(false);      // <- ref de bloqueo
  const appReady        = useAppReady();      // <- custom hook (no condicional)
  const qCtrl           = useAnimation();     // <- framer
  const isMobile = useIsMobile(768);

  // 3) scroll y derivados (hooks de framer sin condicionar)
  const { scrollYProgress } = useFmScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // 4) TODOS los useTransform que uses, en el mismo orden siempre
  // --- SIEMPRE crear MotionValues (nunca condicionales)
  const showMV   = useTransform(scrollYProgress, [0.25, 0.30, 0.80, 0.90], [0, 1, 1, 0]);
  const clipMV   = useTransform(showMV, v => `inset(${(1 - v) * 100}% 0% 0% 0%)`);
  const s2xMV    = useTransform(scrollYProgress, [0.10, 0.20], [0, SHIFT_2]);
  const s3xMV    = useTransform(scrollYProgress, [0.20, 0.30], [0, SHIFT_3]);
  const cityYMV  = useTransform(scrollYProgress, [0.10, 0.70], [450, 39]);
  const cityOpMV = useTransform(scrollYProgress, [0.10, 0.70], [0, 1]);
  const quoteOpMV= useTransform(scrollYProgress, [0.50, 0.55], [0, 1]);
  const quoteYMV = useTransform(scrollYProgress, [0.50, 0.55], [8, 0]);
  const openMV   = useTransform(scrollYProgress, [0.20, 0.25], [0, 1]);
  const mosaicOpacityMV = useTransform(scrollYProgress, [0.30, 0.40], [0, 1]);
  const mosaicXMV       = useTransform(scrollYProgress, [0.40, 0.65], [0, -679]);

const LETTERS = lang === "es"
  ? ["W", "N", "A"]
  : ["D", "I", "W"];

  const wrap = {
  hidden: { opacity: 0, y: 18 },
  show:   { opacity: 1, y: 0, transition:{ duration:0.25, ease:[0.22,1,0.36,1], staggerChildren:.04 } }
  };
  const item = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 2, ease: [0.2,0.8,0.2,1] } },
  };
  const maskIn = {
  hidden: { clipPath: "inset(0 0 100% 0 round 0px)", opacity: 1 },
  show:   { clipPath: "inset(0 0 0% 0 round 0px)",  opacity: 1, transition: { duration: 2, ease: [0.2,0.8,0.2,1] } },
  };
  const quoteMask = {
  hidden: { clipPath: "inset(0 0 100% 0)", opacity: 1, y: 8 },
  show:   { clipPath: "inset(0 0   0% 0)", opacity: 1, y: 0,
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
  };

  // Desplazamientos del 2º y 3º servicio (el 1º se queda)
  const roleFx = {
    hidden: { opacity: 0, y: 10 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.22,1,0.36,1], delay: 0.12 } }
  };

  const gallery = GALLERY;

  // arriba del componente
  // 6) handlers (NO hooks aquí dentro)
  const DUR = 650;
  const nextImg = () => {
    if (lockRef.current) return;
    lockRef.current = true;
    setIdx(i => (i + 1) % gallery.length);
    setTimeout(() => { lockRef.current = false; }, DUR);
  };
  const imgVariants = {
    enter: { opacity: 0, clipPath: "inset(0 0 100% 0)" },
    center:{ opacity: 1, clipPath: "inset(0 0 0% 0)", transition:{ duration: .001, ease:[.22,1,.36,1] }},
    exit:  { opacity: 0, clipPath: "inset(100% 0 0 0)", transition:{ duration: .001, ease:[.2,.8,.2,1] }},
  };

  const raw = t("hero.services"); 
  const services = t("hero.services", []);
  raw: typeof raw === "string"
    ? raw.split("|").map(s => s.trim()).filter(Boolean)  // por si usas "A|B|C"
    : [];

  const renderAccent = (str) =>
  str.split(/(\[\[.*?\]\])/g).map((chunk, i) => {
    const m = chunk.match(/^\[\[(.*)\]\]$/);
    if (!m) return <span key={i}>{chunk}</span>;
    return <span key={i} className="rq-accent">{m[1]}</span>;
  });  

  // 7) effects (mantén su número/orden fijo; sin condicionar la llamada)
  useEffect(() => {
    if (!appReady) return;
    const root = ref.current;
    if (!root) return;
    runScrambleOnce(root.querySelector(".olh-loc"), { delay: 2000, perCharDelay: 30, spins: 5 });
    runScrambleOnce(root.querySelector(".olh-role"),    { delay: 2000, perCharDelay: 30, spins: 5 });
    runScrambleOnce(root.querySelector(".olh-services"), { delay: 1200, perCharDelay: 26, spins: 5 });
  }, [appReady]);

  useEffect(() => {
    if (!appReady) {
      const prevent = e => e.preventDefault();
      document.body.style.overflow = "hidden";
      window.addEventListener("wheel", prevent, { passive: false });
      window.addEventListener("touchmove", prevent, { passive: false });
      return () => {
        window.removeEventListener("wheel", prevent);
        window.removeEventListener("touchmove", prevent);
        document.body.style.overflow = "";
      };
    }
  }, [appReady]);

  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      if (v > 0.25) qCtrl.start("show");
    });
    return () => unsub();
  }, [scrollYProgress, qCtrl]);

  useEffect(() => {
  if (!appReady) return;
   const root = ref.current;
   if (!root) return;
   runScrambleOnce(root.querySelector(".olh-loc"),    { delay: 2000, perCharDelay: 30, spins: 5 });
   runScrambleOnce(root.querySelector(".olh-role"),    { delay: 2000, perCharDelay: 30, spins: 5 });
   runScrambleOnce(root.querySelector(".olh-services"), { delay: 1200, perCharDelay: 26, spins: 5 });
  }, [appReady]);

  useEffect(() => {
  if (!appReady) {
    const prevent = e => e.preventDefault();
    document.body.style.overflow = "hidden";
    window.addEventListener("wheel", prevent, { passive: false });
    window.addEventListener("touchmove", prevent, { passive: false });
    return () => {
      window.removeEventListener("wheel", prevent);
      window.removeEventListener("touchmove", prevent);
      document.body.style.overflow = "";
    };
    }
  }, [appReady]);

  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      // lanza el reveal cuando hayas scrolleado un poco dentro del hero
      if (v > 0.25) qCtrl.start("show");
    });
    return () => unsub();
  }, [scrollYProgress, qCtrl]);
      
  return (
    <motion.section variants={wrap} initial="hidden" animate={appReady ? "show" : "hidden"}>
    <section className="hero-pin" ref={ref}>
    <div className="hero-sticky">
    <section className="olh-hero">
      <div className="olh-wrap">
        {/* Título enorme en una “línea visual” */}
        <motion.h1 className="olh-title" variants={maskIn}>
          {t("hero.titleLeft")}<span className="tight"></span> {t("hero.titleRight")}
        </motion.h1>

        <div className="olh-based-wrap">

        {/* Línea “BASED IN …” muy espaciada */}
        <motion.p className="olh-loc based" variants={maskIn}>
          <span>{t("hero.based")}</span><span>{t("hero.in")}</span><span>{t("hero.spain")}</span>
        </motion.p>
        {/* VALENCIA (centrado bajo la línea, entra desde abajo con scroll) */}
            <motion.p
              className="olh-loc city"
              style={{ y: isMobile ? 0: cityYMV, opacity: isMobile ? 1: cityOpMV }}
              aria-hidden="true" variants={maskIn} 
            > {t("hero.city")}
            </motion.p>

          {/* Quote reactiva a la derecha */}
          <motion.div
            className="rq-wrap"                 // <- wrapper neutro SOLO para la animación
            style={{ opacity: isMobile ? 0 : quoteOpMV, y: isMobile ? 0 : quoteYMV }}>
          <ReactiveQuote
            base={t("hero.quote1")}
            alt={t("hero.quote2")}
            diameter={200}                    // tamaño de la “lupa” y del .c-ring
          />
        </motion.div>
        
          {/* CONTENEDOR 16:9 que ya tienes */}
        <motion.div
          className="pixel-mosaic desktop"
          style={{ opacity: isMobile ? 1 : mosaicOpacityMV, x: isMobile ? 0 : mosaicXMV, 
          scale: 0.75, transformOrigin:"left center", display: isMobile ? "none": undefined }}
          onMouseEnter={nextImg}     // desktop: cambiar al pasar por encima
          onClick={nextImg}          // móvil/desktop: tap/click cambia
        >
          {/* Capa de imagen que cicla */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={idx}
              variants={imgVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="pixel-mosaic-img"   // <- el frame 16:9 y full-bleed
            >
            <PixelImage
              src={gallery[idx]}
              delayMs={400}
              fill
              alt="project"
              className="pm-media"/>
            </motion.div>
          </AnimatePresence>

          {/* Tu overlay de píxeles, arriba exacto */}
            <div className="pixel-mosaic-overlay">
              <MosaicOverlay mosaicProps={{ cols:16, rows:9 }} />
            </div>
            <button
              type="button"
              className="pixel-mosaic-hit"
              onMouseEnter={nextImg}   // desktop hover
              onClick={nextImg}        // click/tap
              aria-label="Next project"
            />
        </motion.div>
        </div>

        {/* Panel de fondo (detrás de foto + servicios) */}
        <div className="olh-panel" aria-hidden="true" />
        {/* Foto a la derecha, solapando el título */}
        <div className="olh-photo">
        {/* solo la imagen queda aria-hidden */}
          <div className="olh-photo-media" aria-hidden="true">
            <PixelImage src="/images/portfolio_mario.webp" fill className="olh-photo-img" delayMs={400} />
          </div>

          {/* rol: subtítulo de la foto */}
        <motion.h3
          className="olh-role"
          aria-label="Role"
          variants={maskIn}>
          <span className="role-left">{t("hero.job1")}</span> <span className="dot">.</span>
          <span className="role-right">{t("hero.job2")}</span></motion.h3>
        </div>
        {/* Servicios en columna; animamos sólo 2º y 3º */}
          <motion.ul className="olh-services" variants={item} id="services" transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}>
            <li>{highlightChar(services[0], LETTERS[0])}</li>
            <motion.li style={isMobile ? {} : { x: s2xMV }}>{highlightChar(services[1], LETTERS[1])}</motion.li>
            <motion.li style={isMobile ? {} : { x: s3xMV }}>{highlightChar(services[2], LETTERS[2])}</motion.li>
          </motion.ul>
          {/* Mosaico MÓVIL estático debajo de los servicios */}
        {isMobile && (
          <div className="pixel-mosaic mobile" aria-hidden="true">
            <div className="pixel-mosaic-img">
            {/* fija una imagen o si quieres usa gallery[0] */}
              <PixelImage
                src={gallery[0]}
                delayMs={300}
                fill
                alt=""
                className="pm-media"
              />
            </div>
            <div className="pixel-mosaic-overlay">
              <MosaicOverlay mosaicProps={{ cols: 16, rows: 9 }} />
            </div>
          </div>
        )}
          <motion.p
            className="hero-open"
            style={{ opacity: isMobile ? 1 : openMV, clipPath: isMobile ? "none" : clipMV }}>
            {t("hero.open")}<span className="dot">.</span>
          </motion.p>
        <ContactDistance />
      </div>
    </section>
    </div>
    </section> 
    </motion.section>
  );
}
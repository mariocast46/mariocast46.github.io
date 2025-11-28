// /components/parallaxWorks/page.js
"use client"
import styles from "./page.module.css";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useMemo, useState, useEffect } from "react";

// ===== CONTROLES RÁPIDOS =====
const STAGE_VH = 280;     // Altura total de la sección (en “pantallas”). Sube para más recorrido (p. ej. 320).
const SPEED    = 1.15;    // >1 más rápido, <1 más lento (afecta a todas las columnas)

const images = [
  { src: "parallax/ClinicaNavarroViana-ImagenScroll.webp", ratio: "tall"   }, // 9:16
  { src: "parallax/ClinicaNavarroViana-Cuadrada.webp",                     ratio: "square"    }, // 3:4
  { src: "parallax/ClinicaNavarroViana-3.webp",                     ratio: "mid" }, // 1:1
  { src: "parallax/GGStudio-ImagenScroll.webp",              ratio: "tall"   },
  { src: "parallax/GGStudio-2.webp",                         ratio: "mid"    },
  { src: "parallax/GGStudio-Cuadrada.webp",                         ratio: "square" },
  { src: "parallax/FEDACV-ImagenScroll.webp",                ratio: "tall"   },
  { src: "parallax/FEDACV-Cuadrada.webp",                           ratio: "square" },
  { src: "parallax/FEDACV-3.webp",                           ratio: "mid" },
  { src: "parallax/EspaiMariameta-ImagenScroll.webp",        ratio: "tall"   },
  { src: "parallax/EspaiMariameta-2.webp",                   ratio: "mid"    },
  { src: "parallax/EspaiMariameta-Cuadrada.webp",                   ratio: "square" },
];

// ====== CONTROLES RÁPIDOS ======
const SHIFT_VH = 28;  // cuánto se desplaza cada columna (en vh). Sube/baja más cambiando esto.
function Col({ imgs, y, reverse = false }) {
  return (
    <motion.div
      className={`${styles.column} ${reverse ? styles.reverse : ""}`}
      style={{ y }}
    >
      {imgs.map((img, i) => (
        <div key={i} className={`${styles.card} ${styles[img.ratio]}`}>
          <Image
            src={`/images/${img.src}`}
            alt="work"
            fill
            className={styles.img}
            sizes="(min-width:1200px) 24vw, (min-width:768px) 45vw, 90vw"
            priority={i < 2}
          />
        </div>
      ))}
    </motion.div>
  );
}

export default function ParallaxWorks() {
  // Sección “larga” con pin interno
  const sectionRef = useRef(null);
  const pinRef = useRef(null);

  // 4 columnas (pares subirán, impares bajarán)
  const columns = useMemo(
    () => [
      [images[0], images[1], images[2]],
      [images[3], images[4], images[5]],
      [images[6], images[7], images[8]],
      [images[9], images[10], images[11]],
    ],
    []
  );

  // Refs por columna para medir overflow real
  const colRefs = useRef([]);
  colRefs.current = Array(columns.length)
    .fill()
    .map((_, i) => colRefs.current[i] || { wrap: null });

  // Progreso de scroll mapeado a la sección entera (pinned)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"], // 0 cuando empieza la sección, 1 cuando termina
  });

  // Medimos overflow de cada columna (altoColumna - altoPin)
  const [overflows, setOverflows] = useState(() => Array(columns.length).fill(0));

  useEffect(() => {
  const measure = () => {
    const pinH = pinRef.current?.clientHeight ?? 0;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    const arr = colRefs.current.map((r) => {
      const el = r.wrap;
      if (!el) return 0;

      // ✅ en móvil la “ventana” visible es la altura del propio colWrap (mitad de pantalla)
      const viewH = isMobile ? el.clientHeight : pinH;

      return Math.max(0, el.scrollHeight - viewH);
    });

    setOverflows(arr);
  };

  measure();
  const ro = new ResizeObserver(measure);
  if (pinRef.current) ro.observe(pinRef.current);
  colRefs.current.forEach((r) => r.wrap && ro.observe(r.wrap));
  window.addEventListener("resize", measure, { passive: true });

  return () => {
    ro.disconnect();
    window.removeEventListener("resize", measure);
  };
}, []);

  // Transforms por columna: pares suben (y muestran el final primero), impares bajan
  const yCols = overflows.map((ov, idx) => {
  const goingUp = idx % 2 === 0; // pares suben; impares bajan

  if (goingUp) {
    // SUBEN: empiezan “normal” y se desplazan hacia arriba
    // (seguimos usando column-reverse para ver primero el final)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useTransform(scrollYProgress, [0, 1], ["0px", `${-ov * SPEED}px`]);
  } else {
    // BAJAN: empiezan mostrando el FONDO (última imagen) y vuelven a y=0
    // => al moverse hacia abajo, se van desvelando las imágenes de ARRIBA
     // eslint-disable-next-line react-hooks/rules-of-hooks
    return useTransform(scrollYProgress, [0, 1], [`${-ov * SPEED}px`, "0px"]);
  }
  });

  {columns.map((imgs, i) => {
  const reverse = i % 2 === 0; // SOLO las que suben usan column-reverse
  return (
    <div key={i} ref={(el) => (colRefs.current[i].wrap = el)} className={styles.colWrap}>
      <Col imgs={imgs} y={yCols[i]} reverse={reverse} />
    </div>
  );
  })}

  return (
    <section
      ref={sectionRef}
      className={styles.stage}
      style={{ height: `${STAGE_VH}vh` }} // define la “longitud” del tramo de animación
    >
      <div ref={pinRef} className={styles.pin}>
        <div className={styles.gallery}>
          {columns.map((imgs, i) => {
            const reverse = i % 2 === 0; // las que suben → reverse: muestran primero el final
            return (
              <div
                key={i}
                ref={(el) => (colRefs.current[i].wrap = el)}
                className={styles.colWrap}
              >
                <Col imgs={imgs} y={yCols[i]} reverse={reverse} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
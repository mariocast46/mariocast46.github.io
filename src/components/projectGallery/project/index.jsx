// project.jsx
"use client";
import styles from "./style.module.css";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { runScrambleOnce } from "../../../lib/scrambleText";
import PixelImage from "../../PixelImage";
import { useT } from "../../../app/providers/DictProvider";

function splitTitle(title){
  const p = title.trim().split(/\s+/);
  if (p.length < 2) return { left:title, right:"" };
  const mid = Math.ceil(p.length/2);
  return { left:p.slice(0,mid).join(" "), right:p.slice(mid).join(" ") };
}

export default function Project({ title, src, active, onEnter, onLeave }){
  const t = useT();
  const { left, right } = splitTitle(title);
  const h2Ref = useRef(null);

  useEffect(() => {
    if (active && h2Ref.current) runScrambleOnce(h2Ref.current, { delay: 80, perCharDelay: 36, spins: 3 });
  }, [active]);

  return (
    <div className={styles.row} onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <h4 ref={h2Ref} className={styles.title}>
        <span className={styles.left}>{left}</span>

        {/* Existe siempre, pero no reserva tamaño hasta el hover */}
        <span className={styles.center}>
          <div className={styles.preview}>
            {/* PixelImage usa fill y necesita contenedor con tamaño y position:relative */}
            <PixelImage src={src} fill delay={200} className={styles.pixel}/>
          </div>
        </span>
        {right && <span className={styles.right}>{right}</span>}
      </h4>
    </div>
  );
}
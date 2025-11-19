// ProjectGallery.jsx
"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./style.module.css";
import Project from "./project";
import { useT } from "../../app/providers/DictProvider";
import { runScrambleOnce } from "../../lib/scrambleText";
import useAppReady from "../../lib/useAppReady";
import Link from "next/link";
import { useParams } from "next/navigation";

const PROJECTS = [
  { title: "Navarro Viana",   src: "/images/parallax/works/ClinicaNavarroViana-Works-16-9.webp" },
  { title: "FEDA CV",         src: "/images/parallax/works/FEDACV-Works2.webp" },
  { title: "GG Studio",       src: "/images/parallax/works/GGStudio-Works2.webp" },
  { title: "Santiago Sevillano", src: "/images/parallax/works/SantiagoSevillano-16-9.webp" },
  { title: "Espai Mariameta", src: "/images/parallax/works/EspaiMariameta-Works-16-9.webp" },
];

export default function ProjectGallery(){
  const t = useT();
  const appReady = useAppReady();
  const rootRef  = useRef(null);
  const [hoverIdx, setHoverIdx] = useState(-1);
  const { lang } = useParams();
  const worksSlug = lang === "es" ? "proyectos" : "works";
  const worksHref = `/${lang}/${worksSlug}`;

  const maskIn = {
  hidden: { clipPath: "inset(0 0 100% 0 round 0px)", opacity: 1 },
  show:   { clipPath: "inset(0 0 0% 0 round 0px)",  opacity: 1, transition: { duration: 2, ease: [0.2,0.8,0.2,1] } },
  };

  useEffect(() => {
    if (!appReady || !rootRef.current) return;
    rootRef.current
      .querySelectorAll(`.${styles.title}`)
      .forEach((node, i) => runScrambleOnce(node, { delay: 120 + i*90, perCharDelay: 22, spins: 4 }));
  }, [appReady]);

  return (
    <section ref={rootRef} className={styles.wrap} aria-label={t("works.heading","Works Selected")}>
      <h2 className={`${styles.title} ${styles.standalone}`} variants={maskIn}>{t("works.heading","Works Selected")}</h2>
      <div className={styles.list} variants={maskIn}>
        {PROJECTS.map((p,i) => (
          <Project
            key={i}
            title={p.title}
            src={p.src}
            active={hoverIdx === i}
            onEnter={() => setHoverIdx(i)}
            onLeave={() => setHoverIdx(-1)}
          />
        ))}
        {/* === CTA: “ver todos” === */}
        <Link
          href={worksHref}
          className={`${styles.row} ${styles.ctaRow}`}
        >
          <span className={styles.title}>{t("works.all")}</span>
        </Link>
      </div>
    </section>
  );
}
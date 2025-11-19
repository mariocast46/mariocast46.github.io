"use client";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import styles from "./contact.module.css";
import { useT } from "../../app/providers/DictProvider";

export default function ContactSection() {
  const ref = useRef(null);
  const t = useT();
  // Scroll “local” a la sección
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  // Rail vertical: relleno con pequeño retraso
  const railFill = useTransform(scrollYProgress, [0.05, 0.98], ["0%", "100%"]);
  // Ghost word: visible en un tramo (0.35 → 0.7)
  const ghostOpacity = useTransform(scrollYProgress, [0.32, 0.40, 0.66, 0.74], [0, 1, 1, 0]);
  const ghostY       = useTransform(scrollYProgress, [0.32, 0.40, 0.66, 0.74], ["12%", "0%", "0%", "-8%"]);
  // Barras horizontales (3 posiciones en % de la sección)
  const bars = [0.22, 0.46, 0.74];
  const barOpacity = (p, delay=0) =>
    useTransform(scrollYProgress, [p - (0.06+delay), p + (0.02+delay)], [0, 1]);
  // Form state (demo)
  const [sent, setSent] = useState(false);
  async function handleSubmit(e) {
    e.preventDefault();
    // envíalo a tu endpoint /api/contact o 3º (resend, formspree, etc.)
    // await fetch("/api/contact", { method:"POST", body: new FormData(e.target) })
    setSent(true);
  }
  return (
  <section ref={ref} id="contact" className={`${styles.wrap} contact`}>
    {/* Rail lateral 
    <div className={styles.rail}>
      <motion.span className={styles.railFill} style={{ height: railFill }} />
    </div>*/}
    {/* Viewport sticky centrado */}
    <div className={styles.center}>
      <div className={styles.card}>
        {!sent ? (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <input required name="name" id="name" placeholder=" " />
              <label htmlFor="name">{t("contact.name")}</label>
            </div>
            <div className={styles.field}>
              <input required type="email" name="email" id="email" placeholder=" " />
              <label htmlFor="email">{t("contact.email")}</label>
            </div>
            <div className={styles.field}>
              <textarea required name="message" id="message" rows={5} placeholder=" " />
              <label htmlFor="message">{t("contact.tell")}</label>
            </div>
            <button className={styles.cta} type="submit">
              {t("contact.send")}
              <svg viewBox="0 0 24 24" className={styles.arrow} aria-hidden>
                <path d="M6 18 L18 6 M9 6 H18 V15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <p className={styles.legal}>
              {t("contact.submitting")} <a href="/privacy">{t("contact.privacy")}</a>.
            </p>
          </form>
        ) : (
          <div className={styles.ok}>
            <h3>{t("contact.thanks")}</h3>
            <p>{t("contact.respuesta")}</p>
          </div>
        )}
      </div>
    </div>
    {/* Barras horizontales decorativas */}
    {bars.map((p, i) => (
      <motion.span
        key={i}
        className={styles.hbar}
        style={{
          top: `${p * 100}%`,
          opacity: barOpacity(p, i * 0.03),
          width: i === 1 ? "60vw" : i === 2 ? "48vw" : "52vw",
          left: i === 0 ? "22vw" : i === 1 ? "18vw" : "26vw",
        }}
        aria-hidden
      />
    ))}
  </section>
);
}

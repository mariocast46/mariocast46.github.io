// OverlayHud.jsx
"use client";
import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, animate } from "framer-motion";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useT } from "../../app/providers/DictProvider";
import s from "./style.module.css";

export default function OverlayHud({
  show,
  baseSrc,
  isSplitting,
  fromSrc,
  toSrc,
  cutMV, 
  href,        // url del proyecto (para “View site”)
  onDetailsClick,
  hudIdx = 0,           // NUEVO: índice del HUD actual
  panelOpen = false,    // NUEVO: estado del panel (lo controla el padre)
  panelSide = "left",
  hudMeta ={},
  ctaOffLabel
}) {
  const t = useT();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // split mask
  const clipPath = useTransform(cutMV, t => `inset(${(1 - t) * 100}% 0 0 0)`);

  // badge follower
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const fx = useSpring(mx, { stiffness: 550, damping: 35, mass: 0.6 });
  const fy = useSpring(my, { stiffness: 550, damping: 35, mass: 0.6 });
  const scaleMV = useMotionValue(0.95);
  const opMV = useMotionValue(0);
  const [badgeOn, setBadgeOn] = useState(false);
  const [nudge, setNudge] = useState(null); // 'left' | 'right' | null

  const mediaRef = useRef(null);
  // ocultar/restaurar ring global (.c-ring)
  const moRef = useRef(null);
  function hideRingsOnce() {
    if (typeof document === "undefined") return;
    document.querySelectorAll(".c-ring").forEach(el => {
      if (!el.hasAttribute("data-hud-ring-saved")) {
        el.setAttribute("data-hud-ring-saved", "1");
        el.setAttribute("data-hud-ring-style", el.getAttribute("style") || "");
      }
      el.style.opacity = "0";
      el.style.visibility = "hidden";
      el.style.pointerEvents = "none";
      el.style.transform = "scale(.9)";
    });
  }
  function restoreRings() {
    if (typeof document === "undefined") return;
    document.querySelectorAll(".c-ring").forEach(el => {
      if (el.hasAttribute("data-hud-ring-saved")) {
        el.setAttribute("style", el.getAttribute("data-hud-ring-style") || "");
        el.removeAttribute("data-hud-ring-saved");
        el.removeAttribute("data-hud-ring-style");
      } else {
        el.style.opacity = "";
        el.style.visibility = "";
        el.style.pointerEvents = "";
        el.style.transform = "";
      }
    });
  }

  const onEnterHit = (e) => {
    hideRingsOnce();
    if (!moRef.current && typeof MutationObserver !== "undefined") {
      moRef.current = new MutationObserver(hideRingsOnce);
      moRef.current.observe(document.body, { childList: true, subtree: true });
    }
    setBadgeOn(true);
    if (mediaRef.current) {
      const r = mediaRef.current.getBoundingClientRect();
      const PAD = 8;
      const x = Math.max(PAD, Math.min(r.width  - PAD, e.clientX - r.left));
      const y = Math.max(PAD, Math.min(r.height - PAD, e.clientY - r.top ));
      mx.set(x); my.set(y);
    }
    animate(opMV, 1, { duration: 0.15 });
    animate(scaleMV, 1, { type: "spring", stiffness: 300, damping: 20 });
  };
  const onMoveHit = (e) => {
    if (!mediaRef.current) return;
    const r = mediaRef.current.getBoundingClientRect();
    const PAD = 8;
    // coords relativas al box (clamp)
    const x = Math.max(PAD, Math.min(r.width  - PAD, e.clientX - r.left));
    const y = Math.max(PAD, Math.min(r.height - PAD, e.clientY - r.top ));
    mx.set(x); my.set(y);
  }
  const onLeaveHit = () => {
    animate(scaleMV, 0.82, { duration: 0.18 });
    animate(opMV, 0, { duration: 0.18 }).then(() => {
      setBadgeOn(false);
      restoreRings();
      if (moRef.current) { moRef.current.disconnect(); moRef.current = null; }
    });
  };

  useEffect(() => () => {
    restoreRings();
    if (moRef.current) { moRef.current.disconnect(); moRef.current = null; }
  }, []);

  // click en badge: abre web si hay href
  const onBadgeClick = (e) => {
    if (!href) return;
    e.preventDefault();
    window.open(href, "_blank", "noopener,noreferrer");
  };

  const sideClass = panelSide === "right" ? s.alignRight : s.alignLeft;

  const node = (
    <motion.div
    className={s.overlayHud}
    initial={false}
    animate={{ opacity: show ? 1 : 0, visibility: show ? "visible" : "hidden" }}
    transition={{ opacity: { duration: .25 } }}
    >
  {/* Caja ancla EXACTA (560x340) para imagen + hit + badge + CTA + panel */}
  <div className={s.hudCenter}>
    <div className={[s.hudMedia, panelOpen && panelSide === "right" ? s.nudgeLeft : "",
        panelOpen && panelSide === "left"  ? s.nudgeRight : ""].join(" ")} ref={mediaRef}>
      {!isSplitting ? (
        <Image
          key={`base-${baseSrc}`}
          src={baseSrc}
          width={560}
          height={340}
          className={s.hudPixel}
          alt=""
          priority
        />
      ) : (
        <div className={s.splitWrap}>
          <Image
            key={`from-${fromSrc}`}
            src={fromSrc}
            width={560}
            height={340}
            className={s.hudPixel}
            alt=""
            priority
          />
          <motion.div className={s.splitMask} style={{ clipPath }}>
            <Image
              key={`to-${toSrc}`}
              src={toSrc}
              width={560}
              height={340}
              className={s.hudPixel}
              alt=""
              priority
            />
          </motion.div>
        </div>
      )}

      {/* HITBOX: ahora está dentro del mismo contenedor de 560x340 */}
      <a
        className={s.hudHit}
        href={href || "#"}
        onPointerEnter={onEnterHit}
        onPointerMove={onMoveHit}
        onPointerLeave={onLeaveHit}
        onClick={onBadgeClick}
        aria-label={t("works.site")}
      />

      {/* BADGE: no se desalineará porque el hit está bien situado */}
      {badgeOn && (
        <motion.div className={s.cursorBadge} 
        style={{left: fx, top:  fy, opacity: opMV, scale:   scaleMV}}>
          <span className={s.cursorLabel}>{t("works.site")}</span>
        </motion.div>
      )}

      {/* CTA bajo la imagen */}
      <button
        className={s.hudCta}
        onClick={(e) => {
          e.preventDefault();
          onDetailsClick?.(); // centra el fondo actual
        }}
      >
        {panelOpen ? (ctaOffLabel ?? t("works.detailsoff")) : t("works.details")}
      </button>
    </div>
  </div>
  {/* Preload invisible */}
  <div style={{ position:"absolute", width:0, height:0, overflow:"hidden" }} aria-hidden>
    <Image src={baseSrc} alt="" width={1} height={1} priority />
    {isSplitting && (
      <>
        <Image src={fromSrc} alt="" width={1} height={1} priority />
        <Image src={toSrc} alt="" width={1} height={1} priority />
      </>
    )}
  </div>
</motion.div>
  );

  if (!mounted) return null;
  return createPortal(node, document.body);
}

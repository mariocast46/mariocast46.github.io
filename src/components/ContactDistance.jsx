"use client";
import { useEffect, useState } from "react";
import { useT } from "../app/providers/DictProvider";

export default function ContactDistance() {
  const [d, setD] = useState(0);
  const t = useT(); // <-- usar traducciones

  useEffect(() => {
    let target = null;
    const findTarget = () => {
      target =
        document.querySelector(".contact")
    };

    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

    const onMove = (e) => {
      if (!target) findTarget();
      if (!target) return;

      const r = target.getBoundingClientRect();
      const nx = clamp(e.clientX, r.left, r.right);
      const ny = clamp(e.clientY, r.top, r.bottom);
      const dx = e.clientX - nx;
      const dy = e.clientY - ny;
      setD(Math.round(Math.hypot(dx, dy)));
    };

    findTarget();
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("resize", findTarget);
    const obs = new MutationObserver(findTarget);
    obs.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", findTarget);
      obs.disconnect();
    };
  }, []);

  return (
    <div className="px-distance" aria-live="polite" aria-atomic="true">
      <span className="px-distance-text">
        {t("distance.prefix")} <b>{d}</b> {t("distance.suffix")}
      </span>
    </div>
  );
}

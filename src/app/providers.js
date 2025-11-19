// src/app/providers.js
"use client";
import { useEffect, useState } from "react";
import { MotionConfig } from "framer-motion";
import { usePathname } from "next/navigation";
import Preloader from "../components/PreLoader";
import useLenis from "../lib/useLenis";

function markReady() {
  try {
    window.__APP_READY__ = true;
    window.dispatchEvent(new Event("app:ready"));
    document.documentElement.classList.add("app-ready");
  } catch {}
}

export default function Providers({ children }) {
  useLenis();

  const [booting, setBooting] = useState(false);
  const [bootFx,  setBootFx]  = useState(false);

  useEffect(() => {
    let seen = false;
    try { seen = !!sessionStorage.getItem("seen"); } catch {}
    if (!seen) {
      setBooting(true);
      document.documentElement.classList.add("booting");
    } else {
      // No hay preloader: marca listo tras hidratar
      requestAnimationFrame(() => markReady());
      document.documentElement.classList.remove("booting");
    }
  }, []);

  const finishBoot = () => {
    setBootFx(true);                 // IN → OUT de pixels
    const total = 550 + 120 + 550;   // inMs + gapMs + outMs (ajusta a tus valores)
    setTimeout(() => {
      setBootFx(false);
      setBooting(false);
      document.documentElement.classList.remove("booting");
      try { sessionStorage.setItem("seen", "1"); } catch {}
      // 🔔 AQUI AVISAMOS AL RESTO
      markReady();
    }, total);
  };

  // wipe en navegación
  const pathname = usePathname();
  const [routeFx, setRouteFx] = useState(false);
  useEffect(() => {
    if (booting) return;
    setRouteFx(true);
    const t = setTimeout(() => setRouteFx(false), 550 + 120 + 550);
    return () => clearTimeout(t);
  }, [pathname, booting]);

  return (
    <MotionConfig reducedMotion="user">
      {children}
      {booting && <Preloader onDone={finishBoot} />}
    </MotionConfig>
  );
}

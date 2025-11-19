// src/components/selectedWorks/HudCaption.jsx
"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import s from "./style.module.css";

export default function HudCaption({ show, left, right }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted || !show) return null;

  return createPortal(
    <div className={s.hudCaption} aria-hidden>
    </div>,
    document.body
  );
}

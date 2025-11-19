// src/lib/useAppReady.js
"use client";
import { useSyncExternalStore } from "react";

function subscribe(cb) {
  if (typeof window === "undefined") return () => {};
  const h = () => cb();
  window.addEventListener("app:ready", h);
  return () => window.removeEventListener("app:ready", h);
}

function getSnapshot() {
  return !!(typeof window !== "undefined" && window.__APP_READY__);
}

export default function useAppReady() {
  // SSR → false; en cliente leer flag + evento
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

// src/providers/ReadyProvider.jsx
"use client";
import { createContext, useContext, useState, useEffect } from "react";

const Ctx = createContext({ ready: false, setReady: () => {} });

export const useAppReady = () => useContext(Ctx).ready;
export const useSetAppReady = () => useContext(Ctx).setReady;

export default function ReadyProvider({ children }) {
  const [ready, setReady] = useState(false);

  // opcional: añade un data-attr al <html> por si quieres disparar CSS
  useEffect(() => {
    document.documentElement.toggleAttribute("data-ready", ready);
  }, [ready]);

  return <Ctx.Provider value={{ ready, setReady }}>{children}</Ctx.Provider>;
}

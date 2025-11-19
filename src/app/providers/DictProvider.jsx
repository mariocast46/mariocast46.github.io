// src/app/providers/DictProvider.jsx
"use client";

import { createContext, useContext, useMemo, useState } from "react";

const Ctx = createContext(null);

export default function DictProvider({ dict, lang, children }) {
  const [curLang, setLang] = useState(lang);

  const t = (key, fallback) => {
    try {
      return key.split(".").reduce((o, k) => o?.[k], dict) ?? fallback ?? key;
    } catch {
      return fallback ?? key;
    }
  };

  const value = useMemo(
    () => ({ t, lang: curLang, setLang }),
    [dict, curLang]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useT = () => useContext(Ctx).t;
export const useLang = () => useContext(Ctx).lang;
export const useSetLang = () => useContext(Ctx).setLang;

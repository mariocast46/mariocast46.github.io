"use client";
import Link from "next/link";
import { useLang } from "../app/providers/DictProvider";

// Slugs canónicos -> por idioma
export const SLUGS = {
  "":         { en: "",         es: "" },
  about:      { en: "about",    es: "sobre-mi" },
  works:      { en: "works",    es: "proyectos" },
  services:   { en: "services", es: "servicios" },
  contact:    { en: "contact",  es: "contacto" },
};

export function mapHref(href, lang) {
  if (!href || !href.startsWith("/")) return href;

  // /works/foo/bar -> ["works","foo","bar"]
  const parts = href.split("/").filter(Boolean);
  const key = parts[0] || "";
  const tail = parts.slice(1).join("/");

  const seg = SLUGS[key]?.[lang] ?? key;

  const prefix = `/${lang}`;
  const segPart = seg ? `/${seg}` : "";
  const tailPart = tail ? `/${tail}` : "";
  return `${prefix}${segPart}${tailPart}`;
}

export default function LangLink({ href, ...rest }) {
  const lang = useLang();
  const to = href?.startsWith("/") ? mapHref(href, lang) : href;
  return <Link href={to} {...rest} />;
}

"use client";
import { useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import LangLink, { SLUGS } from "./LangLink";
import { runScrambleOnce } from "../lib/scrambleText";
import { motion, AnimatePresence } from "framer-motion";
import useAppReady from "../lib/useAppReady";
import scrollToSection from "../lib/scrollToSection.js"
import { useLang, useSetLang, useT } from "../app/providers/DictProvider";

/* ====== opciones de símbolos (random) por letra ====== */
const DEFAULT_SET = ["-"];
const ALT_MAP = {
  A: ["@"],B: ["฿", "ß", "♭"],C: ["¢", "☾"],D: ["Ð"],E: ["3", "ɛ", "€"],F: ["∮"],G: ["6"],H: ["!", "¡"],I: ["↕", "1"],Í: ["↕", "1"],
  J: ["?", "𝆕"],K: ["%"],L:["!","/"],M: ["W"],N: ["ℕ"],O: ["∅", "☯"],P: ["¶"],Q: ["ǫ"],R: ["☈"],S: ["$"],T: ["♜", "ヒ"],U: ["☋", "∪"],
  V: ["✓", "Ⅴ"],W: ["M"],X: ["✗"],Y: ["&"],Z: ["乙", "ℤ"]
  // añade las que quieras…
};

const setFor = (ch) => ALT_MAP[ch.toUpperCase()] || DEFAULT_SET;

/* === manejador ÚNICO para cambiar la letra por un símbolo aleatorio === */
function onCharEnter(e) {
  const el = e.currentTarget;
  const set = (el.getAttribute("data-set") || "").split("");
  if (!set.length) return;
  const pick = set[Math.floor(Math.random() * set.length)];
  el.setAttribute("data-show", pick);
}

/* Palabra con efecto por letra (sin link) */
function SymbolWord({ label, className = "" }) {
  return (
    <span className={`olh-word ${className}`}>
      {label.split("").map((ch, i) => {
        const set = setFor(ch).join("");
        return (
          <span
            key={i}
            className="olh-char"
            data-set={set}
            data-show={set[0]}
            onMouseEnter={onCharEnter}
          >
            {ch}
          </span>
        );
      })}
    </span>
  );
}

/* Link con efecto por letra */
function SymbolLink({ href, onClick, label, className = "", ...rest }) {
  const content = <SymbolWord label={label} />;

  if (onClick) {
    return (
      <a
        type="button"
        onClick={onClick}
        className={`olh-link ${className}`}
        {...rest}
      >
        {content}
      </a>
    );
  }

  // Si no hay onClick, esperamos un href válido
  return (
    <LangLink href={href} className={`olh-link ${className}`} {...rest}>
      {content}
    </LangLink>
  );
}
function SymbolButton({ label, onClick, className = "" }) {
  return (
    <a onClick={onClick} className={`olh-link ${className}`} aria-label={label}>
      <SymbolWord label={label} />
    </a>
  );
}

/* ====== Idioma horizontal (EN visible; aparece " / ES" al hover) ====== */
function LangMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const lang = useLang(); // "en" | "es"
  const setLang = useSetLang(); // setter del provider
  const other = lang === "en" ? "es" : "en";

  const switchTo = (newLang) => {
    try {
      document.cookie = `lang=${newLang}; Path=/; Max-Age=31536000`;
    } catch {}
    const cur = pathname || "/";

    // raíz -> /{newLang}
    if (cur === "/" || /^\/(en|es)\/?$/.test(cur)) {
      router.push(`/${newLang}`);
      return;
    }

    // /{curLang}/{seg}/tail...
    const [, curLang, ...rest] = cur.split("/");
    const curSeg = rest[0] || "";
    const tail = rest.slice(1).join("/");

    // reverse lookup: encontrar la clave canónica a partir del slug actual
    const key =
      Object.keys(SLUGS).find((k) => SLUGS[k]?.[curLang] === curSeg) || curSeg;

    const nextSeg = SLUGS[key]?.[newLang] ?? key;
    router.push(
      `/${newLang}${nextSeg ? `/${nextSeg}` : ""}${tail ? `/${tail}` : ""}`
    );
  };

  return (
    <div className="lang-inline" aria-label="Language">
      <span className="lang-current">
        <span className="olh-word">{lang.toUpperCase()}</span>
        <span className="dot current-dot" >.</span>
      </span>
      <span className="sep">/&nbsp;</span>
      <button
        type="button"
        className="other"
        onClick={() => switchTo(other)}
        aria-label={`Switch to ${other}`}
      >
        <span className="olh-word">{other.toUpperCase()}</span>
        <span className="dot hover-dot">.</span>
      </button>
    </div>
  );
}

/* ====== BRAND “MARIO CAST.” con letras que cambian y punto fijo ====== */
function BrandLink() {
  const label = "MARIO";
  const label1 = " CAST.";
  return (
    <LangLink href="/" className="olh-brand-link" aria-label="Home">
      <span className="olh-brand">
        {label.split("").map((ch, i) => {
          if (ch === "O")
            return (
              <span key={i} className="dot">
                ◯
              </span>
            );
          if (ch === " ") return <span key={i}>&nbsp;</span>;
          if (ch === ".")
            return (
              <span key={i} className="dot">
                .
              </span>
            );
          const set = setFor(ch).join("");
          return (
            <span
              key={i}
              className="olh-char"
              data-set={set}
              data-show={set[0]}
              onMouseEnter={onCharEnter}
            >
              {ch}
            </span>
          );
        })}
      </span>
      <br></br>
      <span className="olh-brand">
        {label1.split("").map((ch, i) => {
          if (ch === "O")
            return (
              <span key={i} className="dot">
                ◯
              </span>
            );
          if (ch === " ") return <span key={i}>&nbsp;</span>;
          if (ch === ".")
            return (
              <span key={i} className="dot">
                .
              </span>
            );
          const set = setFor(ch).join("");
          return (
            <span
              key={i}
              className="olh-char"
              data-set={set}
              data-show={set[0]}
              onMouseEnter={onCharEnter}
            >
              {ch}
            </span>
          );
        })}
      </span>
    </LangLink>
  );
}

export default function Header() {
  const t = useT();
  const appReady = useAppReady();
  const ref = useRef(null);
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((v) => !v);
  const pathname = usePathname() || "/";
  const router = useRouter();
  const lang = useLang();
  const onHome = /^\/(?:en|es)?\/?$/.test(pathname);
  const homePath = `/${lang}`;
  const HEADER_OFFSET = 80;

  const wrap = {
    hidden: { opacity: 0, y: 18 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.04,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: [0.2, 0.8, 0.2, 1] },
    },
  };
  const maskIn = {
    hidden: { clipPath: "inset(0 0 100% 0 round 0px)", opacity: 1 },
    show: {
      clipPath: "inset(0 0 0% 0 round 0px)",
      opacity: 1,
      transition: { duration: 1, ease: [0.2, 0.8, 0.2, 1] },
    },
  };

  useEffect(() => {
    if (!appReady) return; // espera a que termine preloader + pixel
    const root = ref.current;
    if (!root) return;
    runScrambleOnce(root.querySelector(".olh-brand"), {
      delay: 1000,
      perCharDelay: 34,
      spins: 7,
    });
    runScrambleOnce(root.querySelector(".olh-nav"), {
      delay: 1200,
      perCharDelay: 28,
      spins: 6,
    });
    runScrambleOnce(root.querySelector(".lang, .lang-inline, .lang-btn"), {
      delay: 900,
    });
    runScrambleOnce(root.querySelector(".olh-cta"), {
      delay: 1600,
      perCharDelay: 28,
      spins: 5,
    });
  }, [appReady]);

  // Evitar scroll al abrir menú hamburguesa
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => (document.body.style.overflow = "");
  }, [open]);

  function goTo(id) {
    // id: "about" | "works" | "services" | "contact"
    if (!id) return;
    if (onHome) {
      // scroll suave dentro de la misma página
      scrollToSection(id, HEADER_OFFSET);
    } else {
      // navega a la home del idioma con hash (fallback)
      router.push(`${homePath}#${id}`);
    }
  }
  function handleDrawerNav(id) {
    // id será "about" | "works" | "services" | "contact"
    setOpen(false);      // cierra el menú

    // pequeño delay para que la animación del drawer no se pelee con el scroll
    setTimeout(() => {
      goTo(id);
    }, 10);
  }

  // Si entras con hash (e.g. /es#works), aplica scroll con offset tras montar.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash?.slice(1);
    if (!hash) return;
    const t = setTimeout(() => scrollToSection(hash, HEADER_OFFSET), 60);
    return () => clearTimeout(t);
  }, [pathname]);

  return (
    <header className="olh-header" ref={ref}>
      {/* Efectos al aparecer */}
      <motion.div
        className="olh-header-fx"
        initial={{ opacity: 0 }}
        animate={{ opacity: appReady ? 0 : 0 }} // úsala si quieres brillos/overlays
        transition={{ duration: 0.6 }}
        aria-hidden="true"
      />
      
      <div className="olh-header-ui blend-diff">
        <div className="olh-row">
          <BrandLink />
          <nav className="olh-nav" aria-label="Main">
            <SymbolLink onClick={()=> goTo("about")}    label={t("nav.about")} />
            <SymbolLink onClick={()=> goTo("works")}    label={t("nav.works")} />
            <SymbolButton className="contact" onClick={() => goTo("contact")} label={t("nav.contact")} />
          </nav>
          <div className="olh-right">
            <LangMenu className="olh-cta"/>
             
          </div>
          {/* Botón burger solo en móviles (visible por CSS) */}
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={open}
            className={`olh-menu-btn ${open ? "is-open" : ""}`}
            onClick={toggle}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* Drawer mobile */}
      <AnimatePresence>
        {open && (
          <motion.aside
            className="olh-drawer"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
          <div className="drawer-head">
        {/* ⬇️ Logo ahora arriba-izquierda */}
            <div className="drawer-brand">
              <span className="olh-word">MARIO</span>
              <span className="dot">◯</span><br />
              <span className="olh-word">&nbsp;CAST</span>
              <span className="dot">.</span>
            </div>

        {/* ⬇️ Cerrar arriba-derecha */}
            <button
              type="button"
              aria-label="Close menu"
              className="drawer-close"
              onClick={toggle}
            >
            </button>
          </div>
          {/**/}
        <nav className="drawer-nav" aria-label="Mobile">
  {[
    { id: "about",    label: t("nav.about") },
    { id: "works",    label: t("nav.works") },
    { id: "services", label: t("nav.services") },
    { id: "contact",  label: t("nav.contact") },
  ].map((item) => (
    <button
      key={item.id}
      type="button"
      className="drawer-link"
      onClick={() => handleDrawerNav(item.id)}
    >
      {item.label} <span className="dot menu-dot">.</span>
    </button>
  ))}

  {/* Idioma, lo puedes dejar como lo tenías */}
  <div className="drawer-lang">
    <div className="lang-inline">
      <span className="lang-current">
        <span className="olh-word">{lang.toUpperCase()}</span>
        <span className="dot current-dot">.</span>
      </span>
      <span className="sep">/&nbsp;</span>
      <button
        type="button"
        className="other"
        onClick={() => {
          const next = lang === "en" ? "es" : "en";
          window.location.href = `/${next}`;
        }}
      >
        <span className="olh-word">{lang === "en" ? "ES" : "EN"}</span>
        <span className="dot hover-dot">.</span>
      </button>
    </div>
  </div>
</nav>
          </motion.aside>
        )}
      </AnimatePresence>


    </header>
  );
}

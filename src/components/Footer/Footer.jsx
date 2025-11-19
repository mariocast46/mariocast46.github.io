"use client";
import s from "./footer.module.css";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Footer({
  name = "MARIO CAST",
  phone = "+34 623 04 32 80",
  email = "mariocasstt@gmail.com",
  city  = "VALENCIA, SPAIN",
  tz    = "(UTC+1)",
  year  = new Date().getFullYear(),
}) {
    const [timeES, setTimeES] = useState("");

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("es-ES", {
      timeZone: "Europe/Madrid",     // UTC+1 (o +2 en verano)
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const tick = () => setTimeES(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // offset del header fijo (ajústalo a tu altura real)
const HEADER_OFFSET = 72;

function scrollToSection(id) {
  if (typeof window === "undefined") return;
  const el =
    document.getElementById(id) ||
    document.querySelector(`[data-section="${id}"]`) ||
    document.querySelector(`.${id}`) ||
    document.querySelector(`section#${id}`);

  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
  window.scrollTo({ top: y, behavior: "smooth" });
}

// accesible con teclado
function asLinkProps(id) {
  return {
    role: "link",
    tabIndex: 0,
    onClick: () => scrollToSection(id),
    onKeyDown: (e) => (e.key === "Enter" || e.key === " ") && scrollToSection(id),
  };
}

  return (
    <footer className={s.wrap}>
      {/* fila superior: nav izquierda + contacto derecha */}
      <div className={s.top}>
        <nav className={s.nav} aria-label="Footer">
          <a {...asLinkProps("about")}   className={s.navItem}>ABOUT ME</a>
          <a {...asLinkProps("works")} className={s.navItem}>WORKS</a>
          <a {...asLinkProps("contact")}    className={s.navItem}>CONTACT</a>
        </nav>

        <div className={s.contactBlock}>
          <a className={`${s.contactLine} ${s.big}`} href={`tel:${phone.replace(/\s+/g,"")}`}>
            {phone}
          </a>
          <a className={s.contactLine} href={`mailto:${email}`}>
            {email}
          </a>

          <div className={s.socialsTop}>
            <a href="https://www.linkedin.com/in/mariocastellanosbernad" target="_blank" rel="noopener noreferrer" className={s.uLink}>
              LINKEDIN ↗
            </a>
          </div>

        </div>
      </div>

      {/* fila media: etiquetas sociales en corchetes */}
      <div className={s.bracketsRow}>
        
      </div>

      {/* nombre enorme */}
      <h2 className={s.name}>{name}</h2>

      {/* fila inferior: meta izquierda/centro/derecha */}
      <div className={s.bottom}>
        <div className={s.metaLeft}>
          {city}: {timeES}{tz}<span className={s.clock} aria-live="polite"></span>
        </div>
        <div className={s.metaCenter}>DEVELOPMENT – MM</div>
        <div className={s.metaRight}>© All Right Reserved. {year} {name.replace(/\s+/g, "")}</div>
      </div>
    </footer>
  );
}

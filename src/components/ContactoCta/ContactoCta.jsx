/*"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import s from "../ContactoCta/contacto-cta.module.css";
import { useT } from "../../app/providers/DictProvider";

function splitForGif(text) {
  if (text.includes("{{gif}}")) {
    const [left, right] = text.split("{{gif}}");
    return [left.trim(), right.trim()];
  }
  const parts = text.trim().split(/\s+/);
  const mid = Math.max(1, Math.floor(parts.length / 2));
  return [parts.slice(0, mid).join(" "), parts.slice(mid).join(" ")];
}

export default function ContactCta({
  href = "/contact",
  gifSrc = "/images/cta/dog.gif",
  gifAlt = "fun gif",
}) {
  const t = useT();
  const sentence = t("contact.sentence"); // ej: "Vamos a hablar {{gif}} sobre tu proyecto"
  const [left, right] = splitForGif(sentence);

  // Variants del GIF (aparecer suave en hover)
  const gifVar = {
    rest:  { opacity: 0,  filter: "blur(3px)" },
    hover: { opacity: 1,  filter: "blur(0px)", transition: { duration: .28, ease: [0.22,0.8,0.15,1] } }
  };

  return (
    <section className={s.wrap}>
      <Link href={href} aria-label={sentence} className={s.card}>
        <motion.div className={s.inner} initial="rest" whileHover="hover" animate="rest">
        <span className={s.txtRow}>
          <motion.span className={s.txt} whileHover={{ y: -1 }}>
            {left}
          </motion.span>

          <span className={s.gifSlot}>
            <motion.span className={s.gifWrap} variants={gifVar}>
            <Image
              src={gifSrc}
              alt={gifAlt}
              width={1}
              height={1}
              className={s.gif}
              unoptimized
              priority={false}
            />
            </motion.span>
          </span>
          <motion.span className={s.txtRight} whileHover={{ y: -1 }}>
            {right}
            <svg className={s.arrow} viewBox="0 0 24 24" aria-hidden>
              <path d="M6 18 L18 6 M9 6 H18 V15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </motion.span>
          </span>
          <span className={s.underline} aria-hidden />
        </motion.div>
      </Link>
    </section>
  );
}*/
"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import s from "../ContactoCta/contacto-cta.module.css";
import { useT } from "../../app/providers/DictProvider";
// si ya tienes un util scrollToSection, úsalo; si no, basta con la lógica inline
// import scrollToSection from "../../lib/scrollToSection";

function splitForGif(text) {
  if (text.includes("{{gif}}")) {
    const [left, right] = text.split("{{gif}}");
    return [left.trim(), right.trim()];
  }
  const parts = text.trim().split(/\s+/);
  const mid = Math.max(1, Math.floor(parts.length / 2));
  return [parts.slice(0, mid).join(" "), parts.slice(mid).join(" ")];
}

export default function ContactCta({
  // href ya no se usa para navegar; lo dejamos por compat si quieres pasarlo
  href,
  gifSrc = "/images/cta/dog.gif",
  gifAlt = "fun gif",
  headerOffset = 80, // offset para header fijo
}) {
  const t = useT();
  const router = useRouter();
  const pathname = usePathname() || "/";
  const sentence = t("contact.sentence");
  const [left, right] = splitForGif(sentence);

  const goScrollToContact = () => {
    // 1) intenta en esta página
    const el =
      document.getElementById("contact") ||
      document.querySelector(".contact");
    if (el) {
      const top =
        window.scrollY +
        el.getBoundingClientRect().top -
        (headerOffset ?? 0);
      window.scrollTo({ top, behavior: "smooth" });
      return;
    }
    // 2) si no está (p. ej., estás en otra ruta), manda a home con hash
    // respeta el prefijo de idioma si existe (/en o /es)
    const [, maybeLang] = pathname.split("/");
    const lang = /^(en|es)$/.test(maybeLang) ? `/${maybeLang}` : "";
    router.push(`${lang}/#contact`);
  };

  const gifVar = {
    rest:  { opacity: 0,  filter: "blur(3px)" },
    hover: { opacity: 1,  filter: "blur(0px)", transition: { duration: .28, ease: [0.22,0.8,0.15,1] } }
  };

  return (
    <section className={s.wrap}>
      {/* Sustituimos <Link> por un “botón” clicable */}
      <button
        type="button"
        onClick={goScrollToContact}
        aria-label={sentence}
        className={s.card}
      >
        <motion.div className={s.inner} initial="rest" whileHover="hover" animate="rest">
          <span className={s.txtRow}>
            <motion.span className={s.txt} whileHover={{ y: -1 }}>
              {left}
            </motion.span>

            <span className={s.gifSlot}>
              <motion.span className={s.gifWrap} variants={gifVar}>
                <Image
                  src={gifSrc}
                  alt={gifAlt}
                  width={1}
                  height={1}
                  className={s.gif}
                  unoptimized
                  priority={false}
                />
              </motion.span>
            </span>

            <motion.span className={s.txtRight} whileHover={{ y: -1 }}>
              {right}
              <svg className={s.arrow} viewBox="0 0 24 24" aria-hidden>
                <path d="M6 18 L18 6 M9 6 H18 V15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </motion.span>
          </span>
          <span className={s.underline} aria-hidden />
        </motion.div>
      </button>
    </section>
  );
}

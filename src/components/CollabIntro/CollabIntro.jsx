"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import s from "./collabIntro.module.css";
import { useT } from "../../app/providers/DictProvider";

export default function CollabIntro({
  kicker = "LET’S START THE CONVERSATION",
  line1 = "GREAT DESIGN",
  mid   = "STARTS WITH",
  line2 = "GREAT COLLABORATION",
}) {
  const t = useT();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 40%", "end 80%"] });
  const y1 = useTransform(scrollYProgress, [0, 1], ["12px", "0px"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["24px", "0px"]);
  const o  = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section ref={ref} className={s.wrap} id="contact-intro" aria-labelledby="collab-title">
      <motion.p className={s.kicker} style={{ opacity: o, y: y1 }}>
        {t("contact.kicker")}
      </motion.p>

      <motion.h2 id="collab-title" className={s.big} style={{ opacity: o, y: y1 }}>
        {t("contact.line1")}
      </motion.h2>

      <motion.p className={s.mid} style={{ opacity: o }}>
        {t("contact.mid")}
      </motion.p>

      <motion.h3 className={s.big2} style={{ opacity: o, y: y2 }}>
        {t("contact.line2")}
      </motion.h3>
    </section>
  );
}

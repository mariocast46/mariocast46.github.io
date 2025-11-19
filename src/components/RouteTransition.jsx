"use client";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

const ease = [0.2, 0.8, 0.2, 1];

const page = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease,
      when: "beforeChildren",
      staggerChildren: 0.045,
    },
  },
  exit: { opacity: 0, y: -8, transition: { duration: 0.25, ease } },
};

export default function RouteTransition({ children }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      {/* Cambia la key con la ruta para forzar el enter/exit */}
      <motion.main
        key={pathname}
        initial="hidden"
        animate="show"
        exit="exit"
        variants={page}
        style={{ willChange: "transform, opacity" }}
      >
        {children}
      </motion.main>
    </AnimatePresence>
  );
}

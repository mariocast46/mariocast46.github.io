// src/lib/scrambleText.js
// === Mismo “abecedario” que ya usas (puedes ampliarlo aquí) ===
const DEFAULT_SET = ["/", "!", "+", "-", "&", "¿", "?", "¡"];
const ALT_MAP = {
  A:["@"], B:["฿","ß","♭"], C:["¢","☾"], D:["Ð"],
  E:["3","ɛ","€"], F:["∮"], G:["6"], H:["!","¡"],
  I:["↕","1"], J:["?"], K:["%"], M:["W"], N:["ℕ"],
  O:["∅","☯"], P:["¶"], Q:["ǫ"], R:["☈"], S:["$"],
  T:["♜","ヒ"], U:["☋","∪"], V:["✓","Ⅴ"], W:["M"],
  X:["✗"], Y:["Ұ"], Z:["乙","ℤ"]
};
const setFor = (ch) => ALT_MAP[ch?.toUpperCase?.()] || DEFAULT_SET;

// --- Crea spans .olh-char si no existen (para hero, etc.) ---
function ensureCharSpans(container) {
  if (!container) return;
  if (container.querySelector(".olh-char")) return; // ya instrumentado

  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);

  nodes.forEach((node) => {
    const text = node.nodeValue;
    if (!text || !text.trim()) return; // ignora solo espacios puros
    const frag = document.createDocumentFragment();

    for (let i = 0; i < text.length; i++) {
      const ch = text[i];

      // deja espacios como texto normal
      if (ch === " ") {
        frag.appendChild(document.createTextNode(" "));
        continue;
      }

      // para puntos/viñetas puedes no animar si quieres
      if (ch === "." || ch === "·") {
        const span = document.createElement("span");
        span.className = "olh-char dot";
        span.textContent = ch;
        frag.appendChild(span);
        continue;
      }

      const span = document.createElement("span");
      span.className = "olh-char";
      span.textContent = ch;                  // letra real
      span.dataset.set = setFor(ch).join(""); // útil para tu hover
      span.dataset.show = setFor(ch)[0] || DEFAULT_SET[0];
      frag.appendChild(span);
    }

    node.parentNode.replaceChild(frag, node);
  });
}

/**
 * Revela un bloque (brand, nav, based, services, botón, etc.)
 * Sustituyendo el contenido del span por símbolos y, al final, por la letra real.
 * No usa ::after ni opacidades: evita la “fusión”.
 */
export function runScrambleOnce(container, opts = {}) {
  if (!container) return;

  // Si el bloque no tiene .olh-char (hero), lo creamos
  ensureCharSpans(container);

  const els = [...container.querySelectorAll(".olh-char")];
  if (!els.length) return;

  const {
    delay = 800,       // espera antes de empezar (ms)
    perCharDelay = 40, // retardo incremental por letra (ms)
    spins = 6          // cambios aleatorios antes de fijar la letra
  } = opts;

  // Guarda la letra final en data-final; marca las no animables
  els.forEach((el) => {
    if (!el.dataset.final) el.dataset.final = el.textContent;
    const ch = el.dataset.final;
    if (!ch || ch.trim() === "" || el.classList.contains("dot")) {
      el.dataset.locked = "1"; // no animar puntos/espacios/viñetas
    }
  });

  setTimeout(() => {
    let lastTime = 0;

    els.forEach((el, i) => {
      if (el.dataset.locked === "1") return;

      const final = el.dataset.final;
      const set = setFor(final);

      for (let k = 0; k <= spins; k++) {
        const t = i * perCharDelay + k * perCharDelay;
        lastTime = Math.max(lastTime, t);

        setTimeout(() => {
          // Sustitución real del contenido (no overlay)
          if (k === spins) {
            el.textContent = final; // fija la letra real
          } else {
            const pick = set[Math.floor(Math.random() * set.length)] || set[0];
            el.textContent = pick;  // pone símbolo temporal
          }
        }, t);
      }
    });
  }, delay);
}

/** Azúcar: aplicar a varios elementos con un selector dentro de root */
export function runScrambleQuery(root, selector, perItemDelay = 120, base = {}) {
  const parent = typeof root === "string" ? document.querySelector(root) : root;
  if (!parent) return;
  [...parent.querySelectorAll(selector)].forEach((node, i) =>
    runScrambleOnce(node, { ...base, delay: (base.delay ?? 800) + i * perItemDelay })
  );
}

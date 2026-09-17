// K64 · Übersetzer mit ruhigem Rückfall.
// Eine Ansicht, die ohne t gerendert wird, zeigte bisher rohe Schlüssel
// («chapter.save»). Jetzt gilt: zuerst das übergebene t, sonst das t aus dem
// I18n-Kontext, sonst ein leerer Text — nie ein Schlüssel. Im
// Entwicklungsmodus meldet sich der Fehlfall einmal in der Konsole.

const leer = () => '';

export function tMitRueckfall(t, kontextT, name = 'Ansicht') {
  if (typeof t === 'function') return t;
  if (typeof kontextT === 'function') return kontextT;
  if (import.meta.env.DEV) {
    console.warn('[i18n] ' + name + ' ohne t gerendert — Texte bleiben leer statt Schlüssel.');
  }
  return leer;
}

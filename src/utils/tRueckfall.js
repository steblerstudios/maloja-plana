// K64 · Übersetzer mit ruhigem Rückfall.
// Eine Ansicht, die ohne t gerendert wird, zeigte bisher rohe Schlüssel
// («chapter.save»). Jetzt gilt: zuerst das übergebene t, sonst das t aus dem
// I18n-Kontext, sonst (K71) die bereits geladene Sprache — Knöpfe behalten so
// ihren Namen. Erst wenn nichts geladen ist: leerer Text, nie ein Schlüssel.
// Im Entwicklungsmodus meldet sich der Fehlfall einmal in der Konsole.

import { rueckfallT } from '../i18n/index.js';

export function tMitRueckfall(t, kontextT, name = 'Ansicht') {
  if (typeof t === 'function') return t;
  if (typeof kontextT === 'function') return kontextT;
  if (import.meta.env.DEV) {
    console.warn('[i18n] ' + name + ' ohne t gerendert — Texte aus der geladenen Sprache, sonst leer.');
  }
  return rueckfallT();
}

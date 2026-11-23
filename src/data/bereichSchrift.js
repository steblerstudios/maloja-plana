import { getBereich } from './lebensbereiche.js';

// Schrift in der Farbe eines Bereichs (18.11.2026, Eigenanteil orange, Kasse blau): Text braucht 4.5:1 (WCAG 1.4.3),
// die Identitätsfarben erreichen auf #FAFAF8 nur 3.2:1. `LIGHT_TEXT` = derselbe Farbton, dunkler (gemessen:
// Hagebutte #AA6336 4.62:1, Heidelbeere #54789A 4.64:1 auf Weiss). Im Dunkelmodus trägt `dark` schon (über 5:1).
// Ohne Eintrag gibt es keine Bereichsschrift: null, der Aufrufer nimmt seine ruhige Grundfarbe.
// Eigene Datei, weil nur nachgeladene Teile sie brauchen: in lebensbereiche.js lag sie im Startbündel
// (Predeploy 23.11.2026, Startbündel 49 B über 65 kB).
const LIGHT_TEXT = { versicherungen: '#54789A', gesundheit: '#AA6336' };

export function bereichTextColor(key, isDark) {
  const b = getBereich(key);
  if (!b) return null;
  if (isDark) return b.dark;
  return LIGHT_TEXT[key] || null;
}

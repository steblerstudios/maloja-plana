// Bereich (Kapitel-Farbe + Kapitel-Zeichen) für Merkpunkte und Kalender-Einträge.
// Festgelegt von Sophie am 23.10.2026 («Vor dem Bau festgelegt», VERGLEICH.md Fassung 5):
//
//   Merkliste · Verknüpfung → Bereich
//     IPV, Prämien, Vorsorge          → Versicherungen
//     Steuern, Kalender, Offizielle Links → Behörden
//     Sozialhilfe                     → Finanzen
//     ALV, Stipendien                 → Ausbildung
//     Asyl, Ablage, ohne Verknüpfung  → Persönliche Basis
//
//   Kalender · Kategorie → Bereich
//     Gesundheit, Versicherung → Versicherungen
//     Verwaltung, Recht        → Behörden
//     Arbeit, Ausbildung       → Ausbildung
//     Familie, Persönlich      → Basis;  übrige → Basis
//
// Der Bereichs-Schlüssel ist zugleich der Kapitel-Schlüssel und der Icon-Name
// (basis, versicherungen, behoerden, finanzen, ausbildung) — wie in Dashboard/MobileNav.
import { getBereichForChapter } from './lebensbereiche.js';
import { kontrast, lesbareFarbe } from '../utils/lebensbereichFruechte.js';

const RUECKFALL = 'basis';

export const MERKPUNKT_BEREICH = {
  premium: 'versicherungen',
  praemien: 'versicherungen',
  vorsorge: 'versicherungen',
  tax: 'behoerden',
  calendar: 'behoerden',
  direktlinks: 'behoerden',
  sozialhilfe: 'finanzen',
  alv: 'ausbildung',
  stipendien: 'ausbildung',
  asyl: 'basis',
  tresor: 'basis',
};

export const KATEGORIE_BEREICH = {
  health: 'versicherungen',
  insurance: 'versicherungen',
  admin: 'behoerden',
  legal: 'behoerden',
  work: 'ausbildung',
  education: 'ausbildung',
  family: 'basis',
  personal: 'basis',
};

// Verknüpfungen ausserhalb der festgelegten Liste (etwa 'briefe' aus dem Ablauf Umzug)
// fallen wie «ohne Verknüpfung» auf die Persönliche Basis.
export const merkpunktBereich = (link) => (link && MERKPUNKT_BEREICH[link]) || RUECKFALL;
export const kategorieBereich = (category) => KATEGORIE_BEREICH[category] || RUECKFALL;

// Zeichen-Farbe des Bereichs auf der Fläche: Grafik, darum 3:1 (WCAG 1.4.11), wie AblaufSchale.
export const bereichZeichenFarbe = (bereich, palette) => {
  const b = getBereichForChapter(bereich);
  if (!b) return palette.mid;
  const grund = palette.surface || palette.bg;
  const dunkel = kontrast(palette.bg, '#FFFFFF') > kontrast(palette.bg, '#000000');
  return lesbareFarbe(dunkel ? b.dark : b.light, grund, dunkel, 3);
};

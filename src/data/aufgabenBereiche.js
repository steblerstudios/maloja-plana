// Bereich (Kapitel-Farbe + Kapitel-Zeichen) für Merkpunkte und Kalender-Einträge.
// Festgelegt von Stebler Studios am 23.10.2026, Block «Zuordnungen Merkliste und Kalender · festgelegt»
// (VERGLEICH.md Fassung 5, «Ja, Liste B»). Die erste Liste aus «Vor dem Bau festgelegt» ist überholt.
//
// Merkliste: die Zuordnung steht NICHT doppelt hier, sie kommt aus der App selbst —
//   1. data/werkzeugRegister.js, Feld «bereich» (Ast; seit der Seiten-Architektur 06.11.2026),
//   2. config/ansichtenRegister.js, Bereich des Ablaufs (Asyl → Behörden),
//   3. data/gepaeck.js, Gegenstand des Wegs (Stipendien → Werkzeugrolle «arbeit»).
// Der Ast wird über astKapitel (data/lebensbereiche.js) zum Kapitel — so trägt «Neuer Job» die Farbe von
// Ausbildung & Arbeit (vorher: Ast «arbeit» ohne Kapitel → neutral). Ergebnis heute:
//   IPV, Versicherungs-Übersicht, Vorsorge-Rechner → Versicherungen · Steuern, Sozialhilfe → Finanzen ·
//   ALV, Stundenlohn, Lebenslauf, Stipendien → Ausbildung · KVG-Leistungen, KK-Belege, Arztkoffer,
//   Patientenverfügung → Gesundheit (Kapitel `notfall`) · EO → Basis · Asyl → Behörden ·
//   Dokumentenablage, Kalender, Offizielle Links (Aussenfach) und ohne Verknüpfung → kein Bereich:
//   eigenes Zeichen in neutralem Grau-Grün.
//
// Kalender (Kategorie → Bereich), nicht aus einem Register ableitbar, darum hier:
//   Gesundheit → Gesundheit (Kapitel `notfall`, seit 06.11.2026) · Versicherung → Versicherungen ·
//   Finanzen → Finanzen · Verwaltung, Recht → Behörden ·
//   Arbeit, Ausbildung → Ausbildung · Wohnen → Wohnen · Familie → Basis · Persönlich → kein Bereich.
//
// Der Bereichs-Schlüssel ist zugleich Kapitel-Schlüssel und Icon-Name (wie Dashboard/MobileNav).
import { getBereichForChapter, astKapitel } from './lebensbereiche.js';
import { WERKZEUGE } from './werkzeugRegister.js';
import { alleWege } from './gepaeck.js';
import { ablaufBereich, ansichtIkon } from '../config/ansichtenRegister.js';
import { kontrast, lesbareFarbe, mischeHex } from '../utils/lebensbereichFruechte.js';

// Gegenstand im Rucksack → Kapitel, nur noch für die Wege aus data/gepaeck.js (Stipendien).
// Werkzeuge tragen ihren Ast selbst (Feld `bereich`). Aussenfach hat keinen.
const FACH_BEREICH = {
  geld: 'finanzen',
  gesundheit: 'versicherungen',
  alter: 'versicherungen',
  arbeit: 'ausbildung',
};

export const KATEGORIE_BEREICH = {
  health: 'notfall',
  insurance: 'versicherungen',
  finance: 'finanzen',
  admin: 'behoerden',
  legal: 'behoerden',
  work: 'ausbildung',
  education: 'ausbildung',
  housing: 'wohnen',
  family: 'basis',
  // personal: kein Bereich
};

// Bereich einer Verknüpfung — oder null (Aussenfach, ohne Verknüpfung, unbekannt).
export const merkpunktBereich = (link) => {
  if (!link) return null;
  const w = WERKZEUGE.find((x) => x.view === link);
  if (w) return astKapitel(w.bereich);
  const ablauf = astKapitel(ablaufBereich(link));
  if (ablauf) return ablauf;
  const weg = alleWege().find((x) => x.view === link);
  return (weg && FACH_BEREICH[weg.gegenstand]) || null;
};

// Zeichen eines Merkpunkts: das Kapitel-Zeichen, sonst das Zeichen des Werkzeugs
// (Ordner, Kalender, Globus aus dem Register), ohne Verknüpfung der Haken der Merkliste.
export const merkpunktZeichen = (link) => {
  const b = merkpunktBereich(link);
  if (b) return b;
  // Ein Merkpunkt ist «gemerkt», nicht «geschafft»: Lesezeichen (Icon-Besprechung Punkt 3).
  if (!link) return 'lesezeichen';
  return ansichtIkon(link, 'lesezeichen');
};

export const kategorieBereich = (category) => KATEGORIE_BEREICH[category] || null;
export const kategorieZeichen = (category) => kategorieBereich(category) || ansichtIkon('calendar', 'calendar');

// Zeichen-Farbe auf der Fläche: Grafik, darum 3:1 (WCAG 1.4.11), wie AblaufSchale.
// Ohne Bereich ein neutrales Grau-Grün (zwischen sage und mid), wie das Aussenfach.
export const bereichZeichenFarbe = (bereich, palette) => {
  const grund = palette.surface || palette.bg;
  const dunkel = kontrast(palette.bg, '#FFFFFF') > kontrast(palette.bg, '#000000');
  const b = bereich ? getBereichForChapter(bereich) : null;
  const farbe = b ? (dunkel ? b.dark : b.light) : mischeHex(palette.sage, palette.mid, 0.5);
  return lesbareFarbe(farbe, grund, dunkel, 3);
};

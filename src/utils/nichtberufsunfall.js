// Eigene Datei, damit die Funktion nicht im Startbündel landet: anstellung.js wird vom Start geladen,
// diese Prüfung brauchen nur nachgeladene Ansichten (ChapterView, UvgHinweis).
import { istAngestellt } from './anstellung.js';

// Ist eine angestellte Person auch gegen Unfälle in der Freizeit versichert (Kapitel 4, V1)? Nur wer bei einer
// Arbeitgeberin «mindestens acht Stunden» pro Woche arbeitet (UVV Art. 13 Abs. 1). Nur dann darf die Unfalldeckung
// bei der Krankenkasse ruhen (KVG Art. 8 Abs. 1: «obligatorisch für dieses Risiko voll gedeckt»).
//   'ja'    angestellt, Pensum der Hauptstelle ≥ 8 Std./Woche
//   'nein'  angestellt, Pensum bekannt und darunter
//   'offen' angestellt, Pensum nicht eingetragen — oder 8 Std. und mehr bei einem Nebenerwerb
//   null    nicht angestellt
//
// Nebenerwerb (Vortor 10.11.2026): Das Feld «Arbeitsstunden pro Woche» sagt nicht, ob die Stunden bei EINER
// Arbeitgeberin anfallen. Wer daneben einen Nebenerwerb hat, kann zusammen 8 Stunden erreichen, aber bei keiner
// Stelle — dann gilt die Freizeit-Deckung nicht. Darum dort 'offen' statt 'ja'. Unter 8 Stunden insgesamt bleibt
// es 'nein': dann liegt auch jede einzelne Stelle darunter.
const STUNDEN = (wert) => Number.parseFloat(String(wert ?? '').replace(',', '.').trim());

const hatNebenerwerb = (finanzen) =>
  Number(finanzen?.sideIncome) > 0
  || String(finanzen?.sideEmployer ?? '').trim() !== ''
  || STUNDEN(finanzen?.sideHoursPerWeek) > 0;

export function nichtberufsunfallStatus(allData) {
  if (!istAngestellt(allData?.finanzen)) return null;
  const std = STUNDEN(allData?.ausbildung?.workHoursPerWeek);
  if (!Number.isFinite(std) || std <= 0) return 'offen';
  if (std < 8) return 'nein';
  return hatNebenerwerb(allData?.finanzen) ? 'offen' : 'ja';
}

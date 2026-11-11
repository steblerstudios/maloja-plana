// Eigene Datei, damit die Funktion nicht im Startbündel landet: anstellung.js wird vom Start geladen,
// diese Prüfung brauchen nur nachgeladene Ansichten (ChapterView, UvgHinweis).
import { istAngestellt } from './anstellung.js';

// Ist eine angestellte Person auch gegen Unfälle in der Freizeit versichert (Kapitel 4, V1)? Nur wer bei einer
// Arbeitgeberin «mindestens acht Stunden» pro Woche arbeitet (UVV Art. 13 Abs. 1). Nur dann darf die Unfalldeckung
// bei der Krankenkasse ruhen (KVG Art. 8 Abs. 1: «obligatorisch für dieses Risiko voll gedeckt»).
//   'ja'    angestellt, Pensum der Hauptstelle ≥ 8 Std./Woche
//   'nein'  angestellt, Pensum bekannt und darunter
//   'offen' angestellt, Pensum nicht eingetragen
//   null    nicht angestellt
export function nichtberufsunfallStatus(allData) {
  if (!istAngestellt(allData?.finanzen)) return null;
  const roh = String(allData?.ausbildung?.workHoursPerWeek ?? '').replace(',', '.').trim();
  const std = Number.parseFloat(roh);
  if (!roh || !Number.isFinite(std) || std <= 0) return 'offen';
  return std >= 8 ? 'ja' : 'nein';
}

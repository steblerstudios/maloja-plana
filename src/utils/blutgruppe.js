import { auswahlLabel } from './auswahlLabel.js';

// ─── Blutgruppe: gespeicherter Schlüssel → Anzeige ───────────────────────────
// Gespeichert wird der Auswahl-Schlüssel (`aPos`, `abNeg` …), angezeigt werden muss
// das Etikett (`A+`, `AB−`). Befund 27.09.2026: an fünf Stellen stand der rohe
// Schlüssel — Dashboard-Satz, Kapitel-Tabelle, Notfallkarte (Druck und Kopie) und
// der Organspende-QR. Eine Stelle für alle, gleiches Muster wie zivilstandLabel.
//
// «unknown» und leer ergeben '' — wer das Etikett braucht, zeigt dann nichts an.
// Unbekannte Werte (von Hand importiert) erscheinen unverändert statt als Schlüsselpfad.
export function blutgruppeLabel(wert, t) {
  const w = String(wert ?? '').trim();
  if (!w || w === 'unknown') return '';
  return auswahlLabel('notfall', 'bloodType', w, t);
}

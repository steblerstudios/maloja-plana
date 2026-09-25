// Der 13. Monatslohn — EINE Regel für alle Rechner, die aus dem Monatslohn ein Jahr machen
// (Steuern, IPV, EO/AHV/BVG-Vorbefüllung).
//
// Frage «13. Monatslohn?» im Finanzen-Kapitel (Optionen yes/no). Dieselben Schreibweisen wie
// hatDreizehnten()/dreizehnterAngegeben() in src/data/lohnCheck.js. Leer ist nicht «nein».
// Eigene Datei, weil kantonaleSteuerdaten.js cantonalData.js importiert — die IPV in
// cantonalData.js kann die Regel darum nicht von dort holen, ohne einen Kreis zu bilden.
export function dreizehnterStatus(v) {
  if (v === true || v === 'yes' || v === 'ja') return 'ja';
  if (v === false || v === 'no' || v === 'nein') return 'nein';
  return 'offen';
}

// Wie viele Monatslöhne ein Jahr hat: 13 nur bei «ja». «offen» rechnet wie «nein» — die Seite
// sagt es dann dazu (Steuern: annahmen.ohneDreizehnten, IPV: dieselbe Annahme im Ergebnis).
// Gilt nur für den HAUPTLOHN: die Frage steht beim Hauptlohn, Nebenerwerb und Renten bleiben ×12.
export function hauptlohnMonate(v) {
  return dreizehnterStatus(v) === 'ja' ? 13 : 12;
}

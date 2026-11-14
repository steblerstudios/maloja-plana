// Zahlen und Franken-Beträge anzeigen — EINE Quelle für die ganze App.
//
// Entscheid (steuerTexte.js, K66): Tausendertrennung mit dem typografischen Apostroph ’
// (U+2019), «nicht von der Laufzeit-Locale abhängig». Bis 24.09.2026 hielten sich daran nur
// `chf()` und drei Kopien desselben Musters (FinanzUebersicht, BudgetSync, dossierGenerator);
// rund zwanzig weitere Stellen nahmen `toLocaleString('de-CH')` — und das liefert je nach
// Browser etwas anderes: Chromium den geraden Apostroph ' (U+0027), gemessen 24.09. So standen
// auf einer Seite zwei verschiedene Trennzeichen. Und wo `toFixed(2)` stand (Schulden, Budget-
// Import, KVG-Ergebnis), fehlte die Trennung ganz: «CHF 12345.00».
//
// Wächter: src/__tests__/geldEineQuelle.test.js

const APOSTROPH = '’';
const MINUS = '−'; // U+2212, wie in den bisherigen formatCHF-Kopien

const gruppieren = (ganz) => ganz.replace(/\B(?=(\d{3})+(?!\d))/g, APOSTROPH);

// zahl(12345.5)                    → "12’346"
// zahl(12345.5, { stellen: 2 })    → "12’345.50"   (fest)
// zahl(12345.5, { hoechstens: 2 }) → "12’345.5"    (wie toLocaleString ohne Optionen, aber max. 2)
// Ungültiges (NaN, Infinity, null) → "–". Die Aufrufer prüfen ihre eigenen Leerfälle vorher.
export function zahl(n, { stellen, hoechstens } = {}) {
  const x = Number(n);
  if (n === null || n === undefined || !Number.isFinite(x)) return '–';
  const nachkomma = stellen ?? hoechstens ?? 0;
  let fest = Math.abs(x).toFixed(nachkomma);
  if (stellen === undefined && hoechstens !== undefined && fest.includes('.')) {
    fest = fest.replace(/\.?0+$/, '');
  }
  const [ganz, rest] = fest.split('.');
  const negativ = x < 0 && Number(fest) !== 0;
  return (negativ ? MINUS : '') + gruppieren(ganz) + (rest ? '.' + rest : '');
}

// betragEcht(-1234)                 → "− CHF 1’234"
// betragEcht(12.5, { stellen: 2 })  → "CHF 12.50"
// Immer der wahre Betrag — für alles, was die App verlässt (Export, Dossier).
export function betragEcht(n, optionen = {}) {
  const x = Number(n);
  if (n === null || n === undefined || !Number.isFinite(x)) return '–';
  const z = zahl(Math.abs(x), optionen);
  const negativ = x < 0 && z !== '0' && !/^0(\.0+)?$/.test(z);
  return (negativ ? MINUS + ' ' : '') + 'CHF ' + z;
}

// Sichtschutz «Beträge verbergen» (Kopfzeile, seit 10.11.2026, Idee aus dem Nessie-Abgleich):
// Solange <html data-betraege="aus"> gesetzt ist, zeigt der Bildschirm «CHF ···» statt der Zahl.
// Nur die Anzeige — gespeichert, gerechnet und exportiert wird weiter mit dem wahren Wert
// (Exporte nehmen betragEcht, Dokumente laufen in mitEchtenBetraegen). Gesetzt von public/theme-init.js und vom Schalter in main.jsx,
// jeweils VOR dem Rendern, darum genügt hier ein Blick aufs Attribut.
// Dokumente zeigen immer den wahren Betrag (Vortor 13.11.2026, Blocker): t() verbirgt jeden
// «CHF {x}»-Platzhalter, und Briefe, Dossiers, Druck und Exporte bauen ihren Text mit demselben t().
// Ohne diese Ausnahme stand in der gedruckten Lohnforderung «brutto CHF ···». Alles, was die App
// verlässt, läuft darum in mitEchtenBetraegen(); solange es läuft, ist der Sichtschutz aus.
// Nur für synchrone Erzeuger (alle heutigen sind es); Wächter: betraegeVerbergen.test.js.
let echteBetraegeTiefe = 0;
export function mitEchtenBetraegen(erzeugen) {
  echteBetraegeTiefe += 1;
  try {
    return erzeugen();
  } finally {
    echteBetraegeTiefe -= 1;
  }
}

export const betraegeVerborgen = () => echteBetraegeTiefe === 0 && typeof document !== 'undefined' && document.documentElement.dataset.betraege === 'aus';

export function betrag(n, optionen) {
  const echt = betragEcht(n, optionen);
  return echt !== '–' && betraegeVerborgen() ? 'CHF ···' : echt;
}

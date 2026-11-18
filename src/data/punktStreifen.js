// ─── Punktstreifen: die Brücke zwischen Kantonsatlas und Werkzeug ─────────────
//
// Entscheid 5 der Instrumente-Matrix (stebler-studios/analysen/2026-11-10-instrumente-matrix-konzept.md,
// Skizze E), Probe mit der Miete auf Zuruf von Stebler Studios am 18.11.2026 («Ja, Miete zuerst»):
// Dieselbe Form auf /kantonsatlas/ (alle Kantone) und im Werkzeug (der eigene Kanton markiert).
// Wer von der Website in die App wechselt, erkennt das Bild wieder.
//
// Eine Rechnung (Regel 3 der Matrix): Diese Funktion legt die Punkte fest. Die Website
// (scripts/seiten/kantonsatlas.mjs) zeichnet sie beim Bauen, die App bekommt dieselben Lagen über
// scripts/app-verstehen.mjs in src/data/kantonskarten.js und zeichnet sie nur nach.
//
// Jeder Kanton ist ein gleich grosser Punkt, die Lage auf der Achse ist sein Wert. Rücken zwei Punkte
// zu nah zusammen, weicht der spätere in die nächste Zeile aus (keine Überdeckung, kein Rang).
// Die Farbe ist die Stufe der Karte, also dieselbe Lesart wie die Fläche im Atlas.
// ─────────────────────────────────────────────────────────────────────────────

export const STREIFEN = {
  breite: 320, // Einheiten der viewBox
  rand: 10, // links und rechts, damit der halbe Punkt nicht abgeschnitten wird
  radius: 5,
  abstand: 1, // zusätzliche Luft zwischen zwei Punkten
  zeilenHoehe: 11,
  oben: 8, // Platz für den Strich «ganze Schweiz»
  unten: 3, // Beschriftung steht als Text unter dem Bild (mindestens 13 px, querschnittGestaltung.test.js)
};

const runde = (n) => Math.round(n * 10) / 10;

// werte: { KANTON: Zahl } · ch: Zahl oder null · stufe: { KANTON: 1–4 }
// Gibt die Lage jedes Punkts zurück, dazu den Strich für die ganze Schweiz und die Höhe der Zeichnung.
export function streifenLage({ werte, ch = null, stufe = {} }) {
  const S = STREIFEN;
  const eintraege = Object.entries(werte).filter(([, v]) => Number.isFinite(v));
  if (eintraege.length === 0) return null;
  const min = Math.min(...eintraege.map(([, v]) => v));
  const max = Math.max(...eintraege.map(([, v]) => v));
  const innen = S.breite - 2 * S.rand;
  const xVon = (v) => runde(S.rand + (max === min ? innen / 2 : ((v - min) / (max - min)) * innen));
  // Sortiert nach Wert, bei Gleichstand nach Kürzel: dieselbe Eingabe gibt immer dasselbe Bild.
  const reihe = eintraege.sort((a, b) => a[1] - b[1] || a[0].localeCompare(b[0]));
  const naechstesFrei = []; // je Zeile: ab welchem x der nächste Punkt Platz hat
  const durchmesser = 2 * S.radius + S.abstand;
  const punkte = reihe.map(([k, v]) => {
    const x = xVon(v);
    let zeile = naechstesFrei.findIndex((frei) => x >= frei);
    if (zeile === -1) { zeile = naechstesFrei.length; naechstesFrei.push(0); }
    naechstesFrei[zeile] = x + durchmesser;
    return { k, v, x, zeile, s: stufe[k] || null };
  });
  const zeilen = naechstesFrei.length;
  const yVon = (zeile) => runde(S.oben + S.radius + zeile * S.zeilenHoehe);
  for (const p of punkte) p.y = yVon(p.zeile);
  const achseY = runde(yVon(zeilen - 1) + S.radius + 4);
  return {
    breite: S.breite,
    hoehe: runde(achseY + S.unten),
    radius: S.radius,
    min, max,
    xMin: xVon(min), xMax: xVon(max),
    achseY,
    ch: Number.isFinite(ch) ? { v: ch, x: xVon(ch) } : null,
    zeilen,
    punkte,
  };
}

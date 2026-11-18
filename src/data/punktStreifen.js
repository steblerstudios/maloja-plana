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
// zu nah zusammen, weicht der spätere aus, abwechselnd über und unter die Linie (Perlenschnur).
// Erste Fassung hängte die Punkte nach unten; das las sich wie Balken, «hier ist mehr»
// (Stebler Studios 18.11.2026: «wieso ist diese Darstellung so, check nicht»).
// Die Farbe ist die Stufe der Karte, also dieselbe Lesart wie die Fläche im Atlas.
// ─────────────────────────────────────────────────────────────────────────────

// Kantonskürzel in den Punkten (Stebler Studios 18.11.2026, «Ja, Kürzel rein»): Ein Punkt ist so gross, dass
// das Kürzel in 13 Einheiten hineinpasst. Bei 320 Einheiten auf 343 px (Handy) sind das knapp 14 px Schrift.
// Die Website hält den Streifen darum schmal (max. 400 px), sonst würde die Schrift dort unnötig gross.
export const STREIFEN = {
  breite: 320, // Einheiten der viewBox
  rand: 14, // links und rechts, damit der halbe Punkt nicht abgeschnitten wird
  radius: 12.5, // «OW», «NW» brauchen bei 13 Einheiten rund 22 Einheiten Breite
  abstand: 1, // zusätzliche Luft zwischen zwei Punkten
  luft: 3, // oben und unten
  schrift: 13, // Kürzel, nie kleiner (querschnittGestaltung.test.js: keine Schrift unter 13 px)
};

// Schrift im Punkt: dunkel oder hell, je nachdem, was gegen die Farbe des Punkts mehr Kontrast hat.
// Wächter punktStreifen.test.js: mindestens 4,5:1 (WCAG 1.4.3) für jede Stufe, hell und dunkel.
export const SCHRIFT_DUNKEL = '#111111';
export const SCHRIFT_HELL = '#FFFFFF';
const kanal = (c) => { const v = c / 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
export function leuchtdichte(hex) {
  const n = parseInt(hex.replace('#', ''), 16);
  return 0.2126 * kanal((n >> 16) & 255) + 0.7152 * kanal((n >> 8) & 255) + 0.0722 * kanal(n & 255);
}
export const kontrast = (a, b) => {
  const [h, d] = [leuchtdichte(a), leuchtdichte(b)].sort((x, y) => y - x);
  return (h + 0.05) / (d + 0.05);
};
export const schriftAuf = (hex) => (kontrast(hex, SCHRIFT_DUNKEL) >= kontrast(hex, SCHRIFT_HELL) ? SCHRIFT_DUNKEL : SCHRIFT_HELL);

const runde = (n) => Math.round(n * 10) / 10;

// Ausweichen wie Perlen (Bienenschwarm): Jeder Punkt bleibt bei seinem Wert (x) und sucht die Höhe, die
// am nächsten an der Linie liegt und keinen schon gesetzten Punkt berührt. Die Kandidaten sind die Linie
// selbst und die Höhen, auf denen er einen Nachbarn gerade berührt, darüber und darunter. So legen sich
// die Punkte schräg aneinander statt in Säulen (Fassung mit festen Ebenen: bis zu sieben Punkte übereinander).
function ausweichHoehe(x, gesetzt, abstandMitte) {
  const nah = gesetzt.filter((p) => Math.abs(p.x - x) < abstandMitte);
  const frei = (dy) => nah.every((p) => Math.hypot(p.x - x, p.dy - dy) >= abstandMitte - 1e-6);
  const kandidaten = [0];
  for (const p of nah) {
    const h = Math.sqrt(abstandMitte ** 2 - (p.x - x) ** 2);
    kandidaten.push(p.dy + h, p.dy - h);
  }
  // Nächst an der Linie zuerst; bei gleichem Abstand oben vor unten, damit das Bild immer gleich wird.
  kandidaten.sort((a, b) => Math.abs(a) - Math.abs(b) || a - b);
  return kandidaten.find(frei);
}

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
  const abstandMitte = 2 * S.radius + S.abstand;
  const punkte = [];
  for (const [k, v] of reihe) {
    const x = xVon(v);
    punkte.push({ k, v, x, dy: ausweichHoehe(x, punkte, abstandMitte), s: stufe[k] || null });
  }
  const oben = Math.max(0, ...punkte.map((p) => -p.dy));
  const unten = Math.max(0, ...punkte.map((p) => p.dy));
  const achseY = runde(S.luft + S.radius + oben);
  for (const p of punkte) { p.y = runde(achseY + p.dy); p.dy = runde(p.dy); }
  return {
    breite: S.breite,
    hoehe: runde(achseY + unten + S.radius + S.luft),
    radius: S.radius,
    min, max,
    minK: punkte[0].k, maxK: punkte[punkte.length - 1].k,
    xMin: xVon(min), xMax: xVon(max),
    achseY,
    ch: Number.isFinite(ch) ? { v: ch, x: xVon(ch) } : null,
    punkte,
  };
}

// Wo eine Beschriftung zu einem Punkt steht, in Prozent der Breite, und woran sie ausgerichtet ist:
// am Rand bündig, sonst mittig unter dem Punkt. Website und App setzen sie gleich.
export function beschriftungsLage(x, breite = STREIFEN.breite) {
  const prozent = runde((x / breite) * 100);
  if (prozent < 18) return { prozent, ausrichtung: 'links' };
  if (prozent > 82) return { prozent, ausrichtung: 'rechts' };
  return { prozent, ausrichtung: 'mitte' };
}

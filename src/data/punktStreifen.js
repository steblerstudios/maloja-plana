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

export const STREIFEN = {
  breite: 320, // Einheiten der viewBox
  rand: 10, // links und rechts, damit der halbe Punkt nicht abgeschnitten wird
  radius: 5,
  abstand: 1, // zusätzliche Luft zwischen zwei Punkten
  zeilenHoehe: 11,
  luft: 3, // oben und unten
};

const runde = (n) => Math.round(n * 10) / 10;

// Reihenfolge der Ausweichplätze: auf der Linie, dann eins darüber, eins darunter, zwei darüber …
const ebene = (i) => (i === 0 ? 0 : (i % 2 === 1 ? -1 : 1) * Math.ceil(i / 2));

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
  const frei = new Map(); // je Ebene: ab welchem x der nächste Punkt Platz hat
  const durchmesser = 2 * S.radius + S.abstand;
  const punkte = reihe.map(([k, v]) => {
    const x = xVon(v);
    let i = 0;
    while ((frei.get(ebene(i)) ?? -Infinity) > x) i++;
    const e = ebene(i);
    frei.set(e, x + durchmesser);
    return { k, v, x, ebene: e, s: stufe[k] || null };
  });
  const oben = Math.max(0, ...punkte.map((p) => -p.ebene));
  const unten = Math.max(0, ...punkte.map((p) => p.ebene));
  const achseY = runde(S.luft + S.radius + oben * S.zeilenHoehe);
  for (const p of punkte) p.y = runde(achseY + p.ebene * S.zeilenHoehe);
  return {
    breite: S.breite,
    hoehe: runde(achseY + unten * S.zeilenHoehe + S.radius + S.luft),
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

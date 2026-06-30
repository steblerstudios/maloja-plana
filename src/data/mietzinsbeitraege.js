// Mietzinsbeiträge (individuelle, bedarfsabhängige Wohnkostenzuschüsse) — kantonal/
// kommunal sehr fragmentiert. Anders als die IPV (bundesrechtlich in allen Kantonen)
// gibt es Mietzinsbeiträge nur in einzelnen Kantonen — und oft auf Gemeinde-Ebene.
//
// Drei Zustände (würdevoll, keine Falschaussage):
//   'has'   — Kanton hat ein bestätigtes, einkommensabhängiges Programm → affirmativ + Link
//   'none'  — bestätigt KEINES (auch keine Gemeinde) → ausgegraut „gibt's hier nicht"
//   'check' — variiert / unbekannt (Gemeinden können eigene haben) → ruhig „prüf bei Gemeinde/Kanton"
//
// Konservativ: nur solide belegte Programme sind 'has'; alles andere 'check' (nie ein
// falsches „none"). Die Liste wächst mit weiterer kantonaler Recherche.
// Quelle: BWO „Kantonale Hilfen" (bwo.admin.ch) + kantonale Sozial-/Wohnämter.
export const MIETZINS_OVERVIEW_URL = 'https://www.bwo.admin.ch/bwo/de/home/wohnraumfoerderung/kantonale-hilfen.html';

const cantonPortal = (code) => 'https://www.' + String(code).toLowerCase() + '.ch';

// Bestätigte einkommensabhängige Mietzinsbeitrags-Programme (Stand 2024, konservativ).
const PROGRAMS = {
  BS: { state: 'has', url: cantonPortal('bs') },        // Familienmietzinsbeiträge
  BL: { state: 'has', url: 'https://www.baselland.ch/politik-und-behorden/direktionen/finanz-und-kirchendirektion/sozialamt/mietzinsbeitraege' },
  GE: { state: 'has', url: cantonPortal('ge') },        // Allocations de logement
  ZG: { state: 'has', url: cantonPortal('zg') },        // Mietzinszuschüsse für Mieterschaften
};

// Liefert Verfügbarkeit + Link für einen Kanton (Fallback: 'check').
export function getMietzinsbeitraege(canton) {
  const p = PROGRAMS[canton];
  if (p) return { state: p.state, url: p.url, canton };
  return { state: 'check', url: MIETZINS_OVERVIEW_URL, canton };
}

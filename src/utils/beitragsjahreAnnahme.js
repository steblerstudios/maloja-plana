// Angenommene AHV-Beitragsjahre, wenn im Vorsorge-Rechner keine eingetragen sind (Audit B9).
//
// Gezählt wird wie für die volle Beitragsdauer: ab dem 1. Januar nach dem 20. Geburtstag bis zum
// 31. Dezember vor dem Rentenbeginn (BSV-Merkblatt 3.01, Stand 1.1.2026, Ziff. 12). Bei einem
// Bezug mit vollen Jahren ist das unabhängig vom Geburtsmonat genau «Bezugsalter − 21»: Bezug
// mit 63 → 42 Jahre, mit 65 → 44. Darum ergibt ein Vorbezug eine Teilrente («während des
// Vorbezugs in der Regel eine Teilrente», Ziff. 13).
//
// Ab dem Referenzalter gilt die Beitragsdauer als vollständig (höchstens 44). So bleibt die
// Annahme auch für Frauen der Übergangsjahrgänge (Referenzalter 64 J 3/6/9 M) eine Vollrente,
// ohne den Geburtsmonat zu kennen.
export const VOLLE_BEITRAGSJAHRE_ANNAHME = 44;

export function angenommeneBeitragsjahre(bezugAlter, referenzalterJahre) {
  const bezug = Number(bezugAlter);
  if (!Number.isFinite(bezug)) return VOLLE_BEITRAGSJAHRE_ANNAHME;
  if (bezug >= Number(referenzalterJahre)) return VOLLE_BEITRAGSJAHRE_ANNAHME;
  return Math.min(VOLLE_BEITRAGSJAHRE_ANNAHME, Math.max(0, Math.floor(bezug) - 21));
}

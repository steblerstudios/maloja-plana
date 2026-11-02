// Unterstützungseinheit: wer im Haushalt zusammen gerechnet wird. Eine Regel für die Schnellrechnung
// (config/cantonalData.js) und die Vorbefüllung des Rechners (utils/sozialhilfeVorbefuellung.js).
//
// SKOS-RL, Version vom 1.1.2026 (rl.skos.ch, gelesen 02.11.2026):
// - C.2 Erl. b: Eine Einheit bilden zusammenwohnende Personen, «wenn zwischen diesen Unterhaltspflichten
//   bestehen». Konkubinate bilden keine, «junge Erwachsene» im Haushalt der Eltern eine eigene.
// - C.3.1 Erl. b: Paare oder Gruppen, die zusammenleben, «ohne eine Unterstützungseinheit zu bilden (z.B.
//   Konkubinatspaare, Eltern mit volljährigen Kindern)», sind familienähnliche Gemeinschaften: GBL nach
//   der ganzen Haushaltsgrösse, davon der Anteil (C.3.1 Abs. 2, data/skosGrundbedarf.js).
// - C.4.2 Abs. 2: Die Wohnkosten «werden auf die Personen aufgeteilt».
// - D.4.4: Im stabilen Konkubinat zählt nicht der Lohn, sondern ein Konkubinatsbeitrag als Einnahme. Den
//   kann die App nicht rechnen (erweitertes SKOS-Budget der anderen Person), darum `konkubinatOffen`.

import { partnerEinkommenRoh, erwachseneImHaushalt } from './partnereinkommen.js';
import { giltAlsVerheiratet } from './zivilstand.js';

// Alter in ganzen Monaten am Stichtag; null ohne gültiges Geburtsdatum.
export function alterInMonaten(geburtsdatum, heute) {
  const g = new Date(geburtsdatum);
  if (!geburtsdatum || Number.isNaN(g.getTime())) return null;
  let m = (heute.getFullYear() - g.getFullYear()) * 12 + (heute.getMonth() - g.getMonth());
  if (heute.getDate() < g.getDate()) m -= 1;
  return m;
}

export function kindAlter(kind, heute = new Date()) {
  if (kind?.birthDate) {
    const m = alterInMonaten(kind.birthDate, heute);
    if (m != null) return Math.floor(m / 12);
  }
  const a = Number(kind?.age);
  return Number.isFinite(a) && kind?.age !== '' && kind?.age != null ? a : null;
}

// `kinderListe`: die Kinder im Haushalt; die Schnellrechnung gibt auch die aus dem alten Feld `dependents` mit.
// Ohne Alter gilt ein Kind als minderjährig.
export function unterstuetzungseinheit(basis, heute = new Date(), kinderListe = basis?.household?.children) {
  const kinderAlle = Array.isArray(kinderListe) ? kinderListe : [];
  const verheiratet = giltAlsVerheiratet(basis?.maritalStatus);
  const erwachsene = erwachseneImHaushalt(basis?.household);
  const adults = verheiratet && erwachsene >= 2 ? 2 : 1;
  const erwachseneKinder = kinderAlle.filter(k => { const a = kindAlter(k, heute); return a != null && a >= 18; }).length;
  const kinder = kinderAlle.length - erwachseneKinder;
  const weiterePersonen = Math.max(0, erwachsene - adults) + erwachseneKinder;
  const partner = Number(partnerEinkommenRoh(basis)) || 0;
  return {
    verheiratet, adults, kinder, weiterePersonen,
    einheit: adults + kinder,
    haushalt: adults + kinder + weiterePersonen,
    // Bei erfasstem Partnerlohn ohne Ehe, oder im Konkubinat mit Mitbewohnenden.
    konkubinatOffen: !verheiratet && (partner > 0 || (basis?.maritalStatus === 'cohabiting' && weiterePersonen > 0)),
  };
}

// Der eigene Anteil an den Wohnkosten, Miete plus Nebenkosten (C.4.1 Abs. 2, C.4.2 Abs. 2).
export const wohnkostenAnteil = (wohnkosten, { einheit, haushalt }) => Math.round(wohnkosten * einheit / haushalt);

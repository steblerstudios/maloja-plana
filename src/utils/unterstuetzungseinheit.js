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
//   kann die App nicht rechnen (erweitertes SKOS-Budget der anderen Person), darum ein Hinweis.
// - D.4.5: Wer für berufstätige Mitbewohnende den Haushalt führt, dem wird eine Entschädigung als Einnahme
//   angerechnet, höchstens 950 Franken je Person. Sie hängt am Budget der anderen: nur ein Hinweis.

import { partnerEinkommenRoh, erwachseneImHaushalt } from './partnereinkommen.js';
import { giltAlsVerheiratet } from './zivilstand.js';
import { referenzalterMonate } from '../data/lohnAbzuege.js';

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

export function saeule3aBeziehbar(basis, heute = new Date()) {
  const alter = alterInMonaten(basis?.dateOfBirth, heute);
  if (alter == null) return false;
  const jahrgang = new Date(basis.dateOfBirth).getFullYear();
  return alter >= referenzalterMonate({ geschlecht: basis?.gender, geburtsjahr: jahrgang }) - 60;
}

// Die Felder, die als Vermögen zählen: Sparkonto, Wertschriften, übriges, Säule 3b (SKOS-RL D.3.3 Abs. 6),
// die Säule 3a erst, wenn sie beziehbar ist. Rohwerte, damit ein leeres Feld leer bleibt.
export function vermoegensFelder(finanzen, basis, heute = new Date()) {
  const mit3a = saeule3aBeziehbar(basis, heute) && Number(finanzen?.pension3aBalance) > 0;
  const f = finanzen || {};
  return { mit3a, felder: [f.savingsAccount, f.securitiesValue, f.otherAssets, f.pension3bBalance, mit3a ? f.pension3aBalance : undefined] };
}

// Die Kinder im Haushalt, ohne Haushaltsangabe aus dem alten Feld `dependents`. Ohne Alter gilt ein Kind als
// minderjährig. Zivilstand leer und zwei Erwachsene: gerechnet als Paar, wie bis 02.11.2026 auf der Seite. Getrennt
// gerechnet käme aus einem nicht ausgefüllten Feld ein Betrag (Fachprüfung 02.11.2026). `hinweise` sagt es.
export function unterstuetzungseinheit(basis, heute = new Date()) {
  const hh = basis?.household;
  const kinderAlle = hh && typeof hh === 'object'
    ? (Array.isArray(hh.children) ? hh.children : [])
    : Array.from({ length: Number(basis?.dependents) || 0 }, () => ({ age: 0 }));
  const erwachsene = erwachseneImHaushalt(hh);
  const zivilstandOffen = !basis?.maritalStatus && erwachsene >= 2;
  const verheiratet = giltAlsVerheiratet(basis?.maritalStatus) || zivilstandOffen;
  const adults = verheiratet && erwachsene >= 2 ? 2 : 1;
  const erwachseneKinder = kinderAlle.filter(k => { const a = kindAlter(k, heute); return a != null && a >= 18; }).length;
  const kinder = kinderAlle.length - erwachseneKinder;
  const weiterePersonen = Math.max(0, erwachsene - adults) + erwachseneKinder;
  const partner = Number(partnerEinkommenRoh(basis)) || 0;
  return {
    verheiratet, adults, kinder, weiterePersonen,
    einheit: adults + kinder,
    haushalt: adults + kinder + weiterePersonen,
    // Was an der Rechnung offen ist, als i18n-Schlüssel. Konkubinat: bei erfasstem Partnerlohn ohne Ehe oder beim Zivilstand selbst.
    hinweise: [
      zivilstandOffen && 'pegel.zivilstandOffen',
      !verheiratet && (partner > 0 || basis?.maritalStatus === 'cohabiting') && 'pegel.konkubinatOffen',
      verheiratet && erwachsene < 2 && partner > 0 && 'pegel.zweitePersonFehlt',
      weiterePersonen > 0 && 'pegel.haushaltsfuehrungOffen',
    ].filter(Boolean),
  };
}

// Der eigene Anteil an den Wohnkosten, Miete plus Nebenkosten (C.4.1 Abs. 2, C.4.2 Abs. 2).
export const wohnkostenAnteil = (wohnkosten, { einheit, haushalt }) => Math.round(wohnkosten * einheit / haushalt);

// Einnahmen Minderjähriger zählen nur bis zu ihrem Anteil am Budget (SKOS-RL D.1 Abs. 2). Die App rechnet sie ganz an.
export const kinderEinnahmenOffen = (finanzen, { kinder }) => kinder > 0 && (Number(finanzen?.alimenteReceived) > 0 || Number(finanzen?.familienzulagen) > 0);

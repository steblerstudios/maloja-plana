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
//   angerechnet, höchstens 950 Franken je Person (Stand 1.1.2026), die Anzeige nennt den Betrag. Sie hängt am Budget der anderen: nur ein Hinweis.

import { partnerEinkommenRoh, erwachseneImHaushalt } from './partnereinkommen.js';
import { giltAlsVerheiratet } from './zivilstand.js';
import { fruehesterVorbezugMonate } from '../data/lohnAbzuege.js';
import { alterUndRentenalter } from './nettoAusProfil.js';

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

// Die Säule 3a ist «grundsätzlich zusammen mit dem AHV-Vorbezug» herauszulösen (SKOS-RL D.3.3 Abs. 3, Erl. b), also
// ab dem frühesten Vorbezug. Bis 02.11.2026 galten hier fünf Jahre vor dem Referenzalter (BVV 3 Art. 3 Abs. 1): Das
// sagt, ab wann man beziehen KANN, nicht, ab wann die Sozialhilfe es verlangt. «Grundsätzlich»: kantonal nicht geprüft.
export function saeule3aZaehlt(basis, heute = new Date()) {
  const alter = alterInMonaten(basis?.dateOfBirth, heute);
  if (alter == null) return false;
  const jahrgang = new Date(basis.dateOfBirth).getFullYear();
  return alter >= fruehesterVorbezugMonate({ geschlecht: basis?.gender, geburtsjahr: jahrgang });
}

// Die Felder, die als Vermögen zählen: Sparkonto, Wertschriften, übriges, Säule 3b (SKOS-RL D.3.3 Abs. 6),
// die Säule 3a erst ab dem frühesten AHV-Vorbezug oder mit einer ganzen IV-Rente (D.3.3 Abs. 3, Version vom 1.1.2026, gelesen
// 03.11.2026). Eine Teilrente löst sie nicht aus: BVV 3 Art. 3 Abs. 2 Bst. a. Rohwerte, damit ein leeres Feld leer bleibt.
export function vermoegensFelder(finanzen, basis, heute = new Date()) {
  const nachAlter = saeule3aZaehlt(basis, heute);
  const mit3a = (nachAlter || finanzen?.ivBezug === 'ganz') && Number(finanzen?.pension3aBalance) > 0;
  const f = finanzen || {};
  return { mit3a, durchIv: mit3a && !nachAlter, felder: [f.savingsAccount, f.securitiesValue, f.otherAssets, f.pension3bBalance, mit3a ? f.pension3aBalance : undefined] };
}

// Die 2. Säule hängt am selben Auslöser wie die 3a: «Vermögen der 2. Säule und der Säule 3a sind grundsätzlich zusammen
// mit dem AHV-Vorbezug oder dem Bezug einer ganzen IV-Rente herauszulösen» (SKOS-RL D.3.3 Abs. 3, Version vom 1.1.2026,
// gelesen 03.11.2026), ausgelöst zählen sie zum Vermögen (Abs. 5). Bei der IV nach Erl. b nur, wenn das Invaliditätsrisiko
// nicht zusätzlich versichert ist; die Texte sagen es. Ob Kapital oder Rente und wie viel, hängt von Reglement und Begehren
// ab, die Auflage macht der Sozialdienst. Das Profil kennt nur das Guthaben (`versicherungen.bvgBalance`): keine Zahl im
// Vermögen, sondern kein Betrag, solange die Lücke daran hängen kann (F8-Prüfer, 03.11.2026).
// Ist eine Rente der Pensionskasse eingetragen, ist die Frage Kapital oder Rente beantwortet: dann nicht mehr offen.
export function bvgHerausloesen(finanzen, versicherungen, basis, heute = new Date()) {
  return (saeule3aZaehlt(basis, heute) || finanzen?.ivBezug === 'ganz') && Number(versicherungen?.bvgBalance) > 0
    && !(Number(finanzen?.bvgRente) > 0);
}

// Die Rentenfelder im Kapitel Finanzen (seit 04.11.2026), Beträge pro Monat. Sie zählen als Einnahme (SKOS-RL D.1 Abs. 1,
// Version vom 1.1.2026: «alle verfügbaren Einnahmen», Erl. a: «einschliesslich Renten der AHV/IV/UV»), nicht als Erwerb:
// kein Einkommensfreibetrag (D.2 Abs. 1 nur auf Erwerbseinkommen).
export const RENTEN_FELDER = ['ahvRente', 'ivRente', 'bvgRente'];
const eingetragen = (v) => v != null && String(v).trim() !== '' && Number.isFinite(Number(v)) && Number(v) >= 0;
// Eingetragen heisst: das Feld hat eine Zahl, auch eine 0 («keine Rente», etwa bei Aufschub).
export const renteEingetragen = (finanzen) => RENTEN_FELDER.some((k) => eingetragen(finanzen?.[k]));
export const rentenMonat = (finanzen) => RENTEN_FELDER.reduce((s, k) => s + Math.max(0, Number(finanzen?.[k]) || 0), 0);

// Rente bezogen, ihre Höhe aber nicht eingetragen: kein Betrag aus einem Einkommen ohne die Rente, eine Regel für
// Sozialhilfe, Rechner und IPV (Fachprüfung 03.11.2026). Ab dem Referenzalter fliesst fast immer eine AHV-Rente, auch
// bei Erwerbstätigen (Fachprüfung 8ac049b5); wer sie aufschiebt, trägt eine 0 ein. Das Feld muss zur Lage passen: IV-Bezug
// braucht die IV-Rente, Ruhestand oder Rentenalter die AHV-Rente. Eine Pensionskassen-Rente allein hebt die Sperre nicht
// auf (Fachprüfung 376149dc, Muss: sonst Lücke 2411 statt 611 und IPV 450 statt 242).
export const renteOhneBetrag = (finanzen, basis, heute = new Date()) =>
  (['ganz', 'teil'].includes(finanzen?.ivBezug) && !eingetragen(finanzen?.ivRente))
  || ((finanzen?.employmentType === 'retired' || alterUndRentenalter(basis, heute).rentenalter) && !eingetragen(finanzen?.ahvRente));

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
    // Stebler Studios 02.11.2026: dann kein Betrag. D.4.4: Ein Beitrag zählt als Einnahme, die App kennt Dauer und Budget nicht.
    konkubinatMitLohn: !verheiratet && partner > 0,
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

// Kurzfristig verfügbar (SKOS-RL D.3.1 Erl. a und c): Bankguthaben und Wertpapiere.
export const verfuegbarUeberFreibetrag = (finanzen, freibetrag) => (Number(finanzen?.savingsAccount) || 0) + (Number(finanzen?.securitiesValue) || 0) > freibetrag;

// Einnahmen Minderjähriger zählen nur bis zu ihrem Anteil am Budget (SKOS-RL D.1 Abs. 2). Die App rechnet sie ganz an.
export const kinderEinnahmenOffen = (finanzen, { kinder }) => kinder > 0 && (Number(finanzen?.alimenteReceived) > 0 || Number(finanzen?.familienzulagen) > 0);

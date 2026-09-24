// Partnereinkommen — wann das Feld «Nettolohn Partner/in» gilt. Eine Regel für Anzeige und Rechnung.
//
// K62.3: Das Feld erscheint bei zwei oder mehr Erwachsenen im Haushalt, und bei «verheiratet»,
// «eingetragene Partnerschaft» oder «Konkubinat» auch dann, wenn erst eine Person erfasst ist (die
// Steuerschätzung fragt danach, R4 / K62.5).
// K62-Nachlauf A: Was nicht sichtbar ist, zählt nicht. Wird die zweite Person gelöscht (und der
// Zivilstand verlangt das Feld nicht), bleibt household.partnerIncome gespeichert — die Person kann
// wieder hinzukommen —, fliesst aber in keine Rechnung mehr. Darum lesen die Rechner das
// Partnereinkommen nur über partnerEinkommenRoh() / getHouseholdInfo(), die diese Regel anwenden.

import { giltAlsVerheiratet } from './zivilstand.js';

// Zivilstände, bei denen eine zweite erwachsene Person im Haushalt erwartet wird.
export function partnerErwartet(maritalStatus) {
  return giltAlsVerheiratet(maritalStatus) || maritalStatus === 'cohabiting';
}

// Anzahl Erwachsene im Haushalt, genau wie die Erfassung im Kapitel «Basis» sie zählt: die Liste
// adultsList (ich + weitere), sonst die ältere Zahl `adults`, mindestens 1.
export function erwachseneImHaushalt(household) {
  const hh = household && typeof household === 'object' ? household : {};
  if (Array.isArray(hh.adultsList)) return 1 + hh.adultsList.length;
  return Math.max(1, Number(hh.adults) || 1);
}

export const zeigtPartnereinkommen = (adultCount, maritalStatus) =>
  adultCount >= 2 || partnerErwartet(maritalStatus);

// K62-Nachlauf E: Zivilstand erwartet eine zweite Person, erfasst ist nur eine.
export const zweitePersonFehlt = (adultCount, maritalStatus) =>
  adultCount < 2 && partnerErwartet(maritalStatus);

// Zählt das gespeicherte Partnereinkommen? Nur, wenn das Feld nach derselben Regel sichtbar wäre.
export function partnerEinkommenZaehlt(basis) {
  const b = basis && typeof basis === 'object' ? basis : {};
  return zeigtPartnereinkommen(erwachseneImHaushalt(b.household), b.maritalStatus);
}

// Der gespeicherte Rohwert (Text, wie eingetippt), oder undefined, wenn er nicht zählt.
export function partnerEinkommenRoh(basis) {
  if (!partnerEinkommenZaehlt(basis)) return undefined;
  return basis?.household?.partnerIncome;
}

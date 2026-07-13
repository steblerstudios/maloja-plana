// Reine Logik für den IPV-Prämien-Beleg — kein React, damit testbar.
// Zeigt IPV als das, was es ist: ein Abzug von der KK-Prämie (Prämie − Verbilligung
// = selbst). Phase 1 „geschätzt" — reine Anzeige über calculateIPV, keine eigene
// Rechnung. Bewusst ein anderes Material (Papier) als der Sozialhilfe-Pegel (Glas),
// damit die beiden nebeneinander unterscheidbar sind.
//
//   empty      → kein Kanton / kein Einkommen: nichts zu zeigen
//   over       → über der Einkommensgrenze: keine Verbilligung, andere Wege
//   nopremium  → Anspruch da, aber KK-Prämie fehlt → Betrag ohne Aufteilung
//   eligible   → Anspruch + Prämie bekannt → voller Beleg mit Deckungsbalken
import { calculateIPV } from '../config/cantonalData.js';
import { readIpvStatus, IPV_STATUS } from './ipvStatus.js';

export function praemienBelegState(data) {
  const canton = data?.basis?.canton || '';
  const income = Number(data?.finanzen?.monthlyIncome || 0);
  const praemie = Number(data?.versicherungen?.kkPremium || 0);
  const ipv = calculateIPV(data);
  // Read-only Spiegelung des Lebenslinie-Status (gesetzt wird er nur im Voll-Tool).
  const confirmed = readIpvStatus(data).status === IPV_STATUS.BESTAETIGT;

  if (!canton || income <= 0) {
    return { show: true, mode: 'empty', verbilligung: 0, praemie, selbst: praemie, canton, confirmed };
  }
  if (!ipv?.eligible) {
    return { show: true, mode: 'over', verbilligung: 0, praemie, selbst: praemie, canton, confirmed };
  }
  const verbilligungRoh = Number(ipv.amount) || 0;
  const hasPraemie = praemie > 0;
  // Eine Verbilligung senkt die Prämie — sie kann sie nie übersteigen (keine
  // Auszahlung). calculateIPV kennt die eingetragene Prämie nicht, also hier bei
  // bekannter Prämie deckeln, sonst zeigt der Beleg einen unmöglichen Betrag.
  const verbilligung = hasPraemie ? Math.min(verbilligungRoh, praemie) : verbilligungRoh;
  // „selbst" nur ehrlich wenn die Prämie bekannt ist; nie negativ.
  const selbst = hasPraemie ? Math.max(0, praemie - verbilligung) : 0;
  return {
    show: true,
    mode: hasPraemie ? 'eligible' : 'nopremium',
    verbilligung, praemie, selbst, canton, confirmed,
  };
}

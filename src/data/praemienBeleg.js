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
//   orientierung → Kanton nicht amtlich belegt (E9) und Prämie erfasst: Beleg ohne
//                  Betrag, nur der neutrale Hinweis «Anspruch und Höhe legt der Kanton fest»
//   fristVorbei  → Anspruch geschätzt, aber die Anmeldefrist ist vorbei (Luzern, SRL 866
//                  § 12 Abs. 3): kein Abzug, die Prämie bleibt ganz selbst, dazu der Grund
//
// Was abgezogen wird, entscheidet allein data/ipvAbzug.js — hier nur Darstellung und Deckel.
import { calculateIPV } from '../config/cantonalData.js';
import { ipvAbzug, IPV_ABZUG_GRUND } from './ipvAbzug.js';

export function praemienBelegState(data) {
  const canton = data?.basis?.canton || '';
  const income = Number(data?.finanzen?.monthlyIncome || 0);
  const praemie = Number(data?.versicherungen?.kkPremium || 0);
  const ipv = calculateIPV(data);
  // Read-only Spiegelung des Lebenslinie-Status (gesetzt wird er nur im Voll-Tool).
  // Der „bestätigt"-Stempel darf NUR erscheinen, wo der Beleg auch eine Verbilligung
  // zeigt — nie neben „keine Verbilligung" (over) oder auf einem leeren Beleg, sonst
  // widerspricht der Stempel der Karte, auf der er sitzt. Und nur, wenn die Verfügung für das
  // laufende Jahr und den aktuellen Kanton gilt (data/ipvAbzug.js) — sonst stünde «bestätigt»
  // neben der Schätzung.
  if (!canton || income <= 0) {
    return { show: true, mode: 'empty', verbilligung: 0, praemie, selbst: praemie, canton, confirmed: false };
  }
  const abzug = ipvAbzug(data, ipv);
  const confirmed = abzug.grund === IPV_ABZUG_GRUND.BESTAETIGT;
  // Eine eingetragene Verfügung mit Betrag gilt vor der Schätzung — auch wo die Schätzung
  // «unbelegt» oder «über der Grenze» sagt; sonst stünde der Stempel neben einer anderen Zahl.
  if (abzug.grund === IPV_ABZUG_GRUND.BESTAETIGT) return belegMitBetrag(abzug.betrag, praemie, canton, confirmed);
  // E9: unbelegter Kanton → nie ein Betrag, nie «keine Verbilligung».
  if (ipv?.belegt === false) {
    return ipv.anspruchMoeglich
      ? { show: true, mode: 'orientierung', verbilligung: 0, praemie, selbst: praemie, canton, confirmed: false, noteKey: ipv.noteKey }
      : { show: true, mode: 'empty', verbilligung: 0, praemie, selbst: praemie, canton, confirmed: false };
  }
  if (!ipv?.eligible) {
    return { show: true, mode: 'over', verbilligung: 0, praemie, selbst: praemie, canton, confirmed: false };
  }
  if (abzug.grund === IPV_ABZUG_GRUND.FRIST_VORBEI) {
    return { show: true, mode: 'fristVorbei', verbilligung: 0, praemie, selbst: praemie, canton, confirmed: false, noteKey: 'ipv.luFristNichtAbgezogen', noteParams: abzug.frist };
  }
  // Altbestand ohne Kanton/Jahr: der Betrag ist gedeckelt an der Verfügung — der Beleg sagt
  // «Verfügung ohne Jahr» statt «geschätzt», aber keinen Stempel.
  const beleg = belegMitBetrag(abzug.betrag, praemie, canton, confirmed);
  if (abzug.grund === IPV_ABZUG_GRUND.VERFUEGUNG_UNZUGEORDNET) beleg.verfuegungOhneJahr = true;
  return beleg;
}

function belegMitBetrag(verbilligungRoh, praemie, canton, confirmed) {
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

// Die EINE Stelle für die Frage: welcher IPV-Betrag darf von der KK-Prämie abgezogen werden?
// Reine Logik, kein React. Budget (budgetSync.js), KK-Last-Karte (KKLastCard.jsx) und
// Prämien-Beleg (data/praemienBeleg.js) ziehen nur diesen Betrag ab — nie `ipv.amount` direkt
// (Wächter: __tests__/ipvAbzug.test.js). Die Anspruchs-Rechnung (calculateIPV) bleibt unberührt:
// sie sagt, wie hoch der Jahresanspruch ist; hier geht es darum, was davon sicher ankommt.
//
// Rückgabe: { betrag, grund, frist }
//   betrag  → CHF pro Monat, ungedeckelt (die Leser deckeln an der erfassten Prämie wie bisher)
//   grund   → 'bestaetigt'  Verfügung eingetragen, für das laufende Jahr und den aktuellen
//                           Wohnkanton: ihr Betrag gilt (auch in einem nicht belegten Kanton)
//             'verfuegungUnzugeordnet'  Verfügung ohne Kanton/Jahr (Altbestand): höchstens ihr
//                           Betrag, nie mehr als die Schätzung (nur wenn dabei > 0 herauskommt)
//             'geschaetzt'  amtlich belegter Kanton, Anspruch, nichts spricht dagegen
//             'fristVorbei' Anspruch geschätzt, aber die Anmeldefrist ist abgelaufen → 0
//             'keiner'      kein Anspruch, kein belegter Kanton oder kein Betrag → 0
//   frist   → { jahr, vorjahr } nur bei 'fristVorbei' (Parameter für den Hinweis-Text)
//
// Luzern (K31, config/ipvLuzern.js): SRL 866 § 12 Abs. 2/3 — Anmeldung bis 31. Oktober des
// Vorjahres; wer später kommt, erhält nur die Prämien verbilligt, «die nach der Gesuchstellung
// fällig werden». Ob und wann angemeldet wurde, weiss die App nicht — darum nach der Frist 0,
// ausser eine Verfügung ist mit Betrag eingetragen (dann ist die Anmeldung belegt).
//
// EL und Sozialhilfe: nach SRL 866 § 8 Abs. 2/3 gilt die Anmeldefrist des § 12 für sie nicht
// (die Verbilligung kommt ohne Gesuch). Das Profil kennt aber keinen Bezug von EL oder
// Sozialhilfe (nur deren Schätzung, keine Angabe «beziehe ich»), also kann diese Stelle die
// Gruppe nicht erkennen. Sie bleibt hier beim Grund 'fristVorbei'; der Hinweis-Text ist so
// gefasst, dass er für sie nicht falsch wird (er sagt «nicht abgezogen», nicht «kein Anspruch»),
// und der Weg über «Verfügung erhalten» führt auch für sie zum richtigen Betrag.
// Die Verfügung gilt nur für ihr Jahr und ihren Kanton (Deploy-Gate Runde 3, 24.09.2026): eine
// LU-Verfügung 2026 darf im Januar 2027 nichts mehr abziehen — dort sagt die Schätzung «Jahr
// vorbei, keine Zahl» —, und nach einem Umzug gilt die Verfügung des alten Kantons nicht.
// Anspruchsjahr = das laufende Kalenderjahr.
//
// Altbestand (Deploy-Gate Runde 4, 24.09.2026): Einträge von vor 0.1.40-beta tragen weder Kanton
// noch Jahr. Sie sind nicht zuordenbar, aber sie sind eine echte Verfügung — der bestätigte Betrag
// ist eine Obergrenze. Darum: Abzug = min(Verfügungsbetrag, Schätzung nach allen ihren Regeln —
// E9, Jahr vorbei, Luzerner Frist → dort 0). Grund 'verfuegungUnzugeordnet', bis die Person auf der
// Seite Prämienverbilligung sichtbar «Ja» sagt (PremiumSubsidy.jsx ergänzt dann Kanton und Jahr).
// Ein Eintrag, dessen Kanton oder Jahr bekannt ist und NICHT passt, gilt nicht: Schätzung.
import { calculateIPV } from '../config/cantonalData.js';
import { readIpvStatus, IPV_STATUS } from './ipvStatus.js';

export const IPV_ABZUG_GRUND = {
  BESTAETIGT: 'bestaetigt', VERFUEGUNG_UNZUGEORDNET: 'verfuegungUnzugeordnet',
  GESCHAETZT: 'geschaetzt', FRIST_VORBEI: 'fristVorbei', KEINER: 'keiner',
};

// Wofür eine eingetragene Verfügung steht — gelesen von ipvAbzug und von der Seite
// Prämienverbilligung (PremiumSubsidy.jsx), damit beide dasselbe sagen:
//   null            → keine bestätigte Verfügung mit Betrag
//   'gilt'          → laufendes Jahr, aktueller Wohnkanton
//   'unzugeordnet'  → Kanton und/oder Jahr fehlen, und was da ist, widerspricht nicht
//   'giltNicht'     → Kanton oder Jahr bekannt und anders als jetzt
export const VERFUEGUNG_ZUORDNUNG = { GILT: 'gilt', UNZUGEORDNET: 'unzugeordnet', GILT_NICHT: 'giltNicht' };

export function verfuegungZuordnung(data, status = readIpvStatus(data)) {
  if (status.status !== IPV_STATUS.BESTAETIGT || !(status.betrag > 0)) return null;
  const kanton = (data && data.basis && data.basis.canton) || null;
  const jahr = new Date().getFullYear();
  const kantonPasst = status.kanton == null || status.kanton === kanton;
  const jahrPasst = status.jahr == null || status.jahr === jahr;
  if (!kantonPasst || !jahrPasst) return VERFUEGUNG_ZUORDNUNG.GILT_NICHT;
  if (status.kanton == null || status.jahr == null) return VERFUEGUNG_ZUORDNUNG.UNZUGEORDNET;
  return kanton ? VERFUEGUNG_ZUORDNUNG.GILT : VERFUEGUNG_ZUORDNUNG.GILT_NICHT;
}

export function verfuegungGilt(data, status = readIpvStatus(data)) {
  return verfuegungZuordnung(data, status) === VERFUEGUNG_ZUORDNUNG.GILT;
}

// Die Schätzung allein, nach allen ihren Regeln.
function schaetzungsAbzug(ipv) {
  // E9: nur ein amtlich belegter Kanton liefert einen Betrag.
  if (!ipv || !ipv.eligible || !ipv.belegt) {
    return { betrag: 0, grund: IPV_ABZUG_GRUND.KEINER, frist: null };
  }
  if (ipv.anmeldefristVorbei === true) {
    return { betrag: 0, grund: IPV_ABZUG_GRUND.FRIST_VORBEI, frist: { jahr: ipv.jahr, vorjahr: ipv.jahr - 1 } };
  }
  const betrag = Math.max(0, Number(ipv.amount) || 0);
  return { betrag, grund: betrag > 0 ? IPV_ABZUG_GRUND.GESCHAETZT : IPV_ABZUG_GRUND.KEINER, frist: null };
}

// `ipv` darf mitgegeben werden, wenn der Leser calculateIPV schon gerechnet hat (gleiches Ergebnis,
// nur ohne zweite Rechnung).
export function ipvAbzug(data, ipv = calculateIPV(data || {})) {
  const status = readIpvStatus(data);
  const zuordnung = verfuegungZuordnung(data, status);
  if (zuordnung === VERFUEGUNG_ZUORDNUNG.GILT) {
    return { betrag: status.betrag, grund: IPV_ABZUG_GRUND.BESTAETIGT, frist: null };
  }
  const schaetzung = schaetzungsAbzug(ipv);
  if (zuordnung === VERFUEGUNG_ZUORDNUNG.UNZUGEORDNET && schaetzung.betrag > 0) {
    return { betrag: Math.min(status.betrag, schaetzung.betrag), grund: IPV_ABZUG_GRUND.VERFUEGUNG_UNZUGEORDNET, frist: null };
  }
  return schaetzung;
}

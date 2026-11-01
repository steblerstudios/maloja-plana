// Reine Logik für «Was steht mir zu?» (Entscheid O, 24.10.2026) und Schritt 1 des geführten
// Anspruch-Checks — kein React, damit testbar. Rechnet NICHTS neu: dieselben Aufrufe wie bis
// 27.10.2026 im Schnellcheck (calculateIPV / calculateSozialhilfe / checkELEligibility, alle in
// config/cantonalData.js), mit denselben Ehrlichkeits-Gates. Hierher gezogen, damit beide Orte
// dieselbe Antwort geben und keiner die Gates abschreibt.
import { calculateIPV, calculateSozialhilfe, checkELEligibility } from '../config/cantonalData.js';
import { pegelState, sozialhilfePegelState } from './pegel.js';
import { ipvAbzug, IPV_ABZUG_GRUND } from './ipvAbzug.js';

// Die möglichen Wege aus einem Satz Angaben (`probe`: Profil mit den hier angepassten Zahlen).
// Nur POSITIVE Hinweise, nie ein «Nein»-Verdikt. Wirft eine Rechnung, bleibt die Liste leer
// (Orientierung, nie blockierend).
export function wegeAusProbe(probe) {
  const canton = probe?.basis?.canton || '';
  const income = Number(probe?.finanzen?.monthlyIncome) || 0;
  const rent = Number(probe?.wohnen?.rentAmount) || 0;
  const wege = [];
  try {
    // IPV: kantonal + einkommensgetrieben. Ohne Kanton kein erfundener Betrag.
    const ipv = (income > 0 && canton) ? calculateIPV(probe) : null;
    // E9: ohne amtlich belegten Kanton ein Weg ohne Betrag («prüfen»), wie bei der EL.
    if (ipv && ipv.eligible) wege.push({ key: 'ipv', monthly: ipv.amount });
    else if (ipv && ipv.anspruchMoeglich) wege.push({ key: 'ipv', qualitative: true });
    // Sozialhilfe: nur mit Mietkontext (sonst Bedarf unvollständig) + ungedecktem
    // Bedarf + Vermögen unter Freibetrag — sonst wäre «Anspruch» unehrlich.
    if (rent > 0) {
      const sh = calculateSozialhilfe(probe);
      if (sh?.eligible && (sh?.vermoegenUeberFreibetrag || 0) === 0) wege.push({
        key: 'soz', monthly: sh.deficit, vfbUnbestaetigt: !!sh.vfbUnbestaetigt, mitGanzerMiete: !!sh.mitGanzerMiete,
      });
    }
    // EL: nur bei AHV-/IV-Kontext (Renten hinterlegt). Qualitativ, kein Betrag.
    const el = checkELEligibility(probe);
    if (el?.eligible) wege.push({ key: 'el', qualitative: true });
  } catch { /* Orientierung, nie blockierend */ }
  // IPV ist subsidiär: greift Sozialhilfe, wird die volle Prämie schon über den Sozialhilfe-
  // Bedarf mitgetragen — dann kein zusätzlicher Geldbetrag. Quelle: SKOS-Faktenblatt
  // «IPV und Sozialhilfe» 2024.
  const monetaer = wege.filter((w) => !w.qualitative && w.monthly > 0);
  const ipvSubsumed = monetaer.some((w) => w.key === 'soz');
  const ipvAmount = (monetaer.find((w) => w.key === 'ipv') || {}).monthly || 0;
  return { wege, monetaer, ipvSubsumed, ipvAmount };
}

// Was der IPV-Pegel zeigen darf. Der Pegel (pegelState) misst das rohe Jahreseinkommen an der
// Grenze; die Kantonsmodelle (ZH, BE …) rechnen mit einem eigenen massgebenden Einkommen. Wo die
// beiden auseinanderlaufen, stünde das Wasser neben einem Betrag auf der falschen Seite der Linie
// (Fachprüfung 25.10.2026, PraemienOrientierung.jsx). Darum zeigt das Glas nur, wenn es zu
// calculateIPV passt; sonst dieselbe Aussage ohne Glas. Eine gültige Verfügung geht vor — wie im
// Kapitel Finanzen (components/FinanzAuswertung.jsx, ipvKarte).
//   art 'verfuegung' → Betrag laut Verfügung (bestaetigt) oder höchstens die Verfügung
//   art 'laden'      → Kantonsmodell lädt noch (ladeIPVModelle), kein Betrag
//   art 'offen'      → kein Kanton / kein Beleg: Orientierung ohne Betrag (ipv.noteKey)
//   art 'pegel'      → Glas, passt zu calculateIPV
//   art 'ohneGlas'   → gleiche Aussage wie calculateIPV, ohne Wasserstand
export function ipvAnzeige(probe) {
  const canton = probe?.basis?.canton || '';
  const income = Number(probe?.finanzen?.monthlyIncome) || 0;
  if (!canton || income <= 0) return { art: 'leer' };
  const ipv = calculateIPV(probe);
  const abzug = ipvAbzug(probe, ipv);
  if (abzug.grund === IPV_ABZUG_GRUND.BESTAETIGT || abzug.grund === IPV_ABZUG_GRUND.VERFUEGUNG_UNZUGEORDNET) {
    return { art: 'verfuegung', ipv, betrag: abzug.betrag, bestaetigt: abzug.grund === IPV_ABZUG_GRUND.BESTAETIGT };
  }
  if (ipv.offen === 'laden') return { art: 'laden', ipv };
  if (ipv.belegt === false) return { art: 'offen', ipv };
  // Luzern nach der Anmeldefrist (data/ipvAbzug.js): der Anspruch bleibt, kommt aber nicht mehr ganz
  // an — die Karte im Kapitel Finanzen sagt es dazu, hier ebenso.
  const fristVorbei = abzug.grund === IPV_ABZUG_GRUND.FRIST_VORBEI;
  const pegel = pegelState(probe);
  const passt = ipv.eligible ? (pegel.mode === 'clear' || pegel.mode === 'edge') : pegel.mode === 'over';
  return passt ? { art: 'pegel', ipv, pegel, fristVorbei } : { art: 'ohneGlas', ipv, fristVorbei };
}

// Sozialhilfe-Pegel: braucht Kanton, Einkommen und Miete, sonst wäre der Bedarf unvollständig.
export function sozialhilfeAnzeige(probe) {
  const canton = probe?.basis?.canton || '';
  const income = Number(probe?.finanzen?.monthlyIncome) || 0;
  const rent = Number(probe?.wohnen?.rentAmount) || 0;
  if (!canton || income <= 0 || rent <= 0) return null;
  return sozialhilfePegelState(probe);
}

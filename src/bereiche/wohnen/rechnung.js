// Lebensbereich Wohnen · alle Rechnungen (Bauplan Lebensbereich, Stebler Studios 18.11.2026: «wohnen sauber
// zusammen bringen … dann alle anderen kapitel gleich aufbauen»). Nur Zahlen, kein Bild-Bauteil, kein React.
// Drei Fragen, je eine Rechnung:
//   A Anteil — Wie viel vom Einkommen geht ans Wohnen?   wohnkostenRechnung (unten)
//   B Lage   — Wo steht meine Miete im Vergleich?        mieteLage (Kanton, Schweiz, EU)
//   C Hilfe  — Bekomme ich Hilfe an die Miete?           mietzinsHilfe (aus data/mietzinsbeitraege.js)
// Bilder: bereiche/wohnen/bilder.jsx · Zuhause (Kapitel) und Werkzeug: bereiche/wohnen/zuhause.jsx.
// Wächter: src/__tests__/bauplanWohnen.test.js. Bis 18.11.2026 lag Frage A in data/wohnkosten.js.
//
// Frage A · Wohnkosten-Anteil und «Drittel» — EINE Rechnung für alle Orte (Stebler Studios 11.11.2026,
// «am liebsten alle drei vereint»): Kapitel Wohnen (WohnkostenInstrument), Mietzins-Werkzeug
// (MietVergleich) und Budget (BudgetSync). Wächter: src/__tests__/wohnkostenEineRechnung.test.js.
//
// Bis 11.11.2026 rechneten die drei Orte verschieden: das Kapitel alle Wohnkosten ÷ alle eigenen
// Einnahmen, das Mietzins-Werkzeug Miete + Nebenkosten ÷ nur den Lohn, das Budget die Grenze als
// Haushaltseinkommen (mit Partner/in) ÷ 3. Dieselbe Person sah «30 %» im Kapitel und «!» im Werkzeug.
//
// Es gilt die Regel des Kapitels (Fachprüfung 24.10.2026):
//   • Wohnkosten = Nettomiete + Nebenkosten + Hypothek + Gebäudeversicherung ÷ 12.
//   • Einkommen = die eigenen Einnahmen aus der einen Monatsrechnung (Lohn, Nebenverdienst,
//     Familienzulagen, Alimente) — utils/monatsrechnung.js.
//   • Partner/in im Haushalt: die Wohnkosten gelten für den Haushalt, das Einkommen ist das eigene.
//     Dann kein Urteil «mehr als ein Drittel» und keine «!»-Grenze.
//   • Das Drittel ist eine Faustregel, keine Vorschrift.
//
// Partner-Haus (Stebler Studios 11.11.2026; Fachprüfung swiss-precision-pruefer 11.11.2026): Ist der Nettolohn
// der Partnerin/des Partners erfasst, sind es genau zwei Erwachsene und ist kein Lohn brutto erfasst, rechnet
// das Drittel mit den Netto-Einnahmen des HAUSHALTS — dieselbe Summe wie das Budget (haushaltsEinnahmen).
// Sonst bleibt es ohne Urteil (`mitPartner`). Ohne Urteil auch, wenn eine zweite Person erwartet wird, das
// Feld aber leer ist (`partnerOffen`): sonst stünde die Haushaltsmiete gegen das eigene Einkommen.
// Ausdrücklich «0» heisst: kein Partnereinkommen, das eigene ist das Haushaltseinkommen.
import { eigeneEinnahmen, sumAllExpenses } from '../../utils/monatsrechnung.js';
import { haushaltsEinnahmen } from '../../data/haushaltsEinnahmen.js';
import { partnerEinkommenRoh, partnerEinkommenZaehlt, erwachseneImHaushalt } from '../../utils/partnereinkommen.js';
import { getHouseholdInfo } from '../../config/cantonalData.js';
import { getRentComparison } from '../../data/mietpreise.js';
import { mietzinsEinschaetzung, beitragHoechstMonat } from '../../data/mietzinsbeitraege.js';
import { mietzinsPegelState } from '../../data/pegel.js';
import { auslandStoecke } from '../../data/wohnenInternational.js';
import { lageZurRegion, lageWert } from '../../utils/lage.js';
import { zahl } from '../../utils/geld.js';

export { lageZurRegion, lageWert };

const n = (v) => { const x = Number(v); return Number.isFinite(x) && x > 0 ? x : 0; };

// Reine Rechnung, damit sie ohne DOM geprüft werden kann. `wohnen` ist der (gerade bearbeitete)
// Stand des Kapitels, `allData` das ganze Profil, `miete` eine ausprobierte Nettomiete (optional).
export function wohnkostenRechnung(wohnen, allData, miete) {
  const heute = n(wohnen?.rentAmount);
  const nk = n(wohnen?.utilities);
  const netto = miete == null ? heute : n(miete);
  // Eigentum: wie die Monatsrechnung — «Hypothek vorhanden? Nein» zählt nicht.
  const hypothek = wohnen?.mortgageStatus === 'no' ? 0 : n(wohnen?.mortgagePayment);
  const eigentum = hypothek > 0;
  const kosten = netto + nk + hypothek + n(wohnen?.buildingsInsurance) / 12;
  const { total: eigenes, brutto } = eigeneEinnahmen(allData?.finanzen);
  const e = haushaltsEinnahmen({ finanzen: allData?.finanzen || {} });
  const ganzBrutto = brutto && e.lohnArt === 'brutto' && e.lohn > 0 && (e.neben === 0 || e.nebenArt === 'brutto') && e.familienzulagen + e.alimente === 0;
  const basis = allData?.basis;
  const roh = partnerEinkommenRoh(basis);
  const partner = n(roh);
  const partnerOffen = partnerEinkommenZaehlt(basis) && String(roh ?? '').trim() === '';
  const haushalt = partner > 0 && !brutto && erwachseneImHaushalt(basis?.household) <= 2;
  const mitPartner = (partner > 0 && !haushalt) || partnerOffen;
  const einkommen = haushalt ? haushaltsEinnahmen({ finanzen: allData?.finanzen || {}, basis }).total : eigenes;
  const anteil = einkommen > 0 ? (kosten / einkommen) * 100 : null;
  const profil = { ...(allData || {}), wohnen: { ...(wohnen || {}), rentAmount: netto } };
  // «Frei verfügbar» bleibt beim eigenen Einkommen wie bisher (Monatsrechnung im Kapitel Finanzen).
  const frei = eigenes > 0 && !brutto ? eigenes - sumAllExpenses(allData?.finanzen, profil) : null;
  return { heute, nk, netto, kosten, eigentum, einkommen, brutto, ganzBrutto, mitPartner, haushalt, partnerOffen, partnerEinkommen: haushalt ? partner : 0, anteil, ueberDrittel: anteil != null && anteil > 100 / 3, frei };
}

// Die «!»-Grenze als Nettomiete (Budget, Drittel-Linie): die Nettomiete, ab der
// die Wohnkosten mehr als einen Drittel des Einkommens ausmachen. Miete > Grenze ⇔ `ueberDrittel`.
// 0 heisst «keine Marke»: ohne Einkommen (nie geraten) und mit Partner/in (kein Urteil, siehe oben).
export function drittelGrenzeMiete(r) {
  if (!r || r.mitPartner || !(r.einkommen > 0)) return 0;
  return Math.max(0, r.einkommen / 3 - (r.kosten - r.netto));
}

// Hauptzahl Frage A, gleich geschrieben an allen Orten: ganze Prozent, nur knapp über einem Drittel eine Stelle
// (sonst stünde 33 % neben «mehr als ein Drittel»).
export const anteilText = (r) => (r.anteil == null ? null : zahl(r.anteil, { hoechstens: r.ueberDrittel && Math.round(r.anteil) === 33 ? 1 : 0 }) + ' %');

// Satz unter dem Anteil (Kachel, Kapitel, Werkzeug): wessen Einkommen gemeint ist — netto, eigenes, Haushalt, brutto.
export const wohnkostenSatzKey = (r) => r.brutto ? (r.ganzBrutto ? 'instrumente.wohnkostenSatzBrutto' : 'instrumente.wohnkostenSatzTeilsBrutto')
  : r.haushalt ? 'instrumente.wohnkostenSatzHaushalt' : r.mitPartner ? 'instrumente.wohnkostenSatzEigen' : 'instrumente.wohnkostenSatz';
// Satz zum Drittel (Faustregel, mehr als ein Drittel, Partner/in).
export const drittelSatzKey = (r) => r.partnerOffen ? 'wohnenInstrument.partnerOffen' : r.mitPartner ? 'wohnenInstrument.mitPartner'
  : r.ueberDrittel ? 'wohnenInstrument.mehrAlsDrittel' : 'wohnenInstrument.faustregel';

// Frage B · Lage der Miete. Verglichen wird die NETTOMIETE mit der BFS-Nettomiete gleich grosser Wohnungen im Kanton
// (data/mietpreise.js); dazu der Schweizer Schnitt und der abgeleitete EU-Stock (data/wohnenInternational.js).
// `kanton` und `miete` dürfen abweichen (Budget: Kanton der Wohngemeinde, Budget-Miete).
export function mieteLage(data, { kanton = data?.basis?.canton || '', miete } = {}) {
  const netto = miete != null ? Number(miete) || 0 : wohnkostenRechnung(data?.wohnen, data, null).netto;
  if (!kanton || !(netto > 0)) return null;
  const hh = getHouseholdInfo(data) || {};
  const vergleich = getRentComparison(kanton, { rooms: data?.wohnen?.rooms, householdSize: hh.householdSize || 1 });
  if (!vergleich) return null;
  return { kanton, netto, vergleich, lage: lageZurRegion(netto, vergleich.regional), ausland: auslandStoecke(vergleich.national) };
}

// Womit verglichen wird und wie sicher der BFS-Wert ist (Fachprüfung 25.10.2026).
export const mietVorbehalte = (t, comparison, { imKapitel } = {}) => {
  const k = 'po.regionalCompare.rent.';
  const { roomKey, zimmerAngenommen, ohneWertFuerGroesse, wenigeAntworten } = comparison;
  return [
    ohneWertFuerGroesse ? t(k + 'ohneWertFuerGroesse') : null,
    roomKey === 'total' ? t(k + 'vergleichAlle') : roomKey === 'r6' ? t(k + 'vergleichAb6') : t(k + 'vergleichZimmer', { n: roomKey.slice(1) }),
    zimmerAngenommen ? t(k + (imKapitel ? 'zimmerAngenommenHier' : 'zimmerAngenommen')) : null,
    wenigeAntworten ? t(k + 'wenigeAntworten') : null,
  ].filter(Boolean);
};

// Frage C · Hilfe an die Miete (Mietzinsbeiträge). Eine Einschätzung für Kapitel und Werkzeug.
//   fass:   Pegel «Luft» (Einkommen gegen Grenze), nur wo die Grenze eine Zahl ist.
//   moeglich: Einkommen unter der Grenze. Nie «Anspruch»: der Kanton entscheidet.
//   hoechst: belegter Höchstbetrag im Monat (heute BS), sonst null — dann keine Frankenzahl.
export function mietzinsHilfe(data, kanton = data?.basis?.canton || '') {
  if (!kanton) return null;
  const e = mietzinsEinschaetzung(data, kanton);
  const fass = e.hasProgram ? mietzinsPegelState({ annualIncome: e.annualIncome, incomeLimit: e.incomeLimit }) : null;
  return {
    kanton, einschaetzung: e, programm: !!e.hasProgram,
    fass: fass && fass.show ? fass : null,
    moeglich: e.assessment?.key === 'likely',
    hoechst: beitragHoechstMonat(e, data?.wohnen?.rooms) || null,
    url: e.info?.url,
  };
}

// Der mögliche Beitrag im Drittel-Haus (schraffiert, «bis zu»): nur mit Urteil, Einkommen, belegtem Höchstbetrag.
export function beitragAnteil(data, r, kanton = data?.basis?.canton || '') {
  if (!kanton || !r || r.anteil == null || r.mitPartner || !(r.einkommen > 0)) return null;
  const hoechst = beitragHoechstMonat(mietzinsEinschaetzung(data, kanton), data?.wohnen?.rooms);
  if (!hoechst) return null;
  return { anteil: Math.min(hoechst, r.kosten) / r.einkommen * 100, hoechst };
}

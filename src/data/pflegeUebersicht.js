// Angehörige pflegen · «Was zusammenkommt» für Maloja Plana
//
// Fasst die Ergebnisse des Pflege-Ablaufs zusammen. Die Beträge gehören VERSCHIEDENEN Menschen und
// sind verschiedene Arten von Geld — darum gibt es hier bewusst KEIN Gesamttotal:
//   anDich        Lohn der pflegenden Person (Spanne, aus PflegeEntloehnung)
//   anGepflegte   Hilflosenentschädigung der gepflegten Person (aus hilflosenentschaedigung.js)
//   gutschrift    Betreuungsgutschrift: kein Geld heute, sondern angerechnetes Einkommen auf dem
//                 AHV-Konto der pflegenden Person (erhöht die spätere Rente)
// Keine Netzwerk-Calls, nichts gespeichert, reine Berechnung.
//
// === Regel Betreuungsgutschrift (gelesen am 19.11.2026, swiss-precision-pruefer) ===
//   AHVG Art. 29septies Abs. 1 (SR 831.10, Fassung 1.1.2026, gleich 1.1.2027): «Versicherte, welche
//     Verwandte in auf- oder absteigender Linie oder Geschwister mit einem anerkannten Anspruch auf eine
//     Hilflosenentschädigung der AHV, der IV, der obligatorischen Unfallversicherung oder der
//     Militärversicherung betreuen, haben Anspruch auf Anrechnung einer Betreuungsgutschrift, wenn sie die
//     betreuten Personen für die Betreuung leicht erreichen können. Sie müssen diesen Anspruch jährlich
//     schriftlich anmelden.» Kein Grad genannt — jeder Grad genügt, auch leicht («für mindestens mittlere
//     Hilflosigkeit» gestrichen mit BG vom 20.12.2019, AS 2020 4525, in Kraft 1.1.2021).
//   Abs. 2: keine Betreuungsgutschrift für Zeiten mit gleichzeitigem Anspruch auf Erziehungsgutschrift.
//   Abs. 4: «dem Betrag der dreifachen minimalen jährlichen Altersrente» → wie die Erziehungsgutschrift,
//     darum `erziehungsgutschriftJahr` aus ahvRechner.js.
//   Abs. 6: bei Verheirateten «während der Kalenderjahre der Ehe hälftig aufgeteilt».
//   AHVV Art. 52g: leicht erreichbar = höchstens 30 km oder innert einer Stunde.
//   AHVV Art. 52i: mehrere Betreuende teilen zu gleichen Teilen.
//   KSBGS 318.104.01 (Stand 1.1.2026) Rz 3010.2: «Lebt die pflegebedürftige Person in einem Heim, besteht
//     kein Anspruch auf Betreuungsgutschriften (BGE 144 V 159).» Rz 3015: Betreuung «in einem zeitlich
//     überwiegenden Umfang während mindestens 180 Tagen im Kalenderjahr». Rz 1001.1: Anspruch genügt,
//     tatsächlicher Bezug der HE nicht nötig.
//   Lohn für dieselbe Betreuung: keine geschriebene Regel gefunden (weder Ausschluss noch Erlaubnis) —
//     die Funktion entscheidet darüber nicht, die Anzeige sagt «bei der Ausgleichskasse klären».
//
// Vereinfachungen (darum SCHÄTZUNG, nie mehr): Ausnahmen von der Teilung (KSBGS Rz 6003–6005), ein
// unterjähriger Wechsel und die Verwandtschaft werden nicht abgefragt, sondern im Text genannt.

import { ergebnis, ERGEBNIS_ART } from './ergebnisArt.js';
import { ahvWerte } from './ahvRechner.js';

export const GUTSCHRIFT_STATUS = Object.freeze({ JA: 'ja', NEIN: 'nein', OFFEN: 'offen' });

/**
 * @param {object} p
 * @param {{monatVon:number, monatBis:number}|null} [p.lohn]  aus PflegeEntloehnung
 * @param {object|null} [p.he]   Rückgabe von berechneHilflosenentschaedigung, ergänzt um `person`
 *                               ('iv' | 'ahv' | 'kind') aus dem HilflosenRechner
 * @param {boolean|null} [p.erreichbar]   höchstens 30 km oder 1 h (null = nicht beantwortet)
 * @param {boolean|null} [p.mind180Tage]  überwiegend, mindestens 180 Tage im Jahr (null = offen)
 * @param {number} [p.anzahlBetreuende]   Standard 1
 * @param {boolean} [p.verheiratet]
 * @param {*} [p.stichtag]
 */
export function berechnePflegeUebersicht({
  lohn = null, he = null, erreichbar = null, mind180Tage = null,
  anzahlBetreuende = 1, verheiratet = false, stichtag,
} = {}) {
  const w = ahvWerte(stichtag);
  const anzahl = Number.isInteger(anzahlBetreuende) && anzahlBetreuende > 0 ? anzahlBetreuende : 1;

  const anDich = lohn && Number.isFinite(lohn.monatVon) && Number.isFinite(lohn.monatBis)
    ? { monatVon: lohn.monatVon, monatBis: lohn.monatBis }
    : null;

  let anGepflegte = null;
  if (he && he.anspruch === true) anGepflegte = { monat: he.totalMonat };
  else if (he && he.grund === 'grad_offen') anGepflegte = { spanne: he.spanne };

  const gutschrift = gutschriftFuer({ he, erreichbar, mind180Tage, anzahl, verheiratet, w });

  const fehlend = [];
  if (!he || he.grund === 'grad_offen') fehlend.push('grad');
  if (gutschrift.status === GUTSCHRIFT_STATUS.OFFEN) {
    if (erreichbar == null) fehlend.push('erreichbar');
    if (mind180Tage == null) fehlend.push('mind180Tage');
  }

  return {
    anDich, anGepflegte, gutschrift,
    eoHinweis: he?.person === 'kind',
    jahr: w.jahr,
    ergebnis: ergebnis(ERGEBNIS_ART.SCHAETZUNG, { fehlend }),
  };
}

function gutschriftFuer({ he, erreichbar, mind180Tage, anzahl, verheiratet, w }) {
  const nein = (grund) => ({ status: GUTSCHRIFT_STATUS.NEIN, grund, betragJahr: 0 });
  // Reihenfolge: zuerst, was sicher ausschliesst; dann, was noch offen ist.
  if (he?.wohnen === 'heim') return nein('heim');
  if (he?.anspruch === false) return nein('keine_he');
  if (erreichbar === false) return nein('zu_weit');
  if (mind180Tage === false) return nein('zu_wenig');

  // Der Betrag hängt nicht vom Grad ab — er lässt sich zeigen, auch solange einiges offen ist.
  const geteilt = !!verheiratet;
  const betragJahr = Math.round(w.erziehungsgutschriftJahr / anzahl / (geteilt ? 2 : 1));
  const basis = { betragJahr, geteilt, anzahl, vollerBetragJahr: w.erziehungsgutschriftJahr };

  // Eltern eines Kindes: solange ein Anspruch auf Erziehungsgutschrift besteht, keine
  // Betreuungsgutschrift (Abs. 2). Das Alter fragt der Rechner nicht — darum «offen», mit Hinweis.
  if (he?.person === 'kind') return { status: GUTSCHRIFT_STATUS.OFFEN, grund: 'erziehung_vorrang', ...basis };

  const heAnerkannt = he?.anspruch === true;
  if (heAnerkannt && erreichbar === true && mind180Tage === true) {
    return { status: GUTSCHRIFT_STATUS.JA, grund: null, ...basis };
  }
  return { status: GUTSCHRIFT_STATUS.OFFEN, grund: heAnerkannt ? 'fragen_offen' : 'he_offen', ...basis };
}

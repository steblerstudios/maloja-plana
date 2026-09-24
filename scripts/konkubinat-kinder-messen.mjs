#!/usr/bin/env node
// K62-Nachlauf B — Konkubinat MIT Kindern gegen «ledig mit Kindern» (die Reihe, die die App liest).
//
//   node scripts/konkubinat-kinder-messen.mjs
//     Fragt den ESTV-Steuerrechner (API_calculateDetailedTaxes, gemeinsame Anbindung in
//     scripts/estv-schnittstelle.mjs) ab: 26 Kantonshauptorte × 1, 2 und 3 Kinder × 68 Bruttolöhne,
//     je Konkubinat (Relationship 3, Person 2 Alter 40 ohne Einkommen) UND ledig (Relationship 1,
//     alleinerziehend) im selben Lauf — damit eine Abweichung nicht aus einem anderen Stand des
//     Rechners stammt. Dazu je Kanton und Kinderzahl die Abzugsposten Kanton bei Brutto 80 000 für
//     beide Zivilstände (erklärt, WAS abweicht) und eine Kontrolle «zweites Einkommen» (Person 2
//     mit 60 000, 4 Bruttolöhne, 1 Kind).
//     Rohwerte → docs/sources/konkubinat-kinder-kantonssteuer-2026.messpunkte.json.
//
// Seriell, 150 ms Pause (PAUSE_MS) zwischen zwei Abrufen, nur lesend. Nach jedem Block
// (Kanton × Kinderzahl) wird geschrieben; ein neuer Lauf misst nur die fehlenden Blöcke.
// Die App importiert diese Datei nicht und bleibt ohne Netz.

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import {
  API, STEUERJAHR, PAUSE_MS, ORTE, BRUTTO, post, mitWiederholung, gegenprobeErfundeneOperation,
  anfrage, pruefeOrt, kantonUndGemeinde,
} from './estv-schnittstelle.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const KONKUBINAT_KINDER_PATH = resolve(__dirname, '../docs/sources/konkubinat-kinder-kantonssteuer-2026.messpunkte.json');

const KINDER = [1, 2, 3];
const KINDERALTER = 8;
const ABZUG_BRUTTO = 80000;
const ZWEITES_BRUTTO = [30000, 80000, 150000, 250000];
const REL = { ledig: 1, konkubinat: 3 };

// Konkubinat: Person 2 im Haushalt, Alter 40, Konfession andere/keine, ohne Einkommen (wie K62.1).
function anfrageKonkubinat({ ortId, brutto, kinder, einkommen2 = 0 }) {
  return {
    ...anfrage({ ortId, rel: REL.konkubinat, brutto, kinder, kinderalter: KINDERALTER }),
    Age2: 40, Confession2: 4, RevenueType2: einkommen2 > 0 ? 1 : 0, Revenue2: einkommen2,
  };
}

const pause = () => new Promise((r) => setTimeout(r, PAUSE_MS));
async function abruf(body, kt) {
  await pause();
  const r = await mitWiederholung(() => post('API_calculateDetailedTaxes', body));
  pruefeOrt(r, kt, ORTE[kt]);
  if (typeof r.IncomeTaxCanton !== 'number' || typeof r.TaxableIncomeFed !== 'number') throw new Error('Antwort ohne Zahlen: ' + kt);
  return r;
}
const zeile = (r) => [r.TaxableIncomeFed, r.IncomeTaxFed, kantonUndGemeinde(r), r.TaxableIncomeCanton];
const abzuege = (info) => (info || []).filter((e) => e.Value < 0).map((e) => [e.Entry.DE, e.Value]);

async function messen() {
  let stand = null;
  try { stand = JSON.parse(readFileSync(KONKUBINAT_KINDER_PATH, 'utf-8')); } catch { /* neu */ }
  const gegenprobe = await gegenprobeErfundeneOperation();
  if (gegenprobe !== 'fehlgeschlagen wie erwartet') throw new Error('Gegenprobe: ' + gegenprobe);
  const mess = stand || {
    quelle: 'ESTV Steuerrechner, API_calculateDetailedTaxes (' + API + ')',
    webseite: 'https://swisstaxcalculator.estv.admin.ch/',
    steuerjahr: STEUERJAHR,
    anlage: 'Hauptort, unselbständig, Alter 40, Konfession andere/keine, ohne Vermögen; Kinder je ' + KINDERALTER +
      ' Jahre (Children: [{ Age: ' + KINDERALTER + ' }] — die Schnittstelle kennt je Kind nur das Alter, keine Zuordnung zu einer Person). ' +
      'Konkubinat = Relationship 3, Person 2 Alter 40 ohne Einkommen. ledig = Relationship 1 (alleinerziehend), im selben Lauf.',
    kinderalter: KINDERALTER,
    spalten: ['kanton', 'kinder', 'brutto',
      'steuerbarBundKonkubinat', 'bundKonkubinat', 'kgKonkubinat', 'steuerbarKantonKonkubinat',
      'steuerbarBundLedig', 'bundLedig', 'kgLedig', 'steuerbarKantonLedig'],
    laeufe: [],
    bloecke: [],
    punkte: [],
    abzuegeKanton: {},
    zweitesEinkommen: null,
  };
  mess.laeufe.push({ beginn: new Date().toISOString(), gegenprobe: 'erfundene Operation → ' + gegenprobe });
  const fertig = new Set(mess.bloecke);
  const speichern = () => {
    mess.punkte.sort((x, y) => x[0].localeCompare(y[0]) || x[1] - y[1] || x[2] - y[2]);
    writeFileSync(KONKUBINAT_KINDER_PATH, JSON.stringify(mess, null, 0).replace(/\],\[/g, '],\n[') + '\n');
  };
  let abrufe = 0;
  try {
    for (const [kt, o] of Object.entries(ORTE)) {
      for (const kinder of KINDER) {
        const block = kt + '/' + kinder;
        if (fertig.has(block)) continue;
        const neu = [];
        for (const brutto of BRUTTO) {
          const k = await abruf(anfrageKonkubinat({ ortId: o.id, brutto, kinder }), kt);
          const l = await abruf(anfrage({ ortId: o.id, rel: REL.ledig, brutto, kinder, kinderalter: KINDERALTER }), kt);
          abrufe += 2;
          neu.push([kt, kinder, brutto, ...zeile(k), ...zeile(l)]);
          if (brutto === ABZUG_BRUTTO) {
            mess.abzuegeKanton[block] = { konkubinat: abzuege(k.InfoCanton), ledig: abzuege(l.InfoCanton), bundKonkubinat: abzuege(k.InfoFed), bundLedig: abzuege(l.InfoFed) };
          }
        }
        mess.punkte.push(...neu);
        mess.bloecke.push(block);
        speichern();
        console.log(new Date().toISOString(), 'Block', block, 'fertig,', mess.bloecke.length, '/', 26 * KINDER.length);
      }
    }
    if (!mess.zweitesEinkommen) {
      // Kontrolle: ändert ein Einkommen der Person 2 im Konkubinat mit Kind etwas? (1 Kind)
      const z = [];
      for (const [kt, o] of Object.entries(ORTE)) {
        for (const brutto of ZWEITES_BRUTTO) {
          const ohne = await abruf(anfrageKonkubinat({ ortId: o.id, brutto, kinder: 1 }), kt);
          const mit = await abruf(anfrageKonkubinat({ ortId: o.id, brutto, kinder: 1, einkommen2: 60000 }), kt);
          abrufe += 2;
          z.push([kt, brutto, ...zeile(ohne), ...zeile(mit), mit.IncomeP2?.NetIncome ?? null]);
        }
      }
      mess.zweitesEinkommen = {
        anlage: 'Konkubinat, 1 Kind; Person 2 ohne Einkommen gegen Person 2 mit Revenue2 60 000 (RevenueType2 1)',
        spalten: ['kanton', 'brutto', 'steuerbarBundOhne', 'bundOhne', 'kgOhne', 'steuerbarKantonOhne', 'steuerbarBundMit', 'bundMit', 'kgMit', 'steuerbarKantonMit', 'nettoPerson2'],
        punkte: z,
      };
    }
  } finally {
    const lauf = mess.laeufe[mess.laeufe.length - 1];
    lauf.ende = new Date().toISOString();
    lauf.abrufe = abrufe;
    speichern();
  }
  console.log('fertig:', mess.punkte.length, 'Punkte,', abrufe, 'Abrufe in diesem Lauf');
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  messen().catch((e) => { console.error(e); process.exit(1); });
}

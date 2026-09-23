#!/usr/bin/env node
// E37 / E38 — Kantons- und Gemeindesteuer als Stütztabelle je Kanton, Zivilstand und Kinderzahl.
//
// Drei Schritte, getrennt, damit die Auswertung ohne Netz nachvollziehbar bleibt:
//
//   node scripts/steuerband-messen.mjs --messen
//     Fragt den amtlichen Steuerrechner der ESTV ab (swisstaxcalculator.estv.admin.ch,
//     Operation API_calculateDetailedTaxes — dieselbe, die die Web-Oberfläche benutzt), ohne Kinder,
//     und schreibt die Rohwerte nach docs/sources/steuerfaktor-band-2026.messpunkte.json (E37).
//
//   node scripts/steuerband-messen.mjs --messen --kinder
//     Dasselbe mit 1, 2 und 3 Kindern → docs/sources/kantonssteuer-kinder-2026.messpunkte.json (E38).
//
//   node scripts/steuerband-messen.mjs --messen --abzuege
//     Nettolohn und Abzugsposten Bund je Bruttolohn → docs/sources/nettolohn-abzuege-2026.messpunkte.json.
//     Nur dieses Entwickler-Skript geht ins Netz. Die App selbst bleibt ohne Netzwerk-Calls.
//
//   node scripts/steuerband-messen.mjs --messen [--kinder] --kanton TI
//     Nachmessung EINES Kantons: ersetzt nur dessen Punkte in der Messdatei, alle anderen bleiben
//     byte-gleich. Die ersetzten Punkte wandern nach docs/sources/kantonssteuer-ersetzt-<KT>-<Datum>.messpunkte.json,
//     damit alt gegen neu nachvollziehbar bleibt; der Lauf steht in `nachmessungen` der Messdatei.
//
//   node scripts/steuerband-messen.mjs
//     Wertet die Messdateien aus, prüft steuerbarNachEstv() an allen Punkten und schreibt
//       src/data/kantonssteuerTabelle.js            (Stütztabelle, generiert)
//       docs/sources/kantonssteuer-tabelle-2026.md  (Methode, Fehler, Abdeckung, Stützpunkte)
//
// Messanlage: Steuerjahr 2026, Kantonshauptort, unselbständig erwerbend, Alter 40,
// Konfession «andere/keine» (also ohne Kirchensteuer), kein Vermögen. Verheiratet:
// Alleinverdiener-Ehepaar. Die ESTV rechnet vom Bruttolohn mit ihren Standardabzügen (AHV/IV/EO,
// ALV, NBU, BVG, Berufsauslagen, Versicherungs- und Kinderabzüge) und liefert das steuerbare
// Einkommen Bund dazu. Die Tabelle ist nach diesem steuerbaren Einkommen Bund geordnet; die App
// leitet es mit steuerbarNachEstv() (kantonaleSteuerdaten.js) aus ihrem Nettolohn ab.

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { berechneBundessteuer } from '../src/data/steuerRechner.js';
import { steuerbarNachEstv } from '../src/data/kantonaleSteuerdaten.js';
import {
  API, STEUERJAHR, MESS_PATH, PAUSE_MS, ORTE, BRUTTO, ZIVILSTAND,
  post, mitWiederholung, gegenprobeErfundeneOperation, anfrage, pruefeOrt, kantonUndGemeinde as kug,
} from './estv-schnittstelle.mjs';
import { STICHPROBE_BRUTTO, SCHWELLE_CHF } from './estv-stichprobe.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = resolve(__dirname, '../src/data/kantonssteuerTabelle.js');
const DOC_PATH = resolve(__dirname, '../docs/sources/kantonssteuer-tabelle-2026.md');

// Adresse, Orte (TaxLocationID + BFS), Lohnraster, Zivilstände und Anfrage: scripts/estv-schnittstelle.mjs
// (gemeinsam mit scripts/estv-stichprobe.mjs — eine Quelle).

// --kanton XX: nur diesen Kanton messen und in die bestehende Messdatei einsetzen (Nachmessung).
const KANTON_ARG = process.argv.includes('--kanton') ? process.argv[process.argv.indexOf('--kanton') + 1] : null;
if (KANTON_ARG && !ORTE[KANTON_ARG]) throw new Error('unbekannter Kanton: ' + KANTON_ARG);
const orteFuerLauf = () => Object.entries(ORTE).filter(([kt]) => !KANTON_ARG || kt === KANTON_ARG);

// Ersetzte Punkte einer Nachmessung aufbewahren (alt gegen neu bleibt nachprüfbar).
function ersetztArchivieren(kt, teil, daten) {
  const datum = new Date().toISOString().slice(0, 10);
  const pfad = resolve(__dirname, '../docs/sources/kantonssteuer-ersetzt-' + kt + '-' + datum + '.messpunkte.json');
  let archiv = { kanton: kt, ersetzt: datum, zweck: 'Messpunkte, die eine Nachmessung ersetzt hat — nur zur Nachprüfung, die App liest sie nicht.' };
  try { archiv = JSON.parse(readFileSync(pfad, 'utf-8')); } catch { /* neu */ }
  archiv[teil] = daten;
  writeFileSync(pfad, JSON.stringify(archiv, null, 0).replace(/\],\[/g, '],\n[') + '\n');
  return pfad;
}

async function messen() {
  const abgerufen = new Date().toISOString();
  // Gegenprobe: eine erfundene Operation muss scheitern, sonst unterscheidet das Skript echte
  // Antworten nicht von einer Fehlerseite.
  const gegenprobe = await gegenprobeErfundeneOperation();
  if (gegenprobe !== 'fehlgeschlagen wie erwartet') throw new Error('Gegenprobe: ' + gegenprobe);

  const version = await post('API_getTaxVersion', {}).catch(() => null);
  const punkte = [];
  const auftraege = [];
  for (const [kt, o] of orteFuerLauf()) {
    for (const [zs, rel] of Object.entries(ZIVILSTAND)) {
      for (const brutto of BRUTTO) auftraege.push({ kt, o, zs, rel, brutto });
    }
  }
  let i = 0;
  // Den amtlichen Server schonen: ein Abruf nach dem anderen, kurze Pause dazwischen
  // (~3500 Abrufe ≈ 10 Minuten). Beim Messen am 16.09.2026 liefen noch 4 parallel.
  async function arbeiter() {
    while (i < auftraege.length) {
      const a = auftraege[i++];
      await new Promise((r) => setTimeout(r, PAUSE_MS));
      const r = await mitWiederholung(() => post('API_calculateDetailedTaxes', anfrage({ ortId: a.o.id, rel: a.rel, brutto: a.brutto })));
      pruefeOrt(r, a.kt, a.o);
      const kantonUndGemeinde = kug(r);
      punkte.push([a.kt, a.zs, a.brutto, r.TaxableIncomeFed, r.IncomeTaxFed, r.IncomeTaxCanton, r.IncomeTaxCity, r.PersonalTax || 0, r.IncomeTaxChurch, r.TotalTax, kantonUndGemeinde]);
    }
  }
  await arbeiter();
  punkte.sort((x, y) => x[0].localeCompare(y[0]) || x[1].localeCompare(y[1]) || x[2] - y[2]);
  if (KANTON_ARG) {
    // Nachmessung: nur die Punkte dieses Kantons ersetzen, Rest unverändert lassen.
    const alt = JSON.parse(readFileSync(MESS_PATH, 'utf-8'));
    const ersetzt = alt.punkte.filter((p) => p[0] === KANTON_ARG);
    const pfad = ersetztArchivieren(KANTON_ARG, 'ohneKinder', { abgerufen: alt.abgerufen, spalten: alt.spalten, punkte: ersetzt });
    alt.punkte = alt.punkte.filter((p) => p[0] !== KANTON_ARG).concat(punkte)
      .sort((x, y) => x[0].localeCompare(y[0]) || x[1].localeCompare(y[1]) || x[2] - y[2]);
    (alt.nachmessungen ??= []).push({ kanton: KANTON_ARG, abgerufen, ende: new Date().toISOString(), abrufe: punkte.length, gegenprobe: 'erfundene Operation → ' + gegenprobe, version, ersetzt: ersetzt.length, archiv: pfad.split('/docs/')[1] });
    writeFileSync(MESS_PATH, JSON.stringify(alt, null, 0).replace(/\],\[/g, '],\n[') + '\n');
    console.log('nachgemessen:', KANTON_ARG, punkte.length, 'Punkte, ersetzt', ersetzt.length, '· Gegenprobe:', gegenprobe);
    return;
  }
  writeFileSync(MESS_PATH, JSON.stringify({
    quelle: 'ESTV Steuerrechner, API_calculateDetailedTaxes (' + API + ')',
    webseite: 'https://swisstaxcalculator.estv.admin.ch/',
    abgerufen,
    steuerjahr: STEUERJAHR,
    gegenprobe: 'erfundene Operation → ' + gegenprobe,
    version,
    anlage: 'Hauptort, unselbständig, Alter 40, Konfession andere/keine, ohne Kinder, ohne Vermögen; verheiratet = Alleinverdiener',
    orte: ORTE,
    spalten: ['kanton', 'zivilstand', 'brutto', 'steuerbarBund', 'bundessteuerEstv', 'kantonssteuer', 'gemeindesteuer', 'personalsteuer', 'kirchensteuer', 'totalSteuer', 'kantonUndGemeinde'],
    punkte,
  }, null, 0).replace(/\],\[/g, '],\n[') + '\n');
  console.log('gemessen:', punkte.length, 'Punkte, Gegenprobe:', gegenprobe);
}

// E38 — Messung mit Kindern: 1, 2, 3 Kinder, je ledig (alleinerziehend) und verheiratet
// (Alleinverdiener). Der ESTV-Rechner kennt keinen eigenen Zivilstand «alleinerziehend»
// (Relationship 1–4: ledig, verheiratet, Konkubinat, eingetragene Partnerschaft); die Web-Oberfläche
// schickt Kinder als Liste `Children: [{ Age }]`. Kinderalter 8 Jahre: Schulkind, keine
// altersabhängigen Sonderabzüge (Ausbildung, Kleinkind), keine Betreuungskosten erfasst.
// Wird nach jedem Block (Kanton × Zivilstand × Kinder) geschrieben. Bricht die Quelle ab, bleibt das
// bis dahin Gemessene stehen; ein neuer Lauf misst nur die fehlenden Blöcke.
const KINDER = [1, 2, 3];
const KINDERALTER = 8;
const KINDER_PATH = resolve(__dirname, '../docs/sources/kantonssteuer-kinder-2026.messpunkte.json');
const SPALTEN = ['kanton', 'zivilstand', 'kinder', 'brutto', 'steuerbarBund', 'bundessteuerEstv', 'kantonssteuer', 'gemeindesteuer', 'personalsteuer', 'kirchensteuer', 'totalSteuer', 'kantonUndGemeinde', 'steuerbarKanton'];

async function messenKinder() {
  let stand = null;
  try { stand = JSON.parse(readFileSync(KINDER_PATH, 'utf-8')); } catch { /* neu */ }
  // Gegenprobe wie oben, bei jedem Lauf neu.
  const gegenprobe = await gegenprobeErfundeneOperation();
  if (gegenprobe !== 'fehlgeschlagen wie erwartet') throw new Error('Gegenprobe: ' + gegenprobe);
  const version = await post('API_getTaxVersion', {}).catch(() => null);
  const jetzt = new Date().toISOString();
  const mess = stand || {
    quelle: 'ESTV Steuerrechner, API_calculateDetailedTaxes (' + API + ')',
    webseite: 'https://swisstaxcalculator.estv.admin.ch/',
    steuerjahr: STEUERJAHR,
    anlage: 'Hauptort, unselbständig, Alter 40, Konfession andere/keine, ohne Vermögen; Kinder je ' + KINDERALTER +
      ' Jahre (Children: [{ Age: ' + KINDERALTER + ' }]); ledig = alleinerziehend (Relationship 1 mit Kindern), verheiratet = Alleinverdiener',
    kinderalter: KINDERALTER,
    orte: ORTE,
    spalten: SPALTEN,
    laeufe: [],
    bloecke: [],
    punkte: [],
  };
  if (KANTON_ARG) {
    // Nachmessung: die Blöcke dieses Kantons verwerfen (archiviert), damit der Lauf sie neu misst.
    const ersetzt = mess.punkte.filter((p) => p[0] === KANTON_ARG);
    ersetztArchivieren(KANTON_ARG, 'mitKindern', { laeufe: mess.laeufe, spalten: mess.spalten, punkte: ersetzt });
    mess.punkte = mess.punkte.filter((p) => p[0] !== KANTON_ARG);
    mess.bloecke = mess.bloecke.filter((b) => !b.startsWith(KANTON_ARG + '/'));
  }
  mess.laeufe.push({ beginn: jetzt, gegenprobe: 'erfundene Operation → ' + gegenprobe, version, ...(KANTON_ARG ? { kanton: KANTON_ARG, nachmessung: true } : {}) });
  const fertig = new Set(mess.bloecke);
  const speichern = () => {
    mess.punkte.sort((x, y) => x[0].localeCompare(y[0]) || x[1].localeCompare(y[1]) || x[2] - y[2] || x[3] - y[3]);
    writeFileSync(KINDER_PATH, JSON.stringify(mess, null, 0).replace(/\],\[/g, '],\n[') + '\n');
  };
  let abrufe = 0;
  try {
    for (const [kt, o] of orteFuerLauf()) {
      for (const [zs, rel] of Object.entries(ZIVILSTAND)) {
        for (const kinder of KINDER) {
          const block = kt + '/' + zs + '/' + kinder;
          if (fertig.has(block)) continue;
          const neu = [];
          for (const brutto of BRUTTO) {
            await new Promise((r) => setTimeout(r, PAUSE_MS));
            const r = await mitWiederholung(() => post('API_calculateDetailedTaxes', anfrage({ ortId: o.id, rel, brutto, kinder, kinderalter: KINDERALTER })));
            abrufe++;
            pruefeOrt(r, kt, o);
            if (typeof r.IncomeTaxCanton !== 'number' || typeof r.TaxableIncomeFed !== 'number') {
              throw new Error('Antwort ohne Zahlen: ' + block + ' ' + brutto);
            }
            neu.push([kt, zs, kinder, brutto, r.TaxableIncomeFed, r.IncomeTaxFed, r.IncomeTaxCanton, r.IncomeTaxCity, r.PersonalTax || 0, r.IncomeTaxChurch, r.TotalTax, kug(r), r.TaxableIncomeCanton]);
          }
          mess.punkte.push(...neu);
          mess.bloecke.push(block);
          speichern();
          console.log(new Date().toISOString(), 'Block', block, 'fertig,', mess.bloecke.length, '/', 26 * 2 * KINDER.length);
        }
      }
    }
  } finally {
    mess.laeufe[mess.laeufe.length - 1].ende = new Date().toISOString();
    mess.laeufe[mess.laeufe.length - 1].abrufe = abrufe;
    speichern();
  }
  console.log('gemessen mit Kindern:', mess.punkte.length, 'Punkte in', mess.bloecke.length, 'Blöcken');
}

// E38 — Wie kommt die ESTV vom Nettolohn zum steuerbaren Einkommen Bund? Die App kennt den
// Nettolohn (Kapitel Finanzen), nicht das steuerbare Einkommen der ESTV. Die Abzüge des Bundes
// hängen nicht vom Kanton ab; gemessen wird deshalb an einem Ort (Zürich), je Bruttolohn einmal
// ledig ohne Kinder, mit den Abzugsposten, die der Rechner ausweist (InfoBoth).
const ABZUG_PATH = resolve(__dirname, '../docs/sources/nettolohn-abzuege-2026.messpunkte.json');

async function messenAbzuege() {
  const gegenprobe = await gegenprobeErfundeneOperation();
  if (gegenprobe !== 'fehlgeschlagen wie erwartet') throw new Error('Gegenprobe: ' + gegenprobe);
  const beginn = new Date().toISOString();
  const punkte = [];
  for (const brutto of BRUTTO) {
    await new Promise((r) => setTimeout(r, PAUSE_MS));
    const r = await mitWiederholung(() => post('API_calculateDetailedTaxes', anfrage({ ortId: ORTE.ZH.id, rel: 1, brutto })));
    const posten = {};
    for (const e of r.InfoBoth || []) if (e.Fed) posten[e.Entry.DE] = e.Fed;
    punkte.push([brutto, r.IncomeP1.NetIncome, r.IncomeP1.BVGContribution, r.TaxableIncomeFed, posten]);
  }
  writeFileSync(ABZUG_PATH, JSON.stringify({
    quelle: 'ESTV Steuerrechner, API_calculateDetailedTaxes (' + API + ')',
    webseite: 'https://swisstaxcalculator.estv.admin.ch/',
    steuerjahr: STEUERJAHR,
    abgerufen: beginn,
    gegenprobe: 'erfundene Operation → ' + gegenprobe,
    anlage: 'Zürich, ledig, ohne Kinder, unselbständig, Alter 40; Abzugsposten Bund aus InfoBoth (Fed ≠ 0)',
    spalten: ['brutto', 'nettolohn', 'bvgBeitrag', 'steuerbarBund', 'posten'],
    punkte,
  }, null, 0).replace(/\],\[/g, '],\n[') + '\n');
  console.log('Abzüge gemessen:', punkte.length);
}

const chf = (n) => Math.round(n).toLocaleString('de-CH').replace(/[’,]/g, "'");
const pct = (x) => (Math.round(x * 1000) / 10).toFixed(1) + ' %';

// ── Auswertung ─────────────────────────────────────────────────────────────────────────────
// Grenze, die jede Tabellenreihe an JEDEM Messpunkt einhalten muss (Auftrag E38):
// höchstens 3 % der ESTV-Kantons- und Gemeindesteuer oder höchstens CHF 50 — das Grössere gilt,
// damit kleine Beträge nicht an Rappen scheitern.
const GRENZE = { rel: 0.03, abs: 50 };
// Die Stützpunkte werden enger gewählt als die Grenze, damit Reserve bleibt. Die erste Stufe, die
// je Reihe mit höchstens MAX_STUETZPUNKTE Punkten auskommt, gilt.
const STUFEN = [{ rel: 0.005, abs: 10 }, { rel: 0.01, abs: 20 }, { rel: 0.015, abs: 25 }, { rel: 0.02, abs: 35 }, GRENZE];
const MAX_STUETZPUNKTE = 20;
const imRahmen = (fehler, estv, { rel, abs }) => Math.abs(fehler) <= Math.max(rel * Math.abs(estv), abs);

function interpoliere(reihe, x) {
  // reihe = [x0, y0, x1, y1, …], x streng steigend. Ausserhalb → null (keine Extrapolation).
  if (!(x >= reihe[0] && x <= reihe[reihe.length - 2])) return null;
  for (let i = 2; i < reihe.length; i += 2) {
    if (x <= reihe[i]) {
      const x0 = reihe[i - 2]; const y0 = reihe[i - 1];
      return y0 + ((x - x0) / (reihe[i] - x0)) * (reihe[i + 1] - y0);
    }
  }
  return reihe[reihe.length - 1];
}

// Kleinste Auswahl von Messpunkten (erster und letzter immer dabei), bei der die lineare
// Interpolation alle Messpunkte dazwischen innerhalb der Stufe trifft. Dynamische Programmierung.
function stuetzpunkte(pts, stufe) {
  const n = pts.length;
  const traegt = (a, b) => {
    for (let k = a + 1; k < b; k++) {
      const v = pts[a].x === pts[b].x ? pts[a].y : pts[a].y + ((pts[k].x - pts[a].x) / (pts[b].x - pts[a].x)) * (pts[b].y - pts[a].y);
      if (!imRahmen(Math.round(v) - pts[k].y, pts[k].y, stufe)) return false;
    }
    return true;
  };
  const best = Array(n).fill(Infinity); const vor = Array(n).fill(-1);
  best[0] = 1;
  for (let b = 1; b < n; b++) for (let a = 0; a < b; a++) if (best[a] + 1 < best[b] && traegt(a, b)) { best[b] = best[a] + 1; vor[b] = a; }
  const idx = [];
  for (let i = n - 1; i >= 0; i = vor[i]) idx.unshift(i);
  return idx;
}

function reihenAus(mess0, messK) {
  const gruppen = new Map();
  const add = (kt, zs, kinder, brutto, steuerbar, dbgEstv, kug) => {
    const k = kt + '/' + zs + '/' + kinder;
    if (!gruppen.has(k)) gruppen.set(k, { kt, zs, kinder, pts: [] });
    gruppen.get(k).pts.push({ brutto, x: steuerbar, dbgEstv, y: kug });
  };
  for (const p of mess0.punkte) add(p[0], p[1], 0, p[2], p[3], p[4], p[10]);
  if (messK) for (const p of messK.punkte) add(p[0], p[1], p[2], p[3], p[4], p[5], p[11]);
  return gruppen;
}

function auswerten(mess0, messK, messA) {
  const gruppen = reihenAus(mess0, messK);
  const reihen = [];
  const dbgAbw = [];
  const xAbw = [];
  let xGeprueft = 0;
  const netto = new Map(messA ? messA.punkte.map((p) => [p[0], p[1]]) : []);
  let ohneSteuerbar = 0;
  for (const g of gruppen.values()) {
    g.pts.sort((a, b) => a.brutto - b.brutto);
    // Weg der App: Nettolohn → steuerbar nach ESTV-Abzügen (kantonaleSteuerdaten.js) muss das
    // gemessene steuerbare Einkommen Bund treffen — in jedem Kanton, weil die Abzüge Bund sind.
    for (const p of g.pts) {
      if (!netto.has(p.brutto)) continue;
      xGeprueft++;
      const x = steuerbarNachEstv({ nettolohnJahr: netto.get(p.brutto), verheiratet: g.zs === 'verheiratet', kinder: g.kinder });
      if (Math.abs(x - p.x) > 1) xAbw.push({ kt: g.kt, zs: g.zs, kinder: g.kinder, brutto: p.brutto, netto: netto.get(p.brutto), formel: x, estv: p.x });
    }
    // Eigene Bundessteuer gegen die ESTV — alleinerziehend mit Elterntarif (Art. 36 Abs. 2bis DBG).
    for (const p of g.pts) {
      const eigen = berechneBundessteuer({ bruttoEinkommen: p.x, verheiratet: g.zs === 'verheiratet', kinder: g.kinder, elterntarif: g.kinder > 0 }).steuer;
      if (Math.abs(eigen - p.dbgEstv) > 1) dbgAbw.push({ kt: g.kt, zs: g.zs, kinder: g.kinder, brutto: p.brutto, steuerbar: p.x, eigen, estv: p.dbgEstv });
    }
    // Nur Punkte mit steuerbarem Einkommen > 0 (bei 0 hängt die Kantonssteuer nicht mehr am
    // Bund-Wert) und streng steigendem x.
    const pts = [];
    for (const p of g.pts) {
      if (p.x <= 0) { ohneSteuerbar++; continue; }
      if (pts.length && p.x <= pts[pts.length - 1].x) throw new Error('steuerbares Einkommen nicht steigend: ' + g.kt + ' ' + g.zs + ' ' + g.kinder + ' bei ' + p.brutto);
      pts.push(p);
    }
    if (pts.length < 2) { reihen.push({ ...g, alle: g.pts, reihe: null, pts }); continue; }
    let idx = null; let stufe = null;
    for (const s of STUFEN) { idx = stuetzpunkte(pts, s); stufe = s; if (idx.length <= MAX_STUETZPUNKTE) break; }
    const reihe = idx.flatMap((i) => [pts[i].x, pts[i].y]);
    const fehler = pts.map((p) => {
      const v = Math.round(interpoliere(reihe, p.x));
      return { brutto: p.brutto, x: p.x, estv: p.y, tabelle: v, abs: v - p.y, rel: p.y > 0 ? (v - p.y) / p.y : 0, ok: imRahmen(v - p.y, p.y, GRENZE), knoten: idx.includes(pts.indexOf(p)) };
    });
    reihen.push({ ...g, alle: g.pts, reihe, pts, stufe, fehler, anzahl: idx.length });
  }
  // Abdeckung gegen alle Kombinationen, nicht nur gegen die gemessenen.
  const kinderStufen = [0, 1, 2, 3];
  const fehlend = [];
  for (const kt of Object.keys(ORTE)) for (const zs of Object.keys(ZIVILSTAND)) for (const k of kinderStufen) {
    if (!reihen.some((r) => r.kt === kt && r.zs === zs && r.kinder === k && r.reihe)) fehlend.push(kt + ' ' + zs + ' ' + k);
  }
  return { reihen, dbgAbw, ohneSteuerbar, xAbw, xGeprueft, fehlend };
}

const median = (arr) => { const s = [...arr].sort((a, b) => a - b); return s.length ? s[s.length >> 1] : 0; };

// Nachmessung eines Kantons: alt (archiviert) gegen neu, je Messpunkt am selben Bruttolohn.
function nachmessungAbschnitt(n, mess0, messK) {
  const archiv = JSON.parse(readFileSync(resolve(__dirname, '../docs/' + n.archiv), 'utf-8'));
  const neu = new Map();
  for (const p of mess0.punkte.filter((q) => q[0] === n.kanton)) neu.set(p[1] + '/0/' + p[2], { fed: p[3], kg: p[10] });
  for (const p of (messK ? messK.punkte : []).filter((q) => q[0] === n.kanton)) neu.set(p[1] + '/' + p[2] + '/' + p[3], { fed: p[4], kg: p[11], tc: p[12] });
  const alt = new Map();
  for (const p of archiv.ohneKinder?.punkte || []) alt.set(p[1] + '/0/' + p[2], { fed: p[3], kg: p[10] });
  for (const p of archiv.mitKindern?.punkte || []) alt.set(p[1] + '/' + p[2] + '/' + p[3], { fed: p[4], kg: p[11], tc: p[12] });
  const d = [...alt].filter(([k]) => neu.has(k)).map(([k, a]) => ({ k, alt: a.kg, neu: neu.get(k).kg, diff: neu.get(k).kg - a.kg, fedGleich: a.fed === neu.get(k).fed, tc: a.tc != null ? neu.get(k).tc - a.tc : null }));
  const abs = d.map((x) => Math.abs(x.diff));
  const tcZahl = {};
  for (const x of d.filter((q) => q.tc != null)) tcZahl[x.tc] = (tcZahl[x.tc] || 0) + 1;
  const bsp = (zs, k) => [50000, 80000, 120000].map((b) => { const x = d.find((q) => q.k === zs + '/' + k + '/' + b); return x ? chf(x.alt) + ' → ' + chf(x.neu) : '–'; }).join(' · ');
  return ['## Nachmessungen', '',
    '### ' + n.kanton + ' ' + ORTE[n.kanton].ort + ', ' + n.abgerufen.slice(0, 10), '',
    '- Ersetzt: ' + d.length + ' Messpunkte vom ' + (archiv.ohneKinder?.abgerufen || '?').slice(0, 10) + ' (archiviert in `' + n.archiv.replace(/^sources\//, '') + '`).',
    '- ESTV K+G neu − alt: **Maximum CHF ' + chf(Math.max(...abs)) + '**, Median CHF ' + chf(median(abs)) + '; tiefer an ' + d.filter((x) => x.diff < 0).length +
      ', höher an ' + d.filter((x) => x.diff > 0).length + ', gleich an ' + d.filter((x) => x.diff === 0).length + ' Punkten.',
    '- Steuerbares Einkommen Bund an allen Punkten ' + (d.every((x) => x.fedGleich) ? '**unverändert**' : '**verändert**') + ' — die x-Achse der Tabelle ist dieselbe.',
    '- Steuerbares Einkommen Kanton neu − alt (nur mit Kindern gespeichert): ' + Object.entries(tcZahl).map(([k, v]) => 'CHF ' + k + ' an ' + v + ' Punkten').join(', ') + '.',
    '- Beispiele ESTV K+G bei Brutto 50 000 · 80 000 · 120 000 (alt → neu):',
    '  - ledig, ohne Kinder: ' + bsp('ledig', 0),
    '  - ledig, 1 Kind: ' + bsp('ledig', 1),
    '  - verheiratet, ohne Kinder: ' + bsp('verheiratet', 0),
    '  - verheiratet, 2 Kinder: ' + bsp('verheiratet', 2),
    ...(n.befund || []).map((z) => '- ' + z),
    ''];
}

// Stichprobe (scripts/estv-stichprobe.mjs): Umfang und Schwelle aus dem Skript selbst, damit das
// Quellenblatt nicht von Hand nachgeführt werden muss.
function stichprobeAbschnitt() {
  const n = Object.keys(ORTE).length * Object.keys(ZIVILSTAND).length * STICHPROBE_BRUTTO.length;
  return ['## Stichprobe', '',
    'Die Tests der App sichern die **Interpolation** der Tabelle, nicht ihre **Aktualität**. Am 23.09.2026 hatte die ESTV',
    'für TI die Daten des laufenden Steuerjahres geändert, ohne dass sich die Versionsangabe der Schnittstelle änderte',
    '(«Nachmessungen» oben); die Tests merkten es nicht. Die Stichprobe fragt deshalb den Rechner erneut und vergleicht',
    'mit den **gespeicherten Messpunkten** — nicht mit der interpolierten Tabelle.', '',
    '- **Aufruf:** `node scripts/estv-stichprobe.mjs` (optional `--messpunkte <datei>`, `--schwelle <CHF>`). Nur lesend, schreibt',
    '  nichts. Gleiche Schnittstelle und gleiche Anfrage wie die Messung (beide aus `scripts/estv-schnittstelle.mjs`).',
    '- **Umfang:** ' + Object.keys(ORTE).length + ' Kantone × ledig/verheiratet × Brutto ' + STICHPROBE_BRUTTO.map(chf).join(' · ') + ', ohne Kinder = **' + n + ' Abrufe**,',
    '  seriell mit ' + PAUSE_MS + ' ms Pause (rund 40 Sekunden). Vorher: Gegenprobe mit einer erfundenen Operation und Abruf der Version.',
    '- **Vergleich:** Kantons- + Gemeindesteuer (K+G) und steuerbares Einkommen Bund gegen `steuerfaktor-band-2026.messpunkte.json`.',
    '  Abweichend ist ein Punkt, wenn einer der beiden Werte um **mehr als CHF ' + SCHWELLE_CHF + '** abweicht. Die ESTV ist ein Rechner,',
    '  keine Messung mit Streuung: am selben Punkt liefert sie dieselbe Zahl (ZH am 23.09. in allen Feldern gleich wie am 16.09.).',
    '- **Exit-Code:** 0 = alle ' + n + ' Abrufe erfolgreich, keine Abweichung · 1 = mindestens eine Abweichung · 2 = Messung',
    '  gescheitert oder unvollständig (Netz, Schnittstelle geändert, Gegenprobe beantwortet, Messpunkt fehlt, weniger als ' + n,
    '  erfolgreiche Abrufe). 2 hat Vorrang vor 1; gefundene Abweichungen werden trotzdem ausgegeben. Die Zahl der erfolgreichen',
    '  Abrufe steht immer in der Ausgabe — «0 Abweichungen aus 0 Abrufen» ist 2, nie 0.',
    '- **Wann (Vorschlag):** vor einem Deploy, der Steuerzahlen zeigt, und wenn die ESTV Änderungen am Rechner ankündigt. Ob und wie oft',
    '  sie regelmässig läuft, entscheidet Stebler Studios; es gibt bewusst keinen Cron und keinen GitHub-Workflow.',
    '- **Bei Exit 1:** die Tabelle **nicht von Hand** ändern. Den gemeldeten Kanton nachmessen',
    '  (`node scripts/steuerband-messen.mjs --messen --kanton XX`, dann `--messen --kinder --kanton XX`, dann ohne Argumente',
    '  auswerten), den Befund unter «Nachmessungen» begründen (was hat sich geändert, belegt oder nur vermutet) und als',
    '  eigenen PR vorlegen.',
    '- **Bei Exit 2:** kein Befund über die Aktualität. Fehlerzeilen lesen; bei Netzproblemen später wiederholen, bei',
    '  geänderter Schnittstelle zuerst `steuerband-messen.mjs` anpassen.',
    '- **Grenzen:** geprüft werden nur drei Löhne ohne Kinder. Eine Änderung, die allein Kinderabzüge, andere Lohnbereiche',
    '  oder andere Gemeinden als den Hauptort betrifft, sieht die Stichprobe nicht. Die TI-Änderung vom 23.09. hätte sie an',
    '  allen 6 TI-Punkten gemeldet (−29 bis −123 CHF; Gegenprobe mit den archivierten Werten am 24.09.2026).',
    ''];
}

function schreiben(mess0, messK, messA, { reihen, dbgAbw, ohneSteuerbar, xAbw, xGeprueft, fehlend }) {
  // Datum der Gesamtmessung (ohne Nachmessungen einzelner Kantone) — gilt für alle Kantone, die
  // nicht nachgemessen sind. Nachgemessene Kantone tragen ihr eigenes Datum.
  const abgerufen = [mess0.abgerufen, ...(messK ? messK.laeufe.filter((l) => !l.nachmessung).map((l) => l.beginn) : [])];
  const letzterAbruf = abgerufen.slice().sort().at(-1).slice(0, 10);
  const nachgemessen = {};
  for (const n of mess0.nachmessungen || []) nachgemessen[n.kanton] = n.abgerufen;
  for (const l of messK ? messK.laeufe.filter((q) => q.nachmessung) : []) if (!nachgemessen[l.kanton] || l.beginn > nachgemessen[l.kanton]) nachgemessen[l.kanton] = l.beginn;
  const kinderStufen = [0, ...(messK ? [...new Set(messK.punkte.map((p) => p[2]))].sort() : [])];
  const quelle = 'ESTV Steuerrechner (swisstaxcalculator.estv.admin.ch), Steuerjahr ' + STEUERJAHR + ', Kantonshauptort, ohne Kirchensteuer';

  // ── src/data/kantonssteuerTabelle.js ──
  const tab = {};
  for (const r of reihen) {
    tab[r.kt] ??= { ledig: [], verheiratet: [] };
    tab[r.kt][r.zs][r.kinder] = r.reihe;
  }
  const js = [
    '// E38 — Kantons- und Gemeindesteuer (Hauptort, ohne Kirchensteuer) als Stütztabelle.',
    '// GENERIERT von scripts/steuerband-messen.mjs — nicht von Hand ändern.',
    '// Methode, Fehler und Abdeckung: docs/sources/kantonssteuer-tabelle-2026.md',
    '//',
    '// Je Kanton und Zivilstand eine Reihe je Kinderzahl (Index 0–' + kinderStufen.at(-1) + '): [x0, y0, x1, y1, …]',
    '//   x = steuerbares Einkommen Bund (CHF), y = ESTV-Kantons- + Gemeindesteuer inkl. Personalsteuer (CHF).',
    '// Alle Punkte sind Messpunkte des ESTV-Steuerrechners; dazwischen wird linear interpoliert,',
    '// ausserhalb der Reihe gibt es keinen Wert. ledig mit Kindern = alleinerziehend (Kinder im',
    '// gleichen Haushalt), verheiratet = Alleinverdiener. Kinder je ' + (messK ? messK.kinderalter : '–') + ' Jahre.',
    '',
    "export const KANTONSSTEUER_QUELLE = '" + quelle + "';",
    'export const KANTONSSTEUER_STEUERJAHR = ' + STEUERJAHR + ';',
    "export const KANTONSSTEUER_ABGERUFEN = '" + letzterAbruf + "';",
    '// Einzeln nachgemessene Kantone: Datum der Nachmessung (gilt statt KANTONSSTEUER_ABGERUFEN).',
    'export const KANTONSSTEUER_ABGERUFEN_JE_KANTON = {' + Object.entries(nachgemessen).sort().map(([k, d]) => ' ' + k + ": '" + d.slice(0, 10) + "'").join(',') + (Object.keys(nachgemessen).length ? ' ' : '') + '};',
    'export const KANTONSSTEUER_MAX_KINDER = ' + kinderStufen.at(-1) + ';',
    '',
    'export const KANTONSSTEUER_TABELLE = {',
    ...Object.entries(tab).sort(([a], [b]) => a.localeCompare(b)).flatMap(([kt, z]) => [
      '  ' + kt + ': {',
      ...['ledig', 'verheiratet'].map((zs) => '    ' + zs + ': [\n' + kinderStufen.map((k) => '      ' + (z[zs][k] ? '[' + z[zs][k].join(',') + ']' : 'null') + ',').join('\n') + '\n    ],'),
      '  },',
    ]),
    '};',
    '',
  ].join('\n');
  writeFileSync(DATA_PATH, js);

  // ── Kennzahlen ──
  const alle = reihen.filter((r) => r.reihe).flatMap((r) => r.fehler);
  const nichtKnoten = alle.filter((f) => !f.knoten);
  const ausserhalb = alle.filter((f) => !f.ok);
  const maxAbs = Math.max(...alle.map((f) => Math.abs(f.abs)));
  const maxRel = Math.max(...alle.filter((f) => f.estv >= 1000).map((f) => Math.abs(f.rel)));
  const anz = reihen.filter((r) => r.reihe).map((r) => r.anzahl);
  const stufenZahl = {};
  for (const r of reihen.filter((q) => q.reihe)) { const k = pct(r.stufe.rel) + ' / CHF ' + r.stufe.abs; stufenZahl[k] = (stufenZahl[k] || 0) + 1; }

  const L = [];
  L.push('# Kantons- und Gemeindesteuer — Stütztabelle 2026 (E38)', '');
  L.push('Diese Datei ist **generiert** von `node scripts/steuerband-messen.mjs`. Die Rohwerte liegen daneben:',
    '`steuerfaktor-band-2026.messpunkte.json` (ohne Kinder, E37) und `kantonssteuer-kinder-2026.messpunkte.json`',
    '(1–3 Kinder, E38). Die App liest `src/data/kantonssteuerTabelle.js`.', '');
  L.push('## Warum eine Tabelle', '',
    'Bis E37 schätzte die App die Kantons- und Gemeindesteuer als *Faktor × Bundessteuer*. Am ESTV-Steuerrechner 2026',
    'lag dieser eine Faktor bei Brutto 80 000 (ledig) in allen 26 Kantonen 44–70 % zu tief (PR #180). Die Bundessteuer',
    'ist stärker progressiv als die meisten kantonalen Tarife; ein fester Faktor passt deshalb nur in einem schmalen',
    'Einkommensbereich. Seit E38 liest die App die Kantons- und Gemeindesteuer direkt aus Messpunkten des amtlichen',
    'Rechners. Der Faktor und das Band aus E37 sind entfernt.', '');
  L.push('## Quelle', '',
    '- **ESTV, Steuerrechner** — <' + mess0.webseite + '>, Rechner «Einkommens- und Vermögenssteuer», detaillierte',
    '  Berechnung. Abgefragt über die Schnittstelle der Web-Oberfläche: `API_calculateDetailedTaxes` (' + API + ').',
    '- Abrufe (UTC): ohne Kinder ' + mess0.abgerufen + (messK ? '; mit Kindern ' + messK.laeufe.map((l) => l.beginn + '–' + (l.ende || '?') + ' (' + (l.abrufe ?? '?') + ' Abrufe)').join(', ') : '') + '.',
    '- Steuerjahr **' + STEUERJAHR + '**. Ort je Kanton: Kantonshauptort (TaxLocationID aus `API_searchLocation`); jede Antwort',
    '  wurde gegen Kanton und BFS-Nummer geprüft.',
    '- Gegenprobe bei jedem Lauf: eine erfundene Operation muss scheitern — ohne Kinder: ' + mess0.gegenprobe +
      (messK ? '; mit Kindern: ' + messK.laeufe.map((l) => l.gegenprobe).join(', ') : '') + '.',
    '- Abgefragt gedrosselt: ein Abruf nach dem anderen, 150 ms Pause (Lauf mit Kindern; der Lauf ohne Kinder am 16.09. noch mit 4 parallelen Abrufen).',
    ...(mess0.nachmessungen || []).map((n) => '- **Nachgemessen: ' + n.kanton + '** am ' + n.abgerufen.slice(0, 10) + ' (ohne Kinder ' + n.abgerufen + '–' + n.ende + ', ' + n.abrufe + ' Abrufe, seriell 150 ms; mit Kindern siehe Läufe oben; Gegenprobe: ' + n.gegenprobe + '). Die Punkte dieses Kantons ersetzen die vom 16.09. — siehe «Nachmessungen».'),
    '');
  L.push('## Messanlage', '',
    '- Unselbständig erwerbend, Alter 40, Konfession «andere/keine» (ohne Kirchensteuer), kein Vermögen.',
    '- **ledig** = Relationship 1. Mit Kindern heisst das **alleinerziehend**: Der ESTV-Rechner kennt keinen eigenen',
    '  Zivilstand dafür; er rechnet eine ledige Person mit Kindern im gleichen Haushalt. Für die Bundessteuer wendet er',
    '  dabei den Elterntarif an (Art. 36 Abs. 2bis DBG) — Kontrolle unten.',
    '- **verheiratet** = Relationship 2, Alleinverdiener-Ehepaar (zweite Person ohne Einkommen, Alter 40).',
    '- **Kinder:** 0, 1, 2, 3; je ' + (messK ? messK.kinderalter : '–') + ' Jahre (`Children: [{ Age: ' + (messK ? messK.kinderalter : '–') + ' }]`). Schulkinder: keine Abzüge für',
    '  Kleinkinder oder Kinder in Ausbildung, keine Fremdbetreuungskosten.',
    '- Bruttolohn 20 000–150 000 in Schritten von 2 500, danach bis 300 000 in Schritten von 10 000 (68 Werte).',
    '- **ESTV K+G** = Kantonssteuer + Gemeindesteuer + Personal-/Kopfsteuer auf dem Einkommen, ohne Kirchensteuer.',
    '- **x-Achse = steuerbares Einkommen Bund der ESTV** (`TaxableIncomeFed`), also nach den Standardabzügen des',
    '  Rechners. Die App kennt dagegen den **Nettolohn** und die selbst erfassten Abzüge. Sie liest die Tabelle deshalb',
    '  mit `steuerbarNachEstv()` (src/data/kantonaleSteuerdaten.js): Nettolohn − Berufsauslagen-Pauschale (oder erfasste',
    '  Berufsauslagen) − Versicherungsabzug − Verheiratetenabzug − Kinderabzug − übrige erfasste Abzüge. Ein direkt',
    '  eingetragenes steuerbares Einkommen gilt als Wert der direkten Bundessteuer und wird unverändert gelesen.',
    '- Messpunkte gesamt: **' + (mess0.punkte.length + (messK ? messK.punkte.length : 0)) + '** (' + mess0.punkte.length + ' ohne Kinder, ' + (messK ? messK.punkte.length : 0) + ' mit Kindern). ' +
      ohneSteuerbar + ' davon haben steuerbares Einkommen Bund 0 und gehen nicht in die Tabelle (sehr tiefe Löhne mit Kindern).',
    '', '### Kontrolle der eigenen Bundessteuer', '',
    '- ' + (dbgAbw.length === 0
      ? 'An allen Messpunkten liegt `steuerRechner.js` höchstens CHF 1 neben der ESTV-Bundessteuer — ledig mit Kindern mit Elterntarif gerechnet. Der ESTV-Rechner wendet den Elterntarif für ledige Personen mit Kindern also an.'
      : dbgAbw.length + ' Messpunkte weichen um mehr als CHF 1 ab (Liste am Ende).'), '');
  L.push('### Vom Nettolohn zur x-Achse (Weg der App)', '',
    '- Abzugsposten der ESTV je Bruttolohn: `nettolohn-abzuege-2026.messpunkte.json` (Zürich, ledig; abgerufen ' + (messA ? messA.abgerufen : '–') + ', Gegenprobe: ' + (messA ? messA.gegenprobe : '–') + ').',
    '- Posten Bund laut Rechner: «Übrige Berufsauslagen» 3 % des Nettolohns (mind. 2 000, höchstens 4 000), «Abzug private',
    '  Versicherungen / Sparzinsen» 1 800 bzw. 3 700 + 700 je Kind (ohne BVG-Beitrag Grundbetrag × 1,5), «Abzug verheiratete',
    '  Steuerpflichtige» 2 800, «Kindersozialabzug» 6 800 je Kind.',
    '- Prüfung der Formel an ' + xGeprueft + ' Messpunkten (alle Kantone, Zivilstände, Kinderzahlen): ' +
      (xAbw.length === 0 ? '**alle höchstens CHF 1 neben dem steuerbaren Einkommen der ESTV.**' : '**' + xAbw.length + ' Abweichungen > CHF 1** (Liste am Ende).'),
    '- Nicht abgebildet: Die ESTV kennt den Bruttolohn und damit, ob ein BVG-Beitrag anfällt; die App schliesst das aus',
    '  dem Nettolohn (gemessen: Brutto 22 500 ohne, 25 000 mit BVG-Beitrag). Zwischen Nettolohn 20 969 und 23 111 kann x',
    '  deshalb um 900 (ledig) zu hoch oder zu tief liegen. Der 13. Monatslohn und Nebeneinkommen gehen so ein, wie die',
    '  App den Jahreslohn bildet.', '');
  for (const n of mess0.nachmessungen || []) L.push(...nachmessungAbschnitt(n, mess0, messK));
  L.push(...stichprobeAbschnitt());
  L.push('## Tabelle und Randregel', '',
    '- Je Kanton × Zivilstand × Kinderzahl eine Reihe von **Stützpunkten**. Jeder Stützpunkt ist ein Messpunkt.',
    '  Zwischen zwei Stützpunkten wird **linear interpoliert**.',
    '- Auswahl: die kleinste Menge Messpunkte (erster und letzter immer dabei), bei der die Interpolation **jeden**',
    '  Messpunkt der Reihe trifft — zuerst mit ±0,5 % / CHF 10, dann schrittweise weiter (1 % / 20, 1,5 % / 25,',
    '  2 % / 35, 3 % / 50), bis die Reihe mit höchstens ' + MAX_STUETZPUNKTE + ' Stützpunkten auskommt. Die Messpunkte, die nicht',
    '  Stützpunkt sind, sind damit zugleich die Kontrolle der Interpolation.',
    '- **Randregel: keine Extrapolation.** Unter dem kleinsten und über dem grössten Stützpunkt zeigt die App keine',
    '  Zahl. Unten beginnt die Reihe beim Brutto 20 000 (bzw. beim ersten Brutto mit steuerbarem Einkommen > 0);',
    '  darunter kann die Steuer 0 oder eine Kopfsteuer sein — das wäre geraten. Oben endet sie bei Brutto 300 000;',
    '  darüber ändern sich in mehreren Kantonen die Tarifstufen.',
    '- **Keine Reihe, keine Zahl:** mehr als ' + kinderStufen.at(-1) + ' Kinder, ledig mit Kindern ohne bestätigten Elterntarif',
    '  (dann ist offen, ob die Kinder im gleichen Haushalt leben), unbekannter Kanton.',
    '- **Nicht gemessen:** Doppelverdiener, Konkubinat, andere Gemeinden als der Hauptort, Kirchensteuer, Vermögen,',
    '  Kinder in Ausbildung oder mit Betreuungskosten. Die App kennzeichnet die Zahl deshalb als «grobe Schätzung».', '');
  L.push('## Interpolationsfehler (an allen Messpunkten)', '',
    '- Grenze laut Auftrag: höchstens ±3 % der ESTV K+G oder ±CHF 50 (das Grössere).',
    '- Messpunkte in der Tabelle: **' + alle.length + '**, davon ' + nichtKnoten.length + ' nicht Stützpunkt.',
    '- Ausserhalb der Grenze: **' + ausserhalb.length + '**.',
    '- Abweichung Tabelle − ESTV: **Maximum CHF ' + chf(maxAbs) + '**, Median CHF ' + chf(median(alle.map((f) => Math.abs(f.abs)))) +
      ' (nur Nicht-Stützpunkte: Median CHF ' + chf(median(nichtKnoten.map((f) => Math.abs(f.abs)))) + ').',
    '- Grösste relative Abweichung bei ESTV K+G ab CHF 1 000: **' + pct(maxRel) + '**; Median ' + pct(median(alle.filter((f) => f.estv >= 1000).map((f) => Math.abs(f.rel)))) + '.',
    '- Stützpunkte je Reihe: min ' + Math.min(...anz) + ', Median ' + median(anz) + ', max ' + Math.max(...anz) + '. Gewählte Stufe: ' +
      Object.entries(stufenZahl).map(([k, v]) => k + ' → ' + v + ' Reihen').join('; ') + '.', '');
  L.push('## Abdeckung', '',
    '- Reihen mit Tabelle: **' + reihen.filter((r) => r.reihe).length + '** von ' + reihen.length + ' (26 Kantone × 2 Zivilstände × ' + kinderStufen.length + ' Kinderzahlen = ' + 26 * 2 * kinderStufen.length + ').',
    fehlend.length ? '- **Ohne Tabelle:** ' + fehlend.join(', ') : '- Keine der ' + 26 * 2 * kinderStufen.length + ' Kombinationen fehlt (geprüft gegen alle Kombinationen, nicht nur gegen die gemessenen).',
    '', '| Kanton | Zivilstand | Kinder | steuerbar Bund von–bis | Stützpunkte | max. Abw. CHF | max. Abw. % (K+G ≥ 1 000) | ESTV K+G bei Brutto 50 000 / 80 000 / 120 000 |',
    '|---|---|---:|---|---:|---:|---:|---|');
  const sortiert = reihen.slice().sort((a, b) => a.kt.localeCompare(b.kt) || a.zs.localeCompare(b.zs) || a.kinder - b.kinder);
  for (const r of sortiert) {
    if (!r.reihe) { L.push('| ' + r.kt + ' | ' + r.zs + ' | ' + r.kinder + ' | — keine Tabelle | | | | |'); continue; }
    const probe = [50000, 80000, 120000].map((b) => { const p = r.alle.find((q) => q.brutto === b); return p ? chf(p.y) : '–'; }).join(' / ');
    const grosse = r.fehler.filter((f) => f.estv >= 1000);
    L.push('| ' + r.kt + ' ' + ORTE[r.kt].ort + ' | ' + r.zs + ' | ' + r.kinder + ' | ' + chf(r.reihe[0]) + '–' + chf(r.reihe[r.reihe.length - 2]) + ' | ' + r.anzahl + ' | ' +
      chf(Math.max(...r.fehler.map((f) => Math.abs(f.abs)))) + ' | ' + (grosse.length ? pct(Math.max(...grosse.map((f) => Math.abs(f.rel)))) : '–') + ' | ' + probe + ' |');
  }
  L.push('', '## Stützpunkte', '', 'Je Reihe: steuerbar Bund → ESTV K+G (CHF).', '');
  for (const kt of Object.keys(ORTE)) {
    L.push('<details><summary>' + kt + ' — ' + ORTE[kt].ort + '</summary>', '');
    for (const r of sortiert.filter((q) => q.kt === kt && q.reihe)) {
      const paare = [];
      for (let i = 0; i < r.reihe.length; i += 2) paare.push(chf(r.reihe[i]) + ' → ' + chf(r.reihe[i + 1]));
      L.push('- **' + r.zs + ', ' + r.kinder + ' Kind' + (r.kinder === 1 ? '' : 'er') + ':** ' + paare.join(' · '));
    }
    L.push('', '</details>', '');
  }
  if (dbgAbw.length) L.push('## Abweichungen der eigenen Bundessteuer (> CHF 1)', '', '```', ...dbgAbw.map((a) => JSON.stringify(a)), '```', '');
  if (xAbw.length) L.push('## Abweichungen Nettolohn-Formel (> CHF 1)', '', '```', ...xAbw.map((a) => JSON.stringify(a)), '```', '');
  if (ausserhalb.length) L.push('## Messpunkte ausserhalb der Grenze', '', '```', ...ausserhalb.map((a) => JSON.stringify(a)), '```', '');
  writeFileSync(DOC_PATH, L.join('\n'));

  console.log('Reihen:', reihen.filter((r) => r.reihe).length, '/', reihen.length, '· Messpunkte in Tabellen:', alle.length, '· ausserhalb Grenze:', ausserhalb.length);
  console.log('max Abw CHF', maxAbs, '· median', median(alle.map((f) => Math.abs(f.abs))), '· max rel (K+G≥1000)', pct(maxRel), '· Stützpunkte', Math.min(...anz), median(anz), Math.max(...anz));
  console.log('Nettolohn-Formel geprüft:', xGeprueft, '· Abweichungen > 1 CHF:', xAbw.length, xAbw.slice(0, 5));
  console.log('fehlende Kombinationen:', fehlend.length);
  console.log('Stufen:', JSON.stringify(stufenZahl), '· DBG-Abweichungen > 1 CHF:', dbgAbw.length, '· ohne steuerbar:', ohneSteuerbar);
}

if (process.argv.includes('--messen') && process.argv.includes('--abzuege')) {
  await messenAbzuege();
} else if (process.argv.includes('--messen') && process.argv.includes('--kinder')) {
  await messenKinder();
} else if (process.argv.includes('--messen')) {
  await messen();
} else {
  const mess0 = JSON.parse(readFileSync(MESS_PATH, 'utf-8'));
  let messK = null;
  try { messK = JSON.parse(readFileSync(KINDER_PATH, 'utf-8')); } catch { console.warn('ohne Kinder-Messung:', KINDER_PATH); }
  let messA = null;
  try { messA = JSON.parse(readFileSync(ABZUG_PATH, 'utf-8')); } catch { console.warn('ohne Abzugs-Messung:', ABZUG_PATH); }
  schreiben(mess0, messK, messA, auswerten(mess0, messK, messA));
}

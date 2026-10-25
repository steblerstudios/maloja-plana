#!/usr/bin/env node
// Prämien je Versicherer (Standardmodell) aus dem BAG-Gesamtbericht → src/data/praemienDetailDaten.js.
// Die Zugriffe (Stichtag, Franchisen) stehen von Hand in praemienDetail.js.
//
// Jahre werden ZUSAMMENGEFÜHRT (seit 25.10.2026): das gelesene Jahr kommt dazu oder ersetzt sich selbst, frühere
// bleiben. Die App rechnet bis 31.12. mit dem laufenden Jahr und ab 1.1. mit dem neuen.
//
// Quellen, je nachdem was in src/data/raw liegt:
//   gesamtbericht_ch-JJJJ.pdf  — seit 2027 der einzige Weg (priminfo «Gesamtverzeichnis aller Prämien»);
//                                gelesen mit extract-praemien-detail-pdf.py (pdftotext -bbox, poppler).
//   gesamtbericht_ch.xlsx      — Excel-Fassung bis 2026 (extract-praemien-detail.py, openpyxl); --jahr JJJJ nötig.
//
// Run: node scripts/build-praemien-detail.mjs [--jahr JJJJ] [--quelle "Datei, Stand …"]

import { execFileSync } from 'child_process';
import { writeFileSync, existsSync, readFileSync, readdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const RAW_DIR = resolve(__dirname, '../src/data/raw');
const OUT_DIR = resolve(__dirname, '../src/data');
const DATEN = resolve(OUT_DIR, 'praemienDetailDaten.js');
const arg = (name) => { const i = process.argv.indexOf(name); return i > 0 ? process.argv[i + 1] : null; };

// Kurznamen in den PDF-Tabellen → BAG-Versicherernummer (Verzeichnis der zugelassenen Krankenversicherer, im
// selben PDF). Ein Name, der hier fehlt, bricht den Lauf ab — nie raten.
const NR_AUS_KURZNAME = {
  Agrisano: 1560, Aquilana: 32, Assura: 1542, Atupri: 312, Avenir: 343, Birchmeier: 1322, CSS: 8, Concordia: 290,
  EGK: 881, Einsiedeln: 134, Galenos: 1386, Glarner: 780, Helsana: 1562, KKLH: 360, KPT: 376, Mutuel: 1479,
  Philos: 1535, Rhenusana: 1401, SLKK: 923, Sana24: 1568, Sanitas: 1509, Sodalis: 941, Steffisburg: 246,
  Sumiswalder: 194, Swica: 1384, Visana: 1555, Visperterminen: 1040, 'Vita Surselva': 966, 'Vivao Sympany': 509,
  Wädenswil: 1318, curaulta: 820, ÖKK: 455,
};

function ausPdf(pdf) {
  const roh = JSON.parse(execFileSync('python3', [resolve(__dirname, 'extract-praemien-detail-pdf.py'), pdf],
    { encoding: 'utf-8', maxBuffer: 50 * 1024 * 1024, timeout: 300000 }));
  const jahre = new Set(roh.map((z) => z.jahr));
  if (jahre.size !== 1) throw new Error('PDF enthält mehrere Jahre: ' + [...jahre]);
  const tab = {};
  for (const z of roh) {
    const [basis, zusatz] = z.name.split(/, (.*)/s);
    if (!(basis in NR_AUS_KURZNAME)) throw new Error('Unbekannter Versicherer «' + z.name + '» (Seite ' + z.seite + ')');
    // Kinder: Grundtarif fürs erste Kind. «ab 3. Kind», «Zwei Kinder», «Drei und mehr» sind Geschwisterrabatte.
    if (zusatz && !(z.alter === 'kin' && zusatz.startsWith('Ein Kind'))) continue;
    const key = NR_AUS_KURZNAME[basis] + '|' + z.kanton + '|' + z.region;
    const e = (tab[key] ||= {});
    if (e[z.alter]) throw new Error('Doppelt: ' + key + ' ' + z.alter + ' (Seite ' + z.seite + ')');
    e[z.alter] = z;
  }
  const D = {};
  for (const [key, e] of Object.entries(tab)) {
    const [nr, k, r] = key.split('|');
    if (!e.erw || !e.jug || !e.kin) throw new Error('Unvollständig: ' + key);
    (D[nr] ||= []).push([k, Number(r), e.erw.mit, e.jug.mit, e.kin.mit, e.erw.ohne, e.jug.ohne]);
  }
  for (const v of Object.values(D)) v.sort((a, b) => a[0].localeCompare(b[0]) || a[1] - b[1]);
  return { jahr: String([...jahre][0]), D, namen: {} };
}

function ausXlsx(jahr) {
  if (!jahr) throw new Error('Für gesamtbericht_ch.xlsx braucht es --jahr JJJJ');
  const data = JSON.parse(execFileSync('python3', [resolve(__dirname, 'extract-praemien-detail.py'), RAW_DIR],
    { encoding: 'utf-8', maxBuffer: 20 * 1024 * 1024, timeout: 120000 }));
  return { jahr: String(jahr), D: data.premiums, namen: data.insurers };
}

const pdf = readdirSync(RAW_DIR).find((f) => /^gesamtbericht_ch-\d{4}\.pdf$/.test(f));
const neu = pdf ? ausPdf(resolve(RAW_DIR, pdf)) : ausXlsx(arg('--jahr'));

// === Bisherige Jahre laden ===
let detail = {}, namen = {}, quellen = {};
if (existsSync(DATEN)) {
  const alt = await import(pathToFileURL(DATEN).href);
  detail = { ...alt.DETAIL }; namen = { ...alt.NAMEN }; quellen = { ...alt.DETAIL_QUELLEN };
} else {
  // Einmalige Übernahme aus dem alten Format (praemienDetail.js mit `const D`/`const N`, ein Jahr).
  const altJs = readFileSync(resolve(OUT_DIR, 'praemienDetail.js'), 'utf-8');
  const altJahr = altJs.match(/DETAIL_DATA_VERSION = '(\d{4})'/)[1];
  detail[altJahr] = JSON.parse(altJs.match(/const D = (\{.*?\});\n/s)[1]);
  namen = JSON.parse(altJs.match(/const N = (\{.*?\});\n/s)[1]);
  quellen[altJahr] = 'priminfo.admin.ch/downloads/gesamtbericht_ch.xlsx';
}

detail[neu.jahr] = neu.D;
namen = { ...namen, ...neu.namen };
for (const nr of Object.keys(neu.D)) if (!namen[nr]) throw new Error('Kein Name für Versicherer ' + nr);
quellen[neu.jahr] = arg('--quelle') || ('priminfo.admin.ch — ' + (pdf || 'gesamtbericht_ch.xlsx'));

const sortiert = (o) => Object.fromEntries(Object.entries(o).sort(([a], [b]) => a.localeCompare(b, 'en', { numeric: true })));
const js = [
  '// Auto-generated from BAG Gesamtbericht Prämien — nicht von Hand ändern.',
  '// Run: node scripts/build-praemien-detail.mjs',
  '//',
  '// DETAIL[Jahr][versNr] = [[kanton, region, erwMit[6], jugMit[6], kinMit[7], erwOhn[6], jugOhn[6]], ...]',
  '// ERW/JUG franchises: [300, 500, 1000, 1500, 2000, 2500] · KIN franchises: [0, 100, 200, 300, 400, 500, 600]',
  '// Standardmodell (TAR-BASE), mit Unfall = erwMit/jugMit/kinMit, ohne Unfall = erwOhn/jugOhn. Kinder: Grundtarif',
  '// fürs erste Kind (ohne Geschwisterrabatt). 0 = Franchise/Tarif nicht angeboten. PDF-Werte auf 10 Rappen gerundet.',
  '// NAMEN: versNr → Name (über alle Jahre; wer in einem Jahr fehlt, hat dort keine Einträge).',
  '',
  'export const DETAIL = ' + JSON.stringify(sortiert(Object.fromEntries(Object.entries(detail).map(([j, d]) => [j, sortiert(d)])))) + ';',
  '',
  'export const NAMEN = ' + JSON.stringify(sortiert(namen)) + ';',
  '',
  'export const DETAIL_QUELLEN = ' + JSON.stringify(sortiert(quellen), null, 2) + ';',
  '',
].join('\n');
writeFileSync(DATEN, js, 'utf-8');

console.log('✓ praemienDetailDaten.js · Jahre ' + Object.keys(detail).join(', ') + ' · ' + (Buffer.byteLength(js) / 1024).toFixed(1) + ' KB');
for (const [j, d] of Object.entries(detail)) console.log('  ' + j + ': ' + Object.keys(d).length + ' Versicherer, ' + Object.values(d).reduce((s, v) => s + v.length, 0) + ' Einträge');

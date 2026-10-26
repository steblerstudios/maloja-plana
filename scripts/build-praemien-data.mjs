#!/usr/bin/env node
// Transforms BAG Prämienregionen Excel into two JS modules:
//   1. praemienRegionenDaten.js — Gemeinden (BFS-Nr → Kanton, Name, Region) + Durchschnittsprämien JE JAHR
//      und Kantonsregion. Die Zugriffe (Stichtag, Schweizer Schnitt) stehen von Hand in praemienRegionen.js.
//   2. versichererListe.js — zugelassene Krankenversicherer
//
// Jahre werden ZUSAMMENGEFÜHRT (seit 25.10.2026): das Jahr der Excel-Datei (Kopfzeile D_PRIM) kommt dazu
// oder ersetzt sich selbst; frühere Jahre bleiben. So rechnet die App bis 31.12. mit dem laufenden Jahr
// und ab 1.1. mit dem neuen, ohne dass ein Lauf am Jahreswechsel nötig ist.
// Die mittlere Prämie gilt je Kantonsregion, nicht je Gemeinde (BAG, Kopftext D_PRIM) — darum je k+r.
//
// Requires: pip3 install openpyxl
// Run: node scripts/build-praemien-data.mjs [--quelle "Datei, Stand …"]
//   src/data/raw/praemienregionen.xlsx  — «Prämienregionen gültig ab …» von priminfo.admin.ch
//   src/data/raw/zugelassene_kv.xlsx    — «Verzeichnis der zugelassenen Krankenversicherer»

import { execSync } from 'child_process';
import { writeFileSync, existsSync, readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const RAW_DIR = resolve(__dirname, '../src/data/raw');
const OUT_DIR = resolve(__dirname, '../src/data');
const PY_SCRIPT = resolve(__dirname, 'extract-xlsx.py');
const DATEN = resolve(OUT_DIR, 'praemienRegionenDaten.js');

const quelleArg = process.argv.indexOf('--quelle');
const quelle = quelleArg > 0 ? process.argv[quelleArg + 1] : null;

console.log('Parsing XLSX files with Python...');
const raw = execSync('python3 "' + PY_SCRIPT + '" "' + RAW_DIR + '"', {
  encoding: 'utf-8',
  maxBuffer: 10 * 1024 * 1024
});
const data = JSON.parse(raw);
if (!data.jahr) throw new Error('Prämienjahr in D_PRIM (Zeile 15) nicht gefunden');

// === Bisherige Jahre laden ===
let gemeinden = {}, praemien = {}, quellen = {};
if (existsSync(DATEN)) {
  const alt = await import(pathToFileURL(DATEN).href);
  gemeinden = { ...alt.GEMEINDEN }; praemien = { ...alt.PRAEMIEN }; quellen = { ...alt.PRAEMIEN_QUELLEN };
} else {
  // Einmalige Übernahme aus dem alten Format (praemienRegionen.js mit `const D`, ein Jahr).
  const altJs = readFileSync(resolve(OUT_DIR, 'praemienRegionen.js'), 'utf-8');
  const D = JSON.parse(altJs.match(/const D = (\{.*?\});/s)[1]);
  const altJahr = altJs.match(/PRAEMIEN_DATA_VERSION = '(\d{4})'/)[1];
  praemien[altJahr] = {};
  for (const [bfs, e] of Object.entries(D)) {
    gemeinden[bfs] = [e.k, e.g, e.r];
    praemien[altJahr][e.k + e.r] = [e.c, e.y, e.a];
  }
  quellen[altJahr] = (altJs.match(/\/\/ Source: (.*)/) || [])[1] || 'priminfo.admin.ch';
}

// === Neues Jahr einfügen ===
const jahr = String(data.jahr);
praemien[jahr] = {};
for (const [bfs, e] of Object.entries(data.praemien)) {
  gemeinden[bfs] = [e.k, e.g, e.r]; // neuester Stand gewinnt; fusionierte Gemeinden bleiben auffindbar
  const key = e.k + e.r, wert = [e.c, e.y, e.a];
  const da = praemien[jahr][key];
  if (da && da.join('/') !== wert.join('/')) throw new Error('Kantonsregion ' + key + ' ' + jahr + ' nicht einheitlich');
  praemien[jahr][key] = wert;
}
quellen[jahr] = quelle || ('priminfo.admin.ch — praemienregionen-' + jahr + '.xlsx');

const sortiert = (o) => Object.fromEntries(Object.entries(o).sort(([a], [b]) => a.localeCompare(b, 'en', { numeric: true })));
const datenJS = [
  '// Auto-generated from BAG Prämienregionen Excel — nicht von Hand ändern.',
  '// Run: node scripts/build-praemien-data.mjs',
  '//',
  '// GEMEINDEN: BFS-Nr → [Kanton, Gemeinde, Region(0-3)] (Region 0 = Kanton hat nur eine Region).',
  '//   Enthält auch Gemeinden früherer Jahre (Fusionen): die Region bleibt so auffindbar.',
  '// PRAEMIEN[Jahr][Kanton+Region] = [Kinder, Junge Erwachsene, Erwachsene] — monatliche mittlere Prämie OKP',
  '//   in CHF (alle Versicherer, Standardmodell), je Kantonsregion; ggf. mit provisorisch genehmigten Prämien.',
  '',
  'export const GEMEINDEN = ' + JSON.stringify(sortiert(gemeinden)) + ';',
  '',
  'export const PRAEMIEN = ' + JSON.stringify(sortiert(Object.fromEntries(Object.entries(praemien).map(([j, p]) => [j, sortiert(p)])))) + ';',
  '',
  'export const PRAEMIEN_QUELLEN = ' + JSON.stringify(sortiert(quellen), null, 2) + ';',
  ''
].join('\n');

writeFileSync(DATEN, datenJS, 'utf-8');

// === Generate versichererListe.js ===
const versichererJS = [
  '// Auto-generated from BAG zugelassene Krankenversicherer',
  '// Source: priminfo.admin.ch — Stand 01.01.2026',
  '// Run: node scripts/build-praemien-data.mjs',
  '',
  'const V = ' + JSON.stringify(data.insurers) + ';',
  '',
  'export function getAllInsurers() {',
  '  return V.map(v => v.name);',
  '}',
  '',
  'export function searchInsurers(query) {',
  '  if (!query || query.length < 2) return [];',
  '  const q = query.toLowerCase();',
  '  return V.filter(v => v.name.toLowerCase().includes(q)).map(v => v.name);',
  '}',
  '',
  'export function getInsurerInfo(name) {',
  '  return V.find(v => v.name === name) || null;',
  '}',
  '',
  'export const INSURER_COUNT = ' + data.insurers.length + ';',
  "export const INSURER_DATA_VERSION = '2026-01-01';",
  "export const INSURER_DATA_SOURCE = 'BAG priminfo.admin.ch';",
  ''
].join('\n');

writeFileSync(resolve(OUT_DIR, 'versichererListe.js'), versichererJS, 'utf-8');

// Stats
const datenSize = Buffer.byteLength(datenJS, 'utf-8');
const versichererSize = Buffer.byteLength(versichererJS, 'utf-8');

console.log('✓ praemienRegionenDaten.js');
console.log('  ' + Object.keys(gemeinden).length + ' Gemeinden · Jahre ' + Object.keys(praemien).join(', '));
console.log('  ' + (datenSize / 1024).toFixed(1) + ' KB unkomprimiert');
console.log('✓ versichererListe.js');
console.log('  ' + data.insurers.length + ' zugelassene Krankenversicherer');
console.log('  ' + (versichererSize / 1024).toFixed(1) + ' KB unkomprimiert');

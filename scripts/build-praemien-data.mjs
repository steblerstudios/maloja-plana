#!/usr/bin/env node
// Transforms BAG Prämienregionen Excel into two JS modules:
//   1. praemienRegionen.js — BFS-Nr → Region + Durchschnittsprämien
//   2. versichererListe.js — zugelassene Krankenversicherer
//
// Requires: pip3 install openpyxl
// Run: node scripts/build-praemien-data.mjs

import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const RAW_DIR = resolve(__dirname, '../src/data/raw');
const OUT_DIR = resolve(__dirname, '../src/data');
const PY_SCRIPT = resolve(__dirname, 'extract-xlsx.py');

console.log('Parsing XLSX files with Python...');
const raw = execSync('python3 "' + PY_SCRIPT + '" "' + RAW_DIR + '"', {
  encoding: 'utf-8',
  maxBuffer: 10 * 1024 * 1024
});
const data = JSON.parse(raw);

// === Generate praemienRegionen.js ===
const praemienEntries = Object.entries(data.praemien);
const praemienObj = praemienEntries
  .map(([bfs, v]) => JSON.stringify(bfs) + ':' + JSON.stringify(v))
  .join(',');

const praemienJS = [
  '// Auto-generated from BAG Prämienregionen Excel',
  '// Source: priminfo.admin.ch — Stand 2026 (release-2026-04-30)',
  '// Run: node scripts/build-praemien-data.mjs',
  '//',
  '// Format: BFS-Nr → {k: Kanton, r: Region(0-3), c: Kinder, y: Junge, a: Erwachsene}',
  '// Prämien = monatliche Durchschnittsprämie CHF (alle Versicherer, Standardmodell)',
  '// Region 0 = Kanton hat nur eine Region',
  '',
  'const D = {' + praemienObj + '};',
  '',
  'export function getRegion(bfsNr) {',
  '  const entry = D[String(bfsNr)];',
  '  return entry ? entry.r : null;',
  '}',
  '',
  'export function getAveragePremium(bfsNr) {',
  '  const entry = D[String(bfsNr)];',
  '  if (!entry) return null;',
  '  return { kinder: entry.c, junge: entry.y, erwachsene: entry.a, region: entry.r, kanton: entry.k };',
  '}',
  '',
  'export function getRegionInfo(bfsNr) {',
  '  const entry = D[String(bfsNr)];',
  '  if (!entry) return null;',
  '  return {',
  '    kanton: entry.k,',
  '    gemeinde: entry.g,',
  '    region: entry.r,',
  '    praemien: { kinder: entry.c, junge: entry.y, erwachsene: entry.a }',
  '  };',
  '}',
  '',
  "export const PRAEMIEN_DATA_VERSION = '2026';",
  "export const PRAEMIEN_DATA_SOURCE = 'BAG priminfo.admin.ch';",
  ''
].join('\n');

writeFileSync(resolve(OUT_DIR, 'praemienRegionen.js'), praemienJS, 'utf-8');

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
const praemienSize = Buffer.byteLength(praemienJS, 'utf-8');
const versichererSize = Buffer.byteLength(versichererJS, 'utf-8');

console.log('✓ praemienRegionen.js');
console.log('  ' + praemienEntries.length + ' Gemeinden mit Prämien');
console.log('  ' + (praemienSize / 1024).toFixed(1) + ' KB unkomprimiert');
console.log('✓ versichererListe.js');
console.log('  ' + data.insurers.length + ' zugelassene Krankenversicherer');
console.log('  ' + (versichererSize / 1024).toFixed(1) + ' KB unkomprimiert');

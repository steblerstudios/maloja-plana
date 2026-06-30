#!/usr/bin/env node
// Transforms BAG gesamtbericht_ch.xlsx into a compact JS module:
//   praemienDetail.js — per-insurer reference premiums by canton/region/franchise
//
// Requires: pip3 install openpyxl
// Run: node scripts/build-praemien-detail.mjs

import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const RAW_DIR = resolve(__dirname, '../src/data/raw');
const OUT_PATH = resolve(__dirname, '../src/data/praemienDetail.js');
const PY_SCRIPT = resolve(__dirname, 'extract-praemien-detail.py');

console.log('Extracting detailed premiums from gesamtbericht_ch.xlsx...');
const raw = execSync('python3 "' + PY_SCRIPT + '" "' + RAW_DIR + '"', {
  encoding: 'utf-8',
  maxBuffer: 20 * 1024 * 1024,
  timeout: 120000
});
const data = JSON.parse(raw);

// Build compact JS: nested structure
// D[versNr] = [[kanton, region, [erwPremiums], [jugPremiums], [kinPremiums]], ...]
// N[versNr] = insurerName
const dEntries = Object.entries(data.premiums)
  .map(([vk, entries]) => JSON.stringify(vk) + ':' + JSON.stringify(entries))
  .join(',');

const nEntries = Object.entries(data.insurers)
  .map(([vk, name]) => JSON.stringify(vk) + ':' + JSON.stringify(name))
  .join(',');

const js = [
  '// Auto-generated from BAG Gesamtbericht Prämien 2026',
  '// Source: priminfo.admin.ch/downloads/gesamtbericht_ch.xlsx',
  '// Run: node scripts/build-praemien-detail.mjs',
  '//',
  '// D[versNr] = [[kanton, region, erwMit[6], jugMit[6], kinMit[7], erwOhn[6], jugOhn[6]], ...]',
  '// ERW/JUG franchises: [300, 500, 1000, 1500, 2000, 2500]',
  '// KIN franchises: [0, 100, 200, 300, 400, 500, 600]',
  '// Tarif (Standardmodell TAR-BASE): MIT-UNF (mit Unfall) = e/j/k; OHN-UNF (ohne Unfall,',
  '// nur Erwachsene/Junge) = eo/jo. Kinder gibt es nur mit Unfall.',
  '// Premium = 0 means franchise/tariff not offered by this insurer',
  '',
  'const D = {' + dEntries + '};',
  'const N = {' + nEntries + '};',
  '',
  'const ERW_FRA = [300, 500, 1000, 1500, 2000, 2500];',
  'const KIN_FRA = [0, 100, 200, 300, 400, 500, 600];',
  '',
  '// withAccident=false → Tarif ohne Unfalldeckung (eo/jo); Kinder haben keinen,',
  '// dort wird auf den Mit-Unfall-Tarif zurückgegriffen.',
  'function pickPremiums(match, ageClass, withAccident) {',
  '  if (ageClass === "kind") return match[4];',
  '  if (ageClass === "jung") return withAccident ? match[3] : (match[6] || match[3]);',
  '  return withAccident ? match[2] : (match[5] || match[2]);',
  '}',
  '',
  'export function getInsurerPremium(versNr, kanton, region, ageClass, franchise, withAccident = true) {',
  '  const entries = D[String(versNr)];',
  '  if (!entries) return null;',
  '  const match = entries.find(e => e[0] === kanton && e[1] === region);',
  '  if (!match) return null;',
  '  const isKin = ageClass === "kind";',
  '  const fraList = isKin ? KIN_FRA : ERW_FRA;',
  '  const idx = fraList.indexOf(Number(franchise));',
  '  if (idx < 0) return null;',
  '  const premiums = pickPremiums(match, ageClass, withAccident);',
  '  const val = premiums[idx];',
  '  return val > 0 ? val : null;',
  '}',
  '',
  'export function getInsurerAllFranchises(versNr, kanton, region, ageClass, withAccident = true) {',
  '  const entries = D[String(versNr)];',
  '  if (!entries) return null;',
  '  const match = entries.find(e => e[0] === kanton && e[1] === region);',
  '  if (!match) return null;',
  '  const isKin = ageClass === "kind";',
  '  const fraList = isKin ? KIN_FRA : ERW_FRA;',
  '  const premiums = pickPremiums(match, ageClass, withAccident);',
  '  return fraList.map((fra, i) => ({ franchise: fra, premium: premiums[i] || null })).filter(f => f.premium);',
  '}',
  '',
  'export function getInsurerCantons(versNr) {',
  '  const entries = D[String(versNr)];',
  '  if (!entries) return [];',
  '  return [...new Set(entries.map(e => e[0]))].sort();',
  '}',
  '',
  'export function insurerNameFromNr(versNr) {',
  '  return N[String(versNr)] || null;',
  '}',
  '',
  'export function insurerNrFromName(name) {',
  '  const lower = name.toLowerCase();',
  '  for (const [nr, n] of Object.entries(N)) {',
  '    if (n.toLowerCase() === lower) return Number(nr);',
  '  }',
  '  for (const [nr, n] of Object.entries(N)) {',
  '    if (n.toLowerCase().includes(lower) || lower.includes(n.toLowerCase())) return Number(nr);',
  '  }',
  '  return null;',
  '}',
  '',
  'export function allInsurerNrs() {',
  '  return Object.keys(N).map(Number);',
  '}',
  '',
  'export { ERW_FRA, KIN_FRA };',
  "export const DETAIL_DATA_VERSION = '2026';",
  "export const DETAIL_DATA_SOURCE = 'BAG priminfo.admin.ch gesamtbericht_ch.xlsx';",
  ''
].join('\n');

writeFileSync(OUT_PATH, js, 'utf-8');

const fileSize = Buffer.byteLength(js, 'utf-8');
const totalCombos = Object.values(data.premiums).reduce((s, v) => s + v.length, 0);

console.log('✓ praemienDetail.js');
console.log('  ' + Object.keys(data.insurers).length + ' Versicherer');
console.log('  ' + totalCombos + ' Kanton/Region-Kombinationen');
console.log('  ' + (fileSize / 1024).toFixed(1) + ' KB unkomprimiert');

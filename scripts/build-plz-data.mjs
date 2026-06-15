#!/usr/bin/env node
// Transforms the swisstopo Amtliches Ortschaftenverzeichnis CSV
// into a compact JS module for PLZ→Gemeinde lookup.
//
// Source: https://data.geo.admin.ch/ch.swisstopo-vd.ortschaftenverzeichnis_plz/
// Run:    node scripts/build-plz-data.mjs

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CSV_PATH = resolve(__dirname, '../src/data/raw/amtovz_plz_2025.csv');
const OUT_PATH = resolve(__dirname, '../src/data/plzGemeinde.js');

const raw = readFileSync(CSV_PATH, 'utf-8').replace(/^﻿/, '');
const lines = raw.trim().split('\n');
const header = lines[0].split(';');

const colIdx = {
  ortschaft: header.indexOf('Ortschaftsname'),
  plz: header.indexOf('PLZ4'),
  gemeinde: header.indexOf('Gemeindename'),
  bfsNr: header.indexOf('BFS-Nr'),
  kanton: header.indexOf('Kantonskürzel'),
  anteil: header.indexOf('Adressenanteil'),
};

// Parse rows, aggregate by PLZ → unique Gemeinden (highest Adressenanteil first)
const plzMap = new Map();

for (let i = 1; i < lines.length; i++) {
  const cols = lines[i].split(';');
  if (cols.length < 6) continue;

  const plz = cols[colIdx.plz].trim();
  const gemeinde = cols[colIdx.gemeinde].trim();
  const bfsNr = cols[colIdx.bfsNr].trim();
  const kanton = cols[colIdx.kanton].trim();
  const ortschaft = cols[colIdx.ortschaft].trim();
  const anteilStr = cols[colIdx.anteil]?.replace('%', '').replace(',', '.').trim() || '0';
  const anteil = parseFloat(anteilStr) || 0;

  if (!plz || !gemeinde || !kanton) continue;

  if (!plzMap.has(plz)) plzMap.set(plz, new Map());
  const gemeindeMap = plzMap.get(plz);

  const key = bfsNr;
  if (!gemeindeMap.has(key)) {
    gemeindeMap.set(key, { gemeinde, bfsNr, kanton, ortschaften: new Set(), anteil: 0 });
  }
  const entry = gemeindeMap.get(key);
  entry.ortschaften.add(ortschaft);
  entry.anteil = Math.max(entry.anteil, anteil);
}

// Build compact output: sorted by PLZ, Gemeinden sorted by Adressenanteil desc
const entries = [];
for (const [plz, gemeindeMap] of [...plzMap.entries()].sort((a, b) => a[0] - b[0])) {
  const gemeinden = [...gemeindeMap.values()]
    .sort((a, b) => b.anteil - a.anteil)
    .map(g => [g.gemeinde, g.bfsNr, g.kanton]);
  entries.push([plz, gemeinden]);
}

// Generate JS module
const js = `// Auto-generated from swisstopo Amtliches Ortschaftenverzeichnis
// Source: data.geo.admin.ch — Stand 2025
// Run: node scripts/build-plz-data.mjs
//
// Format: PLZ → [[gemeinde, bfsNr, kanton], ...]
// Sorted by Adressenanteil (primary Gemeinde first)

const D = ${JSON.stringify(entries)};

const PLZ_MAP = new Map(D);

export function lookupPLZ(plz) {
  const str = String(plz).trim();
  const matches = PLZ_MAP.get(str);
  if (!matches) return [];
  return matches.map(([gemeinde, bfsNr, kanton]) => ({ gemeinde, bfsNr, kanton }));
}

export function primaryGemeinde(plz) {
  const results = lookupPLZ(plz);
  return results[0] || null;
}

export function cantonFromPLZPrecise(plz) {
  const primary = primaryGemeinde(plz);
  return primary ? primary.kanton : null;
}

export function allPLZ() {
  return [...PLZ_MAP.keys()];
}

export const PLZ_DATA_VERSION = '2025';
export const PLZ_DATA_SOURCE = 'swisstopo Amtliches Ortschaftenverzeichnis';
`;

writeFileSync(OUT_PATH, js, 'utf-8');

// Stats
const totalPLZ = entries.length;
const multiGemeinde = entries.filter(([, g]) => g.length > 1).length;
const fileSize = Buffer.byteLength(js, 'utf-8');

console.log(`✓ ${OUT_PATH}`);
console.log(`  ${totalPLZ} PLZ, ${multiGemeinde} mit mehreren Gemeinden`);
console.log(`  ${(fileSize / 1024).toFixed(1)} KB (unkomprimiert)`);

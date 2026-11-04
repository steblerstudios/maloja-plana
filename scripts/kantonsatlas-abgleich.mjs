#!/usr/bin/env node
// ─── Gleicht die Kantonsatlas-Daten mit der Kopie in diesem Repo ab ──────────
//
//   node scripts/kantonsatlas-abgleich.mjs [--atlas <ordner>]            # vergleicht, ändert nichts
//   node scripts/kantonsatlas-abgleich.mjs [--atlas <ordner>] --uebernehmen
//
// Der Maloja-Kantonsatlas liegt neben diesem Repo (Standard: ../kantonsatlas,
// vom Hauptcheckout aus gesehen) und hat kein öffentliches Repo. Was die Seiten
// hier daraus brauchen, liegt als Kopie unter scripts/daten/kantonsatlas/ und
// wird beim Bauen gelesen. Dieses Skript hält die Kopie gleich: ohne Schalter
// meldet es Abweichungen, mit --uebernehmen schreibt es die Atlas-Fassung.
// Danach: node scripts/build-seiten.mjs und die Tests.
//
// Fehlt der Atlas-Ordner (z. B. in der CI), sagt es das und endet ohne Fehler —
// die Tests prüfen dann nur, dass die Kopie zu src/data passt.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DATEIEN = ['praemien.json'];
const arg = process.argv.indexOf('--atlas');
const kandidaten = arg > 0 ? [resolve(process.argv[arg + 1])]
  : [resolve(WURZEL, '..', 'kantonsatlas'), resolve(WURZEL, '..', '..', 'kantonsatlas')];
const atlas = kandidaten.find((k) => existsSync(join(k, 'daten')));
const uebernehmen = process.argv.includes('--uebernehmen');

if (!atlas) {
  console.log(`Kantonsatlas nicht gefunden (gesucht: ${kandidaten.join(', ')}). Nichts verglichen.`);
  process.exit(0);
}

let abweichend = 0;
for (const name of DATEIEN) {
  const quelle = join(atlas, 'daten', name);
  const kopie = resolve(WURZEL, 'scripts', 'daten', 'kantonsatlas', name);
  const a = JSON.parse(readFileSync(quelle, 'utf8'));
  const b = existsSync(kopie) ? JSON.parse(readFileSync(kopie, 'utf8')) : null;
  if (JSON.stringify(a) === JSON.stringify(b)) { console.log(`  ✓ ${name} gleich`); continue; }
  abweichend++;
  if (uebernehmen) {
    writeFileSync(kopie, JSON.stringify(a) + '\n');
    console.log(`  ↻ ${name} aus dem Atlas übernommen`);
  } else {
    console.error(`  ✗ ${name} weicht vom Atlas ab — übernehmen mit --uebernehmen`);
  }
}
if (abweichend && !uebernehmen) process.exit(1);

// ─── Kapitel-Zeichen für die statischen Seiten ─────────────────────────────
// Die sieben Kapitel-Icons der App (Leitformen aus src/config/seitenZeichen.js, gezeichnet von
// src/IconAbzeichen.jsx) als fertiger SVG-Text, damit die Vorstellungsseite sie ohne React zeigen kann.
// Eine Quelle bleibt die App: dieses Skript zeichnet sie neu, der Wächter
// src/__tests__/vorstellungSeite.test.js vergleicht die erzeugte Datei mit der App-Zeichnung.
//
// Neu erzeugen:  node scripts/seiten/kapitel-zeichen-bauen.mjs
// Ergebnis:      scripts/seiten/kapitel-zeichen.mjs (nicht von Hand bearbeiten)

import { build } from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const WURZEL = fileURLToPath(new URL('../..', import.meta.url));
const eingang = `
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { FamilienZeichen } from './src/IconAbzeichen.jsx';
import { LEITFORM_KAPITEL } from './src/config/seitenZeichen.js';
import { CHAPTER_KEYS } from './src/config/constants.js';
export const ZEICHEN = CHAPTER_KEYS.map((k) => renderToStaticMarkup(
  React.createElement(FamilienZeichen, { leitform: LEITFORM_KAPITEL[k], formFarbe: 'currentColor' })));
`;
// Ablage im Projekt (node_modules/.cache), damit react beim Laden gefunden wird; react bleibt extern.
const ziel = path.join(WURZEL, 'node_modules/.cache/kapitel-zeichen/b.mjs');
await build({
  stdin: { contents: eingang, resolveDir: WURZEL, loader: 'jsx' },
  bundle: true, format: 'esm', platform: 'node', outfile: ziel, logLevel: 'error',
  loader: { '.js': 'jsx' }, jsx: 'transform', external: ['react', 'react-dom', 'react-dom/*'],
});
const { ZEICHEN } = await import(pathToFileURL(ziel).href);
const kopf = '// ERZEUGT von scripts/seiten/kapitel-zeichen-bauen.mjs — nicht von Hand bearbeiten.\n'
  + '// Die sieben Kapitel-Icons der App in der Reihenfolge von CHAPTER_KEYS, Farbe über currentColor.\n';
fs.writeFileSync(path.join(WURZEL, 'scripts/seiten/kapitel-zeichen.mjs'),
  `${kopf}export const KAPITEL_ZEICHEN = ${JSON.stringify(ZEICHEN, null, 2)};\n`);
console.log(`✓ ${ZEICHEN.length} Kapitel-Zeichen erzeugt.`);

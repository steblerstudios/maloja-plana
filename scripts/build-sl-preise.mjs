#!/usr/bin/env node
// Zieht aus dem BAG-Datenstamm der Spezialitätenliste (SL) die Publikumspreise der rund 100 Medikamente,
// die die App kennt (src/config/medicationData.js), und schreibt src/data/medikamentPreise.js.
// Entscheid F7-K6-2 (Stebler Studios, 27.10.2026): von Hand je Quartal und beim Werte-Wechsel im Dezember,
// Stand sichtbar, Warnung im Predeploy. Die App holt zur Laufzeit nichts aus dem Netz.
//
// Quelle: https://www.sl.bag.admin.ch/resources/current-and-archived-data → «Aktueller Datenstamm (SL/GGSL)»,
//   «Als Excel herunterladen» (foph-sl-publication-JJJJMMTT-de.xlsx). Ablegen in src/data/raw/ (gitignored).
//
// Requires: pip3 install openpyxl
// Run:  node scripts/build-sl-preise.mjs src/data/raw/foph-sl-publication-20261006-de.xlsx
//       node scripts/build-sl-preise.mjs --pruefen   → Exit 1, wenn der Stand älter als 4 Monate ist (Predeploy)

import { execFileSync } from 'child_process';
import { writeFileSync } from 'fs';
import { resolve, dirname, basename } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ZIEL = resolve(__dirname, '../src/data/medikamentPreise.js');
const MAX_MONATE = 4;

if (process.argv.includes('--pruefen')) {
  const { SL_STAND } = await import(pathToFileURL(ZIEL).href);
  const stand = new Date(SL_STAND.datum + 'T00:00:00');
  const grenze = new Date();
  grenze.setMonth(grenze.getMonth() - MAX_MONATE);
  const alt = stand < grenze;
  console.log((alt ? '⚠️ ' : '✅ ') + 'SL-Preise Stand ' + SL_STAND.datum + (alt ? ' — älter als ' + MAX_MONATE + ' Monate, neu holen (siehe Kopf von scripts/build-sl-preise.mjs).' : ''));
  process.exit(alt ? 1 : 0);
}

const datei = process.argv[2];
if (!datei) throw new Error('Pfad zur SL-Excel-Datei fehlt');
const datum = basename(datei).match(/(\d{4})(\d{2})(\d{2})/);
if (!datum) throw new Error('Datum nicht im Dateinamen (foph-sl-publication-JJJJMMTT-de.xlsx)');

const { MEDICATIONS } = await import(pathToFileURL(resolve(__dirname, '../src/config/medicationData.js')).href);
const zeilen = JSON.parse(execFileSync('python3', [resolve(__dirname, 'extract-sl-preise.py'), datei], { encoding: 'utf-8', maxBuffer: 50 * 1024 * 1024 }));

// Treffer: Handelsname gleich dem Namen in der App oder «Name …» (z. B. «Euthyrox 50», «Pantoprazol Sandoz»).
// Jede SL-Zeile gehört dem LÄNGSTEN passenden Namen: «Aspirin Cardio» gehört zu «Aspirin Cardio», nicht auch zu
// «Aspirin» (Fachprüfung 27.10.2026 — sonst zeigte «Aspirin» den Preis eines anderen Präparats).
const namen = MEDICATIONS.map(([n]) => n).sort((a, b) => b.length - a.length);
const passt = (h, k) => h === k || h.startsWith(k + ' ');
const besitzer = (h) => namen.find((n) => passt(h.toLowerCase(), n.toLowerCase()));
const preise = {};
for (const [name] of MEDICATIONS) {
  const treffer = zeilen
    .filter(([h]) => besitzer(h) === name)
    .map(([, form, packung, pp, sb]) => [form, packung, Math.round(pp * 100) / 100, Math.round(sb * 100)]);
  const einmalig = [...new Map(treffer.map((t) => [t.join('|'), t])).values()];
  if (einmalig.length) preise[name] = einmalig;
}

const stand = datum[1] + '-' + datum[2] + '-' + datum[3];
const kopf = `// Generiert von scripts/build-sl-preise.mjs — nicht von Hand bearbeiten.
// Quelle: BAG, Spezialitätenliste, Datenstamm ${basename(datei)}. Nur die Medikamente aus medicationData.js.
// Je Packung: [gal. Form/Dosierung, Packung, Publikumspreis inkl. MwSt in CHF, Selbstbehalt in %].
`;
writeFileSync(ZIEL, kopf
  + 'export const SL_STAND = ' + JSON.stringify({ datum: stand, url: 'https://www.sl.bag.admin.ch/resources/current-and-archived-data' }) + ';\n'
  + 'export const SL_PREISE = ' + JSON.stringify(preise) + ';\n');

const ohne = MEDICATIONS.map(([n]) => n).filter((n) => !preise[n]);
console.log(`medikamentPreise.js: Stand ${stand}, ${Object.keys(preise).length} von ${MEDICATIONS.length} Medikamenten mit Preis.`);
console.log('Ohne Treffer in der SL: ' + ohne.join(', '));

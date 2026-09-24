#!/usr/bin/env node
// ─── Schlüsselt das Startbundle nach Quelldateien auf ────────────────────────
//
//   npx vite build --sourcemap                       # zuerst bauen, MIT Sourcemap
//   node scripts/bundle-posten.mjs                   # grösste Posten der Startdatei
//   node scripts/bundle-posten.mjs --top 15          # nur die 15 grössten
//   node scripts/bundle-posten.mjs --datei config/constants.js
//                                                    # Bytes je 20-Zeilen-Block
//   node scripts/bundle-posten.mjs --datei config/constants.js --zeilen
//                                                    # die teuersten Original-Zeilen
//   node scripts/bundle-posten.mjs --js dist/assets/ChapterView-*.js
//                                                    # ein anderer Chunk
//
// Warum das hier liegt:
//   Das Startbundle ist bei 65 kB gzip gedeckelt (`npm run size`, Konfig in
//   package.json). Im September 2026 stand es bei 64,94 kB — rund 60 Byte Luft.
//   PR #294 brauchte darum DREI Verschlankungsrunden, weil niemand wusste, was
//   in der Startdatei eigentlich drin liegt; geraten wurde an der falschen
//   Stelle. Dieses Skript beantwortet die Frage mit einer Messung: es liest die
//   Sourcemap neben dem gebauten Chunk und ordnet jedes generierte Byte der
//   Quelldatei zu, die die Sourcemap für dieses Segment nennt.
//
//   Kein Paket nötig (kein rollup-plugin-visualizer, kein source-map-explorer) —
//   und damit kein Eintrag in package.json, der selbst wieder Fläche wäre.
//
// 🛑 Das Messgerät kennen — minifizierte Bytes sind NICHT gzip-Bytes:
//   Gezählt werden generierte Bytes VOR gzip. gzip verteilt sich nicht
//   proportional: wiederholter Text (etwa 121-mal `label: fl(t, 'kapitel',`)
//   schrumpft sehr stark, Prosa und Zahlentabellen kaum. Am Startbundle
//   gemessen (24.09.2026): 14,3 kB minifiziert waren nur 2,35 kB gzip, also
//   etwa 6:1. Die RANGFOLGE der Posten ist belastbar, der gzip-Betrag eines
//   einzelnen Postens ist es NICHT.
//
//   Wer eine echte Ersparnis nennen will, misst sie mit dem Gerät, das auch das
//   Gate benutzt: Änderung bauen, dann `npx size-limit`, und dieselbe Zahl noch
//   einmal auf frischem `origin/main` als Vergleich. Ein veralteter Vergleichs-
//   stand liegt schnell mehrere Hundert Byte daneben (am 24.09. waren es 220 B).
//
// Gegenprobe, dass die Bücher aufgehen: zugeordnete + nicht zugeordnete Bytes
// müssen die Dateigrösse ergeben. Die Ausgabe zeigt beide Summen; klaffen sie
// weit auseinander, ist die Sourcemap unvollständig und die Liste wertlos.

import { readFileSync, readdirSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';

// ─── Argumente ──────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
function opt(name, fallback = null) {
  const i = argv.indexOf(name);
  return i !== -1 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : fallback;
}
const nurZeilen = argv.includes('--zeilen');
const zielDatei = opt('--datei');
const top = Number(opt('--top', '25'));
let jsPfad = opt('--js');

// Ohne --js die Startdatei suchen (dist/assets/index-*.js)
if (!jsPfad) {
  const ordner = 'dist/assets';
  let kandidaten;
  try {
    kandidaten = readdirSync(ordner).filter((f) => /^index-.*\.js$/.test(f));
  } catch {
    console.error(`${ordner} fehlt — zuerst bauen:  npx vite build --sourcemap`);
    process.exit(2);
  }
  if (kandidaten.length !== 1) {
    console.error(`Erwartet genau eine index-*.js in ${ordner}, gefunden: ${kandidaten.length}`);
    for (const k of kandidaten) console.error('  ' + k);
    console.error('dist/ ist vermutlich alt — einmal leeren und neu bauen.');
    process.exit(2);
  }
  jsPfad = join(ordner, kandidaten[0]);
}

// Glob wie dist/assets/ChapterView-*.js selbst auflösen (die Hashes kennt niemand)
if (jsPfad.includes('*')) {
  const ordner = dirname(jsPfad);
  const muster = new RegExp('^' + basename(jsPfad).replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$');
  const treffer = readdirSync(ordner).filter((f) => muster.test(f));
  if (treffer.length !== 1) {
    console.error(`Muster ${jsPfad} trifft ${treffer.length} Dateien — genau eine nötig.`);
    for (const t of treffer) console.error('  ' + t);
    process.exit(2);
  }
  jsPfad = join(ordner, treffer[0]);
}

let code, map;
try {
  code = readFileSync(jsPfad, 'utf8');
} catch {
  console.error(`${jsPfad} nicht lesbar — zuerst bauen:  npx vite build --sourcemap`);
  process.exit(2);
}
try {
  map = JSON.parse(readFileSync(jsPfad + '.map', 'utf8'));
} catch {
  console.error(`${jsPfad}.map fehlt. Der Build braucht --sourcemap:`);
  console.error('  npx vite build --sourcemap');
  process.exit(2);
}

// ─── VLQ-Dekodierung (Base64, Sourcemap-Spezifikation) ──────────────────────
const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const wert = new Map([...B64].map((z, i) => [z, i]));
function vlq(stueck) {
  const zahlen = [];
  let erg = 0;
  let schub = 0;
  for (const z of stueck) {
    const n = wert.get(z);
    if (n === undefined) throw new Error(`unerwartetes Zeichen in der Sourcemap: ${z}`);
    const weiter = n & 32;
    erg += (n & 31) << schub;
    if (weiter) {
      schub += 5;
    } else {
      const negativ = erg & 1;
      erg >>= 1;
      zahlen.push(negativ ? -erg : erg);
      erg = 0;
      schub = 0;
    }
  }
  return zahlen;
}

// ─── Mappings durchlaufen, Bytes je Segment der genannten Quelle zuordnen ────
// Ein Segment reicht von seiner Spalte bis zur Spalte des nächsten Segments
// (beim letzten bis zum Zeilenende). Diese Breite ist der Byte-Beitrag.
const zeilenBundle = code.split('\n');
let qIdx = 0;
let qZeile = 0;
const proQuelle = new Map();
const proZeileZiel = new Map();
let nichtZugeordnet = 0;

// Ziel-Quelle für --datei bestimmen
let zielIdx = -1;
let zielName = null;
if (zielDatei) {
  const treffer = map.sources.map((s, i) => [s, i]).filter(([s]) => s.includes(zielDatei));
  if (treffer.length === 0) {
    console.error(`Keine Quelle enthält "${zielDatei}". Vorhanden sind u.a.:`);
    for (const s of map.sources.slice(0, 20)) console.error('  ' + s);
    process.exit(1);
  }
  if (treffer.length > 1) {
    console.error(`"${zielDatei}" ist mehrdeutig:`);
    for (const [s] of treffer) console.error('  ' + s);
    process.exit(1);
  }
  [zielName, zielIdx] = treffer[0];
}

const gruppen = map.mappings.split(';');
for (let z = 0; z < gruppen.length; z++) {
  const gruppe = gruppen[z];
  const laenge = (zeilenBundle[z] ?? '').length;
  if (gruppe === '') {
    nichtZugeordnet += laenge + 1;
    continue;
  }
  let spalte = 0;
  const segmente = [];
  for (const roh of gruppe.split(',')) {
    if (roh === '') continue;
    const f = vlq(roh);
    spalte += f[0];
    if (f.length >= 4) {
      qIdx += f[1];
      qZeile += f[2];
    }
    segmente.push({
      spalte,
      quelle: f.length >= 4 ? qIdx : null,
      zeile: f.length >= 4 ? qZeile : null,
    });
  }
  if (segmente.length > 0) nichtZugeordnet += segmente[0].spalte;
  for (let i = 0; i < segmente.length; i++) {
    const von = segmente[i].spalte;
    const bis = i + 1 < segmente.length ? segmente[i + 1].spalte : laenge;
    const breite = Math.max(0, bis - von);
    const q = segmente[i].quelle;
    if (q === null) {
      nichtZugeordnet += breite;
      continue;
    }
    const name = map.sources[q] ?? `?${q}`;
    proQuelle.set(name, (proQuelle.get(name) ?? 0) + breite);
    if (q === zielIdx) {
      const k = segmente[i].zeile;
      proZeileZiel.set(k, (proZeileZiel.get(k) ?? 0) + breite);
    }
  }
  nichtZugeordnet += 1; // Zeilenumbruch
}

// ─── Ausgabe ────────────────────────────────────────────────────────────────
const B = (n) => n.toLocaleString('de-CH');
const summe = [...proQuelle.values()].reduce((a, b) => a + b, 0);

console.log(`Datei:            ${jsPfad}`);
console.log(`minifiziert:      ${B(code.length)} B`);
console.log(`zugeordnet:       ${B(summe)} B`);
console.log(`nicht zugeordnet: ${B(nichtZugeordnet)} B  (Modul-Gerüst, Umbrüche, Runtime)`);
const klaffen = code.length - (summe + nichtZugeordnet);
console.log(`Bücher-Differenz: ${B(klaffen)} B  ${Math.abs(klaffen) > code.length * 0.02 ? '🛑 zu gross — Sourcemap unvollständig, Liste nicht verwenden' : '(im Rahmen)'}`);
console.log('');
console.log('🛑 Minifizierte Bytes, NICHT gzip. Rangfolge belastbar, Betrag nicht —');
console.log('   echte Ersparnis nur mit `npx size-limit` gegen frisches origin/main.');
console.log('');

if (!zielDatei) {
  // Eigener Code je Datei, node_modules je Paket
  const gruppiert = new Map();
  for (const [quelle, bytes] of proQuelle) {
    const m = quelle.match(/node_modules\/((?:@[^/]+\/)?[^/]+)/);
    const schluessel = m ? `node_modules: ${m[1]}` : quelle.replace(/^(\.\.\/)+/, '');
    gruppiert.set(schluessel, (gruppiert.get(schluessel) ?? 0) + bytes);
  }
  const sortiert = [...gruppiert.entries()].sort((a, b) => b[1] - a[1]);
  console.log(`── Die ${Math.min(top, sortiert.length)} grössten Posten von ${sortiert.length} ──`);
  for (const [name, bytes] of sortiert.slice(0, top)) {
    const anteil = ((bytes / summe) * 100).toFixed(1);
    console.log(`${String(B(bytes)).padStart(8)} B  ${anteil.padStart(5)}%  ${name}`);
  }
  console.log('');
  console.log('Weiter hinein:  node scripts/bundle-posten.mjs --datei <pfad-teil>');
} else {
  const quellText = map.sourcesContent?.[zielIdx]?.split('\n') ?? null;
  const summeZiel = [...proZeileZiel.values()].reduce((a, b) => a + b, 0);
  console.log(`Quelle:    ${zielName}`);
  console.log(`im Bundle: ${B(summeZiel)} B aus ${proZeileZiel.size} Original-Zeilen`);
  if (!quellText) console.log('(Die Sourcemap trägt keinen Quelltext — Zeilen ohne Inhalt.)');
  console.log('');
  if (nurZeilen) {
    const sortiert = [...proZeileZiel.entries()].sort((a, b) => b[1] - a[1]).slice(0, 40);
    console.log('── Die teuersten Original-Zeilen ──');
    for (const [zeile, bytes] of sortiert) {
      const txt = (quellText?.[zeile] ?? '').trim().slice(0, 74);
      console.log(`${String(B(bytes)).padStart(7)} B  Z${String(zeile + 1).padStart(4)}  ${txt}`);
    }
  } else {
    const eimer = new Map();
    for (const [zeile, bytes] of proZeileZiel) {
      const e = Math.floor(zeile / 20);
      eimer.set(e, (eimer.get(e) ?? 0) + bytes);
    }
    console.log('── Bytes je 20-Zeilen-Block ──');
    for (const [e, bytes] of [...eimer.entries()].sort((a, b) => a[0] - b[0])) {
      const balken = '#'.repeat(Math.min(40, Math.round(bytes / 120)));
      const kopf = (quellText?.[e * 20] ?? '').trim().slice(0, 40);
      console.log(
        `Z${String(e * 20 + 1).padStart(4)}-${String(e * 20 + 20).padStart(4)}  ${String(B(bytes)).padStart(7)} B  ${balken} ${kopf}`
      );
    }
    console.log('');
    console.log('Zeilengenau:  … --datei <pfad-teil> --zeilen');
  }
}

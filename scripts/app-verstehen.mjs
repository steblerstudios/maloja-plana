// ─── «Verstehen im Werkzeug»: Karten und Erklärfiguren für die App ───────────
//
// Entscheid Stebler Studios 09.11.2026 («Ja, C + D bauen»), Pilot Kapitel Versicherungen:
//   C · Mini-Karte: die Karten des Kantonsatlas auch im Werkzeug, der eigene Kanton markiert,
//       seine Zahl daneben. Das kann nur die App, denn nur sie kennt den Kanton.
//   D · Erklärfigur zum Aufklappen: das Standbild der Hairline-Figur von /krankenkasse/
//       direkt beim Werkzeug, die bewegte Fassung als Link.
//
// Eine Quelle: Stufen, Werte, Format, Titel und Bildtexte kommen aus denselben Funktionen wie
// die öffentlichen Seiten (scripts/seiten/kantonsatlas.mjs → stufen, scripts/seiten-vergleich.mjs
// → EBENEN, scripts/seiten-figuren.mjs → standbildSvg, kostenteilAngaben). Die App rechnet nichts
// davon nach, sie zeigt nur an.
//
// Erzeugt src/data/kantonskarten.js und src/data/erklaerfiguren.js. Der Wächter
// verstehenImWerkzeug.test.js vergleicht beide mit dem, was dieses Skript jetzt erzeugen würde:
// wer Atlas-Daten oder Figuren ändert und das Skript vergisst, sieht es rot.
//
//   node scripts/app-verstehen.mjs
//
// Beide Dateien gehören NICHT ins Startbündel: nur KantonsKarteKlein.jsx bzw.
// ErklaerFigurKlein.jsx importieren sie, und die werden erst beim Aufklappen nachgeladen.
// ─────────────────────────────────────────────────────────────────────────────

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { EBENEN, KANTONE } from './seiten-vergleich.mjs';
import { stufen } from './seiten/kantonsatlas.mjs';
import { standbildSvg, kostenteilAngaben } from './seiten-figuren.mjs';
import { KRANKENKASSE } from './seiten/krankenkasse.mjs';

const HIER = dirname(fileURLToPath(import.meta.url));
const ZIEL_KARTEN = resolve(HIER, '..', 'src', 'data', 'kantonskarten.js');
const ZIEL_FIGUREN = resolve(HIER, '..', 'src', 'data', 'erklaerfiguren.js');
const KOPF = '// Erzeugt von scripts/app-verstehen.mjs — nicht von Hand ändern.\n';

// Welche Karten die App zeigt. Schlüssel = Ebene des Atlas; der Anker ist dieselbe id wie auf /kantonsatlas/.
export const APP_KARTEN = ['praemie', 'lastNachIpv'];

export function erzeugeKarten() {
  const geo = JSON.parse(readFileSync(resolve(HIER, 'daten', 'kantonsatlas', 'paths.json'), 'utf8'));
  const karten = {};
  for (const key of APP_KARTEN) {
    const E = EBENEN[key];
    const { stufe, spannen } = stufen(key);
    karten[key] = {
      titel: E.titel,
      einheit: E.einheit,
      anker: `karte-${key.toLowerCase()}`,
      ch: E.ch != null ? E.fmt(E.ch) : null,
      spannen: spannen.map((s) => ({ s: s.s, text: s.min === s.max ? E.fmt(s.min) : `${E.fmt(s.min)} bis ${E.fmt(s.max)}` })),
      werte: Object.fromEntries(KANTONE.map((k) => [k, { s: stufe[k], text: E.fmt(E.wert(k)) }])),
    };
  }
  const geoKlein = { w: geo.w, h: geo.h, kantone: Object.fromEntries(KANTONE.map((k) => [k, geo.cantons[k].d])), seen: geo.lakes };
  return KOPF +
    '// Kartengrundlage: BFS GEOSTAT, Generalisierte Gemeindegrenzen (OPEN-BY), aufbereitet mit swiss-maps (BSD-3-Clause), siehe NOTICE.\n' +
    `export const KARTE_GEO = ${JSON.stringify(geoKlein)};\n` +
    `export const KARTEN = ${JSON.stringify(karten, null, 1)};\n`;
}

// Belege-Marken [[q:x]] der Seite → Herausgeber und Titel aus der Quellenliste von /krankenkasse/.
function belege(text) {
  const keys = [...text.matchAll(/\[\[q:([a-zA-Z0-9]+)\]\]/g)].map((m) => m[1]);
  const quellen = keys.map((k) => {
    const q = KRANKENKASSE.quellen.find((x) => x.key === k);
    if (!q) throw new Error(`app-verstehen: unbekannte Quelle [[q:${k}]]`);
    return { text: `${q.herausgeber}, ${q.titel}`, url: q.url };
  });
  return { text: text.replace(/\s*\[\[q:[a-zA-Z0-9]+\]\]/g, '').trim(), quellen };
}

export function erzeugeFiguren() {
  const a = kostenteilAngaben();
  const { text, quellen } = belege(a.legende);
  const figuren = {
    kostenteil: {
      kurz: a.kurz,
      wert: a.wert,
      legende: text,
      quellen,
      bewegt: '/krankenkasse/bewegt/kostenteil/',
      seite: `/krankenkasse/#${a.id}`,
      // standbildSvg prüft: kein Skript, kein foreignObject, kein Fremdverweis.
      svg: standbildSvg(a.datei, `app-${a.id}`, a.titel, a.beschreibung),
    },
  };
  return KOPF + `export const ERKLAERFIGUREN = ${JSON.stringify(figuren, null, 1)};\n`;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  writeFileSync(ZIEL_KARTEN, erzeugeKarten());
  writeFileSync(ZIEL_FIGUREN, erzeugeFiguren());
  console.log(`geschrieben: ${ZIEL_KARTEN}\ngeschrieben: ${ZIEL_FIGUREN}`);
}

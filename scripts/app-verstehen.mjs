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
import { stufen, LEGENDE, STUFEN_FARBEN } from './seiten/kantonsatlas.mjs';
import { KANTONE_IM_VERGLEICH } from './seiten/kantone-im-vergleich.mjs';
import { standbildSvg, kostenteilAngaben } from './seiten-figuren.mjs';
import { KRANKENKASSE } from './seiten/krankenkasse.mjs';

const HIER = dirname(fileURLToPath(import.meta.url));
const ZIEL_KARTEN = resolve(HIER, '..', 'src', 'data', 'kantonskarten.js');
const ZIEL_FIGUREN = resolve(HIER, '..', 'src', 'data', 'erklaerfiguren.js');
const KOPF = '// Erzeugt von scripts/app-verstehen.mjs — nicht von Hand ändern.\n';

// Welche Karten die App zeigt. Schlüssel = Ebene des Atlas; der Anker ist dieselbe id wie auf /kantonsatlas/.
// Pilot 09.11.2026: praemie, lastNachIpv. Ausgeweitet am selben Abend (Stebler Studios «sauber weiter») auf die
// fünf Werkzeuge, die schon auf ihre Atlas-Karte verlinkten.
export const APP_KARTEN = ['praemie', 'lastNachIpv', 'steuer', 'miete', 'alq', 'sozialhilfe', 'el'];
// Zu welcher Karte die App eine zweite Zahl daneben stellt (Stebler Studios 09.11.2026, «beides?»): bei der Last nach
// Verbilligung auch die Last davor. Nur als Zahl, nicht als zweite Karte: Der Atlas teilt jede Karte in eigene
// Viertel; zwei Karten hätten zwei Farbskalen, und ein Kanton könnte vorher und nachher gleich aussehen.
export const APP_VERGLEICH = { lastNachIpv: 'last' };

// Prämie nach Altersklasse (Stebler Studios 09.11.2026, «sauber weiter»; Fachprüfung: die Karte zeigt Erwachsene,
// das Werkzeug rechnet aber auch für Kinder und junge Erwachsene). Dieselbe BAG-Datei wie die Karte
// (praemien.json, Felder kind/jung, y27), dasselbe Format. Klassen wie ageClassFromBirth in franchiseTacho.js.
export const APP_ALTERSKLASSEN = { praemie: ['kind', 'jung'] };

function altersklassen(klassen, fmt) {
  const praemien = JSON.parse(readFileSync(resolve(HIER, 'daten', 'kantonsatlas', 'praemien.json'), 'utf8'));
  return Object.fromEntries(klassen.map((kl) => [kl, {
    ch: fmt(praemien.CH[kl].y27),
    werte: Object.fromEntries(KANTONE.map((k) => [k, fmt(praemien[k][kl].y27)])),
  }]));
}

function vergleich(key) {
  const V = EBENEN[key];
  return { titel: V.titel, ch: V.ch != null ? V.fmt(V.ch) : null, werte: Object.fromEntries(KANTONE.map((k) => [k, V.fmt(V.wert(k))])) };
}

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
      // Legende wie auf /kantonsatlas/: Jahr, Rahmung («Rechenwert …»), Belege (Swiss-Precision-Prüfung 09.11.2026).
      ...belege(LEGENDE[key], KANTONE_IM_VERGLEICH.quellen),
      ch: E.ch != null ? E.fmt(E.ch) : null,
      spannen: spannen.map((s) => ({ s: s.s, text: s.min === s.max ? E.fmt(s.min) : `${E.fmt(s.min)} bis ${E.fmt(s.max)}` })),
      werte: Object.fromEntries(KANTONE.map((k) => [k, { s: stufe[k], text: E.fmt(E.wert(k)) }])),
      ...(APP_VERGLEICH[key] ? { vergleich: vergleich(APP_VERGLEICH[key]) } : {}),
      ...(APP_ALTERSKLASSEN[key] ? { altersklassen: altersklassen(APP_ALTERSKLASSEN[key], E.fmt) } : {}),
    };
  }
  const farben = STUFEN_FARBEN;
  const geoKlein = { w: geo.w, h: geo.h, kantone: Object.fromEntries(KANTONE.map((k) => [k, geo.cantons[k].d])), seen: geo.lakes };
  return KOPF +
    '// Kartengrundlage: BFS GEOSTAT, Generalisierte Gemeindegrenzen (OPEN-BY), aufbereitet mit swiss-maps (BSD-3-Clause), siehe NOTICE.\n' +
    `export const KARTE_GEO = ${JSON.stringify(geoKlein)};\n` +
    `export const STUFEN_FARBEN = ${JSON.stringify(farben)};\n` +
    `export const KARTEN = ${JSON.stringify(karten, null, 1)};\n`;
}

// Belege-Marken [[q:x]] einer Seite → Herausgeber und Titel aus deren Quellenliste, mit Link.
function belege(text, liste) {
  const keys = [...text.matchAll(/\[\[q:([a-zA-Z0-9]+)\]\]/g)].map((m) => m[1]);
  const quellen = keys.map((k) => {
    const q = liste.find((x) => x.key === k);
    if (!q) throw new Error(`app-verstehen: unbekannte Quelle [[q:${k}]]`);
    return { text: `${q.herausgeber}, ${q.titel}${q.datum ? `, ${q.datum}` : ''}`, url: q.url };
  });
  return { legende: text.replace(/\s*\[\[q:[a-zA-Z0-9]+\]\]/g, '').trim(), quellen };
}

// Erlaubnisliste statt Verbotsliste (Sicherheitsprüfung 09.11.2026): Das SVG geht in der App per
// innerHTML ins Dokument. standbildSvg weist Skripte und Fremdverweise ab; hier gilt zusätzlich: nur diese
// Elemente und Attribute, url() nur auf eigene Anker. Was neu dazukommt, muss bewusst hier eingetragen werden.
export const SVG_ELEMENTE = ['svg', 'title', 'desc', 'g', 'path', 'defs', 'linearGradient', 'stop', 'mask', 'rect', 'line', 'polygon', 'ellipse'];
export const SVG_ATTRIBUTE = ['viewBox', 'role', 'aria-labelledby', 'focusable', 'id', 'class', 'mask', 'd', 'gradientUnits',
  'x1', 'y1', 'x2', 'y2', 'offset', 'stop-color', 'stop-opacity', 'maskUnits', 'x', 'y', 'width', 'height', 'fill', 'points', 'cx', 'cy', 'rx', 'ry'];

function geprueft(svg) {
  const v = svgVerstoesse(svg);
  if (v.length) throw new Error(`app-verstehen: SVG ausserhalb der Erlaubnisliste: ${v.join(', ')}`);
  return svg;
}

export function svgVerstoesse(svg) {
  const v = [];
  for (const [, name] of svg.matchAll(/<\/?([a-zA-Z][\w:-]*)/g)) if (!SVG_ELEMENTE.includes(name)) v.push(`Element <${name}>`);
  for (const [, name] of svg.matchAll(/\s([a-zA-Z][\w:-]*)\s*=/g)) if (!SVG_ATTRIBUTE.includes(name)) v.push(`Attribut ${name}`);
  for (const [, ziel] of svg.matchAll(/url\(([^)]*)\)/g)) if (!/^#[\w-]+$/.test(ziel)) v.push(`url(${ziel})`);
  return [...new Set(v)];
}

// Eigene ids mit Vorsilbe (Titel und Beschreibung tragen schon «app-…» aus standbildSvg), damit zwei Figuren im selben Dokument sich nie die Maske teilen.
function ids(svg, vorsilbe) {
  const eigene = [...svg.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]).filter((id) => !id.startsWith('app-'));
  return eigene.reduce((t, id) => t.split(`id="${id}"`).join(`id="${vorsilbe}${id}"`).split(`url(#${id})`).join(`url(#${vorsilbe}${id})`), svg);
}

export function erzeugeFiguren() {
  const a = kostenteilAngaben();
  const { legende, quellen } = belege(a.legende, KRANKENKASSE.quellen);
  // Den KVG-Link auf den Artikel setzen (Zitierregel: Gesetzeslink mit «Art.» springt zum Artikel).
  const mitArtikel = quellen.map((q) => q.url.includes('1995/1328_1328_1328')
    ? { text: `${q.text}, ${a.artikel.kvg}`, url: q.url + a.artikel.kvgAnker } : q);
  const figuren = {
    kostenteil: {
      kurz: a.kurz,
      wert: a.wert,
      legende,
      quellen: mitArtikel,
      weitereStellen: a.artikel.weitere,
      bewegt: '/krankenkasse/bewegt/kostenteil/',
      seite: `/krankenkasse/#${a.id}`,
      // standbildSvg prüft: kein Skript, kein foreignObject, kein Fremdverweis.
      svg: geprueft(ids(standbildSvg(a.datei, `app-${a.id}`, a.titel, a.beschreibung), 'app-kostenteil-')),
    },
  };
  return KOPF + `export const ERKLAERFIGUREN = ${JSON.stringify(figuren, null, 1)};\n`;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  writeFileSync(ZIEL_KARTEN, erzeugeKarten());
  writeFileSync(ZIEL_FIGUREN, erzeugeFiguren());
  console.log(`geschrieben: ${ZIEL_KARTEN}\ngeschrieben: ${ZIEL_FIGUREN}`);
}

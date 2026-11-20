import React from 'react';
import { INSTRUMENT_GROESSE } from '../../config/tokens.js';
import { DARK_PALETTE } from '../../config/constants.js';
import { bereichFillColor } from '../../data/lebensbereiche.js';
import { betrag, zahl } from '../../utils/geld.js';

// Franchise-Stand als Fieberthermometer (Stebler Studios 11.11.2026). Koffer-Logik Gesundheit: ein Gegenstand aus dem
// Arztkoffer. Das Thermometer trägt nur diese Bedeutung; das geplante Fach für Fieber heisst darum «Fiebertagebuch».
// Seit 18.11.2026 nach dem Wohnen-Konzept (Sophie: «warum ist der termometer nicht orange und hoch und nicht liegend»):
// EINE Gestalt in allen Grössen, immer stehend, in der Farbe des Lebensbereichs Gesundheit (Hagebutte) — wie das
// Drittel-Haus, das überall gleich dasteht. Nur die Grösse wechselt (Brand Book §7b):
//   klein 64   — Kachel. Nur die Franchise, Strich oben. Keine Wörter.
//   mittel 128 — KVG-Reiter. Über dem Strich der Selbstbehalt als zweite, gestrichelte Strecke.
//   gross 256  — Zuhause Arztkoffer. Dazu Ablesewörter (übersetzt, nie rohe Franken: Sichtschutz).
// stand = franchiseStand(…) / berechneFranchise(…) — keine eigene Rechnung hier. Ruhig: eine Farbe, keine Ampel.
// Die Zahl steht UNTER dem Bild (Regel «Zahl»), nicht im Bild.
const anteil = (wert, max) => (max > 0 ? Math.max(0, Math.min(1, wert / max)) : 0);
const r2 = (n) => Math.round(n * 1000) / 1000;
export const gesundheitFarbe = (palette) => bereichFillColor('gesundheit', palette.bg === DARK_PALETTE.bg) || palette.sky;

export const FranchiseThermometer = ({ palette, stand, groesse = 'klein', t, fuell }) => {
  const h = React.createElement;
  const a = anteil(stand.franchiseVerbraucht, stand.franchise);
  const sb = anteil(stand.selbstbehalt, stand.selbstbehaltMax);
  const fuellung = fuell || gesundheitFarbe(palette);
  const bahn = palette.border;
  const strich = palette.text;
  const px = INSTRUMENT_GROESSE[groesse] || INSTRUMENT_GROESSE.klein;
  const mitSb = groesse !== 'klein';
  const daten = { 'aria-hidden': true, 'data-franchise': groesse, 'data-lage': 'stehend', 'data-anteil': r2(a), 'data-selbstbehalt-anteil': r2(sb) };
  // Zeichnung in Einheiten 40 × 160: Röhre x 14–26, Kugel unten (cy 140). Mit Selbstbehalt: Franchise unten zwei
  // Drittel der Röhre, Selbstbehalt darüber; ohne (klein): die Franchise füllt die ganze Röhre, Strich oben.
  const oben = 12, unten = 128, x = 14, w = 12;
  const fStrich = mitSb ? 52 : oben + 4;
  const fHoehe = unten - fStrich, sHoehe = fStrich - oben;
  const zeichnung = [
    h('rect', { key: 'r', x, y: oben, width: w, height: unten - oben + 4, rx: w / 2, fill: 'none', stroke: bahn, strokeWidth: groesse === 'klein' ? 2.5 : 1.5 }),
    h('circle', { key: 'k', cx: x + w / 2, cy: 140, r: 13, fill: a > 0 ? fuellung : 'none', stroke: a > 0 ? fuellung : bahn, strokeWidth: groesse === 'klein' ? 2.5 : 1.5 }),
    a > 0 && h('rect', { key: 's', 'data-teil': 'saeule', x: x + 3, y: unten - fHoehe * a, width: w - 6, height: fHoehe * a + 6, fill: fuellung }),
    mitSb && sb > 0 && h('rect', { key: 'ss', 'data-teil': 'selbstbehalt-saeule', x: x + 3, y: fStrich - sHoehe * sb, width: w - 6, height: sHoehe * sb, fill: fuellung, opacity: 0.6 }),
    mitSb && h('rect', { key: 'sb', 'data-teil': 'selbstbehalt', x: x + 3, y: oben + 2, width: w - 6, height: sHoehe - 2, fill: 'none', stroke: bahn, strokeDasharray: '3 2' }),
    h('line', { key: 'l', 'data-teil': 'franchise-strich', x1: x - 6, y1: fStrich, x2: x + w + 6, y2: fStrich, stroke: strich, strokeWidth: groesse === 'klein' ? 3 : 2 }),
  ];
  if (groesse === 'gross' && t) {
    // viewBox in echten Pixeln (160 × 256): die Zeichnung mit 1.6 skaliert, die Ablesewörter ausserhalb, 13 px (Regel H).
    const k = 1.6;
    return h('svg', { viewBox: '0 0 160 256', width: '100%', ...daten, style: { maxWidth: '160px', height: 'auto', display: 'block', overflow: 'visible' } },
      h('g', { transform: 'scale(' + k + ')' }, ...zeichnung),
      t && h('text', { 'data-teil': 'ablese-franchise', x: (x + w + 12) * k, y: fStrich * k + 5, fontSize: 13, fill: strich }, t('thermometer.franchise')),
      t && h('text', { 'data-teil': 'ablese-selbstbehalt', x: (x + w + 12) * k, y: (oben + 10) * k, fontSize: 13, fill: palette.mid }, t('thermometer.selbstbehalt')));
  }
  return h('svg', { viewBox: '0 0 40 160', height: px, ...daten, style: { height: px + 'px', width: 'auto', display: 'block', overflow: 'visible' } }, ...zeichnung);
};

// Ablesung am Thermometer (Sophie 18.11.2026, Auswahl «A · Skala am Thermometer»): die Werte stehen auf der Höhe, die
// sie im Thermometer meinen — Selbstbehalt oben, Franchise am Strich, darunter was noch offen ist, unten was erreicht
// ist. Ersetzt die Textzeile «Franchise verbraucht · Franchise offen … Selbstbehalt … Maximum» unter dem Bild.
// Nur mittel 128 (KVG-Reiter) und gross 256 (Arztkoffer); die Kachel bleibt ohne Wörter. Beträge über betrag(),
// HTML statt SVG-Text: so greift der Sichtschutz.
export const FranchiseAblesung = ({ palette, t, stand, groesse = 'mittel', fuell }) => {
  const h = React.createElement;
  const px = INSTRUMENT_GROESSE[groesse] || INSTRUMENT_GROESSE.mittel;
  const k = px / 160;
  const a = anteil(stand.franchiseVerbraucht, stand.franchise);
  const zeile = 17;
  const yStrich = Math.round(52 * k - zeile / 2);
  const yOffen = yStrich + zeile;
  const yFuell = Math.round((128 - 76 * a) * k - zeile / 2);
  const yErreicht = Math.min(Math.round(128 * k), Math.max(yOffen + zeile + 2, yFuell));
  const marke = (teil, top, inhalt, stark) => h('div', { key: teil, 'data-teil': teil, style: { position: 'absolute', left: 0, top: top + 'px', whiteSpace: 'nowrap', fontSize: '13px', lineHeight: zeile + 'px', color: stark ? palette.text : palette.mid, fontWeight: stark ? 600 : 400 } }, inhalt);
  const wert = (n) => h('span', { style: { color: palette.text, fontVariantNumeric: 'tabular-nums' } }, betrag(n, { hoechstens: 2 }));
  return h('div', { 'data-teil': 'franchise-ablesung', 'data-groesse': groesse, style: { display: 'flex', gap: '10px', alignItems: 'flex-start' } },
    h(FranchiseThermometer, { palette, stand, groesse, fuell }),
    h('div', { style: { position: 'relative', height: px + 'px', minWidth: '150px' } },
      marke('ablese-selbstbehalt', Math.max(0, Math.round(14 * k - zeile / 2)), [t('thermometer.selbstbehalt') + ' ', wert(stand.selbstbehalt), ' ' + t('instrumente.franchiseVon', { franchise: zahl(stand.selbstbehaltMax) })]),
      marke('ablese-franchise', yStrich, [t('thermometer.franchise') + ' ', wert(stand.franchise)], true),
      a < 1 && marke('ablese-offen', yOffen, [t('thermometer.offen') + ' ', wert(stand.franchiseOffen)]),
      a > 0 && a < 1 && marke('ablese-erreicht', yErreicht, [t('thermometer.erreicht') + ' ', wert(stand.franchiseVerbraucht)])));
};

// Bereit für den Ernstfall als Herz mit Puls (Stebler Studios 18.11.2026, Auswahl «B · Herz mit Puls»). Das Zeichen
// des Notfalls (Brand Book §5: Herz mit Puls, kein Kreuz). Ersetzt den Ring der Kachel und den Balken im Kapitel:
// ein Bild an beiden Orten.
// Drei Schläge = drei Lagen (Unfall, Spital, Behörde), in der Reihenfolge von SCENARIOS. Ein Schlag ist hoch, wenn
// alle Angaben seiner Lage bereit sind; sonst ein kleiner Ausschlag in der Rahmenfarbe. `lagen` = lagenStand(data).
// groesse: klein 64 (Kachel, keine Wörter) · gross 256 (Kapitel, Lagen-Namen unter den Schlägen).
// Ruhig: eine Farbe (Notfall-Rot), keine Ampel. Die Zahl steht UNTER dem Bild (Regel «Zahl»).
const SCHLAG_X = [20, 60, 100]; // auf den Dritteln, damit die Lagen-Namen darunter passen
const PULS_Y = 44;
const pulsPfad = (lagen) => {
  let d = 'M2 ' + PULS_Y;
  SCHLAG_X.forEach((x, i) => {
    const hoch = lagen[i] && lagen[i].voll ? 22 : 5;
    d += ' L' + (x - 6) + ' ' + PULS_Y + ' L' + (x - 2) + ' ' + (PULS_Y - hoch) + ' L' + (x + 2) + ' ' + (PULS_Y + Math.round(hoch * 0.6)) + ' L' + (x + 6) + ' ' + PULS_Y;
  });
  return d + ' L118 ' + PULS_Y;
};

export const HerzPuls = ({ palette, lagen = [], groesse = 'klein', t }) => {
  const h = React.createElement;
  const rot = palette.roseDeep || palette.rose;
  const px = INSTRUMENT_GROESSE[groesse] || INSTRUMENT_GROESSE.klein;
  const svg = h('svg', { viewBox: '0 0 120 80', width: '100%', 'aria-hidden': true, 'data-teil': 'herz-puls', 'data-groesse': groesse,
    style: { maxWidth: px + 'px', height: 'auto', display: 'block', overflow: 'visible' } },
    h('path', { 'data-teil': 'herz', d: 'M60 72 C20 48 14 22 34 14 C46 9 56 16 60 24 C64 16 74 9 86 14 C106 22 100 48 60 72 Z',
      fill: 'none', stroke: rot, strokeWidth: groesse === 'gross' ? 2 : 3, strokeLinejoin: 'round' }),
    h('path', { 'data-teil': 'puls', d: pulsPfad(lagen), fill: 'none', stroke: rot, strokeWidth: groesse === 'gross' ? 2 : 3, strokeLinejoin: 'round', strokeLinecap: 'round' }),
    lagen.map((l, i) => h('circle', { key: l.key, 'data-teil': 'schlag', 'data-lage': l.key, 'data-voll': l.voll ? 'ja' : 'nein',
      cx: SCHLAG_X[i], cy: PULS_Y, r: 0, fill: 'none' })));
  if (groesse !== 'gross' || !t) return svg;
  return h('div', { style: { maxWidth: px + 'px' } }, svg,
    h('div', { 'aria-hidden': true, style: { display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', fontSize: '13px', color: palette.mid, textAlign: 'center', marginTop: '2px', gap: '4px' } },
      lagen.map((l) => h('span', { key: l.key, 'data-teil': 'lage-name', style: { color: l.voll ? palette.text : palette.mid, overflowWrap: 'anywhere', hyphens: 'auto', WebkitHyphens: 'auto', lineHeight: 1.3 } }, t('notfallEinstieg.' + l.key + '.title')))));
};

// Wer behandelt mich? als Karteikasten (Sophie 19.11.2026, Auswahl «B · Karteikasten»). Ein Gegenstand aus dem
// Arztkoffer, in der Farbe Gesundheit. Je Fachrichtung ein Reiter (`reiter` aus karteikarten(data), höchstens fünf
// gezeichnet, je als stehende Karte). Ohne Karten: der leere Kasten. Keine Wörter im Bild:
// die Zahl und die Fachrichtungen stehen darunter (Regel «Zahl»). Ruhig: eine Farbe, die Hausärztin (erster Reiter,
// Notfall-Angabe) gefüllt, die anderen Reiter nur umrandet.
export const KARTEI_REITER_MAX = 5;
export const KARTEI_KANTEN_MAX = 12;
export const Karteikasten = ({ palette, reiter = [], anzahl = 0, groesse = 'mittel' }) => {
  const h = React.createElement;
  const farbe = gesundheitFarbe(palette);
  const px = INSTRUMENT_GROESSE[groesse] || INSTRUMENT_GROESSE.mittel;
  const gezeigt = reiter.slice(0, KARTEI_REITER_MAX);
  const kanten = Math.min(anzahl, KARTEI_KANTEN_MAX);
  // Zeichnung 160 × 112: je Reiter eine stehende Karte (hinten zuerst), gestaffelt nach vorn und unten; der Reiter
  // sitzt oben auf der Karte, nach rechts versetzt. Davor die niedrige Vorderwand mit Griff. Ohne Karten: leerer Kasten.
  const kartenZeichnung = gezeigt.map((fach, i) => {
    const y = 34 + i * 7, rx = 22 + i * 22;
    return h('g', { key: fach, 'data-teil': 'reiter', 'data-fach': fach },
      h('path', { d: 'M' + rx + ' ' + y + ' v-10 q0 -4 4 -4 h18 q4 0 4 4 v10', fill: i === 0 && fach === 'hausarzt' ? farbe : palette.surface || '#fff', stroke: farbe, strokeWidth: 2, strokeLinejoin: 'round' }),
      h('rect', { x: 18, y, width: 124, height: 96 - y, rx: 3, fill: palette.surface || '#fff', stroke: palette.mid || farbe, strokeWidth: 1.5 }));
  });
  return h('svg', { viewBox: '0 0 160 112', width: '100%', 'aria-hidden': true, 'data-teil': 'karteikasten', 'data-groesse': groesse,
    'data-reiter': gezeigt.length, 'data-karten': kanten, style: { maxWidth: px + 'px', height: 'auto', display: 'block', overflow: 'visible' } },
    h('path', { 'data-teil': 'kasten', d: 'M10 46 L10 104 Q10 108 14 108 L146 108 Q150 108 150 104 L150 46', fill: 'none', stroke: farbe, strokeWidth: 3, strokeLinejoin: 'round' }),
    ...kartenZeichnung,
    h('rect', { 'data-teil': 'vorderwand', x: 10, y: 74, width: 140, height: 34, rx: 4, fill: palette.surface || '#fff', stroke: farbe, strokeWidth: 3 }),
    h('rect', { 'data-teil': 'griff', x: 66, y: 86, width: 28, height: 8, rx: 4, fill: 'none', stroke: farbe, strokeWidth: 2 }));
};

// Was nehme ich wann? als Blisterpackung (Sophie 20.11.2026, Auswahl «A · Wochenblister»). Ein Gegenstand aus dem
// Arztkoffer, in der Farbe Gesundheit: 7 Tage (Spalten) × 4 Zeiten (Zeilen). Je Mulde so viele Tabletten, wie
// Medikamente zu dieser Zeit an diesem Tag eingetragen sind (höchstens drei gezeichnet). Leere Mulde = nichts.
// `raster` aus wochenblister(data). Die Ablesewörter (Tage, Zeiten) sind übersetzt und stehen am Rand, nicht in den
// Mulden; die Zahl steht UNTER dem Bild (Regel «Zahl»). Ruhig: eine Farbe, kein «heute», nichts zum Abhaken.
// viewBox in echten Pixeln (256 breit), Schrift 13 px wie die Ablesung am Thermometer.
export const BLISTER_TABLETTEN_MAX = 3;
export const Blisterpackung = ({ palette, t, raster = [], groesse = 'gross' }) => {
  const h = React.createElement;
  const farbe = gesundheitFarbe(palette);
  const px = INSTRUMENT_GROESSE[groesse] || INSTRUMENT_GROESSE.gross;
  const links = 56, oben = 20, zelle = 28, mulde = 23; // Zeiten ausgeschrieben («Morgen»): kein «Mo» wie Montag
  const breite = links + 7 * zelle, hoehe = oben + 4 * zelle + 4;
  const beschriftung = (key, x, y, inhalt, anker) => h('text', { key, x, y, fontSize: 13, fill: palette.mid, textAnchor: anker }, inhalt);
  const mulden = [];
  for (let tag = 0; tag < 7; tag++) {
    for (let z = 0; z < 4; z++) {
      const n = (raster[tag] && raster[tag][z]) || 0;
      const x = links + tag * zelle + (zelle - mulde) / 2, y = oben + z * zelle + (zelle - mulde) / 2;
      const gezeigt = Math.min(n, BLISTER_TABLETTEN_MAX);
      mulden.push(h('g', { key: tag + '-' + z, 'data-teil': 'mulde', 'data-anzahl': n },
        h('rect', { x, y, width: mulde, height: mulde, rx: 7, fill: 'none', stroke: n ? farbe : palette.border, strokeWidth: n ? 2 : 1.5 }),
        ...Array.from({ length: gezeigt }, (_, i) => h('circle', { key: i, 'data-teil': 'tablette', cx: x + mulde / 2 + (i - (gezeigt - 1) / 2) * 6.5, cy: y + mulde / 2, r: gezeigt > 1 ? 2.8 : 4.5, fill: farbe }))));
    }
  }
  return h('svg', { viewBox: '0 0 ' + breite + ' ' + hoehe, width: '100%', 'aria-hidden': true, 'data-teil': 'blisterpackung', 'data-groesse': groesse,
    style: { maxWidth: px + 'px', height: 'auto', display: 'block', overflow: 'visible' } },
    h('rect', { 'data-teil': 'folie', x: links - 4, y: oben - 2, width: 7 * zelle + 8, height: 4 * zelle + 6, rx: 10, fill: 'none', stroke: farbe, strokeWidth: 3 }),
    t && [1, 2, 3, 4, 5, 6, 7].map((tag, i) => beschriftung('t' + tag, links + i * zelle + zelle / 2, oben - 7, t('blister.tageKurz.' + tag), 'middle')),
    t && ['morgens', 'mittags', 'abends', 'nachts'].map((z, i) => beschriftung('z' + z, links - 8, oben + i * zelle + zelle / 2 + 4, t('blister.zeitenKurz.' + z), 'end')),
    ...mulden);
};

// Wie ging es mir die letzten Tage? als Fieberkurve auf einem Kalenderstreifen (Sophie 20.11.2026, Auswahl «A · Kurve
// auf Kalender»). KEIN Thermometer: das bedeutet in der App nur die Franchise (11.11.2026). Unten 7 Tage als Streifen
// (Wochentage übersetzt, im Feld), darüber je Tag die höchste eingetragene Temperatur als Punkt; Punkte benachbarter
// Tage mit einer Linie verbunden, ein Tag ohne Messung unterbricht die Linie (nichts erfinden). Unter dem Streifen ein
// Strich für Tage mit Symptomen. Feste Höhe 36–40 °C (geklemmt), damit kleine Schwankungen nicht gross aussehen.
// Ruhig: eine Farbe, keine Grenzlinie «ab hier Fieber», keine Ampel, keine Zahlen im Bild (Regel «Zahl»).
// `tage` aus fiebertagebuch(data).
export const FIEBER_SKALA = [36, 40];
export const Fieberkurve = ({ palette, t, tage = [], groesse = 'gross' }) => {
  const h = React.createElement;
  const farbe = gesundheitFarbe(palette);
  const px = INSTRUMENT_GROESSE[groesse] || INSTRUMENT_GROESSE.gross;
  const zelle = 36, links = 2, oben = 10, kurve = 64, streifen = 26;
  const breite = links * 2 + 7 * zelle, yStreifen = oben + kurve + 10, hoehe = yStreifen + streifen + 12;
  const [tief, hoch] = FIEBER_SKALA;
  const yVon = (temp) => oben + kurve - ((Math.min(hoch, Math.max(tief, temp)) - tief) / (hoch - tief)) * kurve;
  const xVon = (i) => links + i * zelle + zelle / 2;
  const linien = [];
  tage.forEach((d, i) => {
    const vor = tage[i - 1];
    if (i > 0 && d.hoechste != null && vor && vor.hoechste != null) {
      linien.push(h('line', { key: 'l' + i, 'data-teil': 'kurvenstueck', x1: xVon(i - 1), y1: yVon(vor.hoechste), x2: xVon(i), y2: yVon(d.hoechste), stroke: farbe, strokeWidth: 2.5, strokeLinecap: 'round' }));
    }
  });
  return h('svg', { viewBox: '0 0 ' + breite + ' ' + hoehe, width: '100%', 'aria-hidden': true, 'data-teil': 'fieberkurve', 'data-groesse': groesse,
    style: { maxWidth: px + 'px', height: 'auto', display: 'block', overflow: 'visible' } },
    ...linien,
    ...tage.map((d, i) => d.hoechste != null && h('circle', { key: 'p' + i, 'data-teil': 'messpunkt', 'data-temp': d.hoechste, cx: xVon(i), cy: yVon(d.hoechste), r: 4.5, fill: farbe })),
    h('rect', { 'data-teil': 'kalenderstreifen', x: links, y: yStreifen, width: 7 * zelle, height: streifen, rx: 6, fill: 'none', stroke: farbe, strokeWidth: 2 }),
    ...tage.slice(1).map((_, i) => h('line', { key: 's' + i, x1: links + (i + 1) * zelle, y1: yStreifen, x2: links + (i + 1) * zelle, y2: yStreifen + streifen, stroke: palette.border, strokeWidth: 1 })),
    ...(t ? tage.map((d, i) => h('text', { key: 't' + i, x: xVon(i), y: yStreifen + streifen / 2 + 4.5, fontSize: 13, fill: palette.mid, textAnchor: 'middle' }, t('blister.tageKurz.' + d.wochentag))) : []),
    ...tage.map((d, i) => d.symptome && h('line', { key: 'y' + i, 'data-teil': 'symptomstrich', x1: xVon(i) - 8, y1: yStreifen + streifen + 7, x2: xVon(i) + 8, y2: yStreifen + streifen + 7, stroke: farbe, strokeWidth: 3, strokeLinecap: 'round' })));
};

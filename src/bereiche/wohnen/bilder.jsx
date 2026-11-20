import React from 'react';
import { text, weight, space, leading, duration, ease, INSTRUMENT_GROESSE } from '../../config/tokens.js';
import { bereichFillColor } from '../../data/lebensbereiche.js';
import { zahl } from '../../utils/geld.js';
import { Icon } from '../../IconSystem.jsx';
import { ansichtIkon } from '../../config/ansichtenRegister.js';
import { ExternerLink } from '../../components/ExternerLink.jsx';
import { KACHELKARTE_LAGE } from '../../data/mietzinsbeitraege.js';
import { PEGEL_SCALE } from '../../data/pegel.js';

// Lebensbereich Wohnen · die Bilder (Bauplan Lebensbereich, 18.11.2026). Je Bild ein Bauteil mit `groesse`
// (klein 64 · mittel 128 · gross 256, Brand Book §7b). Rein Bild: Zahlen und Sätze stehen daneben (aria-hidden).
//   DrittelHaus     Frage A Anteil
//   Vergleichshaus  Frage B Lage — die Tür ist das Fass der Frage C (Stebler Studios 11.11.2026, «von Tonne zur Tür»)
//   MoeglichKnopf   Frage C Wegweiser «möglich ›»
//   Kachelkarte     Frage C, welche Kantone ein Programm haben (nur «Mehr dazu» und Werkzeug)
// Jedes Bild steht auf einer Seite nur einmal (Stebler Studios 18.11.2026, «Jedes Bild einmal»).

// ── Drittel-Haus ────────────────────────────────────────────────────────────────────────────────────────────────────
// Das Haus ist das ganze Einkommen, drei gleiche Stockwerke, das Erdgeschoss ist ein Drittel (Stebler Studios 11.11.2026).
// Ausgebaut nach Grösse (Wächter drittelHausAusbau.test.js): A «!» an der Drittel-Linie, graphit, Rosé erst darüber ·
// B die Füllung steigt (mp-steigen), still bei «weniger Bewegung» · C Viertel-Punktlinie, Budgetberatung Schweiz
// (budgetberatung.ch/wohnen, geprüft 11.11.2026), nur netto und mit Urteil · D «alles andere», nur gross · E Partner-Haus
// geteilt, nur gross · F möglicher Mietzinsbeitrag schraffiert in der Behörden-Farbe («bis zu»), gross + mittel.
// Klein 64 zeigt nur A und B. Die Füllung bleibt immer grün (Wohnen); die Warnung tragen Linie und «!».
const HAUS = { x: 12, oben: 44, b: 96, stock: 24 };
export const DrittelHaus = ({ palette, t, anteil, ueberDrittel, mitPartner, brutto, teile, beitrag, fuell, groesse = 'gross' }) => {
  const h = React.createElement;
  const gross = groesse === 'gross';
  const klein = groesse === 'klein';
  const koerper = HAUS.stock * 3;
  const boden = HAUS.oben + koerper;
  const anteil01 = Math.max(0, Math.min(100, anteil || 0)) / 100;
  const urteil = !mitPartner && anteil != null;
  const darueber = urteil && ueberDrittel;
  const drittelFarbe = darueber ? palette.roseDeep : palette.text;
  const linie = { vectorEffect: 'non-scaling-stroke' };
  const strich = klein ? 2.5 : 1.5;
  const drittelY = boden - HAUS.stock;
  const viertelY = boden - koerper / 4;
  const geteilt = gross && teile && teile.sie > 0 && teile.partner > 0;
  const teilX = geteilt ? Math.round((HAUS.x + HAUS.b * teile.sie / (teile.sie + teile.partner)) * 10) / 10 : null;
  // Wörter nur gross: bei 256 px genau text.xs (13 px, Regel H).
  const schrift = { fontSize: Math.ceil(text.xs * 120 / INSTRUMENT_GROESSE.gross * 100) / 100, fill: palette.mid, textAnchor: 'middle' };
  const hoehe = boden + (geteilt ? 14 : 4);
  const beitragH = !klein && beitrag && beitrag.anteil > 0 && anteil01 > 0 ? koerper * Math.min(beitrag.anteil / 100, anteil01) : 0;
  const fuellOben = boden - koerper * anteil01;
  return h('svg', {
    viewBox: '0 0 120 ' + hoehe, width: '100%', 'aria-hidden': 'true', focusable: 'false', 'data-teil': 'drittel-haus',
    style: { display: 'block', maxWidth: INSTRUMENT_GROESSE[groesse] + 'px', height: 'auto', overflow: 'visible' },
  },
    anteil01 > 0 && h('rect', {
      'data-teil': 'drittel-haus-fuellung', x: HAUS.x, y: HAUS.oben, width: HAUS.b, height: koerper, fill: fuell,
      style: {
        transform: 'scaleY(' + anteil01 + ')', transformBox: 'fill-box', transformOrigin: 'bottom',
        transition: 'transform ' + duration.slow + 'ms ' + ease + ', fill ' + duration.slow + 'ms ' + ease,
        animation: 'mp-steigen ' + duration.slow + 'ms ' + ease,
      },
    }),
    beitragH > 0 && h('defs', null, h('pattern', { id: 'drittel-haus-schraffur', width: 6, height: 6, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' },
      h('line', { x1: 0, y1: 0, x2: 0, y2: 6, stroke: beitrag.farbe, strokeWidth: 2, opacity: 0.55 }))),
    beitragH > 0 && h('rect', {
      'data-teil': 'drittel-haus-beitrag', x: HAUS.x + 0.75, y: fuellOben, width: HAUS.b - 1.5, height: beitragH,
      fill: 'url(#drittel-haus-schraffur)', stroke: beitrag.farbe, strokeWidth: 1.5, strokeDasharray: '4 3', ...linie,
      style: { animation: 'fadeIn ' + duration.slow + 'ms ' + ease },
    }),
    !klein && h('line', { x1: HAUS.x, x2: HAUS.x + HAUS.b, y1: HAUS.oben + HAUS.stock, y2: HAUS.oben + HAUS.stock, stroke: palette.mid, strokeWidth: 1, strokeDasharray: '3 3', ...linie }),
    !klein && urteil && !brutto && h('line', { 'data-teil': 'drittel-haus-viertel', x1: HAUS.x, x2: HAUS.x + HAUS.b, y1: viertelY, y2: viertelY, stroke: palette.mid, strokeWidth: 1, strokeDasharray: '1 3', strokeLinecap: 'round', ...linie }),
    geteilt && h('line', { 'data-teil': 'drittel-haus-teilung', x1: teilX, x2: teilX, y1: HAUS.oben + HAUS.stock, y2: boden, stroke: palette.mid, strokeWidth: 1, strokeDasharray: '2 2', ...linie }),
    // Kante in der Flächenfarbe unter der Drittel-Linie: Rosé auf der Füllung allein trägt zu wenig (Vorschaubild 11.11.).
    anteil01 > 0.29 && h('line', { x1: HAUS.x, x2: HAUS.x + HAUS.b, y1: drittelY, y2: drittelY, stroke: palette.surface, strokeWidth: klein ? 5 : 4, ...linie }),
    h('line', { 'data-teil': 'drittel-haus-drittel', x1: HAUS.x, x2: HAUS.x + HAUS.b, y1: drittelY, y2: drittelY, stroke: drittelFarbe, strokeWidth: klein ? 3 : 2, ...linie }),
    h('rect', { x: HAUS.x, y: HAUS.oben, width: HAUS.b, height: koerper, fill: 'none', stroke: palette.text, strokeWidth: strich, ...linie }),
    h('path', { d: 'M' + (HAUS.x - 8) + ' ' + HAUS.oben + 'L60 6L' + (HAUS.x + HAUS.b + 8) + ' ' + HAUS.oben + 'Z', fill: 'none', stroke: palette.text, strokeWidth: strich, strokeLinejoin: 'round', ...linie }),
    urteil && h('text', { 'data-teil': 'drittel-ausrufe', x: HAUS.x + HAUS.b + 6, y: drittelY + (klein ? 8 : 6), fontSize: klein ? 24 : 16, fontWeight: 700, fill: drittelFarbe }, '!'),
    gross && t && h('text', { x: 60, y: HAUS.oben + HAUS.stock - 9, ...schrift }, t('wohnenInstrument.hausRest')),
    geteilt && t && h('text', { x: (HAUS.x + teilX) / 2, y: boden + 11, ...schrift }, t('wohnenInstrument.hausSie')),
    geteilt && t && h('text', { x: (teilX + HAUS.x + HAUS.b) / 2, y: boden + 11, ...schrift }, t('wohnenInstrument.hausPartner')),
  );
};

// ── Vergleichshaus ──────────────────────────────────────────────────────────────────────────────────────────────────
// Frage B (Stebler Studios 11.11.2026: «Kantonshaus, Schweizer Haus und das internationale zu einem vereinen»), seit
// 18.11.2026 das einzige Bild der Lage an allen Orten. Alles auf einer Franken-Skala:
//   • Füllung = Ihre Nettomiete, in der Wohnen-Farbe (wie die Füllung des Barometers). Ersetzt das zweite, kleine
//     Drittel-Haus, das bis 18.11. in der Strasse stand: das Drittel trägt nur noch das Drittel-Haus.
//   • Stock Kanton durchgezogen in der Farbe Ihrer Lage (gold = finanziell enger, salbei = entspannter, ±2 % neutral),
//     Stock Schweiz gestrichelt grau, Stock EU gepunktet blau (nur gross, abgeleitet aus dem Preisniveau).
//   • Fahnen (nur gross, Regel «Zahl» §10) tragen nur Vergleichswerte, nie die eigene Zahl.
//   • Die Tür ist das Fass der Mietbeiträge (Frage C): Wasser = Einkommen, gestrichelte Linie = Grenze, dieselbe
//     Lesart wie der Pegel. Programm ohne Zahl: Tür getönt. Ohne Programm (oder klein): schlichte Tür.
export const lageFarben = (palette, lage) => {
  const r = lage?.richtung;
  return r === 'Above' ? [palette.gold, palette.goldDeep] : r === 'Below' ? [palette.sage, palette.sageDeep] : [palette.mid, palette.mid];
};
// Gleiches Haus wie das Drittel-Haus (Stebler Studios 20.11.2026, «die beiden Häuser sollten gleicher aussehen, um die
// Logik und Verhältnisse besser zu verstehen»): derselbe Körper (HAUS), dasselbe Dach, dieselbe Füllung. Der Körper ist
// hier die Franken-Skala; der höchste Wert reicht bis `kopf` unter die Traufe, darüber bleibt Platz für eine Fahne.
const VB = { b: 120, boden: HAUS.oben + HAUS.stock * 3, hoehe: HAUS.stock * 3, x: HAUS.x, haus: HAUS.b, kopf: 1.2, tuerB: 16, tuerH: 24 };
export const Vergleichshaus = ({ palette, lage: ml, fuell, tuer, groesse = 'gross', kanton }) => {
  if (!ml || !ml.vergleich) return null;
  const h = React.createElement;
  const gross = groesse === 'gross';
  const klein = groesse === 'klein';
  const { regional, national } = ml.vergleich;
  const eu = gross && ml.ausland ? ml.ausland.eu : null;
  const max = Math.max(regional, national, ml.netto || 0, eu ? eu.hoehe : 0) * VB.kopf || 1;
  const y = (v) => VB.boden - Math.max(3, (v / max) * VB.hoehe);
  const yR = y(regional), yN = y(national), yS = ml.netto > 0 ? y(ml.netto) : VB.boden;

  const x = VB.x, r = VB.x + VB.haus;
  const [kantonFarbe, kantonText] = lageFarben(palette, ml.lage);
  const linie = { vectorEffect: 'non-scaling-stroke' };
  const strich = klein ? 2.5 : 1.5;
  // Schrift nur gross, 13 px (Regel H) bei der Breite, mit der das Haus in der Strasse steht (190 px, BILDHOEHE.gross).
  const schrift = Math.ceil(text.xs * VB.b / 190 * 100) / 100;
  // Fahnen stehen unter ihrem Stock, im Haus. Liegen zwei Stöcke enger als eine Schriftzeile, steht die obere
  // Fahne über ihrem Stock. Ein Rand in der Flächenfarbe hält die Schrift auf der Füllung lesbar.
  const nah = Math.abs(yR - yN) < schrift + 2;
  const fahne = (yy, txt, farbe, teil, oben) => h('text', { 'data-teil': teil, x: x + 3, y: oben ? yy - 2 : yy + schrift + 1, fontSize: schrift, fontWeight: 600, fill: farbe,
    stroke: palette.surface, strokeWidth: schrift / 4, paintOrder: 'stroke', strokeLinejoin: 'round' }, txt);
  // Tür
  const tm = r - 13, tl = tm - VB.tuerB / 2, tr = tm + VB.tuerB / 2, tt = VB.boden - VB.tuerH;
  const tuerPfad = 'M' + tl + ' ' + VB.boden + 'V' + (tt + 4) + 'A4 4 0 0 1 ' + (tl + 4) + ' ' + tt + 'H' + (tr - 4) + 'A4 4 0 0 1 ' + tr + ' ' + (tt + 4) + 'V' + VB.boden + 'Z';
  const fass = !klein && tuer && tuer.fass && tuer.fass.mode !== 'empty' ? tuer.fass : null;
  const wasser = fass ? Math.min(1, fass.fraction / PEGEL_SCALE) * VB.tuerH : 0;
  const grenzeY = VB.boden - VB.tuerH / PEGEL_SCALE;
  const getoent = !klein && tuer && tuer.programm && !fass;
  const clipId = 'vh-tuer-' + groesse;
  return h('svg', {
    viewBox: '0 0 ' + VB.b + ' ' + (VB.boden + 4), width: '100%', 'aria-hidden': 'true', focusable: 'false',
    'data-teil': 'vergleichs-haus', 'data-groesse': groesse,
    style: { display: 'block', maxWidth: INSTRUMENT_GROESSE[groesse] + 'px', height: 'auto', overflow: 'visible' },
  },
    // Füllung = Ihre Miete
    ml.netto > 0 && h('rect', { 'data-teil': 'vergleich-fuellung', x, y: yS, width: VB.haus, height: VB.boden - yS, fill: fuell, opacity: 0.6 }),
    // Körper und Dach genau wie beim Drittel-Haus
    h('rect', { x, y: HAUS.oben, width: VB.haus, height: VB.hoehe, fill: 'none', stroke: palette.text, strokeWidth: strich, ...linie }),
    h('path', { d: 'M' + (x - 8) + ' ' + HAUS.oben + 'L60 6L' + (r + 8) + ' ' + HAUS.oben + 'Z', fill: 'none', stroke: palette.text, strokeWidth: strich, strokeLinejoin: 'round', ...linie }),
    h('line', { 'data-teil': 'stock-schweiz', x1: x, x2: r, y1: yN, y2: yN, stroke: palette.mid, strokeWidth: klein ? 2 : 1.5, strokeDasharray: '4 3', ...linie }),
    h('line', { 'data-teil': 'stock-kanton', x1: x, x2: r, y1: yR, y2: yR, stroke: kantonFarbe, strokeWidth: klein ? 3 : 2.5, ...linie }),
    eu && h('line', { 'data-teil': 'stock-eu', x1: x, x2: r, y1: y(eu.hoehe), y2: y(eu.hoehe), stroke: palette.skyDeep, strokeWidth: 2, strokeDasharray: '1 3', strokeLinecap: 'round', ...linie }),
    gross && fahne(yR, (kanton ? kanton + ' ' : '') + zahl(regional), kantonText, 'fahne-kanton', nah && yR <= yN),
    gross && fahne(yN, 'CH Ø ' + zahl(national), palette.mid, 'fahne-schweiz', nah && yN < yR),
    eu && fahne(y(eu.hoehe), 'EU ' + (eu.pct >= 0 ? '+' : '−') + Math.abs(eu.pct) + ' %', palette.skyDeep, 'fahne-eu', false),
    // Tür = Fass
    h('g', { 'data-teil': 'tuer', 'data-programm': tuer && tuer.programm ? 'ja' : 'nein', 'data-fass': fass ? 'ja' : 'nein' },
      fass && h('defs', null, h('clipPath', { id: clipId }, h('path', { d: tuerPfad }))),
      h('path', { d: tuerPfad, fill: getoent ? (tuer.farbe || palette.mid) : palette.surface, fillOpacity: getoent ? 0.35 : 1 }),
      fass && h('rect', { 'data-teil': 'tuer-fuellung', x: tl, y: VB.boden - wasser, width: VB.tuerB, height: wasser, fill: tuer.farbe || palette.mid, opacity: 0.85, clipPath: 'url(#' + clipId + ')' }),
      fass && h('line', { 'data-teil': 'tuer-grenze', x1: tl - 2, x2: tr + 2, y1: grenzeY, y2: grenzeY, stroke: palette.skyDeep, strokeWidth: 1.5, strokeDasharray: '3 2', ...linie }),
      h('path', { d: tuerPfad, fill: 'none', stroke: palette.text, strokeWidth: klein ? 2 : 1.5, ...linie }),
      !klein && h('circle', { cx: tr - 4, cy: VB.boden - VB.tuerH / 2, r: 1.2, fill: palette.text })),
  );
};

// ── Kachelkarte ─────────────────────────────────────────────────────────────────────────────────────────────────────
// Die 26 Kantone als kleine Häuser, gefüllt = Programm in der App erfasst, leer = unklar (nie «gibt es nicht»).
// Seit 20.11.2026 auch für andere Werte (Dreier-Set im Kapitel Wohnen): `farbe(k)` gibt je Kanton
// { fill, deck, hellSchrift } oder null (leer). `mini`: ohne Kürzel, für die Kachel. `teil`/`aria` je Verwendung.
const KACHEL = { b: 26, h: 18, dach: 7, abstand: 3 };
export const Kachelkarte = ({ palette, t, kanton, gefuellt = [], isDarkMode, farbe = null, mini = false, teil = 'kachelkarte', aria = null }) => {
  const h = React.createElement;
  const zelleB = KACHEL.b + KACHEL.abstand, zelleH = KACHEL.h + KACHEL.dach + KACHEL.abstand;
  const breite = 8 * zelleB;
  const hoehe = 6 * zelleH;
  const frucht = bereichFillColor('wohnen', isDarkMode) || palette.sage;
  const schrift = Math.ceil(text.xs * breite / INSTRUMENT_GROESSE.gross * 100) / 100;
  const wert = farbe || ((k) => gefuellt.includes(k) ? { fill: frucht, deck: 0.45 } : null);
  return h('svg', {
    viewBox: '0 0 ' + breite + ' ' + hoehe, width: '100%', 'data-teil': teil,
    ...(mini || !t ? { 'aria-hidden': 'true', focusable: 'false' } : { role: 'img', 'aria-label': aria || t('mietzinsSzene.karteAria', { liste: gefuellt.join(', '), kanton }) }),
    style: { display: 'block', maxWidth: (mini ? INSTRUMENT_GROESSE.klein * 1.3 : INSTRUMENT_GROESSE.gross) + 'px', height: 'auto' },
  },
    Object.entries(KACHELKARTE_LAGE).map(([k, [zeile, spalte]]) => {
      const f = wert(k);
      const voll = !!f;
      const ihr = k === kanton;
      const x = spalte * zelleB + 1, oben = zeile * zelleH + KACHEL.dach + 1;
      const rand = { stroke: ihr ? palette.text : voll ? f.fill : palette.border, strokeWidth: ihr ? 2.5 : 1, strokeLinejoin: 'round' };
      return h('g', { key: k, 'data-kanton': k, 'data-programm': !farbe ? (voll ? 'ja' : 'nein') : undefined, ...(ihr ? { 'data-ihr': 'ja' } : {}), 'aria-hidden': 'true' },
        h('path', { 'data-form': 'haus', d: 'M' + x + ' ' + (oben + KACHEL.h) + 'V' + oben + 'L' + (x + KACHEL.b / 2) + ' ' + (oben - KACHEL.dach) + 'L' + (x + KACHEL.b) + ' ' + oben + 'V' + (oben + KACHEL.h) + 'Z',
          fill: voll ? f.fill : 'none', fillOpacity: voll ? (f.deck ?? 1) : 0, ...rand }),
        !mini && h('text', { x: x + KACHEL.b / 2, y: oben + KACHEL.h / 2 + schrift * 0.35, textAnchor: 'middle', fontSize: schrift,
          fill: voll && f.hellSchrift ? palette.surface : voll || ihr ? palette.text : palette.mid }, k));
    }));
};

// ── Häuserzeile (Rangfolge) ─────────────────────────────────────────────────────────────────────────────────────────
// Alle Kantone als Häuser nebeneinander, so hoch wie ihr Wert, höchster links (Stebler Studios 20.11.2026: Leerwohnungen
// «in grün und nur in Rangfolge»). Ihr Kanton voll in der Wohnen-Farbe mit Rand, die anderen hell; der Schweizer Wert
// gestrichelt. `werte`: { KT: Zahl }. `mini`: ohne Namen und Linie, für die Kachel. Rein Bild, die Zahlen stehen daneben.
export const HaeuserRang = ({ palette, werte, kanton, ch = null, isDarkMode, mini = false, schreib = (n) => String(n), chText = '' }) => {
  const h = React.createElement;
  const reihe = Object.entries(werte).filter(([, n]) => Number.isFinite(n)).sort((a, b) => b[1] - a[1]);
  if (reihe.length === 0) return null;
  const max = Math.max(reihe[0][1], ch || 0) || 1;
  const gruen = bereichFillColor('wohnen', isDarkMode) || palette.sage;
  const n = reihe.length, sp = 10, b = 8, dach = 3;
  const hoch = mini ? 110 : 62, oben = mini ? 2 : 14, unten = mini ? 0 : 10;
  const breite = n * sp, boden = oben + hoch;
  const y = (v) => boden - Math.max(4, (v / max) * hoch);
  const linie = { vectorEffect: 'non-scaling-stroke' };
  // 13 px (Regel H) bei der grössten Breite, mit der die Zeile im Kapitel steht (zwei Hausbreiten, 512 px).
  const schrift = Math.ceil(text.xs * breite / (INSTRUMENT_GROESSE.gross * 2) * 100) / 100;
  return h('svg', {
    viewBox: '0 0 ' + breite + ' ' + (boden + unten), width: '100%', 'aria-hidden': 'true', focusable: 'false', 'data-teil': mini ? 'haeuser-rang-mini' : 'haeuser-rang',
    style: { display: 'block', maxWidth: (mini ? INSTRUMENT_GROESSE.klein * 1.75 : INSTRUMENT_GROESSE.gross * 2) + 'px', height: 'auto', overflow: 'visible' },
  },
    reihe.map(([k, v], i) => {
      const ihr = k === kanton, x = i * sp + (sp - b) / 2, yy = y(v);
      return h('g', { key: k, 'data-kanton': k, ...(ihr ? { 'data-ihr': 'ja' } : {}) },
        h('path', { d: 'M' + x + ' ' + boden + 'V' + (yy + dach) + 'L' + (x + b / 2) + ' ' + yy + 'L' + (x + b) + ' ' + (yy + dach) + 'V' + boden + 'Z',
          fill: gruen, fillOpacity: ihr ? 1 : 0.35, stroke: ihr ? palette.text : 'none', strokeWidth: 1.5, strokeLinejoin: 'round', ...linie }),
        !mini && h('text', { x: x + b / 2, y: boden + 8, textAnchor: 'middle', fontSize: schrift * 0.9, fontWeight: ihr ? 700 : 400, fill: ihr ? palette.text : palette.mid }, k),
        !mini && ihr && h('text', { 'data-teil': 'rang-ihr', x: Math.min(Math.max(x + b / 2, 18), breite - 18), y: yy - 3, textAnchor: 'middle', fontSize: schrift, fontWeight: 700, fill: palette.text,
          stroke: palette.surface, strokeWidth: 1.5, paintOrder: 'stroke' }, k + ' ' + schreib(v)));
    }),
    !mini && ch != null && h('line', { 'data-teil': 'rang-schweiz', x1: 0, x2: breite, y1: y(ch), y2: y(ch), stroke: palette.mid, strokeWidth: 1.5, strokeDasharray: '4 3', ...linie }),
    !mini && ch != null && chText && h('text', { x: breite, y: y(ch) - 2, textAnchor: 'end', fontSize: schrift, fill: palette.mid, stroke: palette.surface, strokeWidth: 1.5, paintOrder: 'stroke' }, chText),
    h('line', { x1: 0, x2: breite, y1: boden, y2: boden, stroke: palette.mid, strokeWidth: 1, ...linie }));
};

// ── Wegweiser «möglich ›» ───────────────────────────────────────────────────────────────────────────────────────────
// Das ganze Schild ist der Knopf (Stebler Studios 11.11.2026). Im Kapitel ins Werkzeug «Mietzins», im Werkzeug zur
// kantonalen Stelle. Nur unter der Grenze; sagt nie «Anspruch». `kurz`: «möglich ›», der Satz steht im aria-label.
export const MoeglichKnopf = ({ palette, t, onNavigate, url, kurz = false }) => {
  const h = React.createElement;
  const stil = {
    position: 'relative', display: 'inline-flex', alignItems: 'center', gap: space.xs + 'px', minHeight: '44px', maxWidth: '100%',
    padding: space.xs + 'px ' + (space.lg + space.xs) + 'px ' + space.xs + 'px ' + space.ms + 'px', textAlign: 'left', lineHeight: leading.tight, border: 'none', background: 'none', cursor: 'pointer',
    fontFamily: 'inherit', fontSize: text.sm, fontWeight: weight.semi, color: palette.surface, textDecoration: 'none',
  };
  const schild = h('svg', { key: 's', 'aria-hidden': 'true', viewBox: '0 0 100 44', preserveAspectRatio: 'none', style: { position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 } },
    h('path', { d: 'M0 0H92L100 22L92 44H0Z', fill: palette.skyDeep }));
  const inhalt = [schild,
    h(Icon, { key: 'i', name: ansichtIkon('mietzins'), size: 18, style: { position: 'relative', zIndex: 1 } }),
    h('span', { key: 't', style: { position: 'relative', zIndex: 1, whiteSpace: kurz ? 'nowrap' : undefined } }, kurz ? t('mietzinsSzene.ctaKurz') + ' ›' : t(onNavigate ? 'mietzinsSzene.cta' : 'mietzinsSzene.ctaStelle'))];
  const vorlesen = kurz ? { 'aria-label': t(onNavigate ? 'mietzinsSzene.cta' : 'mietzinsSzene.ctaStelle') } : {};
  const knopf = onNavigate
    ? h('button', { type: 'button', 'data-teil': 'mietzins-cta', ...vorlesen, onClick: () => onNavigate('mietzins'), style: stil }, inhalt)
    : url ? h(ExternerLink, { t, href: url, 'data-teil': 'mietzins-cta', ...vorlesen, style: stil }, inhalt) : null;
  if (!knopf) return null;
  return h('div', { 'data-teil': 'mietzins-wegweiser', style: { display: 'inline-flex', flexDirection: 'column', flex: '0 1 auto', minWidth: 0, animation: 'fadeIn ' + duration.slow + 'ms ' + ease } },
    knopf,
    h('span', { 'aria-hidden': 'true', style: { width: '2px', height: space.lg + 'px', marginLeft: space.lg + 'px', background: palette.text } }));
};

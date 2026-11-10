import React from 'react';
import { bereichsTon, kontrast, mischeHex } from '../utils/lebensbereichFruechte.js';
import { netzSchildTeile, teilWinkel, fuellung, SCHILD_KERN } from '../data/netzSchild.js';
import { HAUSRAT_PFLICHT } from '../data/hausratPflicht.js';
import { shieldPath } from './shieldShape.js';
import { text, weight, space, leading, INSTRUMENT_GROESSE } from '../config/tokens.js';
import { linkStil } from './PrimaryButton.jsx';
import { hinweisZeichen } from '../IconSystem.jsx';
import { zahl, betrag } from '../utils/geld.js';

// Netz-Schild (F7-K3-6, Stebler Studios 27.10.2026): ersetzt im Kapitel Versicherungen das Spinnennetz und die
// zwei kleinen Schilde «Pflicht / Empfohlen». Logik: data/netzSchild.js. Die Form ist dieselbe wie überall
// (shieldShape.js), die Farben sind die Maloja-Töne: Sand für «noch nicht eingetragen» (ein Hinweis, kein Alarm),
// helles Salbei für die Grundversicherung, Salbei für eingetragen.
// Der Stand steht nie nur im Bild: Grösse der Füllung + Liste mit ✓/○ und Wort darunter (a11y).

const B = 340, H = 330;
// Mindestschrift 13 px bei der grossen Breite (Brand Book «Instrumente»): 13 × Bildbreite im viewBox / gross.
const SCHRIFT_IM_BILD = Math.ceil((13 * B / INSTRUMENT_GROESSE.gross) * 10) / 10;
// Wörter im Bild: bei Leerzeichen zwei Zeilen; zu lange Einzelwörter an ihrer Trennstelle (nur die Grafik — Listen und
// Vorlesetext behalten das ganze Wort). Neue Sprache oder neues Wort: der Wächter misst, ob es ins Feld passt.
const TRENNSTELLEN = { Krankenkasse: 'Kranken-|kasse' };
export const schildZeilen = (wort) => (TRENNSTELLEN[wort] || wort.split(' ').join('|')).split('|');
// Breite eines Felds auf Höhe der Wörter (5 Teile = 72°, Radius 96) und geschätzte Wortbreite, beide im viewBox.
export const SCHILD_FELD_BREITE = 2 * 96 * Math.sin(Math.PI / 5);
export const wortBreite = (z) => z.length * 0.58 * SCHRIFT_IM_BILD;
const CX = B / 2, TOP = 6, HGT = 318;
const CY = TOP + 0.43 * HGT; // Mitte der Teile: über der halben Höhe, weil das Schild oben breiter ist
const SCHILD = shieldPath(CX, TOP, 300, HGT);
const rad = (g) => (g * Math.PI) / 180;
const punkt = (g, r) => [CX + r * Math.cos(rad(g)), CY + r * Math.sin(rad(g))];
// Um die Mitte skaliert: die Füllung wächst von innen nach aussen.
const skaliert = (s) => `translate(${CX * (1 - s)} ${CY * (1 - s)}) scale(${s})`;

// Keil um den Mittelwinkel, weit über das Schild hinaus — das Schild selbst schneidet ihn zu.
const keil = (mitte, breite) => {
  const pts = [[CX, CY]];
  for (let g = mitte - breite / 2; g <= mitte + breite / 2 + 0.01; g += 3) pts.push(punkt(g, 420));
  return pts.map((p) => p.map((x) => Math.round(x * 10) / 10).join(',')).join(' ');
};

const TEIL_BEREICH = { haushalt: 'wohnen', vorsorge: 'finanzen', kk: 'versicherungen', uvg: 'versicherungen', leben: 'versicherungen' };

// Franken: ganze Beträge ohne Rappen, sonst immer zwei Stellen («CHF 540.30», nie «540.3» — F7-D7).
const chf = (n) => betrag(n, Number.isInteger(n) ? {} : { stellen: 2 });
export const betragText = (b, t) => [
  b.mt && t('netzSchild.betrag.kosten', { mt: chf(b.mt), jahr: chf(b.jahr) }),
  b.guthaben && t('netzSchild.betrag.guthaben', { chf: chf(b.guthaben) }),
  b.summe && t('netzSchild.betrag.summe', { chf: chf(b.summe) }),
  b.lohn && t('netzSchild.betrag.lohn'),
  b.lohnRegel && t('netzSchild.betrag.lohnRegel'),
  b.arbeitgeber && t('netzSchild.betrag.arbeitgeber'),
  b.name,
].filter(Boolean).join(' · ');

// groesse (Stebler Studios 09.11.2026, Brand Book «Instrumente»): gross = Zuhause im Kapitel (Satz + Liste) ·
// mittel = Spiegel auf Werkzeug-Seiten (Bild, Satz, Weg ins Kapitel über onZuhause) · klein = Spiegel Startseite
// (nur das Bild, ohne Wörter in den Teilen — bei 64 px unlesbar, im Browser gesehen).
export const NetzSchild = ({ palette, t, versicherungen, finanzen, kanton, stunden, employed, annualIncome, annualIncomeMit13, lohnBasis, referenzalterErreicht, vorBvgMindestalter, groesse = 'gross', onZuhause }) => {
  const v = versicherungen || {};
  const { teile, offen, teilweise, st } = netzSchildTeile(v, { employed, annualIncome, annualIncomeMit13, lohnBasis, referenzalterErreicht, vorBvgMindestalter, finanzen, kanton });
  if (!st.touched || !teile.length) return null;
  const h = React.createElement;
  const n = teile.length;
  const breite = 360 / n;
  const iLeben = teile.findIndex((p) => p.key === 'leben');
  const winkel = (i) => teilWinkel(i, n, iLeben);
  // Teilweise: dasselbe Salbei wie «ganz», halb so dicht — im hellen wie im dunklen Modus klar als «weniger»
  // lesbar (im Browser verglichen 27.10.2026; ein eigenes helles Grün verschwand dunkel fast).
  // Seit F7-K3-4 trägt jedes Teil die Farbe seines Lebensbereichs (Stebler Studios 01.11.2026: «Hausrat gehört zum Wohnen»); die offene Stelle bleibt Sand.
  const tonVon = (key) => bereichsTon(TEIL_BEREICH[key], palette) || palette.sageDeep || palette.sage;
  const ganz = (p) => p.n > 0 && p.erreicht === p.n;
  const farbe = (p) => p.erreicht === 0 ? palette.sand : tonVon(p.key);
  // Nur Freiwilliges ohne Eintrag (n = 0): kaum sichtbar, das ist keine Lücke.
  const dichte = (p) => p.n === 0 ? 0.15 : ganz(p) ? 0.9 : 0.5;
  // Sand und das Gold der Vorsorge haben 1.07:1, die Farbe allein trennt sie nicht: Offenes ist zusätzlich schraffiert (F7-K3-4, Messung 01.11.2026).
  const offenTeil = (p) => p.n > 0 && p.erreicht === 0;
  // Hell hatte die Schrift in Grundfarbe auf vollem Gold nur 2:1: Sie bleibt nur, wo sie 4.5:1 erreicht, sonst dunkle Schrift mit Kontur.
  const schriftHell = (p) => ganz(p) && kontrast(palette.surface, mischeHex(palette.up, farbe(p), dichte(p))) >= 4.5;
  const kurz = (p) => t('netzSchild.kurz.' + p.key);
  const stand = (p) => (p.n ? t('netzSchild.vonN', { n: p.erreicht, total: p.n }) : t('netzSchild.nichtEingetragen'));
  const aria = t('netzSchild.aria') + ' ' + teile.map((p) => kurz(p) + ': ' + stand(p)).join('; ') + '.';
  // Stufen-Linien je Teil: der Kern und jede Zwischenstufe, in Schildform, nur im eigenen Keil.
  // Eigene IDs je Grösse: zwei Schilde auf einer Seite teilen sich sonst Clip-Pfade und Muster.
  const id = (name) => 'ns-' + groesse + '-' + name;
  const linien = (p) => [SCHILD_KERN, ...Array.from({ length: p.n - 1 }, (_, k) => fuellung({ erreicht: k + 1, n: p.n }))];

  const bild = h('svg', { viewBox: `0 0 ${B} ${H}`, width: '100%', role: 'img', 'aria-label': aria, style: { maxWidth: INSTRUMENT_GROESSE[groesse] + 'px', height: 'auto', display: 'block', margin: '0 auto' } },
    h('defs', null,
      h('clipPath', { id: id('schild') }, h('path', { d: SCHILD })),
      teile.map((p, i) => h('clipPath', { key: p.key, id: id('keil-' + p.key) }, h('polygon', { points: keil(winkel(i), breite) }))),
      // Weit gesetzt: Das Muster schrumpft mit dem Kern (SCHILD_KERN).
      h('pattern', { id: id('offen'), width: 22, height: 22, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' },
        h('line', { x1: 0, y1: 0, x2: 0, y2: 22, stroke: palette.text, strokeOpacity: 0.55, strokeWidth: 6 }))),
    h('g', { clipPath: 'url(#' + id('schild') + ')' },
      h('path', { d: SCHILD, fill: palette.up }),
      teile.map((p) => h('g', { key: p.key, clipPath: 'url(#' + id('keil-' + p.key) + ')' },
        h('path', { 'data-teil': p.key, 'data-erreicht': p.erreicht + '/' + p.n, d: SCHILD, transform: skaliert(fuellung(p)), fill: farbe(p), fillOpacity: dichte(p) }),
        offenTeil(p) && h('path', { 'data-offen': p.key, d: SCHILD, transform: skaliert(fuellung(p)), fill: 'url(#' + id('offen') + ')' }),
        linien(p).map((s) => h('path', { key: s, d: SCHILD, fill: 'none', stroke: palette.mid, strokeOpacity: 0.35, strokeWidth: 1, vectorEffect: 'non-scaling-stroke', transform: skaliert(s) })))),
      // Fugen zwischen den Teilen, in der Farbe des Grunds.
      teile.map((p, i) => {
        const [x, y] = punkt(winkel(i) + breite / 2, 420);
        return h('line', { key: p.key, x1: CX, y1: CY, x2: x, y2: y, stroke: palette.surface, strokeWidth: 5, strokeLinecap: 'round' });
      }),
      h('circle', { cx: CX, cy: CY, r: 6, fill: palette.surface })),
    h('path', { d: SCHILD, fill: 'none', stroke: palette.border, strokeWidth: 1.5 }),
    // Namen im Teil; auf vollem Salbei hell, sonst dunkel (wie im Schutzschild, a11y Abnahme F6).
    // Nur gross: bei 128 px wären sie ~6 px (09.11. gemessen). Grösse aus der Bildbreite, damit sie 13 px ergibt.
    groesse === 'gross' && teile.map((p, i) => {
      const g = (winkel(i) % 360 + 360) % 360;
      // Zwei Wörter («Caisse maladie», «Cassa malati») auf zwei Zeilen, ein zu langes Wort an seiner Trennstelle
      // (09.11.: «Krankenkasse» passte bei 13 px nicht in sein Feld). Wächter: alle 5 Sprachen passen (instrumenteZuhauseSpiegel).
      const zeilen = schildZeilen(kurz(p));
      const r = Math.abs(g - 90) < 20 ? 118 : Math.abs(g - 270) < 1 ? 92 : 96;
      const [x, y] = punkt(g, r);
      return h('text', { key: p.key, 'aria-hidden': true, x, y: y - (zeilen.length - 1) * SCHRIFT_IM_BILD * 0.55, textAnchor: 'middle', dominantBaseline: 'central',
        // Kontur in der Grundfarbe: auf halbdichtem Salbei reichte der Kontrast dunkel nicht (a11y-Prüfung 01.11.2026).
        style: { fontSize: SCHRIFT_IM_BILD + 'px', fontWeight: weight.semi, fill: schriftHell(p) ? palette.surface : palette.text, ...(schriftHell(p) ? {} : { stroke: palette.up, strokeWidth: 3, strokeLinejoin: 'round', paintOrder: 'stroke' }) } },
        zeilen.map((z, k) => h('tspan', { key: k, x, dy: k === 0 ? 0 : SCHRIFT_IM_BILD * 1.1 }, z)));
    }));

  const artText = (x) => x.art === 'kantonPflicht' ? t('netzSchild.art.kantonPflicht', { kanton: String(kanton || '').toUpperCase() }) : t('netzSchild.art.' + x.art);
  const klein = { fontSize: text.xs, color: palette.mid, lineHeight: leading.normal };
  const zahlen = (b) => betragText(b, t);
  const versZeile = (salbei) => (x) => h('div', { key: x.key, role: 'listitem', style: { fontSize: text.xs, padding: '1px 0 1px 4px', color: x.ok ? palette.text : palette.mid } },
    h('div', { style: { display: 'flex', alignItems: 'baseline', gap: '8px' } },
      h('span', { 'aria-hidden': true, style: { color: x.ok ? salbei : palette.mid, width: '14px', flexShrink: 0, textAlign: 'center' } }, hinweisZeichen(x.ok ? 'check' : 'kaestchen', 12)),
      h('span', { style: { minWidth: 0 } }, t('netzSchild.vers.' + x.key), ' ', h('span', { style: { color: palette.mid } }, '· ' + artText(x))),
      h('span', { style: { marginLeft: 'auto', color: x.ok ? salbei : palette.mid, whiteSpace: 'nowrap' } }, t(!x.ok ? 'netzSchild.nichtEingetragen' : x.abgeleitet ? 'netzSchild.lautAngaben' : 'netzSchild.eingetragen'))),
    zahlen(x.betrag) && h('div', { 'data-betrag': x.key, style: { color: palette.mid, paddingLeft: '24px', fontVariantNumeric: 'tabular-nums' } }, zahlen(x.betrag)));
  const hinweis = (teil, key) => h('p', { 'data-teil': teil, style: { ...klein, margin: '2px 0 0 24px' } }, hinweisZeichen(), t(key));
  const teilBlock = (p) => h('div', { key: p.key, 'data-gruppe': p.key, style: { marginBottom: space.xs + 'px' } },
    h('div', { style: { display: 'flex', alignItems: 'baseline', fontSize: text.sm, fontWeight: weight.semi, color: palette.text } },
      kurz(p), h('span', { style: { marginLeft: 'auto', fontSize: text.xs, fontWeight: weight.normal, color: palette.mid } }, stand(p))),
    h('div', { role: 'list', 'aria-label': kurz(p) }, p.versicherungen.map(versZeile(tonVon(p.key)))),
    p.key === 'uvg' && Number(stunden) > 0 && Number(stunden) < 8 && hinweis('unfall-8h', 'stundenlohnView.nbu_nurBeruf'),
    p.key === 'vorsorge' && p.versicherungen.some((x) => x.key === 'bvg' && !x.ok && x.betrag.guthaben) && hinweis('bvg-nur-guthaben', 'netzSchild.bvgNurGuthaben'),
    p.key === 'vorsorge' && p.versicherungen.some((x) => x.key === 'ahv' && !x.ok) && hinweis('ahv-hinweis', 'netzSchild.ahvHinweis'),
    p.key === 'haushalt' && h('p', { style: { ...klein, margin: '2px 0 0 24px' } }, t('netzSchild.haftpflichtHinweis')),
    p.key === 'haushalt' && HAUSRAT_PFLICHT.verify &&
      hinweis('hausrat-pruefen', 'netzSchild.hausratPruefen'));

  // Die Marke erklärt die Schraffur im Bild; das Wort steht im Satz daneben.
  const offenMarke = offen.length > 0 && h('svg', { 'aria-hidden': true, 'data-teil': 'netz-schild-offen-marke', viewBox: '0 0 44 44', width: 14, height: 14, style: { verticalAlign: '-2px', marginRight: '8px' } },
    h('rect', { width: 44, height: 44, fill: palette.sand, fillOpacity: 0.5 }), h('rect', { width: 44, height: 44, fill: 'url(#' + id('offen') + ')' }));
  const satz = [
    offen.length && t('netzSchild.nochOffen', { liste: offen.map((k) => t('netzSchild.kurz.' + k)).join(', ') }),
    teilweise.length && t('netzSchild.teilweise', { liste: teilweise.map((k) => t('netzSchild.kurz.' + k)).join(', ') }),
  ].filter(Boolean).join(' ') || t('netzSchild.ganz');

  if (groesse === 'klein') return h('div', { 'data-schild': 'netz', 'data-groesse': 'klein' }, bild);
  const satzZeile = h('p', { 'data-teil': 'netz-schild-satz', style: { fontSize: text.sm, color: palette.text, textAlign: 'center', margin: space.sm + 'px 0' } }, offenMarke, satz);
  if (groesse === 'mittel') return h('div', { 'data-schild': 'netz', 'data-groesse': 'mittel', style: { marginBottom: space.sm + 'px' } },
    bild, satzZeile,
    onZuhause && h('div', { style: { textAlign: 'center' } },
      h('button', { type: 'button', onClick: onZuhause, style: { ...linkStil(palette), minHeight: '44px', fontSize: text.sm } },
        t('ablauf.kapitelLink', { name: t('chapters.versicherungen.title') }))));

  return h('div', { 'data-schild': 'netz', 'data-groesse': 'gross', style: { marginBottom: space.sm + 'px' } },
    h('p', { style: { ...klein, margin: '0 0 ' + space.sm + 'px 0' } }, t('netzSchild.intro')),
    bild,
    satzZeile,
    // F7-K3-4 (Stebler Studios 01.11.2026): Das Schild ist die Antwort, die lange Liste liegt eingeklappt darunter.
    h('details', { 'data-teil': 'netz-schild-liste', style: { borderTop: '1px solid ' + palette.border + '88', borderBottom: '1px solid ' + palette.border + '88' } },
      // Der eigene Pfeil des Browsers zeigt offen/zu — kein Flex auf summary (A11y-Prüfung).
      h('summary', { style: { cursor: 'pointer', minHeight: '44px', paddingTop: '12px', fontSize: text.sm, fontWeight: weight.medium, color: palette.text } }, t('netzSchild.listeTitel')),
      h('div', { style: { maxWidth: '380px', margin: '0 auto' } }, teile.map(teilBlock))),
    st.bvgUnklar && h('p', { style: { ...klein, margin: space.sm + 'px 0 0' } },
      hinweisZeichen(), t(st.bvgUnklarGrund === 'dreizehnter' ? 'schutzschild.bvgUnklar13' : 'schutzschild.bvgUnklar', { schwelle: zahl(st.bvgSchwelle, { hoechstens: 2 }) })),
    st.bvgNa && h('p', { 'data-teil': 'bvg-na', style: { ...klein, margin: space.sm + 'px 0 0' } },
      hinweisZeichen(), t('schutzschild.bvgNa', { schwelle: zahl(st.bvgSchwelle, { hoechstens: 2 }) })));
};

export default NetzSchild;

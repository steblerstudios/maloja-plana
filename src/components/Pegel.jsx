import React from 'react';
import { PEGEL_SCALE } from '../data/pegel.js';
import { text, weight, space, radius, leading } from '../config/tokens.js';

// Der Pegel: EIN ruhiges Glas-Instrument (Flat + leichter Skeuomorphismus) für die
// ganze Frage-Familie „Einkommen relativ zu einer Linie". Zwei ehrliche Lesarten
// über denselben Gefäss-Metapher — keine neue Metapher pro Leistung:
//   variant 'luft'        → IPV: Wasser = Einkommen, Linie = Einkommensgrenze.
//                            Lücke über dem Wasser = „Luft" (Puffer). Über der
//                            Linie färbt sich der obere Teil sand — NIE rot.
//   variant 'aufstockung' → Sozialhilfe: Linie = Existenzminimum (Bedarf). Die
//                            Lücke wird schraffiert AUFGEFÜLLT — „du wirst gehoben",
//                            kein Defizit. Deckung = Einkommen erreicht den Bedarf.
// Reine Anzeige über calculateIPV / calculateSozialhilfe — keine eigene Rechnung.

const INNER_TOP = 20, INNER_BOTTOM = 135, INNER_H = INNER_BOTTOM - INNER_TOP; // 115
const LINE_Y = INNER_BOTTOM - (1 / PEGEL_SCALE) * INNER_H;                    // Referenz-Linie
const VESSEL = 'M32 16 L32 124 Q32 138 46 138 L82 138 Q96 138 96 124 L96 16';
const VESSEL_CLIP = 'M33 17 L33 123 Q33 137 46 137 L82 137 Q95 137 95 123 L95 17 Z';

const fmtCHF = (n) => 'CHF ' + Number(n || 0).toLocaleString('de-CH', { maximumFractionDigits: 0 });

export const Pegel = ({ palette, t, state }) => {
  const h = React.createElement;
  if (!state || !state.show) return null;
  const variant = state.variant || 'luft';
  const { mode, fraction } = state;
  const empty = mode === 'empty';
  const soz = variant === 'aufstockung';
  const uid = 'pegel-' + variant;

  const waterTopY = empty ? INNER_BOTTOM : INNER_BOTTOM - (fraction / PEGEL_SCALE) * INNER_H;
  const belowLine = waterTopY > LINE_Y + 0.5;   // Wasser-Oberkante unter der Linie
  const aboveLine = waterTopY < LINE_Y - 0.5;   // Wasser-Oberkante über der Linie
  // luft: Sandband über der Linie (Einkommen > Grenze). aufstockung: Aufstockung
  // füllt die Lücke von der Linie bis zur Wasser-Oberkante (Einkommen < Bedarf).
  const showSand = !soz && aboveLine;
  // Aufstockung nur im echten 'gap'-Modus füllen — bei 'vermoegen' (Ersparnisse
  // über dem Freibetrag) keine Aufstockung suggerieren.
  const showSupport = soz && belowLine && mode === 'gap';
  const showLuft = !soz && belowLine && !empty;
  const sageTopY = soz ? waterTopY : Math.max(waterTopY, LINE_Y);
  const lineLabel = soz ? t('pegel.bedarf') : t('pegel.grenze');

  const svg = h('svg', { viewBox: '0 0 128 152', width: 112, height: 133, 'aria-hidden': true, style: { flexShrink: 0 } },
    h('defs', null,
      h('clipPath', { id: uid + '-clip' }, h('path', { d: VESSEL_CLIP })),
      soz && h('pattern', { id: uid + '-hatch', width: 6, height: 6, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' },
        h('rect', { width: 6, height: 6, fill: palette.sage, opacity: 0.16 }),
        h('line', { x1: 0, y1: 0, x2: 0, y2: 6, stroke: palette.sage, strokeWidth: 2, opacity: 0.5 })
      )
    ),
    !empty && h('g', { clipPath: 'url(#' + uid + '-clip)' },
      // luft: Sandband über der Linie
      showSand && h('rect', { x: 33, y: waterTopY, width: 62, height: LINE_Y - waterTopY, fill: palette.sand, opacity: 0.55 }),
      // aufstockung: schraffierte Aufstockung von der Linie bis zur Wasser-Oberkante
      showSupport && h('rect', { x: 33, y: LINE_Y, width: 62, height: waterTopY - LINE_Y, fill: 'url(#' + uid + '-hatch)' }),
      // Einkommen (sage)
      h('rect', { x: 33, y: sageTopY, width: 62, height: INNER_BOTTOM - sageTopY + 2, fill: palette.sage, opacity: 0.82 }),
      // Meniskus
      h('rect', { x: 33, y: waterTopY - 1.5, width: 62, height: 3, fill: palette.surface, opacity: 0.3 })
    ),
    !empty && h('rect', { x: 38, y: 24, width: 5, height: 78, rx: 2.5, fill: palette.surface, opacity: 0.4 }),
    h('path', { d: VESSEL, fill: 'none', stroke: empty ? palette.border : palette.soft, strokeWidth: 2, strokeLinecap: 'round', strokeDasharray: empty ? '4 4' : 'none' }),
    // Referenz-Linie
    h('line', { x1: 24, y1: LINE_Y, x2: 104, y2: LINE_Y, stroke: palette.skyDeep, strokeWidth: 1.8, strokeDasharray: '5 3', opacity: empty ? 0.5 : 1 }),
    h('text', { x: 104, y: LINE_Y - 5, textAnchor: 'end', fontSize: 8.5, fontWeight: 700, fill: palette.skyDeep }, lineLabel),
    // Aufstockungs-Label (nur wenn Lücke gefüllt)
    showSupport && h('text', { x: 35, y: (LINE_Y + waterTopY) / 2 + 3, fontSize: 8, fontWeight: 700, fill: palette.sageDeep }, t('pegel.aufstockung')),
    // „Luft"-Klammer (nur IPV, drunter)
    showLuft && h('g', null,
      h('line', { x1: 100, y1: LINE_Y, x2: 100, y2: waterTopY, stroke: palette.mid, strokeWidth: 1.2 }),
      h('line', { x1: 97, y1: LINE_Y, x2: 103, y2: LINE_Y, stroke: palette.mid, strokeWidth: 1.2 }),
      h('line', { x1: 97, y1: waterTopY, x2: 103, y2: waterTopY, stroke: palette.mid, strokeWidth: 1.2 }),
      h('text', { x: 108, y: (LINE_Y + waterTopY) / 2 + 3, fontSize: 8, fill: palette.mid }, t('pegel.luft'))
    ),
    h('line', { x1: 30, y1: 146, x2: 98, y2: 146, stroke: palette.border, strokeWidth: 3, strokeLinecap: 'round' })
  );

  // ── Ablesung ──
  const title = soz ? t('nav.sozialhilfe') : t('schnellcheck.ipv');
  const hasAmount = !empty && (soz ? mode === 'gap' : (mode === 'clear' || mode === 'edge'));
  const headline = soz ? t('pegel.deckt', { amount: fmtCHF(state.amount) })
    : t('pegel.perMonthPossible', { amount: fmtCHF(state.amount) });
  const statusText = empty ? t('pegel.empty')
    : soz ? (mode === 'gap' ? t('pegel.gap') : mode === 'vermoegen' ? t('pegel.vermoegen') : t('pegel.covered'))
    : (mode === 'clear' ? t('pegel.clear') : mode === 'edge' ? t('pegel.edge') : t('pegel.over'));
  const statusColor = empty ? palette.mid
    : (soz ? (mode === 'gap' ? palette.sageDeep : palette.mid)
      : (mode === 'over' ? palette.sandDeep : mode === 'edge' ? palette.sandDeep : palette.sageDeep));

  const readout = h('div', { style: { flex: 1, minWidth: 0 } },
    h('div', { style: { fontSize: text.xs, color: palette.mid, fontWeight: weight.medium, marginBottom: '4px' } }, title),
    hasAmount ? h('div', { style: { fontSize: text.xl, fontWeight: weight.bold, color: palette.sageDeep, lineHeight: leading.tight, marginBottom: '4px' } }, headline) : null,
    h('div', { style: { fontSize: text.sm, color: statusColor, lineHeight: leading.normal } }, statusText),
    // In-Card-Disclaimer wie beim Prämien-Beleg — sobald ein CHF-Betrag steht,
    // ihn sichtbar als Schätzung/Orientierung markieren (nicht nur der Seiten-Fuss).
    hasAmount ? h('div', { style: { fontSize: text.xs, color: palette.soft, marginTop: '4px' } }, t('beleg.geschaetzt')) : null
  );

  return h('div', {
    style: {
      display: 'flex', alignItems: 'center', gap: space.md + 'px',
      padding: space.md + 'px', marginTop: space.md + 'px', marginBottom: space.md + 'px',
      background: palette.up, borderRadius: radius.sm + 'px', border: '1px solid ' + palette.border,
    },
    role: 'img',
    'aria-label': title + ' — ' + (hasAmount ? headline + ' — ' : '') + statusText,
  }, svg, readout);
};

export default Pegel;

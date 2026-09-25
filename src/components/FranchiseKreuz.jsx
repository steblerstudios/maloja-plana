import React, { useState, useRef, useEffect } from 'react';
import { kreuzState } from '../data/franchiseTacho.js';
import { text, weight, leading, space } from '../config/tokens.js';
import { zahl } from '../utils/geld.js';

// Franchise-Kreuz (seit 25.09.2026, ersetzt den Franchise-Tacho). Die Frage «lohnt sich die
// hohe oder die tiefe Franchise?» als das, was sie ist: zwei Gesamtkosten-Linien (Prämie ×12 +
// Eigenanteil) über den Gesundheitskosten, die sich beim Break-even kreuzen. Rechnung:
// kreuzState() in data/franchiseTacho.js — dieselben Kurven, mit denen PraemienOrientierung
// den Break-even sucht.
//
// Kodierung (Skill dataviz, Farben mit validate_palette.js geprüft, 25.09.2026):
//   • hohe Franchise = sky, ● am Linienende · tiefe Franchise = sand, ■ am Linienende.
//     Salbei/Sand fiel durch (ΔE 9 normal, zu ähnlich); sky/sand trägt in hell UND dunkel
//     (ΔE 16,8 normal, 14,0 Protan). Sand liegt hell unter 3:1 → Namen stehen direkt an den Linien.
//   • Beschriftungen in Text-Farben, nie in der Linienfarbe; die Form am Ende trägt die Identität.
//   • Flächen links/rechts vom Break-even nur leise getönt (0.08), Legende darunter wie beim Tacho.
//   • Strich = Kosten BISHER (durchgezogen) · Hochrechnung aufs Jahr gestrichelt, als Schätzung.
//   • Hover: Fadenkreuz mit beiden Gesamtkosten an der Stelle.
// Breite = echte Breite (300–560 px): die Zeichenfläche wird nie skaliert, Schrift bleibt ≥ 11 px.
// Unter 420 px (Handy): Namen der Linien über den Enden statt rechts daneben (R schrumpft).
const W_MAX = 560, W_MIN = 240, H = 236, T = 22, B = 34;

export const FranchiseKreuz = ({ palette, t, franchiseOpt, costs, onNavigate, heute }) => {
  const [hoverC, setHoverC] = useState(null);
  const [W, setW] = useState(W_MAX);
  const huelle = useRef(null);
  useEffect(() => {
    const el = huelle.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(([e]) => setW(Math.max(W_MIN, Math.min(W_MAX, Math.round(e.contentRect.width)))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const st = kreuzState(franchiseOpt, costs, heute);
  if (!st.show) return null;
  const h = React.createElement;
  const num = (n) => zahl(Math.round(n || 0));

  const schmal = W < 420;
  const L = schmal ? 36 : 44, R = schmal ? 14 : 104;
  const x = (c) => L + (c / st.scaleMax) * (W - L - R);
  const y = (v) => T + (1 - (v - st.yMin) / (st.yMax - st.yMin)) * (H - T - B);
  const linie = (key) => st.kurve.map((p) => x(p.c).toFixed(1) + ',' + y(p[key]).toFixed(1)).join(' ');
  const ende = st.kurve[st.kurve.length - 1];
  const farbeHoch = palette.sky, farbeTief = palette.sand;
  // Namen am Linienende mindestens 16 px auseinander, damit sie sich nicht überdecken.
  const labelY = (() => {
    let a = y(ende.tief), b = y(ende.hoch);
    if (Math.abs(a - b) < 16) { const m = (a + b) / 2, s = a <= b ? -8 : 8; a = m + s; b = m - s; }
    return { tief: a, hoch: b };
  })();

  const readout =
    st.mode === 'orientation' ? t('po.kreuzOrientation')
    : st.mode === 'below' ? t('po.tachoReadoutBelow', { costs: num(st.costs), be: num(st.breakEven), high: num(st.high) })
    : t('po.tachoReadoutAbove', { costs: num(st.costs), be: num(st.breakEven), low: num(st.low) });
  const readoutColor = st.mode === 'below' ? (palette.sageDeep || palette.sage) : st.mode === 'above' ? palette.sandDeep : palette.mid;

  const senkrecht = (key, c, farbe, strich, label, oben) => c != null && c <= st.scaleMax && h('g', { key },
    h('line', { x1: x(c), x2: x(c), y1: T, y2: H - B, stroke: farbe, strokeWidth: strich ? 1.5 : 2, strokeDasharray: strich || undefined }),
    h('text', { x: x(c) + 4, y: oben, fontSize: 11, fill: palette.text }, label));

  // Hover: Stelle unter der Maus → Gesamtkosten beider Franchisen dort.
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * W;
    const c = Math.max(0, Math.min(st.scaleMax, ((px - L) / (W - L - R)) * st.scaleMax));
    setHoverC(Math.round(c / 50) * 50);
  };
  const hv = hoverC != null ? st.gesamtBei(hoverC) : null;

  const swatch = (color, label, form) => h('span', {
    key: label, style: { display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: text.xs, color: palette.mid },
  },
    h('span', { 'aria-hidden': true, style: { width: '10px', height: '10px', borderRadius: form === 'kreis' ? '50%' : '2px', background: color, flexShrink: 0 } }),
    label);

  return h('div', { ref: huelle, style: { marginBottom: space.md + 'px' } },
    h('svg', {
      viewBox: '0 0 ' + W + ' ' + H, width: W, height: H, role: 'img',
      'aria-label': t('po.kreuzAria', { low: num(st.low), high: num(st.high), be: num(st.breakEven) }),
      style: { display: 'block', maxWidth: '100%', margin: '0 auto', overflow: 'visible', touchAction: 'pan-y' },
      onMouseMove: onMove, onMouseLeave: () => setHoverC(null),
    },
      // leise Zonen: links hohe, rechts tiefe Franchise günstiger
      h('rect', { x: L, y: T, width: x(st.breakEven) - L, height: H - T - B, fill: farbeHoch, opacity: 0.08 }),
      h('rect', { x: x(st.breakEven), y: T, width: x(st.scaleMax) - x(st.breakEven), height: H - T - B, fill: farbeTief, opacity: 0.08 }),
      // Achsen: Grundlinie, Enden beschriftet
      h('line', { x1: L, x2: x(st.scaleMax), y1: H - B + 0.5, y2: H - B + 0.5, stroke: palette.border }),
      h('text', { x: L, y: H - B + 16, fontSize: 11, fill: palette.mid }, '0'),
      h('text', { x: x(st.scaleMax), y: H - B + 16, fontSize: 11, fill: palette.mid, textAnchor: 'end' }, num(st.scaleMax)),
      h('text', { x: (L + x(st.scaleMax)) / 2, y: H - 4, fontSize: 11, fill: palette.mid, textAnchor: 'middle' }, t('po.kreuzAchse') + ' (CHF)'),
      h('text', { x: L - 6, y: T + 4, fontSize: 11, fill: palette.mid, textAnchor: 'end' }, num(st.yMax)),
      h('text', { x: L - 6, y: H - B, fontSize: 11, fill: palette.mid, textAnchor: 'end' }, num(st.yMin)),
      h('text', { x: L, y: T - 8, fontSize: 11, fill: palette.mid }, t('po.kreuzKosten')),
      // Break-even
      // Break-even: Beschriftung unten im Feld, damit sie keine Linie überdeckt
      senkrecht('be', st.breakEven, palette.mid, '4 4', t('po.tachoBreakeven') + ' ≈ ' + num(st.breakEven), H - B - 8),
      // die zwei Linien, 2 px, Enden mit Form + Name
      h('polyline', { points: linie('tief'), fill: 'none', stroke: farbeTief, strokeWidth: 2, strokeLinejoin: 'round' }),
      h('polyline', { points: linie('hoch'), fill: 'none', stroke: farbeHoch, strokeWidth: 2, strokeLinejoin: 'round' }),
      h('rect', { x: x(ende.c) - 4, y: y(ende.tief) - 4, width: 8, height: 8, fill: farbeTief, stroke: palette.surface, strokeWidth: 2 }),
      h('circle', { cx: x(ende.c), cy: y(ende.hoch), r: 4.5, fill: farbeHoch, stroke: palette.surface, strokeWidth: 2 }),
      schmal
        ? h('text', { x: x(ende.c) - 8, y: labelY.tief + 16, fontSize: 11, fill: palette.text, textAnchor: 'end' }, num(st.low))
        : h('text', { x: x(ende.c) + 10, y: labelY.tief + 4, fontSize: 12, fill: palette.text }, t('po.kreuzLinie', { franchise: num(st.low) })),
      schmal
        ? h('text', { x: x(ende.c) - 8, y: labelY.hoch - 8, fontSize: 11, fill: palette.text, textAnchor: 'end' }, num(st.high))
        : h('text', { x: x(ende.c) + 10, y: labelY.hoch + 4, fontSize: 12, fill: palette.text }, t('po.kreuzLinie', { franchise: num(st.high) })),
      // eigene Kosten: bisher (durchgezogen) · Hochrechnung (gestrichelt, Schätzung)
      st.costs > 0 && senkrecht('bisher', Math.min(st.costs, st.scaleMax), palette.text, null, t('po.kreuzBisher') + ' ' + num(st.costs), T + 12),
      st.hochrechnung && senkrecht('hoch', st.hochrechnung, palette.text, '2 3', t('po.kreuzHochrechnung') + ' ≈ ' + num(st.hochrechnung), T + 26),
      // Hover-Fadenkreuz
      hv && h('g', { pointerEvents: 'none' },
        h('line', { x1: x(hoverC), x2: x(hoverC), y1: T, y2: H - B, stroke: palette.mid, strokeWidth: 1 }),
        h('circle', { cx: x(hoverC), cy: y(hv.tief), r: 3.5, fill: farbeTief }),
        h('circle', { cx: x(hoverC), cy: y(hv.hoch), r: 3.5, fill: farbeHoch }))
    ),
    h('div', { style: { display: 'flex', justifyContent: 'center', gap: space.md + 'px', flexWrap: 'wrap', margin: space.xs + 'px 0 ' + space.sm + 'px' } },
      swatch(farbeHoch, t('po.tachoLegendHigh'), 'kreis'),
      swatch(farbeTief, t('po.tachoLegendLow'), 'quadrat')),
    // Hover-/Tipp-Wert als Text unter der Grafik (bricht auf dem Handy um); Höhe reserviert,
    // damit nichts springt.
    h('div', { style: { minHeight: '1.4em', fontSize: text.xs, color: palette.text, textAlign: 'center', marginBottom: space.xs + 'px', fontVariantNumeric: 'tabular-nums' } },
      hv ? t('po.kreuzTooltip', { c: num(hoverC), low: num(st.low), tief: num(hv.tief), high: num(st.high), hoch: num(hv.hoch) }) : ''),
    h('div', { 'aria-live': 'polite', style: { fontSize: text.sm, color: readoutColor, lineHeight: leading.normal, textAlign: 'center' } }, readout),
    st.hochrechnung && h('div', { style: { fontSize: text.xs, color: palette.mid, lineHeight: leading.normal, textAlign: 'center', marginTop: space.xs + 'px' } },
      t('po.kreuzHochrechnungText', { value: num(st.hochrechnung) })),
    st.mode === 'orientation' && onNavigate && h('button', {
      onClick: () => onNavigate('kvg', null, 'franchise'),
      style: { display: 'block', margin: space.xs + 'px auto 0', background: 'none', border: 'none', cursor: 'pointer', padding: '8px 0', fontSize: text.sm, color: palette.sandDeep, fontFamily: 'inherit', fontWeight: weight.medium },
    }, t('po.tachoTrackLink'))
  );
};

export default FranchiseKreuz;

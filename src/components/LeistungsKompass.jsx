import React from 'react';
import { kompassBearing } from '../data/leistungsKompass.js';
import { text, weight, space, leading } from '../config/tokens.js';

// Leistungs-Kompass: das zweite „Instrument". Liest den bestehenden Schnellcheck
// als Peilung (kompassBearing) — misst nichts, zeigt eine Richtung. Die farbige
// Nadelspitze zeigt bei gefundenen Leistungen auf „Leistungen" (Norden), sonst
// auf „weitere Wege" (Süden); ohne Einkommen ruht sie. Ruhig, kein Alarm.
// Die detaillierten Leistungs-Zeilen bleiben darunter erhalten.
const CX = 100, CY = 100, R = 78;

export const LeistungsKompass = ({ palette, t, benefitCount = 0, topLabel, hasIncome }) => {
  const h = React.createElement;
  const { state, bearing } = kompassBearing({ hasIncome, benefitCount });

  // Farbe der Spitze je Zustand (sage = Leistungen da, sky = weitere Wege, mid = Ruhe).
  const northColor = state === 'found' ? palette.sage : state === 'none' ? palette.sky : palette.mid;
  const southColor = palette.mid;
  const northOpacity = state === 'idle' ? 0.5 : 1;

  const caption =
    state === 'idle' ? t('schnellcheck.kompassIdle')
    : state === 'found' ? (benefitCount === 1
        ? t('schnellcheck.kompassFoundOne', { top: topLabel || '' })
        : t('schnellcheck.kompassFound', { n: benefitCount, top: topLabel || '' }))
    : t('schnellcheck.kompassNone');
  const captionColor = state === 'found' ? palette.sage : state === 'none' ? palette.skyDeep : palette.mid;

  const tick = (deg, len) => {
    const a = (deg - 90) * Math.PI / 180;
    const r2 = R, r1 = R - len;
    return h('line', {
      key: 'tk' + deg,
      x1: CX + r1 * Math.cos(a), y1: CY + r1 * Math.sin(a),
      x2: CX + r2 * Math.cos(a), y2: CY + r2 * Math.sin(a),
      stroke: palette.border, strokeWidth: deg % 90 === 0 ? 2 : 1,
    });
  };

  // Grafik dekorativ (aria-hidden) — die Peilung steht als sichtbarer Text
  // direkt darunter und ist die a11y-Quelle (kein Doppel-Vorlesen).
  const rose = h('svg', {
    viewBox: '0 0 200 210', width: '100%',
    style: { maxWidth: '220px', height: 'auto', display: 'block', margin: '0 auto', overflow: 'visible' },
    'aria-hidden': true,
  },
    h('circle', { cx: CX, cy: CY, r: R, fill: 'none', stroke: palette.border, strokeWidth: 2 }),
    [0, 45, 90, 135, 180, 225, 270, 315].map(d => tick(d, d % 90 === 0 ? 12 : 7)),
    // Peilungs-Beschriftung: Norden = Leistungen, Süden = weitere Wege
    h('text', { x: CX, y: CY - R - 8, textAnchor: 'middle', style: { fontSize: '12px', fill: state === 'found' ? palette.sage : palette.mid, fontWeight: weight.medium } }, t('schnellcheck.kompassLeistungen')),
    h('text', { x: CX, y: CY + R + 18, textAnchor: 'middle', style: { fontSize: '12px', fill: state === 'none' ? palette.skyDeep : palette.mid, fontWeight: weight.medium } }, t('schnellcheck.kompassWege')),
    // Nadel: farbige Spitze (Peilung) + gedämpftes Gegenende, um bearing gedreht
    h('g', { transform: 'rotate(' + bearing + ' ' + CX + ' ' + CY + ')' },
      h('polygon', { points: CX + ',' + (CY - R + 16) + ' ' + (CX + 7) + ',' + CY + ' ' + (CX - 7) + ',' + CY, fill: northColor, opacity: northOpacity }),
      h('polygon', { points: CX + ',' + (CY + R - 22) + ' ' + (CX + 7) + ',' + CY + ' ' + (CX - 7) + ',' + CY, fill: southColor, opacity: 0.4 })
    ),
    h('circle', { cx: CX, cy: CY, r: 6, fill: palette.surface, stroke: palette.mid, strokeWidth: 2 })
  );

  return h('div', { style: { marginBottom: space.md + 'px' } },
    rose,
    h('div', { style: { fontSize: text.sm, color: captionColor, lineHeight: leading.normal, textAlign: 'center', marginTop: space.sm + 'px' } }, caption)
  );
};

export default LeistungsKompass;

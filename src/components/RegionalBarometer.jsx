import React from 'react';
import { text, weight, space, leading } from '../config/tokens.js';
import { renderSource } from '../utils/renderSource.js';

// Ruhiges Regional-Barometer im Stil der „KK-Last"-Karte. Encoding (die Inhaberin):
//   • Füllung  = eigener Wert (deine Prämie/Miete) — wie bei KK-Last die eigene Last
//   • Punkt    = Regions-Durchschnitt
//   • Strich   = Schweizer Schnitt (Referenz-Marke, wie der 10%-WHO-Strich)
// Bewusst calm — eine Abweichung ist eine strukturelle Tatsache, kein Alarm.
// Ohne eigenen Wert füllt der Balken bis zum Regions-Durchschnitt (kein leerer Balken).
//
// Props:
//   palette, t           — Theme + Übersetzer
//   comparison           — { regional, national, diffPct, year, ... } aus getRegionalComparison
//   userValue            — (optional) eigener Wert (Prämie/Miete) → Füllung „wo wir sind"
//   kind                 — 'premium' | 'rent' (wählt Titel/Quelle/Text), Default 'premium'
//   compact (optional)   — etwas dichter, ohne Titel (für Einbettung ins Budget)
export const RegionalBarometer = ({ palette, t, comparison, userValue, kind = 'premium', compact }) => {
  if (!comparison) return null;
  const { regional, national, diffPct, year } = comparison;
  const ns = 'po.regionalCompare.';
  const k = ns + kind + '.';

  const hasUser = userValue != null && userValue > 0;
  // Skala mit etwas Luft nach oben, gerundet — Schweizer Schnitt sitzt als Marke darauf.
  const maxVal = Math.max(regional, national, hasUser ? userValue : 0);
  const scaleMax = Math.ceil((maxVal * 1.15) / 50) * 50 || 50;
  const pct = (v) => Math.max(0, Math.min(100, (v / scaleMax) * 100));
  const nationalPct = pct(national);
  const regionalPct = pct(regional);

  const rounded = Math.round(diffPct);
  const dir = rounded > 0 ? 'above' : rounded < 0 ? 'below' : 'equal';
  // Warmer, nicht-alarmierender Ton (Region vs. Schweiz): drüber=gold, drunter=sage, ≈=mid.
  const accent = dir === 'above' ? palette.gold : dir === 'below' ? palette.sage : palette.mid;

  // Füllung = eigener Wert (sky = „du"); ohne eigenen Wert = Regions-Schnitt (accent).
  const fillPct = hasUser ? pct(userValue) : regionalPct;
  const fillColor = hasUser ? palette.sky : accent;

  const diffText = t(ns + dir, { pct: Math.abs(rounded) });
  let ariaLabel = t(ns + 'aria', {
    regional: regional.toFixed(0), national: national.toFixed(0), diff: diffText,
  });
  if (hasUser) ariaLabel += ' ' + t(k + 'yourVal', { amount: userValue.toFixed(0) });

  return React.createElement('div', { style: { marginTop: compact ? space.sm + 'px' : space.md + 'px' } },
    !compact && React.createElement('div', {
      style: { fontWeight: weight.semi, marginBottom: space.sm + 'px', fontSize: text.sm },
    }, t(k + 'title')),

    // Balken: Füllung (eigener Wert) + Punkt (Region) + Strich (Schweizer Schnitt)
    React.createElement('div', {
      role: 'img', 'aria-label': ariaLabel,
      style: { position: 'relative', height: '10px', background: palette.border, borderRadius: '5px', marginBottom: '12px' },
    },
      // Füllung = eigener Wert
      React.createElement('div', { style: { height: '100%', width: fillPct + '%', background: fillColor, borderRadius: '5px' } }),
      // Punkt = Regions-Durchschnitt (nur wenn die Füllung den eigenen Wert zeigt)
      hasUser && React.createElement('div', {
        style: {
          position: 'absolute', top: '-1px', left: regionalPct + '%', marginLeft: '-6px',
          width: '12px', height: '12px', borderRadius: '50%', background: accent,
          border: '2px solid ' + palette.surface,
        },
      }),
      // Strich = Schweizer Schnitt (Referenz-Marke wie der 10%-Strich). Ragt bewusst oben
      // über den Balken hinaus, damit er auch dann sichtbar bleibt, wenn er fast auf dem
      // Regions-Punkt liegt (Region und Schweizer Schnitt sind nicht immer am selben Ort) —
      // die dunkle Linie ragt dann klar über den farbigen Punkt.
      React.createElement('div', { style: { position: 'absolute', top: '-9px', bottom: '-3px', left: nationalPct + '%', width: '2px', background: palette.text } }),
    ),

    // Werte als Marken (Farben = Encoding)
    React.createElement('div', {
      style: { display: 'flex', justifyContent: 'space-between', fontSize: text.xs, color: palette.mid },
    },
      React.createElement('span', null, t(ns + 'nationalVal', { amount: national.toFixed(0) })),
      React.createElement('span', { style: { color: accent } }, '● ' + t(ns + 'regionalVal', { amount: regional.toFixed(0) })),
    ),
    hasUser && React.createElement('div', {
      style: { fontSize: text.xs, color: palette.skyDeep, marginTop: '2px', fontWeight: weight.medium },
    }, t(k + 'yourVal', { amount: userValue.toFixed(0) })),

    // Prozentuale Abweichung (Region vs. Schweiz)
    React.createElement('div', {
      style: { fontSize: text.sm, color: accent, fontWeight: weight.medium, marginTop: space.sm + 'px', lineHeight: leading.normal },
    }, diffText),

    // Strukturelle Einordnung (neutral, kein Vorwurf) — nur wenn merklich drüber
    dir === 'above' && React.createElement('div', {
      style: { fontSize: text.xs, color: palette.mid, marginTop: space.xs + 'px', lineHeight: leading.normal },
    }, t(k + 'structural')),

    // Quelle
    React.createElement('div', {
      style: { fontSize: text.xs, color: palette.soft, marginTop: space.xs + 'px', fontStyle: 'italic' },
    }, renderSource(t(k + 'source', { year }))),
  );
};

export default RegionalBarometer;

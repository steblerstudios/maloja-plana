import React from 'react';
import { text, weight, radius, space, leading } from '../config/tokens.js';
import { bereichColor } from '../data/lebensbereiche.js';
import { lohnBandState } from '../data/lohnEinordnung.js';
import { renderSource } from '../utils/renderSource.js';

// „Wo steht Ihr Lohn?" — spiegelgleich zum Miet-Barometer (components/MietVergleich).
// Gleiche Grammatik, andere Domäne. Encoding: docs/design/farb-und-daten-system.md
//   • Füllung = dein Lohn, in der Frucht-Farbe des Bereichs Arbeit (Haselnuss)
//   • ● Punkt = Median, gefärbt nach DEINER Lage (sage = darüber, gold = darunter)
//   • | Strich = Durchschnitt, neutral
//   • ! = der kantonale Mindestlohn-Boden. Graphit normal, rose nur wenn unterschritten.

// Balken + Marken. Bewusst ohne positionierte Labels — die Werte stehen als Zeile darunter,
// sonst überlappen sie sich auf schmalen Geräten.
const Barometer = ({ palette, value, fillColor, marks, scaleMin, scaleMax, ariaLabel }) => {
  const pct = (v) => Math.max(0, Math.min(100, ((v - scaleMin) / (scaleMax - scaleMin)) * 100));
  return React.createElement('div', {
    role: 'img', 'aria-label': ariaLabel,
    style: { position: 'relative', height: '10px', background: palette.border, borderRadius: '5px', marginBottom: '12px' },
  },
    React.createElement('div', {
      style: { height: '100%', width: pct(value) + '%', background: fillColor, borderRadius: '5px' },
    }),
    marks.map((m, i) => {
      const left = pct(m.value) + '%';
      if (m.form === 'dot') {
        return React.createElement('div', {
          key: i,
          style: {
            position: 'absolute', top: '-1px', left, marginLeft: '-6px',
            width: '12px', height: '12px', borderRadius: '50%', background: m.color,
            border: '1.5px solid ' + palette.surface,
          },
        });
      }
      if (m.form === 'line') {
        return React.createElement('div', {
          key: i,
          style: { position: 'absolute', top: '-9px', bottom: '-3px', left, width: '2px', background: m.color },
        });
      }
      // exclaim — die harte Schwelle
      return React.createElement('div', {
        key: i,
        style: {
          position: 'absolute', top: '-15px', height: '28px', left, marginLeft: '-4px',
          width: '8px', textAlign: 'center', lineHeight: '28px', fontSize: '24px',
          fontWeight: 700, pointerEvents: 'none', color: m.color,
          textShadow: '0 0 2px ' + palette.surface + ', 0 0 2px ' + palette.surface,
        },
      }, '!');
    })
  );
};

// `embedded`: ohne eigene Karte rendern — für Orte, die schon in einer `palette.up`-Karte
// sitzen (Finanz-Übersicht). Sonst läge Karte auf Karte und die Kante verschwände.
export const LohnEinordnung = ({ palette, t, data, isDarkMode, embedded }) => {
  const state = lohnBandState({
    income: data?.finanzen?.monthlyIncome,
    canton: data?.basis?.canton,
    hoursPerWeek: data?.ausbildung?.workHoursPerWeek,
  });

  const card = embedded
    ? { fontSize: text.sm }
    : { padding: '12px', background: palette.up, borderRadius: radius.sm, fontSize: text.sm };

  if (!state.show) {
    return React.createElement('div', { style: card },
      React.createElement('div', { style: { fontWeight: weight.semi, color: palette.text, marginBottom: '4px' } }, t('lohnEinordnung.title')),
      React.createElement('div', { style: { color: palette.mid, lineHeight: leading.normal } }, t('lohnEinordnung.empty'))
    );
  }

  const { incomeFTE, income, partTime, hoursKnown, hoursPerWeek, rel, median, durchschnitt, mindestlohn, scaleMin, scaleMax } = state;
  const arbeitColor = bereichColor('arbeit', isDarkMode);

  // WAHRHEITS-DISZIPLIN: Ohne erfasste Wochenstunden ist nicht bestimmbar, ob der
  // Mindestlohn unterschritten ist — CHF 3000 bei 50% sind CHF 32.97/Std., nicht 16.48.
  // Das „!" bleibt dann graphit. (Gleicher Grundsatz wie lohnCheck.pruefeStundenlohn.)
  const mlBreached = !!mindestlohn && hoursKnown && incomeFTE < mindestlohn.monat;

  // Valenz statt Richtung: gold ist die „engere Seite" — beim Lohn also darunter.
  const valenceColor = rel === 'above' ? palette.sage : rel === 'below' ? palette.gold : palette.mid;
  const readoutColor = rel === 'above' ? palette.sageDeep : rel === 'below' ? palette.goldDeep : palette.mid;

  const marks = [
    { value: median, form: 'dot', color: valenceColor },
    { value: durchschnitt, form: 'line', color: palette.mid },
  ];
  if (mindestlohn && mindestlohn.monat < scaleMax) {
    marks.unshift({ value: mindestlohn.monat, form: 'exclaim', color: mlBreached ? palette.roseDeep : palette.text });
  }

  const fmt = (n) => Math.round(n).toLocaleString('de-CH');

  return React.createElement('div', { style: card },
    React.createElement('div', {
      style: { fontWeight: weight.semi, color: palette.text, marginBottom: space.sm + 'px' },
    }, t('lohnEinordnung.title')),

    React.createElement(Barometer, {
      palette, value: Math.min(incomeFTE, scaleMax), fillColor: arbeitColor, marks, scaleMin, scaleMax,
      ariaLabel: t('lohnEinordnung.aria', { amount: fmt(incomeFTE), median: fmt(median) }),
    }),

    // Werte-Zeile — die Marken zum Nachlesen, in denselben Farben wie auf dem Balken.
    React.createElement('div', {
      style: { display: 'flex', justifyContent: 'space-between', fontSize: text.xs, color: palette.mid },
    },
      React.createElement('span', null, t('lohnEinordnung.durchschnitt') + ': CHF ' + fmt(durchschnitt)),
      React.createElement('span', { style: { color: valenceColor } }, '● ' + t('lohnEinordnung.median') + ': CHF ' + fmt(median))
    ),

    React.createElement('div', {
      style: { fontSize: text.xs, color: palette.text, marginTop: '2px', fontWeight: weight.medium },
    }, t('lohnEinordnung.yourWage', { amount: fmt(incomeFTE) })),

    React.createElement('div', {
      style: { fontSize: text.sm, color: readoutColor, fontWeight: weight.medium, marginTop: space.sm + 'px', lineHeight: leading.normal },
    }, t('lohnEinordnung.readout' + rel.charAt(0).toUpperCase() + rel.slice(1))),

    // Wie der Vergleich zustande kommt — ehrlich, je nach Datenlage.
    React.createElement('div', {
      style: { fontSize: text.xs, color: palette.mid, marginTop: space.xs + 'px', lineHeight: leading.normal },
    }, partTime
      ? t('lohnEinordnung.fteNote', { hours: hoursPerWeek, fte: fmt(incomeFTE), actual: fmt(income) })
      : hoursKnown ? t('lohnEinordnung.fulltimeNote') : t('lohnEinordnung.hoursUnknownNote')),

    mindestlohn && React.createElement('div', {
      style: { fontSize: text.xs, color: mlBreached ? palette.roseDeep : palette.mid, marginTop: space.xs + 'px', lineHeight: leading.normal },
    }, t('lohnEinordnung.mindestlohnLine', { amount: fmt(mindestlohn.monat), stunde: mindestlohn.chfStunde.toFixed(2), jahr: mindestlohn.jahr })),

    React.createElement('div', {
      style: { fontSize: text.xs, color: palette.soft, marginTop: space.xs + 'px', fontStyle: 'italic' },
    }, renderSource(t('lohnEinordnung.source', { median: fmt(median), durchschnitt: fmt(durchschnitt) })))
  );
};

export default LohnEinordnung;

import React from 'react';
import { text, weight, radius, space, leading } from '../config/tokens.js';
import { bereichFillColor } from '../data/lebensbereiche.js';
import { lohnBandState, LOHN_REFERENZ } from '../data/lohnEinordnung.js';
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
      // exclaim — die harte Schwelle.
      // Deckender Ring statt weichem Blur (Predeploy-Runde 8, zweite Batterie): Liegt der
      // Lohn ÜBER dem Boden — der Normalfall —, läuft die Füllung über das „!" hinweg, und
      // Graphit auf Frucht trägt im Dunkelmodus nur 1.70–1.89:1. Derselbe Ring wie am
      // ●-Punkt (`1.5px solid palette.surface`) trennt es sauber: 4.01–4.05:1.
      // `paintOrder: stroke fill` legt den Ring unter die Glyphe; `textShadow` bleibt Rückfall.
      return React.createElement('div', {
        key: i,
        style: {
          position: 'absolute', top: '-15px', height: '28px', left, marginLeft: '-4px',
          width: '8px', textAlign: 'center', lineHeight: '28px', fontSize: '24px',
          fontWeight: 700, pointerEvents: 'none', color: m.color,
          WebkitTextStrokeWidth: '2px',
          WebkitTextStrokeColor: palette.surface,
          paintOrder: 'stroke fill',
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
    // Der Mindestlohn ist ein BRUTTO-Stundenlohn — ohne bekannte Basis kein Befund.
    incomeType: data?.finanzen?.incomeType,
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

  const { incomeFTE, income, partTime, overFullTime, hoursKnown, basisKnown, einkommensart, hoursPerWeek, rel, median, mindestlohn, mlBreached, scaleMin, scaleMax } = state;
  // Füll-Ton, nicht Identitätston: die Füllung trägt die Aussage → WCAG 1.4.11 (3:1).
  const arbeitColor = bereichFillColor('arbeit', isDarkMode);

  // Dieses Instrument vergleicht gegen VOLLZEIT- und BRUTTO-Bezüge: der BFS-Median ist ein
  // Bruttomedianlohn auf 40 Std./Woche, der Mindestlohn ein Brutto-Stundenlohn. Fehlen die
  // Wochenstunden ODER die Einkommensart, deckt keine einzige Marke den gezeigten Wert —
  // dann ist auch der BALKEN eine Behauptung, nicht nur der Satz darunter. Also gar kein
  // Balken, sondern eine ruhige Einladung; derselbe Ton wie im Kapitel (Predeploy-Runde 8).
  if (!basisKnown || !hoursKnown) {
    const hinweis = !basisKnown
      ? (einkommensart === 'netto' ? 'lohnCheck.basisNetto' : 'lohnCheck.basisMissing')
      : 'lohnEinordnung.hoursUnknownNote';
    return React.createElement('div', { style: card },
      React.createElement('div', { style: { fontWeight: weight.semi, color: palette.text, marginBottom: '4px' } }, t('lohnEinordnung.title')),
      React.createElement('div', { style: { color: palette.mid, lineHeight: leading.normal } }, t(hinweis))
    );
  }

  // `mlBreached` kommt aus `lohnBandState` → `pruefeStundenlohn` — dieselbe Funktion, die
  // das Kapitel und der Brief benutzen. Hier stand bis Predeploy-Runde 8 eine ZWEITE
  // Rechnung (`incomeFTE < mindestlohn.monat`), die bei >42 Std. das Gegenteil des Kapitels
  // sagte und einen Netto-Lohn gegen den Brutto-Boden hielt. Nicht wieder selbst rechnen.

  // Ab hier ist `rel` garantiert gesetzt (der frühe Return oben deckt !comparable ab).
  // Valenz statt Richtung: gold ist die „engere Seite" — beim Lohn also darunter.
  const valenceColor = rel === 'above' ? palette.sage : rel === 'below' ? palette.gold : palette.mid;
  const readoutColor = rel === 'above' ? palette.sageDeep : rel === 'below' ? palette.goldDeep : palette.mid;

  const marks = [
    { value: median, form: 'dot', color: valenceColor },
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
      // Die Text-Alternative trägt dieselbe Aussage wie die Farbe: Lage UND
      // Mindestlohn-Unterschreitung in Worten. Vorher nannte das aria-Label nur zwei Zahlen,
      // und die Unterschreitung stand ausschliesslich in der Farbe (WCAG 1.4.1, Level A).
      ariaLabel: [
        t('lohnEinordnung.aria', { amount: fmt(incomeFTE), median: fmt(median) }),
        t('lohnEinordnung.readout' + rel.charAt(0).toUpperCase() + rel.slice(1)),
        mlBreached ? t('lohnEinordnung.mindestlohnBreachedLine') : null,
      ].filter(Boolean).join(' '),
    }),

    // Werte-Zeile — die Marke zum Nachlesen.
    // ⚠️ a11y: `valenceColor` ist die GRAFIK-Farbe (roh sage/gold). Als Text trägt sie AA
    // nicht — gold auf `up` = 1.93:1 (nötig 4.5:1), und gold ist ausgerechnet der
    // Unter-Median-Fall, also die Zielgruppe. Für Text gilt die Deep-Variante
    // (`readoutColor`), für den Punkt auf dem Balken die kräftige. `config/constants.js`
    // sagt es selbst: „gold bleibt für Akzente/Ringe."
    React.createElement('div', {
      style: { display: 'flex', justifyContent: 'space-between', fontSize: text.xs, color: palette.mid },
    },
      React.createElement('span', { style: { color: readoutColor } },
        '● ' + t('lohnEinordnung.median') + ': CHF ' + fmt(median)),
      React.createElement('span', { style: { color: palette.text, fontWeight: weight.medium } },
        t('lohnEinordnung.yourWage', { amount: fmt(incomeFTE) }))
    ),

    // Lage-Aussage. Sie ist hier immer belegt: ohne Stunden oder ohne Brutto-Basis
    // kommt die Anzeige gar nicht bis hierher (früher Return oben).
    React.createElement('div', {
      style: { fontSize: text.sm, color: readoutColor, fontWeight: weight.medium, marginTop: space.sm + 'px', lineHeight: leading.normal },
    }, t('lohnEinordnung.readout' + rel.charAt(0).toUpperCase() + rel.slice(1))),

    // Wie der Vergleich zustande kommt — ehrlich, je nach Datenlage.
    React.createElement('div', {
      style: { fontSize: text.xs, color: palette.mid, marginTop: space.xs + 'px', lineHeight: leading.normal },
    }, partTime ? t('lohnEinordnung.fteNote', { hours: hoursPerWeek, fte: fmt(incomeFTE), actual: fmt(income) })
      : overFullTime ? t('lohnEinordnung.overFteNote', { hours: hoursPerWeek, fte: fmt(incomeFTE), actual: fmt(income) })
      : t('lohnEinordnung.fulltimeNote')),

    // Mindestlohn-Zeile. Die Unterschreitung steht jetzt als eigener SATZ da, nicht nur in
    // Rosé — der Text war vorher in beiden Zuständen identisch (WCAG 1.4.1, Level A).
    mindestlohn && React.createElement('div', {
      style: { fontSize: text.xs, color: mlBreached ? palette.roseDeep : palette.mid, marginTop: space.xs + 'px', lineHeight: leading.normal },
    },
      // `monatVollzeit` (42 Std.), NICHT `monat` (40 Std., das ist die Marken-Position):
      // der Text „bei Vollzeit rund CHF X im Monat" muss dieselbe Zahl nennen wie Kapitel
      // und Brief (GE 4475, nicht 4262) — sonst widerspricht das Barometer der übrigen App
      // um ~5 % (Predeploy-Runde 8, dritte Prüfung).
      t('lohnEinordnung.mindestlohnLine', { amount: fmt(mindestlohn.monatVollzeit), stunde: mindestlohn.chfStunde.toFixed(2), jahr: mindestlohn.jahr }),
      // Verdacht, keine Feststellung — und die Ausnahmen dazu. Die App kennt sie nicht
      // (Lehre/Praktikum/unter 18/GAV; GE hat drei Sätze), also darf sie hier keine
      // Rechtsverletzung behaupten. Siehe `WAGECLAIM_BEREIT` in data/lohnCheck.js.
      // Derselbe Ausnahme-Text wie im Kapitel — eine Wahrheit, kein zweiter Wortlaut.
      mlBreached ? ' ' + t('lohnEinordnung.mindestlohnBreachedLine') + ' ' + t('lohnCheck.ausnahmen') : ''
    ),

    React.createElement('div', {
      style: { fontSize: text.xs, color: palette.soft, marginTop: space.xs + 'px', fontStyle: 'italic' },
    }, renderSource(t('lohnEinordnung.source', { median: fmt(median), jahr: LOHN_REFERENZ.jahr })))
  );
};

export default LohnEinordnung;

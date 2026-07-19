import React from 'react';
import { text, weight, radius, space, leading } from '../config/tokens.js';
import { bereichFillColor } from '../data/lebensbereiche.js';
import { lohnBandState, LOHN_REFERENZ } from '../data/lohnEinordnung.js';
import { renderSource } from '../utils/renderSource.js';

// „Wo steht Ihr Lohn?" — spiegelgleich zum Miet-Barometer (components/MietVergleich).
// Encoding: docs/design/farb-und-daten-system.md
//   • Zonen  = vier belegte Verteilungs-Abschnitte (p10 / Median / p90, LSE) als tastige
//     Bubbles, gleich breit (kategorial), damit jede ihren Namen darunter trägt. Neutral
//     getönt — die Farbe gliedert nur, sie wertet nicht.
//   • Füllung = dein Lohn füllt die Bubbles bis zu seiner Stelle (Frucht-Farbe Arbeit/Haselnuss)
//   • ● Punkt = Median, gefärbt nach DEINER Lage (sage = darüber, gold = darunter)
//   • | Strich = Median der angetippten Branche (Finanz-Übersicht), neutral — reine Orientierung
//   • ! = der kantonale Mindestlohn-Boden, LIEGT ÜBER dem Balken. Graphit normal, rose wenn unterschritten.

// Balken aus gleich breiten Bubble-Segmenten (kategorial/Quantil). Die Skala ist innerhalb
// jeder Bubble linear nach CHF, die Bubble-Grenzen sind die belegten Quantile — so trägt
// jede Bubble einen lesbaren Namen und der Lohn füllt sie ehrlich bis zu seiner Stelle.
const Barometer = ({ palette, isDark, value, fillColor, marks, zones, ariaLabel }) => {
  const n = zones.length;
  // CHF → Pixel-% über die kategorialen Bubbles (jede Bubble = 1/n der Breite, innen linear).
  const pctCat = (v) => {
    for (let i = 0; i < n; i++) {
      const z = zones[i];
      if (v <= z.max || i === n - 1) {
        const within = Math.max(0, Math.min(1, (v - z.min) / (z.max - z.min)));
        return ((i + within) / n) * 100;
      }
    }
    return 100;
  };
  const tintBase = isDark ? '236,236,234' : '90,80,66';
  const alphas = [0.16, 0.10, 0.055, 0.03];
  const GAP = 6; // px Luft zwischen den Bubbles

  return React.createElement('div', {
    role: 'img', 'aria-label': ariaLabel,
    style: { position: 'relative', height: '10px', marginBottom: '12px' },
  },
    // Bubbles (gleich breit). Jede füllt sich Haselnuss bis zu dem Anteil, den der Lohn
    // in IHREM CHF-Bereich erreicht — Bubbles darunter voll, die eigene teilweise, darüber leer.
    zones.map((z, i) => {
      const l = (i / n) * 100;
      const w = (1 / n) * 100;
      const leftGap = i === 0 ? 0 : GAP / 2;
      const rightGap = i === n - 1 ? 0 : GAP / 2;
      const fillW = value >= z.max ? 100 : value <= z.min ? 0 : ((value - z.min) / (z.max - z.min)) * 100;
      return React.createElement('div', {
        key: 'z' + i,
        style: {
          position: 'absolute', top: 0, height: '100%', boxSizing: 'border-box', overflow: 'hidden',
          left: 'calc(' + l + '% + ' + leftGap + 'px)',
          width: 'calc(' + w + '% - ' + (leftGap + rightGap) + 'px)',
          background: 'rgba(' + tintBase + ',' + (alphas[i] != null ? alphas[i] : 0.03) + ')',
          borderRadius: '9px', border: '0.5px solid ' + palette.border,
        },
      },
        fillW > 0 && React.createElement('div', {
          style: { position: 'absolute', left: 0, top: 0, bottom: 0, width: fillW + '%', background: fillColor },
        })
      );
    }),

    // Marken: ● Median-Punkt · | Durchschnitt-Strich · „!" Mindestlohn (über dem Balken).
    marks.map((m, i) => {
      const leftPos = pctCat(m.value) + '%';
      if (m.form === 'dot') {
        return React.createElement('div', {
          key: 'm' + i,
          style: {
            position: 'absolute', top: '-1px', left: leftPos, marginLeft: '-6px',
            width: '12px', height: '12px', borderRadius: '50%', background: m.color,
            border: '1.5px solid ' + palette.surface,
          },
        });
      }
      if (m.form === 'line') {
        return React.createElement('div', {
          key: 'm' + i,
          style: { position: 'absolute', top: '-9px', bottom: '-3px', left: leftPos, width: '2px', background: m.color },
        });
      }
      // exclaim — die harte Schwelle, liegt ÜBER dem Balken. Deckender Ring statt Blur
      // (Predeploy-Runde 8): `paintOrder: stroke fill` legt den surface-Ring unter die Glyphe.
      return React.createElement('div', {
        key: 'm' + i,
        style: {
          position: 'absolute', top: '-15px', height: '28px', left: leftPos, marginLeft: '-4px',
          width: '8px', textAlign: 'center', lineHeight: '28px', fontSize: '24px',
          fontWeight: 700, pointerEvents: 'none', color: m.color,
          WebkitTextStrokeWidth: '2px', WebkitTextStrokeColor: palette.surface,
          paintOrder: 'stroke fill',
          textShadow: '0 0 2px ' + palette.surface + ', 0 0 2px ' + palette.surface,
        },
      }, '!');
    })
  );
};

// `embedded`: ohne eigene Karte rendern — für Orte, die schon in einer `palette.up`-Karte
// sitzen (Finanz-Übersicht). Sonst läge Karte auf Karte und die Kante verschwände.
export const LohnEinordnung = ({ palette, t, data, isDarkMode, embedded, branchMark }) => {
  // Alter aus dem Geburtsdatum — für die Netto→Brutto-Schätzung (PK-Anteil nach Alter).
  const geb = data?.basis?.dateOfBirth ? new Date(data.basis.dateOfBirth) : null;
  const alter = geb && !isNaN(geb.getTime()) ? Math.floor((Date.now() - geb.getTime()) / 31557600000) : undefined;
  const state = lohnBandState({
    income: data?.finanzen?.monthlyIncome,
    canton: data?.basis?.canton,
    hoursPerWeek: data?.ausbildung?.workHoursPerWeek,
    // Bei Brutto direkt; bei Netto schätzt lohnBandState das Brutto (AHV/ALV + PK nach Alter)
    // und markiert es als «geschätzt» — die Mindestlohn-Warnung bleibt echtem Brutto vorbehalten.
    incomeType: data?.finanzen?.incomeType,
    alter,
    // Der BFS-Median enthält den anteiligen 13.; mit einem 13. wird der Lohn ×13/12
    // vergleichbar gemacht, und der Mindestlohn-Boden sinkt um 12/13 (Jahres-Boden).
    dreizehnter: data?.finanzen?.dreizehnter,
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

  const { incomeFTE, incomeVergleich, hat13, income, incomeRoh, geschaetzt, partTime, overFullTime, hoursKnown, basisKnown, einkommensart, hoursPerWeek, rel, median, mindestlohn, mlBreached, konformMit13, dreizehnterUnklar, scaleMin, scaleMax } = state;
  // Füll-Ton, nicht Identitätston: die Füllung trägt die Aussage → WCAG 1.4.11 (3:1).
  const arbeitColor = bereichFillColor('arbeit', isDarkMode);

  // Dieses Instrument vergleicht gegen VOLLZEIT- und BRUTTO-Bezüge. Fehlen die Wochenstunden
  // ODER die Einkommensart, deckt keine einzige Marke den gezeigten Wert — dann gar kein
  // Balken, sondern eine ruhige Einladung (Predeploy-Runde 8).
  if (!basisKnown || !hoursKnown) {
    const hinweis = !basisKnown
      ? (einkommensart === 'netto' ? 'lohnCheck.basisNetto' : 'lohnCheck.basisMissing')
      : 'lohnEinordnung.hoursUnknownNote';
    return React.createElement('div', { style: card },
      React.createElement('div', { style: { fontWeight: weight.semi, color: palette.text, marginBottom: '4px' } }, t('lohnEinordnung.title')),
      React.createElement('div', { style: { color: palette.mid, lineHeight: leading.normal } }, t(hinweis))
    );
  }

  // Valenz statt Richtung: gold ist die „engere Seite" — beim Lohn also darunter.
  const valenceColor = rel === 'above' ? palette.sage : rel === 'below' ? palette.gold : palette.mid;
  const readoutColor = rel === 'above' ? palette.sageDeep : rel === 'below' ? palette.goldDeep : palette.mid;

  // Vier belegte Verteilungs-Zonen (LSE): unteres Zehntel (<p10) · unterer Bereich
  // (p10–Median) · oberer Bereich (Median–p90) · oberes Zehntel (>p90).
  const zones = [
    { min: scaleMin, max: LOHN_REFERENZ.p10, key: 'zoneLow', sub: 'zoneLowSub' },
    { min: LOHN_REFERENZ.p10, max: median, key: 'zoneLowerMid' },
    { min: median, max: LOHN_REFERENZ.p90, key: 'zoneUpperMid' },
    { min: LOHN_REFERENZ.p90, max: scaleMax, key: 'zoneHigh', sub: 'zoneHighSub' },
  ];
  const activeZone = zones.find(z => incomeVergleich <= z.max) || zones[zones.length - 1];

  const marks = [
    { value: median, form: 'dot', color: valenceColor },
  ];
  // Branchen-Marke: Median der in der Finanz-Übersicht angetippten Branche. Neutraler Strich —
  // eine Branche ist nicht „gut"/„schlecht", das ist reine Orientierung, kein Werturteil.
  // Ersetzt den früheren Durchschnitt-Strich: der BFS-Mittelwert steht in KEINER zitierbaren
  // Quelle (nur STAT-TAB) — eine erfundene Zahl auf einer Tatsachen-Marke ist der Runde-8-Fehler.
  if (branchMark && branchMark.lohn < scaleMax) {
    marks.push({ value: branchMark.lohn, form: 'line', color: palette.mid });
  }
  if (mindestlohn && mindestlohn.monat < scaleMax) {
    marks.unshift({ value: mindestlohn.monat, form: 'exclaim', color: mlBreached ? palette.roseDeep : palette.text });
  }

  const fmt = (n) => Math.round(n).toLocaleString('de-CH');

  return React.createElement('div', { style: card },
    React.createElement('div', {
      style: { fontWeight: weight.semi, color: palette.text, marginBottom: space.sm + 'px' },
    }, t('lohnEinordnung.title')),

    // Quantil-Grenzen über dem Balken (p10 / p90) als belegte Zahlen an ihren Bubble-Kanten.
    React.createElement('div', {
      style: { position: 'relative', height: '15px', marginBottom: '3px', fontSize: '11px', color: palette.soft },
    },
      React.createElement('span', { style: { position: 'absolute', left: '25%', transform: 'translateX(-50%)', whiteSpace: 'nowrap' } }, 'CHF ' + fmt(LOHN_REFERENZ.p10)),
      React.createElement('span', { style: { position: 'absolute', left: '75%', transform: 'translateX(-50%)', whiteSpace: 'nowrap' } }, 'CHF ' + fmt(LOHN_REFERENZ.p90))
    ),

    React.createElement(Barometer, {
      palette, isDark: isDarkMode, value: Math.min(incomeVergleich, scaleMax), fillColor: arbeitColor,
      marks, zones,
      ariaLabel: [
        t('lohnEinordnung.aria', { amount: fmt(incomeVergleich), median: fmt(median) }),
        t('lohnEinordnung.readout' + rel.charAt(0).toUpperCase() + rel.slice(1)),
        t('lohnEinordnung.' + activeZone.key),
        mlBreached ? t('lohnEinordnung.mindestlohnBreachedLine') : null,
        branchMark ? t('branche.' + branchMark.key) + ' CHF ' + fmt(branchMark.lohn) : null,
      ].filter(Boolean).join(' '),
    }),

    // Zonen-Namen UNTER der jeweiligen Bubble (kategorial → gleich breit, kein Überlappen).
    // Rand-Zonen tragen zusätzlich das vertraute Klartext-Wort (Tieflohn / Spitzenlohn).
    React.createElement('div', {
      style: { position: 'relative', height: '30px', marginTop: '5px', marginBottom: space.sm + 'px', fontSize: '10px' },
    }, zones.map((z, i) => {
      const center = ((i + 0.5) / zones.length) * 100;
      const isActive = z.key === activeZone.key;
      return React.createElement('div', {
        key: 'zl' + i,
        style: {
          position: 'absolute', left: center + '%', transform: 'translateX(-50%)', top: 0,
          textAlign: 'center', width: (100 / zones.length - 1) + '%',
          color: isActive ? palette.text : palette.mid, fontWeight: isActive ? weight.medium : weight.regular,
          lineHeight: 1.25,
        },
      },
        t('lohnEinordnung.' + z.key),
        z.sub && React.createElement('div', { style: { color: palette.soft, fontWeight: weight.regular } }, t('lohnEinordnung.' + z.sub))
      );
    })),

    // Werte-Zeile — Ihr Lohn LINKS, Median RECHTS (Entscheid Stebler Studios 2026-07-18).
    // ⚠️ a11y: `valenceColor` ist die GRAFIK-Farbe; als Text gilt die Deep-Variante.
    React.createElement('div', {
      style: { display: 'flex', justifyContent: 'space-between', fontSize: text.xs, color: palette.mid },
    },
      React.createElement('span', { style: { color: palette.text, fontWeight: weight.medium } },
        React.createElement('span', { 'aria-hidden': true }, '▬ '),
        t('lohnEinordnung.yourWage', { amount: fmt(incomeVergleich) })),
      React.createElement('span', { style: { color: readoutColor } },
        React.createElement('span', { 'aria-hidden': true }, '● '),
        t('lohnEinordnung.median') + ': CHF ' + fmt(median))
    ),

    // Netto-Nutzerin: das Brutto ist geschätzt — ausdrücklich ausweisen (Wahrheits-Disziplin).
    geschaetzt && React.createElement('div', {
      style: { fontSize: text.xs, color: palette.soft, marginTop: space.xs + 'px', lineHeight: leading.normal },
    }, t('lohnEinordnung.geschaetztAusNetto', { netto: fmt(incomeRoh) })),

    React.createElement('div', {
      style: { fontSize: text.sm, color: readoutColor, fontWeight: weight.medium, marginTop: space.sm + 'px', lineHeight: leading.normal },
    }, t('lohnEinordnung.readout' + rel.charAt(0).toUpperCase() + rel.slice(1))),

    React.createElement('div', {
      style: { fontSize: text.xs, color: palette.mid, marginTop: space.xs + 'px', lineHeight: leading.normal },
    }, partTime ? t('lohnEinordnung.fteNote', { hours: hoursPerWeek, fte: fmt(incomeFTE), actual: fmt(income) })
      : overFullTime ? t('lohnEinordnung.overFteNote', { hours: hoursPerWeek, fte: fmt(incomeFTE), actual: fmt(income) })
      : t('lohnEinordnung.fulltimeNote')),

    // Die Basis des Vergleichs IMMER ausweisen (Sophie/Stebler Studios): mit 13. enthält der
    // Vergleichswert den anteiligen 13. (×13/12, standardisiert wie der BFS-Median); ohne 13.
    // wird der Basislohn direkt verglichen — mit Hinweis, dass ein 13. den Wert hebt.
    React.createElement('div', {
      style: { fontSize: text.xs, color: palette.mid, marginTop: space.xs + 'px', lineHeight: leading.normal },
    }, hat13
      ? t('lohnEinordnung.dreizehnterNote', { fte: fmt(incomeFTE) })
      : t('lohnEinordnung.ohneDreizehnterNote')),

    mindestlohn && React.createElement('div', {
      style: { fontSize: text.xs, color: mlBreached ? palette.roseDeep : palette.mid, marginTop: space.xs + 'px', lineHeight: leading.normal },
    },
      t('lohnEinordnung.mindestlohnLine', { amount: fmt(mindestlohn.monatVollzeit), stunde: mindestlohn.chfStunde.toFixed(2), jahr: mindestlohn.jahr }),
      mlBreached ? ' ' + t('lohnEinordnung.mindestlohnBreachedLine') + ' ' + t('lohnCheck.ausnahmen') : '',
      // Qualifiziert konform: Basislohn unter dem vollen, aber über dem reduzierten Boden —
      // gesetzeskonform, SOFERN der 13. angerechnet wird (in BS nur anteilig-monatlich).
      konformMit13 ? ' ' + t('lohnEinordnung.konformMit13Line') : '',
      // 12/13-Spalt, 13.-Frage offen: kein Urteil, ruhige Einladung (reuse lohnCheck-String).
      dreizehnterUnklar ? ' ' + t('lohnCheck.dreizehnterUnklar') : ''
    ),

    React.createElement('div', {
      style: { fontSize: text.xs, color: palette.soft, marginTop: space.xs + 'px', fontStyle: 'italic' },
    }, renderSource(t('lohnEinordnung.source', { median: fmt(median), jahr: LOHN_REFERENZ.jahr })))
  );
};

export default LohnEinordnung;

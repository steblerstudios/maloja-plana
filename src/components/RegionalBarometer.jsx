import React from 'react';
import { text, weight, space, leading } from '../config/tokens.js';
import { renderSource } from '../utils/renderSource.js';

// Ruhiges Regional-Barometer im Stil der „KK-Last"-Karte. Encoding (Stebler Studios):
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
//   fillColor (optional) — Frucht-Farbe des Instruments für „du" (Miete = Wohnen/Birne).
//                          Ohne sie bleibt es beim bisherigen Sky. Regel: „du" trägt die
//                          Bereichsfarbe — Blau nur dort, wo Blau ohnehin der Bereich ist.
//   thresholdValue (opt) — harte Schwelle als Betrag (Miete: ein Drittel des Einkommens).
//                          Wird als „!" auf dem Balken gesetzt: graphit normal, rose NUR
//                          wenn überschritten. Einziger Ort für Rose → keine Alarm-Inflation.
export const RegionalBarometer = ({ palette, t, comparison, userValue, kind = 'premium', compact, fillColor, thresholdValue }) => {
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
  // ⚠️ ZWEI Töne je Valenz, nicht einer (Predeploy-Runde 8): `accent` ist die GRAFIK-Farbe,
  // `accentText` die lesbare. Roh-Gold als Text liegt bei 1.93:1 auf `up` und 2.19:1 auf
  // `surface` — nötig sind 4.5:1. `config/constants.js` sagt es selbst: „gold bleibt für
  // Akzente/Ringe." Auch rohes `sage` verfehlt AA knapp (4.11 hell / 4.35 dunkel).
  const accent = dir === 'above' ? palette.gold : dir === 'below' ? palette.sage : palette.mid;
  const accentText = dir === 'above' ? palette.goldDeep : dir === 'below' ? palette.sageDeep : palette.mid;

  // Füllung = eigener Wert („du"); ohne eigenen Wert = Regions-Schnitt (accent).
  const fillPct = hasUser ? pct(userValue) : regionalPct;
  const barFill = hasUser ? (fillColor || palette.sky) : accent;

  // Punkt = Regions-Schnitt, gefärbt nach DEINER Lage zur Region (nicht Region-vs-Land).
  // Valenz statt Richtung: gold = finanziell enger, sage = entspannter, mid = neutral.
  const dotColor = hasUser
    ? (userValue > regional * 1.02 ? palette.gold : userValue < regional * 0.98 ? palette.sage : palette.mid)
    : accent;
  // Derselbe Punkt, aber als Text gelesen — Deep-Variante (siehe `accentText`).
  const dotTextColor = hasUser
    ? (userValue > regional * 1.02 ? palette.goldDeep : userValue < regional * 0.98 ? palette.sageDeep : palette.mid)
    : accentText;

  // Harte Schwelle als „!" auf dem Balken (nur mit eigenem Wert und innerhalb der Skala).
  const hasThreshold = thresholdValue > 0 && hasUser && thresholdValue <= scaleMax;
  const thresholdBreached = hasThreshold && userValue > thresholdValue;
  // Kollision mit dem Schweizer-Schnitt-Strich: Bei der Miete fällt die Drittel-Schwelle
  // genau dann auf den Strich, wenn das Einkommen ≈ 3× CH-Schnitt ist — also bei rund
  // CHF 4'000. Das ist kein Randfall, sondern mitten in unserer Zielgruppe. Die Position
  // bleibt (sie IST die Aussage), das „!" hebt sich stattdessen über den Strich ab —
  // dieselbe Lösung, die der Strich schon gegen den Regions-Punkt anwendet.
  const thresholdNearNational = hasThreshold && Math.abs(pct(thresholdValue) - nationalPct) < 3;
  // ⚠️ Predeploy-Runde 8: Der Fix oben prüfte NUR gegen den Strich. Gegen den ●-Punkt prüfte
  // niemand — und die Renderreihenfolge (Füllung → Punkt → „!" → Strich, kein z-index) legt
  // das „!" direkt darauf. Belegt erreichbar: ZH, 1-Personen-Haushalt (regional 1538,
  // national 1327), Einkommen CHF 4'614 → Drittel-Schwelle exakt auf dem Punkt; Abstand zum
  // Strich 11.7pp, also greift `thresholdNearNational` nicht. Das „!" verdeckt dann den ●,
  // und der ● trägt die Valenz-Aussage.
  // Toleranz 4pp statt 3: der ● ist 12px + 1.5px Halo, das „!" ~7px — 3pp sind bei einem
  // ~296px-Balken nur ~9px und damit zu eng.
  const thresholdNearDot = hasThreshold && hasUser && Math.abs(pct(thresholdValue) - regionalPct) < 4;
  // „Abheben, nie verschieben" gilt für JEDEN Nachbarn, nicht nur den Strich.
  const thresholdLifted = thresholdNearNational || thresholdNearDot;

  const diffText = t(ns + dir, { pct: Math.abs(rounded) });
  let ariaLabel = t(ns + 'aria', {
    regional: regional.toFixed(0), national: national.toFixed(0), diff: diffText,
  });
  if (hasUser) ariaLabel += ' ' + t(k + 'yourVal', { amount: userValue.toFixed(0) });
  // ⚠️ Predeploy-Runde 8, ZWEITE Batterie (a11y-Prüfer): Die Schwellen-Überschreitung stand
  // NUR in der Farbe — das „!" schaltet auf roseDeep, das aria-Label nannte sie nicht
  // (WCAG 1.4.1, Level A). In `MietVergleich` fing die Nachbarzeile (Drittel-Regel) das auf;
  // in `BudgetSync` gibt es sie NICHT — dort war das rote „!" der einzige Träger der Aussage.
  // Genau dieser Befund wurde fürs Lohn-Barometer als Blocker behandelt und behoben; das
  // Spiegel-Instrument blieb offen. Jetzt trägt das BAUTEIL die Aussage — damit bekommen
  // beide Orte sie, statt sie an zwei Stellen nachzuziehen.
  const breachLine = thresholdBreached ? t(k + 'thresholdBreachedLine') : null;
  if (breachLine) ariaLabel += ' ' + breachLine;

  return React.createElement('div', { style: { marginTop: compact ? space.sm + 'px' : space.md + 'px' } },
    !compact && React.createElement('div', {
      style: { fontWeight: weight.semi, marginBottom: space.sm + 'px', fontSize: text.sm },
    }, t(k + 'title')),

    // Balken: Füllung (eigener Wert) + Punkt (Region) + Strich (Schweizer Schnitt)
    React.createElement('div', {
      role: 'img', 'aria-label': ariaLabel,
      style: {
        position: 'relative', height: '10px', background: palette.border, borderRadius: '5px',
        marginBottom: '12px',
        // Das abgehobene „!" ist absolut positioniert und würde sonst in die Überschrift
        // ragen — Platz reservieren statt auf Glück hoffen.
        marginTop: thresholdLifted ? '18px' : 0,
      },
    },
      // Füllung = eigener Wert
      React.createElement('div', { style: { height: '100%', width: fillPct + '%', background: barFill, borderRadius: '5px' } }),
      // Punkt = Regions-Durchschnitt (nur wenn die Füllung den eigenen Wert zeigt).
      // Dünner Halo (1.5px), kein hartes Weiss.
      hasUser && React.createElement('div', {
        style: {
          position: 'absolute', top: '-1px', left: regionalPct + '%', marginLeft: '-6px',
          width: '12px', height: '12px', borderRadius: '50%', background: dotColor,
          border: '1.5px solid ' + palette.surface,
        },
      }),
      // „!" = die harte Schwelle (Miete über ⅓ des Einkommens). Sitzt auf dem Balken,
      // nicht im Fliesstext — und wird nur dort rose, wo sie wirklich überschritten ist.
      //
      // ⚠️ Predeploy-Runde 8, ZWEITE Batterie (a11y-Prüfer, gegen den Fix selbst):
      // `thresholdBreached` heisst `userValue > thresholdValue` — also läuft die FÜLLUNG
      // über das „!" hinweg. Es liegt dann auf der Frucht-Farbe, nicht auf der Spur.
      // Der Frucht-Fix (`lightDeep`) hat die Füllung gehärtet und dabei genau diese Kante
      // VERSCHLECHTERT: roseDeep-„!" auf Birne 1.92 → **1.44** (hell) / 1.22 (dunkel).
      // Nötig sind 3:1 (24px/700 = grosse Schrift, 1.4.3 — und bedeutungstragend, 1.4.11).
      // Der `textShadow` ist ein weicher Blur, keine deckende Trennung.
      // Der ●-Punkt löst dasselbe Problem seit jeher mit `1.5px solid palette.surface` —
      // gemessen 4.05:1 gegen die neue Füllung. Das „!" bekommt denselben Ring.
      // `paintOrder: stroke fill` legt den Ring UNTER die Glyphe (sonst frisst er sie an);
      // der `textShadow` bleibt als Rückfall, falls ein Browser den Stroke nicht kennt.
      hasThreshold && React.createElement('div', {
        style: {
          position: 'absolute', top: (thresholdLifted ? '-30px' : '-15px'), height: '28px',
          left: pct(thresholdValue) + '%',
          marginLeft: '-4px', width: '8px', textAlign: 'center', lineHeight: '28px',
          fontSize: '24px', fontWeight: 700, pointerEvents: 'none',
          color: thresholdBreached ? palette.roseDeep : palette.text,
          WebkitTextStrokeWidth: '2px',
          WebkitTextStrokeColor: palette.surface,
          paintOrder: 'stroke fill',
          textShadow: '0 0 2px ' + palette.surface + ', 0 0 2px ' + palette.surface,
        },
      }, '!'),
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
      // Punkt-Label trägt dieselbe Valenz-Farbe wie der Punkt — eine Marke, eine Farbe.
      React.createElement('span', { style: { color: dotTextColor } }, '● ' + t(ns + 'regionalVal', { amount: regional.toFixed(0) })),
    ),
    hasUser && React.createElement('div', {
      style: { fontSize: text.xs, color: fillColor ? palette.text : palette.skyDeep, marginTop: '2px', fontWeight: weight.medium },
    }, t(k + 'yourVal', { amount: userValue.toFixed(0) })),

    // Die Schwellen-Überschreitung als SATZ — nicht nur als rotes „!". Steht hier im
    // Bauteil, damit jeder Ort sie bekommt (das Budget hat keine Nachbarzeile, die sie
    // auffangen würde). `roseDeep` trägt AA in beiden Modi (5.14 / 4.78).
    breachLine && React.createElement('div', {
      style: { fontSize: text.xs, color: palette.roseDeep, marginTop: space.xs + 'px', lineHeight: leading.normal },
    }, breachLine),

    // Prozentuale Abweichung (Region vs. Schweiz)
    React.createElement('div', {
      style: { fontSize: text.sm, color: accentText, fontWeight: weight.medium, marginTop: space.sm + 'px', lineHeight: leading.normal },
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

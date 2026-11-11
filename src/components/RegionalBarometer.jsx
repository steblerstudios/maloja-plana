import React from 'react';
import { text, weight, space, leading, radius, INSTRUMENT_GROESSE } from '../config/tokens.js';
import { renderSource } from '../utils/renderSource.js';
import { zahl, betrag } from '../utils/geld.js';
import { LegendenMarke } from './LegendenMarke.jsx';
// Dieselbe Anzeige-Skala wie der Pegel (data/pegel.js PEGEL_SCALE = 1.25): die Tür reicht etwas über die Grenze.
const PEGEL_SKALA = 1.25;

// Eigener Wert gegen den Regions-Schnitt — EINE Rechnung für Barometer und Instrument-Kachel
// (10.11.2026). Schwelle ±2 % wie die Farbe des Regions-Punkts.
export function lageZurRegion(userValue, regional) {
  if (!(userValue > 0) || !(regional > 0)) return null;
  const pct = Math.round((userValue / regional - 1) * 100);
  const richtung = userValue > regional * 1.02 ? 'Above' : userValue < regional * 0.98 ? 'Below' : 'Equal';
  return { pct, richtung };
}

// Womit verglichen wird und wie sicher der BFS-Wert ist (Fachprüfung 25.10.2026) — EINE Quelle für
// das Barometer und die Instrument-Kachel (10.11.2026).
export const mietVorbehalte = (t, comparison, { imKapitel } = {}) => {
  const k = 'po.regionalCompare.rent.';
  const { roomKey, zimmerAngenommen, ohneWertFuerGroesse, wenigeAntworten } = comparison;
  return [
    ohneWertFuerGroesse ? t(k + 'ohneWertFuerGroesse') : null,
    roomKey === 'total' ? t(k + 'vergleichAlle') : roomKey === 'r6' ? t(k + 'vergleichAb6') : t(k + 'vergleichZimmer', { n: roomKey.slice(1) }),
    zimmerAngenommen ? t(k + (imKapitel ? 'zimmerAngenommenHier' : 'zimmerAngenommen')) : null,
    wenigeAntworten ? t(k + 'wenigeAntworten') : null,
  ].filter(Boolean);
};

// Skala wie im grossen Barometer: etwas Luft nach oben, auf 50 gerundet.
const skala = (regional, national, userValue) => Math.ceil((Math.max(regional, national, userValue > 0 ? userValue : 0) * 1.15) / 50) * 50 || 50;

// Ruhiges Regional-Barometer im Stil der „KK-Last"-Karte. Encoding (Stebler Studios):
//   • Füllung  = eigener Wert (deine Prämie/Miete) — wie bei KK-Last die eigene Last
//   • Punkt    = Regions-Durchschnitt
//   • Strich   = Schweizer Schnitt (Referenz-Marke, wie der Strich der Vergleichsmarke 10 %)
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
// `showThresholdText`: die SICHTBARE Überschreitungs-Zeile. Default false — in `MietVergleich`
// erzählt die Nachbarzeile (`rentShareGuide`) die Drittel-Regel schon, dort wäre sie doppelt
// (Predeploy-Runde 8, dritte Prüfung). `BudgetSync` hat keine Nachbarzeile → setzt sie true.
// Das aria-Label trägt die Überschreitung IMMER (WCAG 1.4.1), unabhängig von diesem Prop.
// `userLabel` (optional): ersetzt «Ihre Miete: CHF …» — im Kapitel Wohnen beim Regler «Ausprobierte
// Miete: CHF …» (Fassung 6), damit niemand die ausprobierte Zahl für die erfasste hält.
// `imKapitel` (optional): ruhige Fassung fürs Kapitel Wohnen (Abnahme F6, Stebler Studios 25.10.2026 «Barometer
// ruhiger»). Ohne die strukturelle Erklärung, und der Zimmer-Hinweis zeigt auf das Feld unten im
// Kapitel statt «im Kapitel Wohnen» — man ist ja schon dort.
// `form` (optional, 11.11.2026, Stebler Studios «A und B kombiniert»): 'haeuser' zeichnet dieselben Marken
// als Häuserzeile — Ihr Haus gefüllt (= Füllung), Haus der Region mit farbigem Dach (= Punkt), Schweiz
// gestrichelt (= Strich), das Drittel als Linie quer über die Strasse mit «!» (= Schwelle). Höhe = Betrag.
// Nur für die Miete (Wohnen); Lohn und Prämie bleiben Balken. Texte, Vorlesetext, Farben und Rechnung
// sind dieselben — nur das Bild wechselt. `maxBreite`: Instrument-Grösse (Brand Book §7b), Standard mittel.
// `drittel` (11.11.2026): die Wohnkosten-Rechnung (wohnkostenRechnung) — dann ist Ihr Haus in der Häuserzeile das
// Drittel-Haus klein, und die Drittel-Linie quer über die Strasse entfällt.
export const RegionalBarometer = ({ palette, t, comparison, userValue, kind = 'premium', compact, fillColor, thresholdValue, showThresholdText, userLabel, imKapitel, form, maxBreite, drittel, kanton, tuer, ausland }) => {
  if (!comparison) return null;
  const { regional, national, diffPct, year, roomKey } = comparison;
  const ns = 'po.regionalCompare.';
  const k = ns + kind + '.';

  const hasUser = userValue != null && userValue > 0;
  // Skala mit etwas Luft nach oben, gerundet — Schweizer Schnitt sitzt als Marke darauf.
  const scaleMax = skala(regional, national, hasUser ? userValue : 0);
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
  // das „!" direkt darauf. Belegt erreichbar: ZH, 1-Personen-Haushalt (regional 1732,
  // national 1446, BFS 2024), Einkommen CHF 5'196 → Drittel-Schwelle exakt auf dem Punkt; Abstand
  // zum Strich 14.3pp, also greift `thresholdNearNational` nicht. (Mit Stand 2020: 1538 / 1327,
  // CHF 4'614, 11.7pp — nachgerechnet in der Fachprüfung 25.10.2026.) Das „!" verdeckt dann den ●,
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
  const userText = hasUser ? (userLabel || t(k + 'yourVal', { amount: zahl(userValue) })) : null;
  // Strasse gross (Kapitel Wohnen, 256): Kürzel in den Häusern, Beträge direkt darunter statt der Legenden-Zeilen
  // (Stebler Studios 11.11.2026, Skizze B). In mittel (Mietzins, Budget) wären Kürzel und Beträge unter 13 px bzw.
  // zu eng — dort bleiben die Legenden-Zeilen.
  const strasseGross = form === 'haeuser' && (maxBreite || 0) >= INSTRUMENT_GROESSE.gross;
  if (hasUser) ariaLabel += ' ' + userText;
  // Eigener Wert gegen Region, gleiche Schwelle (±2 %) wie die Farbe des Regions-Punkts.
  const lage = hasUser ? lageZurRegion(userValue, regional) : null;
  const userPct = lage ? lage.pct : 0;
  const userDir = lage ? lage.richtung : null;
  const userDiffText = userDir ? t(k + 'user' + userDir, { pct: Math.abs(userPct) }) : null;
  if (userDiffText) ariaLabel += ' ' + userDiffText;
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

    form === 'haeuser' ? haeuserzeile({ palette, t, ariaLabel, hasUser, userValue, regional, national, pct, barFill, dotColor, dotTextColor, hasThreshold, thresholdValue, thresholdBreached, maxBreite, drittel, gross: strasseGross, kanton, userLabel, fillColor, tuer, ausland }) :
    // Balken: Füllung (eigener Wert) + Punkt (Region) + Strich (Schweizer Schnitt)
    React.createElement('div', {
      role: 'img', 'aria-label': ariaLabel,
      style: {
        position: 'relative', height: '10px', background: palette.border, borderRadius: radius.full,
        marginBottom: '12px',
        // Das abgehobene „!" ist absolut positioniert und würde sonst in die Überschrift
        // ragen — Platz reservieren statt auf Glück hoffen.
        marginTop: thresholdLifted ? '18px' : 0,
      },
    },
      // Füllung = eigener Wert
      React.createElement('div', { style: { height: '100%', width: fillPct + '%', background: barFill, borderRadius: radius.full } }),
      // Punkt = Regions-Durchschnitt (nur wenn die Füllung den eigenen Wert zeigt).
      // Dünner Halo (1.5px), kein hartes Weiss.
      hasUser && React.createElement('div', {
        style: {
          position: 'absolute', top: '-1px', left: regionalPct + '%', marginLeft: '-8px',
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
      // Der ●-Punkt löst dasselbe Problem seit jeher mit einem deckenden `surface`-Ring
      // (dort `1.5px solid`) — gemessen 4.05:1 gegen die neue Füllung. Das „!" bekommt
      // dieselbe Farbe/Absicht als 2px-Text-Stroke (≈1px Aussen-Halo nach `paintOrder`).
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

    // Werte als Marken (Farben = Encoding). Die Legenden-Marken (`LegendenMarke`) spiegeln
    // die Marken AUF dem Balken in derselben Farbvariablen — eine Marke, eine Farbe.
    // Rein dekorativ (`aria-hidden`), der Wert steht im Text daneben.
    // Fassung 6 (Feinschliff «Barometer-Beschriftungen kurz, kein Umbruch»): bei 375 px brach
    // «Schweizer Schnitt: CHF / 1327» (Werte Stand 2020) mitten im Eintrag. Jetzt bleibt jeder Eintrag ganz und rückt
    // bei Platzmangel als Ganzes in die nächste Zeile.
    !strasseGross && React.createElement('div', {
      style: { display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2px ' + space.md + 'px', fontSize: text.xs, color: palette.mid },
    },
      // Strich verbindet das Label mit dem Strich auf dem Balken (Schweizer Schnitt) — sonst
      // liest man den Strich leicht als „meinen Wert" statt als Referenz.
      React.createElement('span', { style: { whiteSpace: 'nowrap' } },
        React.createElement(LegendenMarke, { form: form === 'haeuser' ? 'hausStrich' : 'strich', color: form === 'haeuser' ? palette.mid : palette.text, palette }),
        t(ns + 'nationalVal', { amount: zahl(national) })),
      // Punkt in der Grafik-Farbe des Punkts, Label in der lesbaren Deep-Variante.
      React.createElement('span', { style: { color: dotTextColor, whiteSpace: 'nowrap' } },
        React.createElement(LegendenMarke, { form: form === 'haeuser' ? 'hausDach' : 'punkt', color: dotColor, palette }),
        t(ns + 'regionalVal', { amount: zahl(regional) })),
    ),
    hasUser && !strasseGross && React.createElement('div', {
      style: { fontSize: text.xs, color: fillColor ? palette.text : palette.skyDeep, marginTop: '2px', fontWeight: weight.medium },
    },
      // Füllung in der Füll-Farbe (Miete = Birne) verbindet das Label mit der Füllung — damit
      // klar ist: die FÜLLUNG ist dein Wert, der Strich ist der Schweizer Schnitt.
      React.createElement(LegendenMarke, { form: form === 'haeuser' ? (drittel && drittel.anteil != null ? 'drittelHaus' : 'haus') : 'fuellung', color: barFill, palette }),
      userText
    ),

    // Die Schwellen-Überschreitung als SATZ — nur wo die Eltern-Ansicht sie nicht schon
    // erzählt (`showThresholdText`, siehe Prop-Kommentar). Im aria-Label steht sie immer.
    // `roseDeep` trägt AA in beiden Modi (5.14 / 4.78). Die «!»-Marke davor bindet den Satz
    // an das «!» auf dem Balken (dieselbe Symbol-Sprache wie Füllung/Punkt/Strich).
    breachLine && showThresholdText && React.createElement('div', {
      style: { fontSize: text.xs, color: palette.roseDeep, marginTop: space.xs + 'px', lineHeight: leading.normal },
    }, React.createElement(LegendenMarke, { form: 'schwelle', color: palette.roseDeep, palette }), breachLine),

    // Fassung 7 (F7-K1-1, Stebler Studios 27.10.2026): Mit eigenem Wert sagt der erste Satz, wo DER EIGENE
    // Wert zur Region liegt — vorher stand unter «Ihre Miete: CHF 1’650» nur «rund 20 % über dem
    // Schweizer Schnitt», und das war die Region, nicht die Miete. Die Region-gegen-Schweiz-Zeile
    // folgt darunter mit eigenem Subjekt.
    userDiffText && React.createElement('div', {
      'data-teil': 'barometer-eigener-wert',
      style: { fontSize: text.sm, color: dotTextColor, fontWeight: weight.medium, marginTop: space.sm + 'px', lineHeight: leading.normal },
    }, userDiffText),
    // Prozentuale Abweichung (Region vs. Schweiz)
    React.createElement('div', {
      'data-teil': 'barometer-region',
      style: userDiffText
        ? { fontSize: text.xs, color: palette.mid, marginTop: space.xs + 'px', lineHeight: leading.normal }
        : { fontSize: text.sm, color: accentText, fontWeight: weight.medium, marginTop: space.sm + 'px', lineHeight: leading.normal },
    }, t(ns + 'region' + dir[0].toUpperCase() + dir.slice(1), { pct: Math.abs(rounded) })),

    // Strukturelle Einordnung (neutral, kein Vorwurf) — nur wenn merklich drüber
    dir === 'above' && !imKapitel && React.createElement('div', {
      style: { fontSize: text.xs, color: palette.mid, marginTop: space.xs + 'px', lineHeight: leading.normal },
    }, t(k + 'structural')),

    // Miete: womit verglichen wird (Zimmerzahl, angenommen oder erfasst) und ob der BFS-Wert unsicher
    // ist (weniger als 50 Beobachtungen). Fachprüfung 25.10.2026: vorher unsichtbar — wer allein in
    // 1½ Zimmern wohnt, wurde still mit 3-Zimmer-Wohnungen verglichen.
    kind === 'rent' && roomKey && React.createElement('div', {
      'data-teil': 'miete-vergleich-groesse',
      style: { fontSize: text.xs, color: palette.mid, marginTop: space.xs + 'px', lineHeight: leading.normal },
    },
      mietVorbehalte(t, comparison, { imKapitel }).join(' ')
    ),

    // Quelle
    React.createElement('div', {
      style: { fontSize: text.xs, color: palette.soft, marginTop: space.xs + 'px', fontStyle: 'italic' },
    }, renderSource(t(k + 'source', { year }), null, t)),
  );
};


// Häuserzeile (Wohnen): drei Häuser auf einer Strasse, Höhe = Betrag auf derselben Skala wie der Balken.
// Rein Bild — die Aussage steht im aria-Label des Rahmens und in den Zeilen darunter.
const HAUS_B = 28;
const HAUS_X = { sie: 6, region: 44, schweiz: 82 };
const BODEN = 84;
const HOEHE = 58;
const DACH = 12;
const STRICH = { vectorEffect: 'non-scaling-stroke' };
// Kürzel im Haus nur gross: bei 256 px genau text.xs (Regel H) — viewBox 132 breit.
// Strasse gross (11.11.2026, «C Fahne am Stock» und «Wegweiser in die Strasse»): breiter, damit rechts vom Vergleichshaus
// die Fahne des Kanton-Stocks und der Wegweiser stehen. Gleicher Massstab wie bisher (1.94 px je Einheit bei 330 px);
// die Schrift ist 7 Einheiten, damit sie auch bei 375 px Bildschirm (Strasse ~319 px breit) 13 px misst (Regel H).
const VB_GROSS = 170;
const STRASSE_SCHRIFT = 7;
export const STRASSE_BREITE = Math.round(VB_GROSS * 256 / 132);
// Ein Haus: Körper ab `y` bis zum Boden, Dach darüber.
const hausForm = (x, y, koerper, dach) => React.createElement('g', null,
  React.createElement('rect', { x, y, width: HAUS_B, height: BODEN - y, ...koerper, ...STRICH }),
  React.createElement('path', { d: 'M' + (x - 3) + ' ' + y + 'L' + (x + HAUS_B / 2) + ' ' + (y - DACH) + 'L' + (x + HAUS_B + 3) + ' ' + y + 'Z', ...dach, ...STRICH }),
);
// Ihr Haus in der Strasse = das Drittel-Haus klein (Stebler Studios 11.11.2026: «dieses Haus in die Stadt … das was
// heute Ihre Miete ist ersetzen»). Höhe = Ihre Miete (wie bisher), darin die Füllung = Anteil der Wohnkosten am
// Einkommen und die Drittel-Linie, Rosé nur darüber und nur mit Urteil — dieselbe Rechnung wie das grosse Haus
// (`drittel` = wohnkostenRechnung). Ohne «!»: zwischen den Häusern ist kein Platz, das «!» steht im grossen Haus.
const sieDrittelHaus = (x, y, drittel, palette, fuell) => {
  const h = React.createElement;
  const hoehe = BODEN - y;
  const anteil = drittel && drittel.anteil != null ? Math.max(0, Math.min(100, drittel.anteil)) / 100 : null;
  const urteil = drittel && drittel.anteil != null && !drittel.mitPartner;
  const linie = urteil && drittel.ueberDrittel ? palette.roseDeep : palette.text;
  return h('g', { 'data-teil': 'sie-drittel-haus' },
    anteil > 0 && h('rect', { 'data-teil': 'sie-drittel-fuellung', x, y: BODEN - hoehe * anteil, width: HAUS_B, height: hoehe * anteil, fill: fuell }),
    anteil != null && h('line', { 'data-teil': 'sie-drittel-linie', x1: x, x2: x + HAUS_B, y1: BODEN - hoehe / 3, y2: BODEN - hoehe / 3, stroke: linie, strokeWidth: 1.5, ...STRICH }),
    hausForm(x, y, { fill: 'none', stroke: palette.text, strokeWidth: 1.5 }, { fill: 'none', stroke: palette.text, strokeWidth: 1.5, strokeLinejoin: 'round' }),
  );
};

// Das Vergleichshaus (Stebler Studios 11.11.2026: «Kantonshaus, Schweizer Haus und das internationale zu einem
// vereinen, mit Farben und Linien, Fahnen in jeden Stock, die Tür darf die Tonne selbst sein»). Nur gross (Kapitel).
//   • Ein Haus neben Ihrem; jeder Vergleich ist ein Stock auf derselben Franken-Skala wie Ihr Haus:
//     Kanton durchgezogen in der Lage-Farbe, Schweiz gestrichelt grau. Die Beschriftung («ZG 1'875», «CH Ø 1'446»)
//     steht als Fahne am Stock, im Haus. Europa folgt erst nach der Quellenprüfung (kein geschätzter Stock).
//   • Die Tür ist die Tonne der Mietbeiträge: eine Tür, grau gefüllt (Einkommen) mit der Grenze als Linie —
//     dieselbe Lesart wie der Pegel (mietzinsPegelState). Kennt der Kanton ein Programm ohne Zahl: Tür hell getönt.
//     Ohne Programm eine schlichte Tür.
const VH = { x: 44, b: 68, dach: 10, luft: 8, tuerB: 16, tuerH: 24 };
// Die Tür sitzt rechts im Haus, neben dem Wegweiser; links bleibt Platz für die Fahnen der Stöcke.
const VH_TUER_MITTE = VH.x + VH.b - 14;
function vergleichsHaus({ palette, oben, regional, national, dotColor, dotTextColor, fillColor, kanton, tuer, ausland }) {
  const h = React.createElement;
  const yR = oben(regional), yN = oben(national);
  const top = Math.min(yR, yN) - VH.luft;
  const x = VH.x, r = VH.x + VH.b;
  const nah = Math.abs(yR - yN) < 9;
  const unten = (y) => nah && y === Math.max(yR, yN);
  const fahne = (y, t, farbe, teil) => h('text', { 'data-teil': teil, x: x + 4, y: unten(y) ? y + STRASSE_SCHRIFT + 2 : y - 3, fontSize: STRASSE_SCHRIFT, fontWeight: 600, fill: farbe }, t);
  const tl = VH_TUER_MITTE - VH.tuerB / 2, tr = VH_TUER_MITTE + VH.tuerB / 2, tt = BODEN - VH.tuerH;
  const tuerPfad = 'M' + tl + ' ' + BODEN + 'V' + (tt + 4) + 'A4 4 0 0 1 ' + (tl + 4) + ' ' + tt + 'H' + (tr - 4) + 'A4 4 0 0 1 ' + tr + ' ' + (tt + 4) + 'V' + BODEN + 'Z';
  const stand = tuer && tuer.stand && tuer.stand.mode !== 'empty' ? tuer.stand : null;
  const wasser = stand ? Math.min(1, stand.fraction / PEGEL_SKALA) * VH.tuerH : 0;
  const grenzeY = BODEN - VH.tuerH / PEGEL_SKALA;
  return h('g', { 'data-teil': 'vergleichs-haus' },
    h('path', { d: 'M' + x + ' ' + BODEN + 'V' + top + 'L' + (x + VH.b / 2) + ' ' + (top - VH.dach) + 'L' + r + ' ' + top + 'V' + BODEN + 'Z',
      fill: fillColor || 'none', fillOpacity: fillColor ? 0.12 : undefined, stroke: palette.text, strokeWidth: 1.5, strokeLinejoin: 'round', ...STRICH }),
    h('line', { 'data-teil': 'stock-schweiz', x1: x, x2: r, y1: yN, y2: yN, stroke: palette.mid, strokeWidth: 2, strokeDasharray: '5 3', ...STRICH }),
    h('line', { 'data-teil': 'stock-kanton', x1: x, x2: r, y1: yR, y2: yR, stroke: dotColor, strokeWidth: 2.5, ...STRICH }),
    fahne(yR, (kanton ? kanton + ' ' : '') + zahl(regional), dotTextColor || palette.text, 'fahne-kanton'),
    // Regel «Zahl» (Stebler Studios 11.11.2026, Matrix §10): die eigene Zahl steht nicht als Fahne im Haus, sondern
    // gross unter dem Bild wie auf der Kachel. Fahnen tragen nur Vergleichswerte (Kanton, Schweiz, EU).
    fahne(yN, 'CH Ø ' + zahl(national), palette.mid, 'fahne-schweiz'),
    // EU als Stock (Stebler Studios 11.11.2026, «so wie BS und CH»): abgeleitet aus dem Preisniveau für Wohnen und
    // Energie (data/wohnenInternational.js), darum gepunktet blau und eine Prozent-Fahne, kein Frankenbetrag.
    ausland && h('line', { 'data-teil': 'stock-eu', x1: x, x2: r, y1: oben(ausland.eu.hoehe), y2: oben(ausland.eu.hoehe), stroke: palette.skyDeep, strokeWidth: 2, strokeDasharray: '1 3', strokeLinecap: 'round', ...STRICH }),
    ausland && h('text', { 'data-teil': 'fahne-eu', x: x + 4, y: oben(ausland.eu.hoehe) - 3, fontSize: STRASSE_SCHRIFT, fontWeight: 600, fill: palette.skyDeep }, 'EU ' + (ausland.eu.pct >= 0 ? '+' : '−') + Math.abs(ausland.eu.pct) + ' %'),
    // Die Tür (= Tonne)
    h('g', { 'data-teil': 'tuer', 'data-programm': tuer && tuer.programm ? 'ja' : 'nein' },
      h('defs', null, h('clipPath', { id: 'vh-tuer-clip' }, h('path', { d: tuerPfad }))),
      h('path', { d: tuerPfad, fill: tuer && tuer.programm && !stand ? (tuer.farbe || palette.mid) : palette.surface, fillOpacity: tuer && tuer.programm && !stand ? 0.35 : 1 }),
      stand && h('rect', { 'data-teil': 'tuer-fuellung', x: tl, y: BODEN - wasser, width: VH.tuerB, height: wasser, fill: tuer.farbe || palette.mid, opacity: 0.85, clipPath: 'url(#vh-tuer-clip)' }),
      stand && h('line', { 'data-teil': 'tuer-grenze', x1: tl - 2, x2: tr + 2, y1: grenzeY, y2: grenzeY, stroke: palette.skyDeep, strokeWidth: 1.5, strokeDasharray: '3 2', ...STRICH }),
      h('path', { d: tuerPfad, fill: 'none', stroke: palette.text, strokeWidth: 1.5, ...STRICH }),
      h('circle', { cx: tr - 4, cy: BODEN - VH.tuerH / 2, r: 1.2, fill: palette.text })),
  );
}

function haeuserzeile({ palette, t, ariaLabel, hasUser, userValue, regional, national, pct, barFill, dotColor, dotTextColor, hasThreshold, thresholdValue, thresholdBreached, maxBreite, drittel, gross, kanton, userLabel, fillColor, tuer, ausland }) {
  const h = React.createElement;
  const oben = (v) => BODEN - Math.max(4, (pct(v) / 100) * HOEHE);
  const strich = STRICH;
  const haus = (x, v, koerper, dach) => hausForm(x, oben(v), koerper, dach);
  const linieY = hasThreshold ? BODEN - (pct(thresholdValue) / 100) * HOEHE : null;
  const schwelleFarbe = thresholdBreached ? palette.roseDeep : palette.text;
  // Ohne Einkommen kein Anteil: dann bleibt Ihr Haus gefüllt wie bisher (kein leeres Drittel-Haus).
  const mitDrittel = !!drittel && drittel.anteil != null;
  // Gross: Platz über der Strasse für das Dach des Vergleichshauses.
  const breite = gross ? STRASSE_BREITE : (maxBreite || INSTRUMENT_GROESSE.mittel);
  const vb = gross ? VB_GROSS : 132;
  const strasse = h('div', { role: 'img', 'aria-label': ariaLabel, 'data-form': 'haeuser', style: { marginBottom: space.sm + 'px', paddingTop: gross ? space.lg + 'px' : 0 } },
    h('svg', { viewBox: '0 0 ' + vb + ' 90', width: '100%', 'aria-hidden': 'true', focusable: 'false', style: { display: 'block', maxWidth: breite + 'px', height: 'auto', overflow: 'visible' } },
      // Gross: ein Vergleichshaus (Kanton + Schweiz als Stöcke, Tür = Tonne). Mittel: wie bisher drei Häuser.
      gross ? vergleichsHaus({ palette, oben, regional, national, dotColor, dotTextColor, fillColor, kanton, tuer, ausland })
        : h('g', null,
          haus(HAUS_X.schweiz, national, { fill: 'none', stroke: palette.mid, strokeWidth: 1.5, strokeDasharray: '3 2' }, { fill: 'none', stroke: palette.mid, strokeWidth: 1.5, strokeDasharray: '3 2' }),
          haus(HAUS_X.region, regional, { fill: 'none', stroke: palette.text, strokeWidth: 1.5 }, { fill: dotColor, stroke: palette.surface, strokeWidth: 1 })),
      // Sie: das Drittel-Haus klein, wo die Wohnkosten-Rechnung mitkommt; sonst gefüllt (= Füllung)
      hasUser && (mitDrittel ? sieDrittelHaus(HAUS_X.sie, oben(userValue), drittel, palette, barFill) : haus(HAUS_X.sie, userValue, { fill: barFill }, { fill: barFill })),
      h('line', { x1: 0, x2: gross ? vb : 120, y1: BODEN, y2: BODEN, stroke: palette.mid, strokeWidth: 1, ...strich }),
      // Drittel: Linie quer über die Strasse, «!» am Ende — rose nur, wenn Ihr Haus darüber ragt. Trägt Ihr Haus das
      // Drittel selbst (`drittel`), fällt die Linie weg; der Satz und das aria-Label bleiben.
      hasThreshold && !mitDrittel && h('line', { 'data-teil': 'drittel-linie', x1: 0, x2: 120, y1: linieY, y2: linieY, stroke: schwelleFarbe, strokeWidth: 1.5, strokeDasharray: '5 3', ...strich }),
      hasThreshold && !mitDrittel && h('text', { x: 128, y: linieY + 5, textAnchor: 'middle', fontSize: 15, fontWeight: 700, fill: schwelleFarbe }, '!'),
    ),
    // Regel «Zahl» (Stebler Studios 11.11.2026, Matrix §10): unter dem Bild die eine Hauptzahl gross wie auf der Kachel
    // (Lage gegen den Kanton, dieselbe Rechnung lageZurRegion), darunter klein Ihre Miete. Eigene Franken über
    // betrag(), damit der Sichtschutz greift. Rein Bild-Beschriftung (aria-hidden): der Satz darunter sagt es.
    gross && hasUser && userValue > 0 && (() => {
      const lage = lageZurRegion(userValue, regional);
      const wert = lage.richtung === 'Equal' ? '≈ 0 %' : (lage.pct > 0 ? '+' : '−') + Math.abs(lage.pct) + ' %';
      return h('div', { 'data-teil': 'strasse-hauptzahl', 'aria-hidden': 'true', style: { marginTop: space.sm + 'px' } },
        h('div', { 'data-instrument-zahl': 'miete', style: { fontSize: text['2xl'], fontWeight: weight.semi, lineHeight: 1.1, color: palette.text, fontVariantNumeric: 'tabular-nums' } }, wert),
        h('div', { 'data-teil': 'strasse-betrag', style: { fontSize: text.xs, color: palette.mid, marginTop: '2px', whiteSpace: 'nowrap' } },
          (userLabel ? t('strasse.ausprobiert') : t('strasse.eigen')) + ': ' + betrag(userValue)));
    })(),
  );
  // Der Wegweiser steht IN der Strasse rechts vom Vergleichshaus, auf dem Boden (Stebler Studios 11.11.2026) — als
  // Knopf ausserhalb des Bildes (role=img), darübergelegt: ein Kasten so hoch wie die Strasse bis zum Boden
  // (padding-bottom in Prozent der Breite), darin der Wegweiser unten rechts.
  if (!(gross && tuer && tuer.schild)) return strasse;
  return h('div', { 'data-teil': 'strasse-mit-schild', style: { position: 'relative', maxWidth: breite + 'px' } },
    strasse,
    h('div', { style: { position: 'absolute', left: 0, right: 0, top: space.lg + 'px', height: 0, paddingBottom: (BODEN / vb * 100) + '%', pointerEvents: 'none' } },
      h('div', { 'data-teil': 'wegweiser-in-strasse', style: { position: 'absolute', bottom: 0, left: ((VH.x + VH.b + 6) / vb * 100) + '%', pointerEvents: 'auto' } }, tuer.schild)));
}

// Die Häuserzeile klein (64 px, Brand Book §7b «Spiegel Startseite»; Stebler Studios 11.11.2026 «Kacheln 64
// Wohnen»): dieselben drei Häuser wie im Kapitel — Ihr Haus gefüllt, die Region mit Dach in der Farbe Ihrer
// Lage (lageZurRegion, wie der Punkt), die Schweiz gestrichelt. Ohne Drittel-Linie: das Drittel trägt die
// Nachbarkachel (Drittel-Haus). Keine Wörter, die Zahl steht daneben. Ersetzt das kleine Barometer.
export const HaeuserzeileKlein = ({ palette, comparison, userValue, fillColor, drittel }) => {
  if (!comparison) return null;
  const h = React.createElement;
  const { regional, national } = comparison;
  const max = skala(regional, national, userValue);
  const oben = (v) => BODEN - Math.max(4, Math.min(1, v / max) * HOEHE);
  const lage = lageZurRegion(userValue, regional);
  const dach = !lage ? palette.mid : lage.richtung === 'Above' ? palette.gold : lage.richtung === 'Below' ? palette.sage : palette.mid;
  const fuell = fillColor || palette.sky;
  return h('svg', { viewBox: '2 12 114 74', width: '100%', 'aria-hidden': 'true', focusable: 'false', 'data-form': 'haeuser-klein', style: { display: 'block', maxWidth: INSTRUMENT_GROESSE.klein + 'px', height: 'auto', overflow: 'visible' } },
    hausForm(HAUS_X.schweiz, oben(national), { fill: 'none', stroke: palette.mid, strokeWidth: 1.5, strokeDasharray: '3 2' }, { fill: 'none', stroke: palette.mid, strokeWidth: 1.5, strokeDasharray: '3 2' }),
    hausForm(HAUS_X.region, oben(regional), { fill: 'none', stroke: palette.text, strokeWidth: 1.5 }, { fill: dach, stroke: palette.surface, strokeWidth: 1 }),
    userValue > 0 && (drittel && drittel.anteil != null ? sieDrittelHaus(HAUS_X.sie, oben(userValue), drittel, palette, fuell) : hausForm(HAUS_X.sie, oben(userValue), { fill: fuell }, { fill: fuell })),
    h('line', { x1: 2, x2: 116, y1: BODEN, y2: BODEN, stroke: palette.mid, strokeWidth: 1, ...STRICH }),
  );
};

// Zwei Häuser (Budget, Gruppe «Wohnen», 11.11.2026, Stebler Studios «Richtwert als Häuserzeile»): Ihre
// Wohnkosten gegen den BFS-Richtwert eines vergleichbaren Haushalts. Dieselben Marken wie die Häuserzeile:
// Ihr Haus gefüllt (= Füllung), das Vergleichshaus mit Dach in der Farbe Ihrer Lage (gold = Sie darüber,
// salbei = darunter, ±2 % neutral — wie der Punkt). Rein Bild (aria-hidden): Betrag und Richtwert stehen im
// Text daneben. Keine neue Aussage — der Richtwert-Satz mit Quelle bleibt.
export function lageFarbe(palette, wert, vergleich) {
  if (!(wert > 0) || !(vergleich > 0)) return palette.mid;
  return wert > vergleich * 1.02 ? palette.gold : wert < vergleich * 0.98 ? palette.sage : palette.mid;
}
export const HaeuserVergleich = ({ palette, sie, vergleich, fuell, maxBreite }) => {
  if (!(sie > 0) || !(vergleich > 0)) return null;
  const h = React.createElement;
  const skala = Math.max(sie, vergleich) * 1.15;
  const oben = (v) => BODEN - Math.max(4, (v / skala) * HOEHE);
  return h('svg', { viewBox: '0 0 84 90', width: '100%', 'aria-hidden': 'true', focusable: 'false', 'data-form': 'haeuser-vergleich', style: { display: 'block', maxWidth: (maxBreite || INSTRUMENT_GROESSE.klein) + 'px', height: 'auto', overflow: 'visible' } },
    hausForm(HAUS_X.region, oben(vergleich), { fill: 'none', stroke: palette.text, strokeWidth: 1.5 }, { fill: lageFarbe(palette, sie, vergleich), stroke: palette.surface, strokeWidth: 1 }),
    hausForm(HAUS_X.sie, oben(sie), { fill: fuell }, { fill: fuell }),
    h('line', { x1: 0, x2: 82, y1: BODEN, y2: BODEN, stroke: palette.mid, strokeWidth: 1, ...STRICH }),
  );
};

export default RegionalBarometer;

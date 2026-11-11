import React, { useState } from 'react';
import { text, weight, space, leading, duration, ease, INSTRUMENT_GROESSE } from '../config/tokens.js';
import { getHouseholdInfo } from '../config/cantonalData.js';
import { getRentComparison } from '../data/mietpreise.js';
import { bereichFillColor } from '../data/lebensbereiche.js';
import { wohnkostenRechnung, drittelGrenzeMiete } from '../data/wohnkosten.js';
import { zahl, betrag } from '../utils/geld.js';
import { RegionalBarometer } from './RegionalBarometer.jsx';
import { LegendenMarke } from './LegendenMarke.jsx';
import { knopfStil } from './PrimaryButton.jsx';

// Kapitel Wohnen · das Instrument oben (Fassung 6, Runde 9, Entwurf Z, Entscheid Stebler Studios 24.10.2026).
// Ersetzt den Kasten «Wohnkosten / Einkommen / Anteil» und im Kapitel den MietVergleich:
//   1. «Wohnkosten pro Monat» gross, darunter der Anteil am Einkommen mit Marke bei einem Drittel.
//   2. Das Regional-Barometer «Miete regional vs. Schweiz» (RegionalBarometer, kind «rent»). Ohne
//      Drittel-«!» — die Drittel-Marke steht schon im Balken darüber, zweimal wäre doppelt.
//   3. Aufklappbar «Ausprobieren: andere Miete»: ein Regler für die Nettomiete. Alles oben folgt ihm.
//      Der Wert lebt nur in diesem Bauteil (useState) — das Profil wird nie verändert, nichts gespeichert.
//
// Einkommen und «Frei verfügbar» kommen aus der einen Monatsrechnung (utils/monatsrechnung.js), wie
// «Jeden Monat bleiben» im Kapitel Finanzen. Ist der eigene Lohn brutto erfasst, gibt es keine
// «Frei verfügbar»-Zahl, sondern die Netto-Frage (budgetSync.availableNeedsNetto), wie dort.
//
// Die Drittel-Marke ist eine Faustregel, keine Vorschrift (Swiss-Precision-Prüfer) — so steht es im Text.
// Fachprüfung 24.10.2026, eingearbeitet:
//   • Partner/in: die Miete gilt für den Haushalt, das Einkommen ist das eigene. Dann heisst es
//     «Ihres eigenen Einkommens», und statt «Mehr als ein Drittel» steht, dass Partner/in fehlt.
//   • «des Bruttoeinkommens» nur, wenn wirklich alles brutto ist; sonst «teils brutto».
//   • Eigentum mit Hypothek: Hypothek und Gebäudeversicherung zählen zu den Wohnkosten, und den
//     Regler gibt es nicht — er rechnete die neue Miete neben der weiterlaufenden Hypothek.

export const REGLER_MIN = 800;
export const REGLER_MAX = 3500;
export const REGLER_SCHRITT = 50;
// Eine erfasste Miete über 3'500 bleibt auf dem Regler erreichbar (kein Sprung beim ersten Schieben).
export const reglerMax = (heute) => Math.max(REGLER_MAX, Math.ceil(heute / REGLER_SCHRITT) * REGLER_SCHRITT);

const aufRegler = (v, max) => Math.min(max, Math.max(REGLER_MIN, Math.round(v / REGLER_SCHRITT) * REGLER_SCHRITT));

// Die Rechnung liegt seit 11.11.2026 in data/wohnkosten.js — eine Quelle für Kapitel, Mietzins-Werkzeug
// und Budget. Mietzins (MietVergleich) und Budget holen sie über DIESE Datei: so landet sie im
// bestehenden Baustein «WohnkostenInstrument» und nicht in einem eigenen, dessen Name sonst im
// Startbündel stünde (gemessen 11.11.2026: eigener Baustein = 65’005 / 65’000 B).
export { wohnkostenRechnung, drittelGrenzeMiete };

// Das Drittel-Haus (Stebler Studios 11.11.2026, «A und B kombiniert»): das Haus ist das ganze Einkommen,
// drei gleiche Stockwerke, das Erdgeschoss ist ein Drittel. Die Wohnkosten füllen es von unten. Reicht die
// Füllung in den ersten Stock, geht mehr als ein Drittel ans Wohnen. Ersetzt den Drittel-Balken; dieselbe
// Rechnung (`anteil`, `ueberDrittel`), dieselben Farben (Birne, über einem Drittel Sand). Mit Partner/in bleibt
// es Birne — kein Urteil, wie der Satz. Rein Bild: die Zahl und der Satz stehen daneben (aria-hidden).
// Grösse nach Brand Book §7b: gross 256 im Kapitel, klein 64 in der Übersicht.
const HAUS = { x: 12, oben: 44, b: 96, stock: 24 };
export const DrittelHaus = ({ palette, anteil, ueberDrittel, mitPartner, fuell, groesse = 'gross' }) => {
  const h = React.createElement;
  const koerper = HAUS.stock * 3;
  const boden = HAUS.oben + koerper;
  const voll = Math.max(0, Math.min(100, anteil || 0)) / 100 * koerper;
  const farbe = ueberDrittel && !mitPartner ? palette.sand : fuell;
  const linie = { vectorEffect: 'non-scaling-stroke' };
  return h('svg', {
    viewBox: '0 0 120 ' + (boden + 4), width: '100%', 'aria-hidden': 'true', focusable: 'false', 'data-teil': 'drittel-haus',
    style: { display: 'block', maxWidth: INSTRUMENT_GROESSE[groesse] + 'px', height: 'auto' },
  },
    voll > 0 && h('rect', { 'data-teil': 'drittel-haus-fuellung', x: HAUS.x, y: boden - voll, width: HAUS.b, height: voll, fill: farbe }),
    // Zwischen 1. und 2. Stock nur fein, über dem Erdgeschoss die feste Linie: das Drittel.
    h('line', { x1: HAUS.x, x2: HAUS.x + HAUS.b, y1: HAUS.oben + HAUS.stock, y2: HAUS.oben + HAUS.stock, stroke: palette.mid, strokeWidth: 1, strokeDasharray: '3 3', ...linie }),
    h('line', { 'data-teil': 'drittel-haus-drittel', x1: HAUS.x, x2: HAUS.x + HAUS.b, y1: boden - HAUS.stock, y2: boden - HAUS.stock, stroke: palette.text, strokeWidth: 2, ...linie }),
    h('rect', { x: HAUS.x, y: HAUS.oben, width: HAUS.b, height: koerper, fill: 'none', stroke: palette.text, strokeWidth: 1.5, ...linie }),
    h('path', { d: 'M' + (HAUS.x - 8) + ' ' + HAUS.oben + 'L60 6L' + (HAUS.x + HAUS.b + 8) + ' ' + HAUS.oben + 'Z', fill: 'none', stroke: palette.text, strokeWidth: 1.5, strokeLinejoin: 'round', ...linie }),
  );
};

// Welcher Text unter «… % des Einkommens» steht.
// Partner-Haus (11.11.2026): mit dem Haushalt gerechnet → «der Netto-Einnahmen Ihres Haushalts».
const anteilKey = (r) => r.brutto ? (r.ganzBrutto ? 'wohnenInstrument.anteilBrutto' : 'wohnenInstrument.anteilTeilsBrutto')
  : r.haushalt ? 'wohnenInstrument.anteilHaushalt' : r.mitPartner ? 'wohnenInstrument.anteilEigen' : 'wohnenInstrument.anteil';
const satzKey = (r) => r.partnerOffen ? 'wohnenInstrument.partnerOffen' : r.mitPartner ? 'wohnenInstrument.mitPartner'
  : r.ueberDrittel ? 'wohnenInstrument.mehrAlsDrittel' : 'wohnenInstrument.faustregel';

// Kurzer Satz für die Instrument-Kachel: wessen Einkommen gemeint ist (dieselben Fälle wie anteilKey).
export const wohnkostenSatzKey = (r) => r.brutto ? (r.ganzBrutto ? 'instrumente.wohnkostenSatzBrutto' : 'instrumente.wohnkostenSatzTeilsBrutto')
  : r.haushalt ? 'instrumente.wohnkostenSatzHaushalt' : r.mitPartner ? 'instrumente.wohnkostenSatzEigen' : 'instrumente.wohnkostenSatz';

export const WohnkostenInstrument = ({ palette, t, wohnen, allData, isDarkMode }) => {
  const [probe, setProbe] = useState(null);
  const [offen, setOffen] = useState(false);
  const r = wohnkostenRechnung(wohnen, allData, probe);
  // Ohne erfasste Wohnkosten bleibt das Instrument weg — das Formular darunter ist der Ort zum Eintragen.
  if (r.kosten <= 0) return null;
  const max = reglerMax(r.heute);

  const ausprobiert = probe != null && probe !== r.heute;
  const fuell = bereichFillColor('wohnen', isDarkMode) || palette.sage;
  // Ganze Prozent wie die Monatskarte. Nur knapp über einem Drittel eine Stelle, sonst stünde 33 % neben «mehr als ein Drittel».
  const pct = r.anteil == null ? null : zahl(r.anteil, { hoechstens: r.ueberDrittel && Math.round(r.anteil) === 33 ? 1 : 0 });

  const canton = allData?.basis?.canton || '';
  const hh = getHouseholdInfo(allData) || {};
  const vergleich = canton && r.netto > 0 ? getRentComparison(canton, { rooms: wohnen?.rooms, householdSize: hh.householdSize || 1 }) : null;

  const klein = { fontSize: text.xs, color: palette.mid, lineHeight: leading.normal };
  const zeile = { display: 'flex', justifyContent: 'space-between', gap: space.md + 'px', padding: '8px 0', fontSize: text.sm, color: palette.text };
  const kapH = { margin: space.lg + 'px 0 0', fontSize: text.sm, fontWeight: weight.semi, color: palette.text };

  return React.createElement('section', { 'data-teil': 'wohnkosten', style: { marginBottom: space.lg + 'px' } },
    React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginBottom: '2px' } },
      t(ausprobiert ? 'wohnenInstrument.titelAusprobiert' : 'wohnenInstrument.titel')),
    React.createElement('div', { 'aria-live': 'polite', style: { fontSize: text['2xl'], fontWeight: weight.bold, color: palette.text, lineHeight: 1.2 } }, betrag(r.kosten)),

    // Anteil am Einkommen im Drittel-Haus. Das Haus wiederholt die Zahl daneben — für Screenreader stumm.
    r.anteil != null && React.createElement(React.Fragment, null,
      React.createElement('div', { style: { margin: space.md + 'px 0 ' + space.sm + 'px' } },
        React.createElement(DrittelHaus, { palette, anteil: r.anteil, ueberDrittel: r.ueberDrittel, mitPartner: r.mitPartner, fuell })),
      React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2px ' + space.md + 'px', fontSize: text.sm, color: palette.mid } },
        React.createElement('span', null, t(anteilKey(r), { pct, einkommen: zahl(r.einkommen) })),
        React.createElement('span', null, React.createElement(LegendenMarke, { form: 'strich', color: palette.text, palette }), t('wohnenInstrument.drittel'))
      ),
      React.createElement('p', { 'data-teil': 'drittel-satz', style: { ...klein, margin: space.xs + 'px 0 0', color: r.ueberDrittel ? palette.text : palette.mid } },
        t(satzKey(r)))
    ),
    r.anteil == null && React.createElement('p', { style: { ...klein, margin: space.xs + 'px 0 0' } }, t('wohnenInstrument.ohneEinkommen')),

    // Regional-Barometer, wie in der Finanz-Auswertung. Folgt dem Regler.
    vergleich && React.createElement(React.Fragment, null,
      React.createElement('h3', { style: kapH }, t('po.regionalCompare.rent.title')),
      React.createElement(RegionalBarometer, {
        palette, t, comparison: vergleich, userValue: r.netto, kind: 'rent', compact: true, fillColor: fuell, imKapitel: true,
        form: 'haeuser', maxBreite: INSTRUMENT_GROESSE.gross,
        userLabel: ausprobiert ? t('wohnenInstrument.ausprobierteMiete', { amount: zahl(r.netto) }) : undefined,
      })
    ),

    // Ausprobieren: andere Miete — nur hier, nichts wird gespeichert. Nicht bei Eigentum (siehe oben).
    // Das «›» zeigt, dass die Zeile aufgeht (Abnahme F6, 25.10.2026: ohne Zeichen wirkte sie nicht aufklappbar).
    !r.eigentum && React.createElement('details', { 'data-teil': 'miete-ausprobieren', onToggle: (e) => setOffen(e.currentTarget.open), style: { marginTop: space.md + 'px', borderTop: '1px solid ' + palette.border + '88', paddingTop: space.sm + 'px' } },
      React.createElement('summary', { style: { cursor: 'pointer', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: space.sm + 'px', fontSize: text.sm, fontWeight: weight.semi, color: palette.text, listStyle: 'none' } },
        React.createElement('span', null, t('wohnenInstrument.ausprobieren')),
        React.createElement('span', { style: { display: 'flex', alignItems: 'center', gap: space.sm + 'px', fontSize: text.xs, fontWeight: weight.normal, color: palette.mid } },
          t('wohnenInstrument.wohnungssuche'),
          React.createElement('span', { 'aria-hidden': 'true', 'data-teil': 'ausprobieren-zeichen', style: { fontSize: text.lg, lineHeight: 1, color: palette.mid, transform: offen ? 'rotate(90deg)' : 'none', transition: 'transform ' + duration.fast + 'ms ' + ease } }, '›')
        )
      ),
      React.createElement('div', { style: { paddingTop: space.xs + 'px' } },
        React.createElement('label', { htmlFor: 'wohnen-regler', style: { ...zeile, paddingBottom: 0 } },
          React.createElement('span', null, t('wohnenInstrument.reglerLabel')),
          React.createElement('span', { style: { fontWeight: weight.semi, color: palette.text, whiteSpace: 'nowrap' } }, betrag(r.netto))
        ),
        React.createElement('input', {
          id: 'wohnen-regler', type: 'range', min: REGLER_MIN, max, step: REGLER_SCHRITT,
          value: aufRegler(probe ?? (r.heute || REGLER_MIN), max),
          onChange: (e) => setProbe(Number(e.target.value)),
          'aria-valuetext': betrag(r.netto),
          style: { width: '100%', minHeight: '44px', accentColor: fuell, margin: 0 },
        }),
        React.createElement('div', { style: zeile },
          React.createElement('span', null, t('wohnenInstrument.nebenkostenWieHeute')),
          React.createElement('span', { style: { color: palette.text, whiteSpace: 'nowrap' } }, betrag(r.nk))
        ),
        r.brutto && r.einkommen > 0
          ? React.createElement('div', { role: 'status', style: { ...zeile, display: 'block', borderTop: '1px solid ' + palette.border + '88' } }, t('budgetSync.availableNeedsNetto'))
          : r.frei != null && React.createElement('div', { role: 'status', 'data-teil': 'frei-danach', style: { ...zeile, fontWeight: weight.semi, borderTop: '1px solid ' + palette.border + '88' } },
              React.createElement('span', null, t(r.frei < 0 ? 'wohnenInstrument.fehltDanach' : 'wohnenInstrument.freiDanach')),
              React.createElement('span', { style: { color: palette.text, whiteSpace: 'nowrap' } }, betrag(Math.abs(r.frei)))
            ),
        React.createElement('p', { style: { ...klein, margin: space.xs + 'px 0 ' + space.sm + 'px' } }, t('wohnenInstrument.durchspielen')),
        probe != null && React.createElement('button', {
          type: 'button', onClick: () => setProbe(null),
          style: knopfStil(palette, 'neben'),
        }, t('wohnenInstrument.zurueck'))
      )
    )
  );
};

export default WohnkostenInstrument;

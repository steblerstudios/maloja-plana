import React, { useState } from 'react';
import { text, weight, radius, space, leading, duration, ease, INSTRUMENT_GROESSE } from '../config/tokens.js';
import { getHouseholdInfo } from '../config/cantonalData.js';
import { getRentComparison } from '../data/mietpreise.js';
import { bereichFillColor } from '../data/lebensbereiche.js';
import { eigeneEinnahmen, sumAllExpenses } from '../utils/monatsrechnung.js';
import { haushaltsEinnahmen } from '../data/haushaltsEinnahmen.js';
import { partnerEinkommenRoh } from '../utils/partnereinkommen.js';
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

const n = (v) => { const x = Number(v); return Number.isFinite(x) && x > 0 ? x : 0; };
const aufRegler = (v, max) => Math.min(max, Math.max(REGLER_MIN, Math.round(v / REGLER_SCHRITT) * REGLER_SCHRITT));

// Reine Rechnung, damit sie ohne DOM geprüft werden kann. `wohnen` ist der gerade bearbeitete Stand
// des Kapitels, `allData` das ganze Profil, `miete` die (ausprobierte) Nettomiete.
export function wohnkostenRechnung(wohnen, allData, miete) {
  const heute = n(wohnen?.rentAmount);
  const nk = n(wohnen?.utilities);
  const netto = miete == null ? heute : n(miete);
  // Eigentum: wie die Monatsrechnung — «Hypothek vorhanden? Nein» zählt nicht.
  const hypothek = wohnen?.mortgageStatus === 'no' ? 0 : n(wohnen?.mortgagePayment);
  const eigentum = hypothek > 0;
  const kosten = netto + nk + hypothek + n(wohnen?.buildingsInsurance) / 12;
  const { total: einkommen, brutto } = eigeneEinnahmen(allData?.finanzen);
  const e = haushaltsEinnahmen({ finanzen: allData?.finanzen || {} });
  const ganzBrutto = brutto && e.lohnArt === 'brutto' && e.lohn > 0 && (e.neben === 0 || e.nebenArt === 'brutto') && e.familienzulagen + e.alimente === 0;
  const mitPartner = n(partnerEinkommenRoh(allData?.basis)) > 0;
  const anteil = einkommen > 0 ? (kosten / einkommen) * 100 : null;
  const profil = { ...(allData || {}), wohnen: { ...(wohnen || {}), rentAmount: netto } };
  const frei = einkommen > 0 && !brutto ? einkommen - sumAllExpenses(allData?.finanzen, profil) : null;
  return { heute, nk, netto, kosten, eigentum, einkommen, brutto, ganzBrutto, mitPartner, anteil, ueberDrittel: anteil != null && anteil > 100 / 3, frei };
}

// Welcher Text unter «… % des Einkommens» steht.
const anteilKey = (r) => r.brutto ? (r.ganzBrutto ? 'wohnenInstrument.anteilBrutto' : 'wohnenInstrument.anteilTeilsBrutto')
  : r.mitPartner ? 'wohnenInstrument.anteilEigen' : 'wohnenInstrument.anteil';
const satzKey = (r) => r.mitPartner ? 'wohnenInstrument.mitPartner' : r.ueberDrittel ? 'wohnenInstrument.mehrAlsDrittel' : 'wohnenInstrument.faustregel';

// Der Drittel-Balken klein (64 px, Brand Book §7b «Spiegel Startseite», 10.11.2026): nur das Bild —
// Füllung = Anteil der Wohnkosten am Einkommen, Strich = ein Drittel. Dieselbe Rechnung wie gross.
export const DrittelBalkenKlein = ({ palette, r, fillColor }) => {
  const h = React.createElement;
  const breite = 56;
  return h('svg', { viewBox: '0 0 60 40', width: '100%', 'aria-hidden': true, 'data-drittel': 'klein', style: { maxWidth: INSTRUMENT_GROESSE.klein + 'px', height: 'auto', display: 'block', overflow: 'visible' } },
    h('rect', { x: 2, y: 16, width: breite, height: 8, rx: 4, fill: palette.border }),
    r.anteil != null && h('rect', { x: 2, y: 16, width: Math.max(8, Math.min(100, r.anteil) / 100 * breite), height: 8, rx: 4, fill: r.ueberDrittel ? palette.sand : (fillColor || palette.sage) }),
    h('line', { x1: 2 + breite / 3, y1: 10, x2: 2 + breite / 3, y2: 30, stroke: palette.text, strokeWidth: 2 }),
  );
};

// Kurzer Satz für die Instrument-Kachel: wessen Einkommen gemeint ist (dieselben Fälle wie anteilKey).
export const wohnkostenSatzKey = (r) => r.brutto ? (r.ganzBrutto ? 'instrumente.wohnkostenSatzBrutto' : 'instrumente.wohnkostenSatzTeilsBrutto')
  : r.mitPartner ? 'instrumente.wohnkostenSatzEigen' : 'instrumente.wohnkostenSatz';

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

    // Anteil am Einkommen mit Drittel-Marke. Der Balken wiederholt die Zahl daneben — für Screenreader stumm.
    r.anteil != null && React.createElement(React.Fragment, null,
      React.createElement('div', { 'aria-hidden': 'true', 'data-teil': 'drittel-balken', style: { position: 'relative', height: '10px', margin: space.md + 'px 0 ' + space.sm + 'px', borderRadius: radius.full, background: palette.up, border: '1px solid ' + palette.border } },
        React.createElement('div', { style: { position: 'absolute', left: 0, top: 0, bottom: 0, width: Math.min(100, r.anteil) + '%', background: r.ueberDrittel ? palette.sand : fuell, borderRadius: radius.full } }),
        React.createElement('div', { style: { position: 'absolute', top: '-5px', bottom: '-5px', left: (100 / 3) + '%', width: '2px', background: palette.text } })
      ),
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

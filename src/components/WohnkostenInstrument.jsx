import React, { useState } from 'react';
import { text, weight, space, leading, duration, ease, INSTRUMENT_GROESSE } from '../config/tokens.js';
import { getHouseholdInfo } from '../config/cantonalData.js';
import { getRentComparison } from '../data/mietpreise.js';
import { bereichFillColor } from '../data/lebensbereiche.js';
import { wohnkostenRechnung, drittelGrenzeMiete } from '../data/wohnkosten.js';
import { zahl, betrag } from '../utils/geld.js';
import { RegionalBarometer } from './RegionalBarometer.jsx';
import { LegendenMarke } from './LegendenMarke.jsx';
import { Pegel } from './Pegel.jsx';
import { Icon } from '../IconSystem.jsx';
import { ansichtIkon } from '../config/ansichtenRegister.js';
import { ExternerLink } from './ExternerLink.jsx';
import { mietzinsEinschaetzung, beitragHoechstMonat, PROGRAMM_KANTONE, KACHELKARTE_LAGE } from '../data/mietzinsbeitraege.js';
import { mietzinsPegelState } from '../data/pegel.js';
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
// Ausgebaut 11.11.2026 (Stebler Studios, Kombination A–E nach Grösse: «Ja, so bauen»; Wächter drittelHausAusbau.test.js):
//   A «!» an der Drittel-Linie: graphit, Rosé (roseDeep) erst darüber — Linie und «!» zusammen. Ohne Urteil kein «!».
//   B Die Füllung ist das ganze Haus, gestaucht auf den Anteil (scaleY): sie steigt beim Erscheinen (mp-steigen) und
//     folgt dem Regler mit demselben Übergang. «Weniger Bewegung» stellt beides still (tokens.css, beide Schalter).
//   C Viertel-Strich, gross + mittel, nur netto und mit Urteil: Budgetberatung Schweiz (budgetberatung.ch/wohnen,
//     geprüft 11.11.2026): «Der Dachverband empfiehlt, dass die Wohnkosten nicht mehr als ein Viertel der
//     Nettoeinnahmen betragen.»
//   D «alles andere» im oberen Teil, nur gross.  E Partner-Haus geteilt (Sie | Partner/in), nur gross.
// Klein 64 zeigt nur A und B — nichts Feines (§7b).
//   F Mietzinsbeitrag (11.11.2026, Stebler Studios «im Haus weiter füllen, gestrichelt, Behörden-Farbe»): `beitrag`
//     = { anteil (% des Einkommens), farbe } — oben in der Füllung schraffiert und gestrichelt, so viel könnte der
//     Kanton höchstens übernehmen. Nur gross + mittel. Der Satz daneben sagt «bis zu».
export const DrittelHaus = ({ palette, t, anteil, ueberDrittel, mitPartner, brutto, teile, beitrag, fuell, groesse = 'gross' }) => {
  const h = React.createElement;
  const gross = groesse === 'gross';
  const klein = groesse === 'klein';
  const koerper = HAUS.stock * 3;
  const boden = HAUS.oben + koerper;
  const anteil01 = Math.max(0, Math.min(100, anteil || 0)) / 100;
  const urteil = !mitPartner && anteil != null;
  const darueber = urteil && ueberDrittel;
  // Die Füllung bleibt immer grün (Wohnen): die Warnung tragen Linie und «!» (Stebler Studios 11.11.2026, «darf grün
  // gefüllt werden und nicht golden»). Bis dahin wurde sie über einem Drittel Sand.
  const farbe = fuell;
  const drittelFarbe = darueber ? palette.roseDeep : palette.text;
  const linie = { vectorEffect: 'non-scaling-stroke' };
  const strich = klein ? 2.5 : 1.5;
  const drittelY = boden - HAUS.stock;
  const viertelY = boden - koerper / 4;
  const geteilt = gross && teile && teile.sie > 0 && teile.partner > 0;
  const teilX = geteilt ? Math.round((HAUS.x + HAUS.b * teile.sie / (teile.sie + teile.partner)) * 10) / 10 : null;
  // Wörter nur gross: die Schrift ist so gesetzt, dass sie bei 256 px genau text.xs (13 px) misst (Regel H).
  const schrift = { fontSize: Math.ceil(text.xs * 120 / INSTRUMENT_GROESSE.gross * 100) / 100, fill: palette.mid, textAnchor: 'middle' };
  const hoehe = boden + (geteilt ? 14 : 4);
  const beitragH = !klein && beitrag && beitrag.anteil > 0 && anteil01 > 0
    ? koerper * Math.min(beitrag.anteil / 100, anteil01) : 0;
  const fuellOben = boden - koerper * anteil01;
  return h('svg', {
    viewBox: '0 0 120 ' + hoehe, width: '100%', 'aria-hidden': 'true', focusable: 'false', 'data-teil': 'drittel-haus',
    style: { display: 'block', maxWidth: INSTRUMENT_GROESSE[groesse] + 'px', height: 'auto', overflow: 'visible' },
  },
    anteil01 > 0 && h('rect', {
      'data-teil': 'drittel-haus-fuellung', x: HAUS.x, y: HAUS.oben, width: HAUS.b, height: koerper, fill: farbe,
      style: {
        transform: 'scaleY(' + anteil01 + ')', transformBox: 'fill-box', transformOrigin: 'bottom',
        transition: 'transform ' + duration.slow + 'ms ' + ease + ', fill ' + duration.slow + 'ms ' + ease,
        animation: 'mp-steigen ' + duration.slow + 'ms ' + ease,
      },
    }),
    beitragH > 0 && h('defs', null, h('pattern', { id: 'drittel-haus-schraffur', width: 6, height: 6, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' },
      h('line', { x1: 0, y1: 0, x2: 0, y2: 6, stroke: beitrag.farbe, strokeWidth: 2, opacity: 0.55 }))),
    beitragH > 0 && h('rect', {
      'data-teil': 'drittel-haus-beitrag', x: HAUS.x + 0.75, y: fuellOben, width: HAUS.b - 1.5, height: beitragH,
      fill: 'url(#drittel-haus-schraffur)', stroke: beitrag.farbe, strokeWidth: 1.5, strokeDasharray: '4 3', ...linie,
      style: { animation: 'fadeIn ' + duration.slow + 'ms ' + ease },
    }),
    !klein && h('line', { x1: HAUS.x, x2: HAUS.x + HAUS.b, y1: HAUS.oben + HAUS.stock, y2: HAUS.oben + HAUS.stock, stroke: palette.mid, strokeWidth: 1, strokeDasharray: '3 3', ...linie }),
    !klein && urteil && !brutto && h('line', { 'data-teil': 'drittel-haus-viertel', x1: HAUS.x, x2: HAUS.x + HAUS.b, y1: viertelY, y2: viertelY, stroke: palette.mid, strokeWidth: 1, strokeDasharray: '1 3', strokeLinecap: 'round', ...linie }),
    geteilt && h('line', { 'data-teil': 'drittel-haus-teilung', x1: teilX, x2: teilX, y1: HAUS.oben + HAUS.stock, y2: boden, stroke: palette.mid, strokeWidth: 1, strokeDasharray: '2 2', ...linie }),
    // Kante in der Flächenfarbe unter der Drittel-Linie: Rosé auf Sand allein trägt zu wenig (Vorschaubild 11.11.).
    anteil01 > 0.29 && h('line', { x1: HAUS.x, x2: HAUS.x + HAUS.b, y1: drittelY, y2: drittelY, stroke: palette.surface, strokeWidth: klein ? 5 : 4, ...linie }),
    h('line', { 'data-teil': 'drittel-haus-drittel', x1: HAUS.x, x2: HAUS.x + HAUS.b, y1: drittelY, y2: drittelY, stroke: drittelFarbe, strokeWidth: klein ? 3 : 2, ...linie }),
    h('rect', { x: HAUS.x, y: HAUS.oben, width: HAUS.b, height: koerper, fill: 'none', stroke: palette.text, strokeWidth: strich, ...linie }),
    h('path', { d: 'M' + (HAUS.x - 8) + ' ' + HAUS.oben + 'L60 6L' + (HAUS.x + HAUS.b + 8) + ' ' + HAUS.oben + 'Z', fill: 'none', stroke: palette.text, strokeWidth: strich, strokeLinejoin: 'round', ...linie }),
    urteil && h('text', { 'data-teil': 'drittel-ausrufe', x: HAUS.x + HAUS.b + 6, y: drittelY + (klein ? 8 : 6), fontSize: klein ? 24 : 16, fontWeight: 700, fill: drittelFarbe }, '!'),
    gross && t && h('text', { x: 60, y: HAUS.oben + HAUS.stock - 9, ...schrift }, t('wohnenInstrument.hausRest')),
    geteilt && t && h('text', { x: (HAUS.x + teilX) / 2, y: boden + 11, ...schrift }, t('wohnenInstrument.hausSie')),
    geteilt && t && h('text', { x: (teilX + HAUS.x + HAUS.b) / 2, y: boden + 11, ...schrift }, t('wohnenInstrument.hausPartner')),
  );
};

// Der mögliche Mietzinsbeitrag im Haus (F): eine Stelle für Kapitel und Werkzeug. Nur mit Urteil (nicht bei
// Partner/in ohne Haushalt-Rechnung) und nur, wo ein Höchstbetrag belegt ist und das Einkommen unter der Grenze liegt.
export const beitragImHaus = (data, r, isDarkMode, palette, kanton = data?.basis?.canton || '') => {
  if (!kanton || !r || r.anteil == null || r.mitPartner || !(r.einkommen > 0)) return null;
  const hoechst = beitragHoechstMonat(mietzinsEinschaetzung(data, kanton), data?.wohnen?.rooms);
  if (!hoechst) return null;
  return { anteil: Math.min(hoechst, r.kosten) / r.einkommen * 100, farbe: bereichFillColor('behoerden', isDarkMode) || palette.mid, hoechst };
};
const BeitragLegende = ({ palette, t, beitrag }) => React.createElement('p', {
  'data-teil': 'beitrag-legende', style: { fontSize: text.xs, color: palette.mid, lineHeight: leading.normal, margin: space.xs + 'px 0 0', display: 'flex', gap: '4px' },
},
  React.createElement('svg', { width: 14, height: 10, viewBox: '0 0 14 10', 'aria-hidden': 'true', style: { flexShrink: 0, marginTop: '4px' } },
    React.createElement('rect', { x: 0.75, y: 0.75, width: 12.5, height: 8.5, fill: 'none', stroke: beitrag.farbe, strokeWidth: 1.5, strokeDasharray: '3 2' })),
  t('mietzinsSzene.beitragLegende', { betrag: zahl(beitrag.hoechst) }));

// Welcher Text unter «… % des Einkommens» steht.
// Partner-Haus (11.11.2026): mit dem Haushalt gerechnet → «der Netto-Einnahmen Ihres Haushalts».
const anteilKey = (r) => r.brutto ? (r.ganzBrutto ? 'wohnenInstrument.anteilBrutto' : 'wohnenInstrument.anteilTeilsBrutto')
  : r.haushalt ? 'wohnenInstrument.anteilHaushalt' : r.mitPartner ? 'wohnenInstrument.anteilEigen' : 'wohnenInstrument.anteil';
const satzKey = (r) => r.partnerOffen ? 'wohnenInstrument.partnerOffen' : r.mitPartner ? 'wohnenInstrument.mitPartner'
  : r.ueberDrittel ? 'wohnenInstrument.mehrAlsDrittel' : 'wohnenInstrument.faustregel';

// Kurzer Satz für die Instrument-Kachel: wessen Einkommen gemeint ist (dieselben Fälle wie anteilKey).
export const wohnkostenSatzKey = (r) => r.brutto ? (r.ganzBrutto ? 'instrumente.wohnkostenSatzBrutto' : 'instrumente.wohnkostenSatzTeilsBrutto')
  : r.haushalt ? 'instrumente.wohnkostenSatzHaushalt' : r.mitPartner ? 'instrumente.wohnkostenSatzEigen' : 'instrumente.wohnkostenSatz';

export const WohnkostenInstrument = ({ palette, t, wohnen, allData, isDarkMode, onNavigate }) => {
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
  const imHaus = beitragImHaus(allData, r, isDarkMode, palette);
  const zeile = { display: 'flex', justifyContent: 'space-between', gap: space.md + 'px', padding: '8px 0', fontSize: text.sm, color: palette.text };
  const kapH = { margin: space.lg + 'px 0 0', fontSize: text.sm, fontWeight: weight.semi, color: palette.text };

  return React.createElement('section', { 'data-teil': 'wohnkosten', style: { marginBottom: space.lg + 'px' } },
    React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginBottom: '2px' } },
      t(ausprobiert ? 'wohnenInstrument.titelAusprobiert' : 'wohnenInstrument.titel')),
    React.createElement('div', { 'aria-live': 'polite', style: { fontSize: text['2xl'], fontWeight: weight.bold, color: palette.text, lineHeight: 1.2 } }, betrag(r.kosten)),

    // Anteil am Einkommen im Drittel-Haus. Das Haus wiederholt die Zahl daneben — für Screenreader stumm.
    r.anteil != null && React.createElement(React.Fragment, null,
      React.createElement('div', { style: { margin: space.md + 'px 0 ' + space.sm + 'px' } },
        React.createElement(DrittelHaus, { palette, t, anteil: r.anteil, ueberDrittel: r.ueberDrittel, mitPartner: r.mitPartner, brutto: r.brutto, teile: r.haushalt ? { sie: r.einkommen - r.partnerEinkommen, partner: r.partnerEinkommen } : null, beitrag: imHaus, fuell })),
      React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2px ' + space.md + 'px', fontSize: text.sm, color: palette.mid } },
        React.createElement('span', null, t(anteilKey(r), { pct, einkommen: zahl(r.einkommen) })),
        React.createElement('span', null, React.createElement(LegendenMarke, { form: 'strich', color: r.ueberDrittel && !r.mitPartner ? palette.roseDeep : palette.text, palette }), t('wohnenInstrument.drittel')),
        // C · Viertel-Strich mit Quelle (nur wo er im Haus steht: netto, mit Urteil).
        !r.mitPartner && !r.brutto && React.createElement('span', { 'data-teil': 'viertel-legende' }, React.createElement(LegendenMarke, { form: 'punktlinie', color: palette.mid, palette }), t('wohnenInstrument.viertel'))
      ),
      React.createElement('p', { 'data-teil': 'drittel-satz', style: { ...klein, margin: space.xs + 'px 0 0', color: r.ueberDrittel ? palette.text : palette.mid } },
        t(satzKey(r))),
      imHaus && React.createElement(BeitragLegende, { palette, t, beitrag: imHaus })
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

    // Mietzinsbeiträge (11.11.2026): Glas, Schild, Kachelkarte — der Beitrag selbst steht schon im Haus oben.
    React.createElement(MietzinsSzene, { palette, t, data: allData, isDarkMode, onNavigate }),

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

// Mietzinsbeiträge als Szene (Stebler Studios 11.11.2026, «Ja, so bauen»; Wächter wohnenMietzinsSzene.test.js).
// Eine Rechnung: mietzinsEinschaetzung — dieselbe wie im Werkzeug «Mietzins». Teile:
//   Haus (nur mit `mitHaus`): der mögliche Beitrag gestrichelt in der Behörden-Farbe, als «bis zu» (beitragHoechstMonat).
//   Glas: der Pegel der IPV, Lesart «Luft» (Einkommen gegen Grenze) — nur, wo die Grenze eine Zahl ist.
//   Schild «möglich»: nur, wenn das Einkommen unter der Grenze liegt. Nie «Anspruch»: der Kanton entscheidet.
//   Kachelkarte: die 26 Kantone, gefüllt = Programm in der App erfasst, leer = unklar (nie «gibt es nicht»).
// Jeder Kanton ein kleines Haus (Stebler Studios 11.11.2026, «einzelne kleine Häuser, jeder Kanton»): Körper mit dem
// Kürzel, Dach darüber — die Häuserstrasse der Wohnen-Bilder als Karte.
const KACHEL = { b: 26, h: 18, dach: 7, abstand: 3 };
export const Kachelkarte = ({ palette, t, kanton, gefuellt, isDarkMode }) => {
  const h = React.createElement;
  const zelleB = KACHEL.b + KACHEL.abstand, zelleH = KACHEL.h + KACHEL.dach + KACHEL.abstand;
  const breite = 8 * zelleB;
  const hoehe = 6 * zelleH;
  const frucht = bereichFillColor('wohnen', isDarkMode) || palette.sage;
  // Schrift bei 256 px genau text.xs (Regel H), die Karte wird nie breiter als gross.
  const schrift = Math.ceil(text.xs * breite / INSTRUMENT_GROESSE.gross * 100) / 100;
  return h('svg', {
    viewBox: '0 0 ' + breite + ' ' + hoehe, width: '100%', role: 'img', 'data-teil': 'kachelkarte',
    'aria-label': t('mietzinsSzene.karteAria', { liste: gefuellt.join(', '), kanton }),
    style: { display: 'block', maxWidth: INSTRUMENT_GROESSE.gross + 'px', height: 'auto' },
  },
    Object.entries(KACHELKARTE_LAGE).map(([k, [zeile, spalte]]) => {
      const voll = gefuellt.includes(k);
      const ihr = k === kanton;
      const x = spalte * zelleB + 1, oben = zeile * zelleH + KACHEL.dach + 1;
      const rand = { stroke: ihr ? palette.text : voll ? frucht : palette.border, strokeWidth: ihr ? 2.5 : 1, strokeLinejoin: 'round' };
      return h('g', { key: k, 'data-kanton': k, 'data-programm': voll ? 'ja' : 'nein', ...(ihr ? { 'data-ihr': 'ja' } : {}), 'aria-hidden': 'true' },
        h('path', { 'data-form': 'haus', d: 'M' + x + ' ' + (oben + KACHEL.h) + 'V' + oben + 'L' + (x + KACHEL.b / 2) + ' ' + (oben - KACHEL.dach) + 'L' + (x + KACHEL.b) + ' ' + oben + 'V' + (oben + KACHEL.h) + 'Z',
          fill: voll ? frucht : 'none', fillOpacity: voll ? 0.45 : 0, ...rand }),
        h('text', { x: x + KACHEL.b / 2, y: oben + KACHEL.h / 2 + schrift * 0.35, textAnchor: 'middle', fontSize: schrift, fill: voll || ihr ? palette.text : palette.mid }, k));
    }));
};

// «möglich» als Wegweiser, der ganz der Knopf ist (Stebler Studios 11.11.2026: «die Kombo von dem jetzt und dem vorher»):
// Pfosten und Pfeil-Schild vom ersten Entwurf, Zeichen und Link vom Knopf. Im Kapitel ins Werkzeug «Mietzins», im
// Werkzeug zur kantonalen Stelle. Nur unter der Grenze; sagt nie «Anspruch». Das Schild ist ein Bild hinter dem Knopf,
// der Knopf selbst bleibt rechteckig — so bleibt der Fokusring sichtbar. Blau = informieren; Schrift in der Flächenfarbe
// (hell 5.4:1 auf skyDeep, dunkel umgekehrt).
const MoeglichKnopf = ({ palette, t, onNavigate, url }) => {
  const h = React.createElement;
  const stil = {
    position: 'relative', display: 'inline-flex', alignItems: 'center', gap: space.xs + 'px', minHeight: '44px',
    padding: '0 ' + (space.lg + space.xs) + 'px 0 ' + space.ms + 'px', border: 'none', background: 'none', cursor: 'pointer',
    fontFamily: 'inherit', fontSize: text.sm, fontWeight: weight.semi, color: palette.surface, textDecoration: 'none',
  };
  const schild = h('svg', { 'aria-hidden': 'true', viewBox: '0 0 100 44', preserveAspectRatio: 'none', style: { position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 } },
    h('path', { d: 'M0 0H92L100 22L92 44H0Z', fill: palette.skyDeep }));
  const inhalt = [schild,
    h(Icon, { key: 'i', name: ansichtIkon('mietzins'), size: 18, style: { position: 'relative', zIndex: 1 } }),
    h('span', { key: 't', style: { position: 'relative', zIndex: 1 } }, t(onNavigate ? 'mietzinsSzene.cta' : 'mietzinsSzene.ctaStelle'))];
  const knopf = onNavigate
    ? h('button', { type: 'button', 'data-teil': 'mietzins-cta', onClick: () => onNavigate('mietzins'), style: stil }, inhalt)
    : url ? h(ExternerLink, { t, href: url, 'data-teil': 'mietzins-cta', style: stil }, inhalt) : null;
  if (!knopf) return null;
  return h('div', { 'data-teil': 'mietzins-wegweiser', style: { display: 'inline-flex', flexDirection: 'column', animation: 'fadeIn ' + duration.slow + 'ms ' + ease } },
    knopf,
    h('span', { 'aria-hidden': 'true', style: { width: '2px', height: space.lg + 'px', marginLeft: space.lg + 'px', background: palette.text } }));
};

export const MietzinsSzene = ({ palette, t, data, isDarkMode, onNavigate, kanton: kantonVorgabe, groesse = 'gross', mitHaus = false, ohneSatz = false }) => {
  const h = React.createElement;
  const kanton = kantonVorgabe || data?.basis?.canton || '';
  if (!kanton) return null;
  const e = mietzinsEinschaetzung(data, kanton);
  const glas = e.hasProgram ? mietzinsPegelState({ annualIncome: e.annualIncome, incomeLimit: e.incomeLimit }) : null;
  const moeglich = e.assessment?.key === 'likely';
  const r = mitHaus ? wohnkostenRechnung(data?.wohnen, data, null) : null;
  const zeigtHaus = r && r.anteil != null && !r.mitPartner;
  const beitrag = zeigtHaus ? beitragImHaus(data, r, isDarkMode, palette, kanton) : null;
  const satz = e.hasProgram && e.assessment ? t('mietzinsView.result_' + e.assessment.key, e.assessment.params || {}) : t('mietzins.' + e.info.state);
  const klein = { fontSize: text.xs, color: palette.mid, lineHeight: leading.normal, margin: space.xs + 'px 0 0' };
  return h('section', { 'data-teil': 'mietzins-szene', style: { margin: space.lg + 'px 0' } },
    h('div', { style: { fontSize: text.sm, fontWeight: weight.semi, color: palette.text, marginBottom: space.sm + 'px' } }, t('mietzinsSzene.titel')),
    (zeigtHaus || glas || moeglich) && h('div', { style: { display: 'flex', alignItems: 'flex-end', gap: space.md + 'px', flexWrap: 'wrap' } },
      zeigtHaus && h('div', { style: { flex: '0 1 ' + INSTRUMENT_GROESSE[groesse] + 'px' } },
        h(DrittelHaus, { palette, t, anteil: r.anteil, ueberDrittel: r.ueberDrittel, mitPartner: r.mitPartner, brutto: r.brutto, beitrag, fuell: bereichFillColor('wohnen', isDarkMode) || palette.sage, groesse })),
      glas && h('div', { 'data-teil': 'mietzins-glas' }, h(Pegel, { palette, t, state: glas, nurGlas: true, fuellFarbe: bereichFillColor('behoerden', isDarkMode) || palette.mid })),
      moeglich && h(MoeglichKnopf, { palette, t, onNavigate, url: e.info?.url })),
    beitrag && h(BeitragLegende, { palette, t, beitrag }),
    !ohneSatz && h('p', { style: { margin: space.sm + 'px 0', fontSize: text.sm, color: palette.text, lineHeight: leading.normal } }, satz),
    h(Kachelkarte, { palette, t, kanton, gefuellt: PROGRAMM_KANTONE, isDarkMode }),
    h('p', { style: klein }, t('mietzinsSzene.karteLegende')),
  );
};

export default WohnkostenInstrument;

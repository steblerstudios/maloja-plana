import { lohnVergleichSperre } from '../data/lohnEinordnung.js';
import React, { useState } from 'react';
import { text, weight, space, radius } from '../config/tokens.js';
import { bruttoZuNettoRichtwert, nettoZuBruttoRichtwert } from '../data/lohnAbzuege.js';
import { alterUndRentenalter } from '../utils/nettoAusProfil.js';
import { KNAPP_OBEN } from '../data/sozialhilfeKern.js';
import { zahltBeitraegeSelbst } from '../utils/monatsrechnung.js';
import { zahl } from '../utils/geld.js';
import { rentenMonat, RENTEN_FELDER } from '../utils/unterstuetzungseinheit.js';
import { auswahlStil, KNOPF_RADIUS } from './PrimaryButton.jsx';

// Monatseinkommen brutto ODER netto (Wunsch 25.09.2026: «man sollte immer vor und zurück rechnen
// können»). Ein Feld für die Dashboard-Leistungsliste und den Leistungs-Schnellcheck, damit beide
// sich gleich verhalten.
//
//   • Gerechnet wird immer mit NETTO (Sozialhilfe vergleicht das, was reinkommt, mit dem Bedarf;
//     die IPV-Orientierung ist näher an netto als an brutto).
//   • Wer brutto eintippt, sieht «≈ netto … (geschätzt)», umgekehrt «≈ brutto …» — beide Richtungen
//     aus demselben Baustein (data/ahvRechner.js, AHV/ALV + PK nach Alter). Nie verbindlich.
//   • Vorbefüllt aus dem Profil MIT der Art, die dort steht (finanzen.incomeType). Ist die Art offen,
//     bleibt das Feld leer, mit dem bestehenden Hinweis (einkommensart.offenNetto) — dieselbe Regel
//     wie in den übrigen Rechnern (Predeploy-Gate 25.09.2026, einkommensartOffen.test.js).

// «Knapp» (Fachprüfung swiss-precision 25.09.2026): die Schätzung irrt EINSEITIG — das echte Netto
// liegt fast immer tiefer (NBU, KTG, PK-Risiko/-Überobligatorium, Quellensteuer fehlen). Darum
// asymmetrisch: geschätztes Netto zwischen 97 % und 110 % des SKOS-Bedarfs; ohne Alter fehlt der
// PK-Abzug ganz (bis ~5.7 %) → Obergrenze 115 %. Eine Regel für Dashboard und Schnellcheck.
export { KNAPP_OBEN };
export const KNAPP_UNTEN = 0.97, KNAPP_OBEN_OHNE_ALTER = 1.15;
export const istKnapp = (sh, ohneAlter = false) => {
  if (!sh || !(sh.totalBedarf > 0)) return false;
  const q = sh.income / sh.totalBedarf;
  return q >= KNAPP_UNTEN && q <= (ohneAlter ? KNAPP_OBEN_OHNE_ALTER : KNAPP_OBEN);
};

export function useEinkommen(data) {
  const typ = data?.finanzen?.incomeType;
  const profilWert = data?.finanzen?.monthlyIncome;
  const bekannt = typ === 'netto' || typ === 'brutto';
  const [betrag, setBetrag] = useState(bekannt && profilWert ? String(profilWert) : '');
  const [art, setArt] = useState(typ === 'brutto' ? 'brutto' : 'netto');
  // Alter und Rentenalter: dieselbe Regel wie die Sozialhilfe-Schnellrechnung (utils/nettoAusProfil.js).
  const { alter, bvgAlter, rentenalter, beitragsfrei } = alterUndRentenalter(data?.basis);
  const zahlWert = Math.max(0, Number(betrag) || 0);
  // Selbständige: eine Regel mit calculateSozialhilfe, der Betrag bleibt, wie er eingetragen ist (Predeploy 02.11.2026).
  const selbst = zahltBeitraegeSelbst(data?.finanzen);
  const nettoMonat = art === 'netto' || selbst ? zahlWert : bruttoZuNettoRichtwert(zahlWert, bvgAlter, rentenalter, undefined, beitragsfrei);
  // Die Art aus dem Feld zählt, nicht die aus dem Profil: dort kann sie fehlen oder anders stehen.
  const sperre = lohnVergleichSperre({ ...data, finanzen: { ...data?.finanzen, incomeType: art } }, rentenalter);
  const ohneBrutto = selbst || (art === 'netto' && (sperre === 'keinLohn' || sperre === 'quellensteuer'));
  const gegenwert = zahlWert > 0 && !ohneBrutto ? (art === 'netto' ? nettoZuBruttoRichtwert(zahlWert, bvgAlter, rentenalter, undefined, beitragsfrei) : nettoMonat) : 0;
  return {
    betrag, setBetrag, art, setArt, alter, ohneAlter: alter == null, nettoMonat, gegenwert,
    geschaetzt: art === 'brutto' && !selbst && zahlWert > 0,
    offen: !bekannt && profilWert != null && String(profilWert).trim() !== '' && betrag === '',
    // Renten aus dem Profil rechnen schon mit: das Feld sagt es, damit niemand sie hier ein zweites Mal einträgt.
    renten: rentenMonat(data?.finanzen),
    // Im Ruhestand steht im Lohnfeld oft die Rente (kantonsModell.js). Ist der Betrag gleich hoch wie eine Rente im Profil
    // oder ihre Summe, sagt das Feld es sichtbar: sonst zählt sie doppelt (Fachprüfung 65fa06d4).
    renteImLohn: data?.finanzen?.employmentType === 'retired' && zahlWert > 0
      && [...RENTEN_FELDER.map((k) => data?.finanzen?.[k]), rentenMonat(data?.finanzen)].some((v) => Math.round(Number(v) || 0) > 0 && Math.round(Number(v)) === Math.round(zahlWert)),
  };
}

export const EinkommenFeld = ({ palette, t, e, stil = {} }) => {
  const h = React.createElement;
  const knopf = (wert) => h('button', {
    key: wert, type: 'button', 'aria-pressed': e.art === wert,
    onClick: () => e.setArt(wert),
    style: {
      ...auswahlStil(palette, e.art === wert), padding: '4px 10px', minHeight: '28px', fontSize: text.xs,
      fontWeight: e.art === wert ? weight.semi : weight.medium,
    },
  }, t('einkommensfeld.' + wert));
  return h('div', { style: { flex: '0 1 240px', minWidth: 0, ...stil } },
    h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: space.sm + 'px', marginBottom: space.xs + 'px' } },
      h('label', { htmlFor: 'einkommen-feld', style: { fontSize: text.xs, color: palette.mid } }, t('einkommensfeld.label')),
      h('div', { role: 'group', 'aria-label': t('einkommensfeld.art'), style: { display: 'inline-flex', gap: '2px', padding: '2px', background: palette.up, borderRadius: KNOPF_RADIUS } },
        knopf('netto'), knopf('brutto'))),
    h('input', {
      id: 'einkommen-feld', type: 'number', inputMode: 'numeric',
      placeholder: t('dashboard.quickCheckPlaceholder'),
      value: e.betrag, onChange: (ev) => e.setBetrag(ev.target.value),
      style: {
        width: '100%', padding: '10px 12px', fontSize: text.body, boxSizing: 'border-box',
        border: '1px solid ' + palette.border, borderRadius: radius.md + 'px',
        background: palette.surface, color: palette.text, fontFamily: 'inherit', outline: 'none',
      },
    }),
    h('div', { 'aria-live': 'polite', style: { minHeight: '1.3em', marginTop: '4px', fontSize: text.xs, color: palette.mid, fontVariantNumeric: 'tabular-nums' } },
      e.gegenwert > 0
        ? t(e.art === 'netto' ? 'einkommensfeld.bruttoGeschaetzt' : 'einkommensfeld.nettoGeschaetzt', { value: zahl(e.gegenwert) })
        : e.offen ? t('einkommensart.offenNetto') : ''),
    e.renten > 0 && h('div', { style: { marginTop: '2px', fontSize: text.xs, color: palette.mid, lineHeight: 1.4 } },
      t('einkommensfeld.rentenEingerechnet', { value: zahl(e.renten) })),
    e.renteImLohn && h('div', { role: 'status', style: { marginTop: '4px', fontSize: text.xs, color: palette.skyDeep || palette.text, fontWeight: weight.medium, lineHeight: 1.4 } },
      t('einkommensfeld.renteImLohn'))
  );
};

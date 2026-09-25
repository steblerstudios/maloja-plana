import React, { useState } from 'react';
import { text, weight, space, radius } from '../config/tokens.js';
import { bruttoZuNettoRichtwert, nettoZuBruttoRichtwert } from '../data/ahvRechner.js';
import { zahl } from '../utils/geld.js';

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

// «Knapp»: geschätztes Netto innerhalb dieses Anteils am SKOS-Bedarf — die Umrechnung kann dort
// kippen (fehlende NBU/KTG/PK-Überobligatorium). Eine Regel für Dashboard und Schnellcheck.
export const KNAPP_ANTEIL = 0.05;
export const istKnapp = (sh) => !!sh && sh.totalBedarf > 0 && Math.abs(sh.income - sh.totalBedarf) <= KNAPP_ANTEIL * sh.totalBedarf;

const alterAus = (geburt) => {
  if (!geburt) return undefined;
  const g = new Date(geburt);
  if (isNaN(g.getTime())) return undefined;
  const h = new Date();
  return h.getFullYear() - g.getFullYear() - (h < new Date(h.getFullYear(), g.getMonth(), g.getDate()) ? 1 : 0);
};

export function useEinkommen(data) {
  const typ = data?.finanzen?.incomeType;
  const profilWert = data?.finanzen?.monthlyIncome;
  const bekannt = typ === 'netto' || typ === 'brutto';
  const [betrag, setBetrag] = useState(bekannt && profilWert ? String(profilWert) : '');
  const [art, setArt] = useState(typ === 'brutto' ? 'brutto' : 'netto');
  const alter = alterAus(data?.basis?.dateOfBirth);
  const zahlWert = Math.max(0, Number(betrag) || 0);
  const nettoMonat = art === 'netto' ? zahlWert : bruttoZuNettoRichtwert(zahlWert, alter);
  const gegenwert = zahlWert > 0 ? (art === 'netto' ? nettoZuBruttoRichtwert(zahlWert, alter) : nettoMonat) : 0;
  return {
    betrag, setBetrag, art, setArt, alter, nettoMonat, gegenwert,
    geschaetzt: art === 'brutto' && zahlWert > 0,
    offen: !bekannt && profilWert != null && String(profilWert).trim() !== '' && betrag === '',
  };
}

export const EinkommenFeld = ({ palette, t, e, stil = {} }) => {
  const h = React.createElement;
  const knopf = (wert) => h('button', {
    key: wert, type: 'button', 'aria-pressed': e.art === wert,
    onClick: () => e.setArt(wert),
    style: {
      padding: '4px 10px', minHeight: '28px', fontFamily: 'inherit', fontSize: text.xs, cursor: 'pointer',
      border: 'none', borderRadius: radius.full + 'px',
      background: e.art === wert ? palette.surface : 'transparent',
      color: e.art === wert ? palette.text : palette.mid,
      fontWeight: e.art === wert ? weight.semi : weight.medium,
    },
  }, t('einkommensfeld.' + wert));
  return h('div', { style: { flex: '0 1 240px', minWidth: 0, ...stil } },
    h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: space.sm + 'px', marginBottom: space.xs + 'px' } },
      h('label', { htmlFor: 'einkommen-feld', style: { fontSize: text.xs, color: palette.mid } }, t('einkommensfeld.label')),
      h('div', { role: 'group', 'aria-label': t('einkommensfeld.art'), style: { display: 'inline-flex', gap: '2px', padding: '2px', background: palette.up, borderRadius: radius.full + 'px' } },
        knopf('netto'), knopf('brutto'))),
    h('input', {
      id: 'einkommen-feld', type: 'number', inputMode: 'numeric',
      placeholder: t('dashboard.quickCheckPlaceholder'),
      value: e.betrag, onChange: (ev) => e.setBetrag(ev.target.value),
      style: {
        width: '100%', padding: '10px 12px', fontSize: text.body, boxSizing: 'border-box',
        border: '1px solid ' + palette.border, borderRadius: radius.sm + 'px',
        background: palette.surface, color: palette.text, fontFamily: 'inherit', outline: 'none',
      },
    }),
    h('div', { 'aria-live': 'polite', style: { minHeight: '1.3em', marginTop: '4px', fontSize: text.xs, color: palette.mid, fontVariantNumeric: 'tabular-nums' } },
      e.gegenwert > 0
        ? t(e.art === 'netto' ? 'einkommensfeld.bruttoGeschaetzt' : 'einkommensfeld.nettoGeschaetzt', { value: zahl(e.gegenwert) })
        : e.offen ? t('einkommensart.offenNetto') : '')
  );
};
